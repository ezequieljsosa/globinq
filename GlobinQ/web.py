'''
Created on Dec 30, 2016

@author: eze
'''

import json
from collections import defaultdict
import os
import subprocess as sp
import tempfile
import uuid
import datetime
import Bio.SearchIO as bpsio
import Bio.SeqIO as bpio
import bottle
import configparser
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from beaker.middleware import SessionMiddleware
from bottle import hook, response, get, static_file, redirect, run, request, \
    error, abort, post, delete
from gevent import monkey  # @UnresolvedImport
from peewee import DoesNotExist, MySQLDatabase, JOIN

from GlobinQ.db import mysql_db, site_pos, sites
from GlobinQ.db.Model import Globin, IndexKeyword, Tax, PDB, Channel, \
    ExperimentalData, User, Contribution
from GlobinQ.upload_globin import upload_globin
import traceback
import requests
from Bio.SeqUtils import seq1
from Bio.PDB.Polypeptide import is_aa,CaPPBuilder
monkey.patch_all()


def identity(hsp):
    return 1.0 * hsp.ident_num / hsp.aln_span


def coverage(query_result, hsp):
    # return 1.0 * hsp.aln_span / hsp.query_span
    return 1.0 * hsp.query_span / query_result.seq_len


def hit_coverage(hit, hsp):
    # return 1.0 * hsp.aln_span /  hsp.hit_span
    return 1.0 * hsp.hit_span / hit.seq_len


config = configparser.ConfigParser()
config.read("./globinq.config")

mysqldb = MySQLDatabase('globinq', user=config["mysql"]["user"], password=config["mysql"]["pass"])
mysql_db.initialize(mysqldb)

# ip = "157.92.24.157"
ip = "localhost"

bapp = bottle.app()
session_opts = {
    'session.cookie_expires': True,
    'session.encrypt_key': 'please use a random key and keep it secret!',
    'session.httponly': True,
    'session.timeout': 3600 * 24,  # 1 day
    'session.type': 'cookie',
    'session.validate_key': True,
}
bapp = SessionMiddleware(bapp, session_opts)


def session_var(name):
    s = bottle.request.environ.get('beaker.session')  # @UndefinedVariable
    return s.get(name, None)


def save_session_var(name, value):
    s = bottle.request.environ.get('beaker.session')  # @UndefinedVariable
    s[name] = value
    s.save()


def serialize_search_globin(globin):
    return {
        'id': globin.id,
        'name': globin.globinName(),
        'organism': globin.tax.name,
        'group': globin.globin_group,
        'pdbs': [x.pdb for x in globin.structures],

        "exp": globin.exp_txt(),
        "curated": "yes" if globin.owner else "no",
        "calc": globin.calc_txt()

    }


def struct_aln(globin):
    aln = {globin.name: globin.aln_seq
           }

    for x in globin.structures:
        if x.chain == "A":
            aln[x.pdb + "_" + x.chain] = x.aln_seq
    return aln


def serialize_pdb(pdb):
    return {
        "pdb": pdb.pdb,
        "chain": pdb.chain,
        "description": pdb.description,
        # "insertions": [{"aa": x.aa, "order": x.order, "aln_pos": x.aln_pos} for x in pdb.insertions],
    }


def serialize_globin(globin):
    insertions = {x: 0 for x in site_pos.keys()}
    for i in globin.insertions:
        insertions[i.g_position] = i.insertions
    exp_contributions = {x.experimental.id: x for x in
                         Contribution.select().where(Contribution.experimental_id in globin.experimental)
                         if not x.removed}

    gdict = {
        'id': globin.id,
        "tax": globin.tax.id,
        'name': globin.globinName(),
        'uniprot': globin.uniprot,
        'organism': globin.tax.name,
        'group': globin.globin_group,
        'pdbs': [serialize_pdb(x) for x in globin.structures],
        'alns': struct_aln(globin),
        'sequence': globin.sequence,
        'owner': "",
        "experimental": [{
            'kon': x.k_on_o2_exp,
            'koff': x.k_off_o2_exp,
            'name': x.sequence_red,
            'owner': {k: v for k, v in exp_contributions[x.id].user.to_dict().items() if
                      k != "password"} if x.id in exp_contributions else {}
        } for x in globin.experimental],
        'p50': globin.p50,
        "calculated": {
            'kon': globin.k_on_o2_pred,
            'koff': globin.k_off_o2_pred
        },

        'regions': {
            'AS': {"reduced": globin.active_site_red,
                   "residues": [{'res': x, 'name': sites["sa"][i]} for i, x in
                                enumerate(globin.active_site if globin.active_site else [])]},
            'E7G': {"reduced": globin.e7_portal.sequence_red,
                    "residues": [{'res': x, 'name': sites["e7"][i]} for i, x in
                                 enumerate(globin.e7_portal.sequence)],
                    'opened': globin.e7_portal.openness, 'k': globin.e7_portal.e_bar_contrib},
            'STG8': {"reduced": globin.g8_channel.sequence_red,
                     "residues": [{'res': x, 'name': sites["g8"][i]} for i, x in
                                  enumerate(globin.g8_channel.sequence)],
                     'opened': globin.g8_channel.openness, 'k': globin.g8_channel.e_bar_contrib},
            'LT': {"reduced": globin.l_channel.sequence_red,
                   "residues": [{'res': x, 'name': sites["lt"][i]} for i, x in
                                enumerate(globin.l_channel.sequence)],
                   'opened': globin.l_channel.openness, 'k': globin.l_channel.e_bar_contrib}
        },

        'positions': {
            p.g_position: {'visible': True, 'seq_pos': p.seq_pos, 'aln_pos': site_pos[p.g_position],
                           "insertions": insertions[p.g_position],
                           'pdb_pos': {r.pdb.pdb: r.pdb.chain + "." + r.pdb_res_id for r in p.residues}}
            for p in globin.positions
        },

    }
    if globin.owner:
        gdict['owner'] = globin.owner.name
        gdict['institution'] = globin.owner.institution
        gdict['closest_curated'] = {"id": globin.closest_curated.id,
                                    "name": globin.closest_curated.name}

    return gdict


@hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


@hook('before_request')
def _connect_db():
    mysqldb.connect()


@hook('after_request')
def _close_db():
    if not mysqldb.is_closed():
        mysqldb.close()


@error(404)
def error404(error):
    desc = request.url + " invalid url"
    return desc


@get("/tax")
def tax_search():
    search = request.query["search"].strip()
    if len(search) > 2:
        res = {"tax": [{"id": x.id, "name": x.name} for x in
                       Tax.select().where(Tax.name ** ("%" + search + "%"))]}
    else:
        res = {"tax": []}

    return res


@get("/search")
def search():
    query = Globin.select().distinct()

    if ("kw" in request.query) and request.query["kw"]:
        kw = request.query["kw"]
        q = IndexKeyword.keyword ** ('%' + kw.split()[0] + '%')
        query = query.join(IndexKeyword).where(q)

        for x in kw.split()[1:]:
            ikAlias = IndexKeyword.alias()
            q = q & (ikAlias.keyword ** ('%' + x + '%'))
            query = query.switch(Globin).join(ikAlias).where(q)
    query.switch(Globin)
    if ("with_exp" in request.query) and int(request.query["with_exp"]):
        query = query.join(ExperimentalData)
    else:
        query = query.join(ExperimentalData, join_type=JOIN.LEFT_OUTER, on=ExperimentalData.globin)
    query.switch(Globin)
    if ("only_struct" in request.query) and int(request.query["only_struct"]):
        query = query.switch(Globin).join(PDB)
    query.switch(Globin)
    #     kquery= None
    if ("kon_start" in request.query):
        k_min = float(request.query["kon_start"])
        k_max = float(request.query["kon_end"])
        query = query.where(
            (ExperimentalData.k_on_o2_exp >= k_min) & (ExperimentalData.k_on_o2_exp <= k_max)
            |
            (Globin.k_on_o2_pred >= k_min) & (Globin.k_on_o2_pred <= k_max)
        )

    if ("koff_start" in request.query):
        k_min = float(request.query["koff_start"])
        k_max = float(request.query["koff_end"])
        query = query.where(
            (ExperimentalData.k_off_o2_exp >= k_min) & (ExperimentalData.k_off_o2_exp <= k_max)
            |
            (Globin.k_off_o2_pred >= k_min) & (Globin.k_off_o2_pred <= k_max)
        )

    if ("p50_min" in request.query) and request.query["p50_min"]:
        p50_min = float(request.query["p50_min"])
        p50_max = float(request.query["p50_max"])
        query = query.where(Globin.p50.between(p50_min, p50_max))

    if ("groups" in request.query) and request.query["groups"]:
        group = [x.split("_")[0].upper() for x in request.query["groups"].split(",") if x.split("_")[1] == "true"]
        query = query.where(Globin.globin_group << group)

    if ("noncurated" not in request.query) or (not int(request.query["noncurated"])):
        query = query.where(Globin.owner_id.is_null())

    if ("tax" in request.query) and request.query["tax"]:
        tax = int(request.query["tax"])
        ids = Tax.parent_ids(Tax.select().where(Tax.id == tax).get())
        query = query.where(Globin.tax << ids)

    if ("org" in request.query) and request.query["org"]:
        tax = int(request.query["org"])
        query = query.where(Globin.tax == Tax.select().where(Tax.id == tax).get())

    if ("as" in request.query) and request.query["as"]:
        query = query.where(Globin.active_site_red.regexp(str(request.query["as"])))

    if ("e7" in request.query) and request.query["e7"]:
        channels = Channel.select().where(Channel.sequence_red.regexp(request.query["e7"]))
        query = query.where(Globin.e7_portal << channels)

    if ("lt" in request.query) and request.query["lt"]:
        channels = Channel.select().where(Channel.sequence_red.regexp(request.query["lt"]))
        query = query.where(Globin.l_channel << channels)

    if ("g8" in request.query) and request.query["g8"]:
        channels = Channel.select().where(Channel.sequence_red.regexp(request.query["g8"]))
        query = query.where(Globin.g8_channel << channels)

    if ("download" in request.query):
        fd, path = tempfile.mkstemp()
        try:
            with os.fdopen(fd, 'w') as tmp:
                if request.query["download"] == "csv":
                    tmp.write('tax,organism,name,group,exp,teo,pdb,uniprot,closest_curated\n')
                    for x in query:
                        tmp.write(
                            '{tax},{organism},{name},{group},{exp},{teo},{pdb},{uniprot},{closest_curated}\n'.format(
                                tax=x.tax.id, organism=x.tax.name,
                                name=x.name, uniprot=x.uniprot, group=x.globin_group,
                                exp="yes" if x.hasExperimental() else "no",
                                teo="yes" if x.hasPredicted() else "no",
                                pdb="yes" if list(x.structures) else "no",
                                closest_curated=x.closest_curated
                            ))
                else:
                    for x in query:
                        r = SeqRecord(id=x.name, seq=Seq(x.sequence),
                                      description=x.tax.name + " " +
                                                  str(x.tax.id) + " " + str(x.uniprot))
                        bpio.write(r, tmp, "fasta")
            return static_file(path, root="/", download="query." + request.query["download"])
        finally:
            os.remove(path)

    else:
        res = []

        for x in query:
            try:
                res.append(serialize_search_globin(x))
            except Exception as ex:
                print x
                print ex
                return {error: "Error filtering globins", 'globins': []}

        return {'globins': res}


@get("/protein/<protein_id>")
def protein(protein_id):
    try:
        globin = Globin.get(Globin.id == int(protein_id))  # @UndefinedVariable
    except DoesNotExist:
        abort(404, "no such globin")

    return serialize_globin(globin)


@get("/user/<user_id>")
def protein(user_id):
    try:
        user = User.get_by_id(user_id)
    except DoesNotExist:
        abort(404, "no such user")
    doc = user.to_dict()
    doc["globins"] = [{"id": g.id, "name": g.name, "group": g.globin_group}
                      for g in Globin.select(Globin.id, Globin.name, Globin.globin_group).where(Globin.owner == user,
                                                                                                Globin.removed == False)]
    doc["contributions"] = []
    for c in Contribution.select().where(Contribution.user == user, Contribution.removed == False):
        data = {}
        for k, v in c.to_dict().items():

            if (k == "experimental") and v :
                data["experimental"] = ExperimentalData.get_by_id(v).to_dict()
                data["experimental"]["globin_name"] = Globin.get_by_id(int(data["experimental"]["globin"])).globinName()

            else:
                data[k] = v.isoformat() if k in ["creation", "last_update"] else v

        doc["contributions"].append(data)

    return doc


@post("/blast")
def blast():
    postdata = json.loads(request.body.read())
    bid = str(uuid.uuid1())

    import re
    pattern = re.compile(r'\s+')
    sequence = re.sub(pattern, '', postdata["sequence"])
    os.mkdir("/tmp/" + bid)
    bpio.write(SeqRecord(id="query", seq=Seq(sequence)), "/tmp/" + bid + "/query.fasta", "fasta")
    cmd = "blastp -db data/generated/sequences.fasta -query  /tmp/%s/query.fasta -evalue 0.01 -qcov_hsp_perc 80  -outfmt 5  -max_hsps 1 > /tmp/%s/result.xml"
    sp.call(cmd % (bid, bid), shell=True)
    return {"id": bid}


@post("/upload")
def upload():
    postdata = json.loads(request.body.read())
    upload_res = upload_globin(postdata)
    # if ("error" not in upload_res) or (not upload_res["error"]):
    #     contrib = Contribution()
    #     contrib.user = User.get_by_id(int(postdata["owner"]["id"]))
    #     contrib.ctype = "pdb"
    #     contrib.creation = datetime.datetime.now()
    #     contrib.last_update = datetime.datetime.now()
    #     contrib.save()
    return upload_res


@post("/del_contrib")
def del_contrib():
    data = json.loads(request.body.read())
    c = Contribution.get_by_id(data["contrib_id"])
    c.last_update = datetime.datetime.now()
    c.removed = True
    c.save()
    return {"id": data["globin_id"]}


@post("/add_pdb")
def add_pdb():
    from GlobinQ.db.update_pdb_alignments import  process_globin_structure

    from Bio.PDB import PDBParser,parse_pdb_header
    data = json.loads(request.body.read())
    pdb = data["pdb"]
    globin_id = data["globin"]
    globin = Globin.get_by_id(globin_id)
    error = ""

    if pdb in [x.pdb for x in globin.structures]:
        error = "PDB code already related to the globin"
        return {"error": error}

    try:

        pdb_path = "/data/databases/pdb/divided/" + pdb[1:3] + "/pdb" + pdb + ".ent"
        if not os.path.exists(pdb_path):
            r = requests.get('https://files.rcsb.org/download/'  + pdb.upper() + ".pdb")
            if r.status_code == 404:
                error = "PDB code does not exists"
                return {"error": error}
            if r.status_code == 200:
                if not os.path.exists("/data/databases/pdb/divided/" + pdb[1:3]):
                    os.mkdir("/data/databases/pdb/divided/" + pdb[1:3])
                with open(pdb_path,"w") as h:
                    h.write(r.text)


        if not os.path.exists("/tmp/globinq/"):
            os.mkdir("/tmp/globinq/")
        pdb_seq_path = "/tmp/globinq/" + pdb + ".fasta"
        globin_seq_path = "/tmp/globinq/" + str(globin.id) + ".fasta"

        with open(globin_seq_path, "w") as h:
            bpio.write(SeqRecord(id=str(globin.id), name="", description="", seq=Seq(globin.sequence)), h, "fasta")

        with open(pdb_seq_path, "w") as h:
            parser = PDBParser(QUIET=True)
            structure = parser.get_structure(pdb, pdb_path)
            polypeps = defaultdict(lambda: {})

            ppb = CaPPBuilder()
            for chain in structure.get_chains():
                polipep = list(ppb.build_peptides(structure[0][chain.id]))[0]
                polypeps[pdb][chain.id] = polipep
                seq = polipep.get_sequence()
                if len(seq):
                    bpio.write(SeqRecord(id=pdb + "_" + chain.id, seq=seq), h, "fasta")

            # for chain in structure.get_chains():
            #
            #     residues = []
            #     for x in chain.get_residues():
            #         polypeps[]
            #         if is_aa(x, standard=True):
            #             residues.append(x)
            #     if residues:
            #         seq = "".join([seq1(x.resname) for x in residues])
            #         # start = str(residues[0].id[1])
            #         # end = str(residues[-1].id[1])
            #         record = SeqRecord(id="_".join([pdb, chain.id]), seq=Seq(seq))
            #         bpio.write(record, h, "fasta")

        if not os.path.exists("/tmp/{pdb}_{globin}/".format(pdb=pdb,globin=globin.id)):
            os.mkdir("/tmp/{pdb}_{globin}/".format(pdb=pdb,globin=globin.id))
        result = "/tmp/{pdb}_{globin}/result.xml".format(pdb=pdb,globin=globin.id)
        cmd = "makeblastdb -dbtype prot -in " +  pdb_seq_path
        sp.call(cmd, shell=True)
        cmd = "blastp -db /tmp/globinq/{pdb}.fasta -query  /tmp/globinq/{seq}.fasta -evalue 0.01 -qcov_hsp_perc 80  -outfmt 5  -max_hsps 1 > {result}"
        sp.call(cmd.format(pdb=pdb,seq=globin.id,result=result), shell=True)

        alns = defaultdict(lambda: {})

        with open(pdb_path) as h:
            header = parse_pdb_header(h)

        blast_results = {q.id: q for q in bpsio.parse(result, "blast-xml")}
        for q in blast_results.values():
            for hit in q:
                for hsp in hit:
                    alns[q.id]["_".join(hit.id.split("_")[0:2])] = hsp

        if alns:
            for hit in  alns[q.id]:
                with mysqldb.atomic():
                    struct = PDB(globin=globin, pdb=pdb, chain=hit.split("_")[1], description=header["name"])
                    if (("source" in header) and header["source"]
                            and ("organism_scientific" in header["source"].values()[0])):
                        struct.organism = header["source"].values()[0]["organism_scientific"]
                    struct.save(force_insert=True)
                    process_globin_structure(globin,struct,alns,polypeps,lambda g:str(g.id))
        else:
            error = "this globin has not any valid alignment against the selected pdb"

    except Exception as ex:
        traceback.print_exc()
        print(ex)
        error = "Error processing pdb..."

    if error:
        return {"error": error}
    else:
        return {"id": data["globin"]}


@post("/del_globin")
def del_globin():
    data = json.loads(request.body.read())
    g = Globin.get_by_id(data["globin_id"])
    if g.owner.id == data["user_id"]:
        Globin.update(removed=True).where(Globin.id == int(data["globin_id"])).execute()
        return {"id": data["globin_id"]}
    else:
        abort(403)


@post("/del_globin")
def del_globin():
    data = json.loads(request.body.read())
    g = Globin.get_by_id(data["globin_id"])
    if g.owner.id == data["user_id"]:
        Globin.update(removed=True).where(Globin.id == int(data["globin_id"])).execute()
        return {"id": data["globin_id"]}
    else:
        abort(403)


@post("/addData")
def addData():
    postdata = json.loads(request.body.read())
    with mysql_db.atomic() as transaction:
        try:
            if "id" in postdata:
                contrib = Contribution.get_by_id(postdata["id"])
            else:
                contrib = Contribution()
                contrib.user = User.get_by_id(int(postdata["user"]))
                contrib.ctype = postdata["ctype"].strip().lower()
                contrib.creation = datetime.datetime.now()
            contrib.last_update = datetime.datetime.now()

            contrib.paper = postdata["paper"]
            contrib.description = postdata["description"]

            if contrib.ctype == "exp":
                if "id" in postdata:
                    exp = contrib.experimental
                else:
                    exp = ExperimentalData(globin=Globin.get_by_id(int(postdata["protein"])))

                exp.k_on_o2_exp = float(postdata["k_on_o2_exp"])
                exp.k_off_o2_exp = float(postdata["k_off_o2_exp"])
                exp.sequence_red = postdata["condition"]

                exp.save()
                contrib.experimental = exp
            elif contrib.ctype == "pdb":
                contrib.pdb = postdata["pdb"]
            else:
                raise Exception("invalid ctype:" + postdata)

            contrib.save()

            return {"id": postdata["protein"]}

        except Exception as ex:
            print(traceback.format_exc())
            # exc_info = sys.exc_info()
            # traceback.print_exception(*exc_info)
            # del exc_info

            transaction.rollback()
            return {"error": "error processing the contribution"}


@post("/login")
def login():
    credentials = json.loads(request.body.read())

    user = list(User.select().where(
        (User.email == str(credentials["email"])) &
        (User.password == str(credentials["password"]))))
    if user:
        user = user[0]
        save_session_var("user", user.id)
        return {"name": user.name, "email": user.email, "id": user.id,
                "institution": user.institution}
    else:
        return {"error": "Login incorrect"}

@post("/ask_reset")
def recover():
    credentials = json.loads(request.body.read())
    user = list(User.select().where((User.email == str(credentials["email"]))))
    if not user:
        return {"error":"User not found"}
    else:
        user = user[0]
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.ehlo()
        server.login(config["email"]["gmail_user"], config["email"]["gmail_password"])
        email_text ="""
        User %s (%i) asked for a password reset
        """ % (user.email,user.id)
        server.sendmail(gmail_user, config["gmail_user"], email_text)
        server.close()
        return {"info":"We will check your request and send you your new password as soon as possible!"}



@post("/register")
def register():
    credentials = json.loads(request.body.read())

    user = list(User.select().where(
        User.email == str(credentials["email"])))

    if user:
        return {"error": "Email already used"}

    else:
        user = User.create(**credentials)
        credentials["id"] = user.id
        return credentials


@get("/blast")
def blast_result():
    blast_id = request.query["bid"]

    result = []
    for q in bpsio.parse("/tmp/%s/result.xml" % blast_id, "blast-xml"):
        for h in q:
            for hsp in h:
                g = list(Globin.select().where(Globin.aln_id == hsp.hit_id))[0]
                res = serialize_search_globin(g)
                res["identity"] = identity(hsp)
                res["coverage"] = coverage(q, hsp)
                res["alignment"] = {
                    hsp.query_id + " " + str(hsp.query_start) + ":" + str(hsp.query_end): str(hsp.aln[0].seq),
                    hsp.hit_id + " " + str(hsp.hit_start) + ":" + str(hsp.hit_end): str(hsp.aln[1].seq),
                }
                result.append(res)

    return {"globins": result}


@get("/organism")
def organism():
    return {}


@get("/group")
def group():
    return {}


@get("/methodology")
def search2():
    return {"hola": "chau"}


# Static Routes
@get('/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='./')


# Static Routes
@get('/<filename:re:.*\.html>')
def html(filename):
    return static_file(filename, root='./')


@get('/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='./')


@get('/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):
    return static_file(filename, root='./')


@get('/<filename:re:.*\.(eot|ttf|woff|svg)>')
def fonts(filename):
    return static_file(filename, root='./')


@get('/tree')
def home():
    redirect("/variant/")


if __name__ == '__main__':
    run(app=bapp, host=ip, port=3001, debug=True)
