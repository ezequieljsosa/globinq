from __future__ import unicode_literals
from django.utils.translation import gettext_lazy as __

from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.views.generic import DetailView, RedirectView, UpdateView
from django.contrib import messages
from django.utils.translation import ugettext_lazy as _
from django.core.files.base import ContentFile
from django.db.models import Q
from django.http import HttpResponseNotFound, HttpResponse
from django.db import transaction

import json
from collections import defaultdict
import os
import subprocess as sp
import tempfile
import uuid
import datetime
import Bio.SearchIO as bpsio
import Bio.SeqIO as bpio

from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord

from globinq import site_pos, sites
from .models import Globin, IndexKeyword, Tax, PDB, Channel, \
    ExperimentalData, Contribution
from globinq.users.models import User

from globinq.upload_globin import upload_globin

# import requests
from Bio.SeqUtils import seq1
from Bio.PDB.Polypeptide import is_aa, CaPPBuilder

import traceback


def identity(hsp):
    return 1.0 * hsp.ident_num / hsp.aln_span


def coverage(query_result, hsp):
    # return 1.0 * hsp.aln_span / hsp.query_span
    return 1.0 * hsp.query_span / query_result.seq_len


def hit_coverage(hit, hsp):
    # return 1.0 * hsp.aln_span /  hsp.hit_span
    return 1.0 * hsp.hit_span / hit.seq_len


def serialize_search_globin(globin):
    return {
        'id': globin.id,
        'name': globin.globinName(),
        'organism': globin.tax.name,
        'group': globin.globin_group,
        'pdbs': [x.pdb for x in globin.structures.all()],

        "exp": globin.exp_txt(),
        "curated": "yes" if globin.owner else "no",
        "calc": globin.calc_txt()

    }


def struct_aln(globin):
    aln = {globin.name: globin.aln_seq
           }

    for x in globin.structures.all():
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
    for i in globin.insertions.all():
        insertions[i.g_position] = i.insertions
    exp_contributions = {x.experimental.id: x for x in
                         Contribution.objects.filter(experimental__in=globin.experimental.all())
                         if not x.removed}

    gdict = {
        'id': globin.id,
        "tax": globin.tax.id,
        'name': globin.globinName(),
        'uniprot': globin.uniprot,
        'organism': globin.tax.name,
        'group': globin.globin_group,
        'pdbs': [serialize_pdb(x) for x in globin.structures.all()],
        'alns': struct_aln(globin),
        'sequence': globin.sequence,
        'owner': "",
        "experimental": [{
            'kon': x.k_on_o2_exp,
            'koff': x.k_off_o2_exp,
            'name': x.sequence_red,
            'owner': {k: v for k, v in exp_contributions[x.id].user.to_dict().items() if
                      k != "password"} if x.id in exp_contributions else {}
        } for x in globin.experimental.all()],
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


# @hook('after_request')
# def enable_cors():
#     """
#     You need to add some headers to each request.
#     Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
#     """
#     response.headers['Access-Control-Allow-Origin'] = '*'
#     response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
#     response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


def tax_search(request):
    search = request.GET["search"].strip()
    if len(search) > 2:
        res = {"tax": [{"id": x.id, "name": x.name} for x in
                       Tax.objects.filter(name__icontains=search)]}
    else:
        res = {"tax": []}

    return res


def search(request):
    query = Globin.objects.prefetch_related("structures", "experimental", "tax", "l_channel", "g8_channel", "e7_portal")

    if ("kw" in request.GET) and request.GET["kw"]:
        kw = request.GET["kw"].lower().strip()
        query = query.filter(keywords__keyword__in=kw.split())

    if ("with_exp" in request.GET) and int(request.GET["with_exp"]):
        query.filter(experimental__isnull=False)

    if ("only_struct" in request.GET) and int(request.GET["only_struct"]):
        query.filter(structures__isnull=True)

    if ("kon_start" in request.GET):
        k_min = float(request.GET["kon_start"])
        k_max = float(request.GET["kon_end"])
        query = query.filter(
            Q(experimental__k_on_o2_exp__gte=k_min, experimental__k_on_o2_exp__lte=k_max)
            |
            Q(k_on_o2_pred__gte=k_min, k_on_o2_pred__lte=k_max)
        )

    if ("koff_start" in request.GET):
        k_min = float(request.GET["koff_start"])
        k_max = float(request.GET["koff_end"])
        query = query.filter(
            Q(experimental__k_off_o2_exp__gte=k_min, experimental__k_off_o2_exp__lte=k_max)
            |
            Q(k_off_o2_pred_gte=k_min, k_off_o2_pred_lte=k_max)
        )

    if ("p50_min" in request.GET) and request.GET["p50_min"]:
        p50_min = float(request.GET["p50_min"])
        p50_max = float(request.GET["p50_max"])
        query = query.filter(p50__range=(p50_min, p50_max))

    if ("groups" in request.GET) and request.GET["groups"]:
        group = [x.split("_")[0].upper() for x in request.GET["groups"].split(",") if x.split("_")[1] == "true"]
        query = query.filter(globin_group__in=group)

    if ("noncurated" not in request.GET) or (not int(request.GET["noncurated"])):
        query = query.filter(owner_id__isnull=True)

    if ("tax" in request.GET) and request.GET["tax"]:
        tax = int(request.GET["tax"])
        ids = Tax.parent_ids(Tax.objects.get(id=tax))
        query = query.filter(tax__in=ids)

    if ("org" in request.GET) and request.GET["org"]:
        tax = int(request.GET["org"])
        query = query.filter(tax_id=tax)

    if ("as" in request.GET) and request.GET["as"]:
        query = query.filter(active_site_red__icontains=str(request.GET["as"]))

    if ("e7" in request.GET) and request.GET["e7"]:
        channels = Channel.objects.filter(sequence_red__icontains=str(request.GET["e7"]))
        query = query.filter(e7_portal__in=channels)

    if ("lt" in request.GET) and request.GET["lt"]:
        channels = Channel.objects.filter(sequence_red__icontains=str(request.GET["lt"]))
        query = query.filter(l_channel__in=channels)

    if ("g8" in request.GET) and request.GET["g8"]:
        channels = Channel.objects.filter(sequence_red__icontains=str(request.GET["g8"]))
        query = query.filter(g8_channel__in=channels)

    if ("download" in request.GET):
        import csv
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="globinq.csv"'
        tmp = csv.writer(response)

        if request.GET["download"] == "csv":
            tmp.writerow('tax,organism,name,group,exp,teo,pdb,uniprot,closest_curated'.split(","))
            for x in query:
                tmp.writerow(
                    '{tax},{organism},{name},{group},{exp},{teo},{pdb},{uniprot},{closest_curated}\n'.format(
                        tax=x.tax.id, organism=x.tax.name,
                        name=x.name, uniprot=x.uniprot, group=x.globin_group,
                        exp="yes" if x.hasExperimental() else "no",
                        teo="yes" if x.hasPredicted() else "no",
                        pdb="yes" if list(x.structures.all()) else "no",
                        closest_curated=x.closest_curated
                    ).split(","))
        else:
            for x in query:
                r = SeqRecord(id=x.name, seq=Seq(x.sequence),
                              description=x.tax.name + " " +
                                          str(x.tax.id) + " " + str(x.uniprot))
                bpio.write(r, tmp, "fasta")
        return response
    else:
        res = []
        from tqdm import tqdm
        for x in tqdm(list(query)):
            try:
                res.append(serialize_search_globin(x))
            except Exception as ex:
                print(x)
                print(ex)
                return HttpResponse(json.dumps({"error": "Error filtering globins", 'globins': []}))

        return HttpResponse(json.dumps({'globins': res}))


def protein(request, protein_id):
    globin_qs = Globin.objects.prefetch_related("structures", "experimental", "tax", "l_channel", "g8_channel",
                                                "e7_portal").filter(id=int(protein_id))
    if globin_qs.count() == 0:
        return HttpResponseNotFound("no such globin")

    return serialize_globin(globin_qs.get())


def user_page(request, user_id):
    user_qs = User.objects.filter(id=int(user_id))
    if user_qs.count() == 0:
        return HttpResponseNotFound("no such user")
    user = user_qs.get()
    doc = user.to_dict()
    doc["globins"] = [{"id": g.id, "name": g.name, "group": g.globin_group}
                      for g in
                      Globin.objects.filter(
                          owner=user,
                          removed=False)]
    doc["contributions"] = []
    for c in Contribution.objects.filter(user=user, removed=False):
        data = {}
        for k, v in c.to_dict().items():

            if (k == "experimental") and v:
                data["experimental"] = ExperimentalData.objects.get(id=v).to_dict()
                data["experimental"]["globin_name"] = Globin.objects.get(id=
                                                                         int(data["experimental"][
                                                                                 "globin"])).globinName()

            else:
                data[k] = v.isoformat() if k in ["creation", "last_update"] else v

        doc["contributions"].append(data)

    return doc


def blast(request):
    if request.method == "POST":
        postdata = json.loads(request.body.decode('utf-8'))
        bid = str(uuid.uuid1())

        import re
        pattern = re.compile(r'\s+')
        sequence = re.sub(pattern, '', postdata["sequence"])
        os.mkdir("/tmp/" + bid)
        bpio.write(SeqRecord(id="query", seq=Seq(sequence)), "/tmp/" + bid + "/query.fasta", "fasta")
        cmd = "blastp -db data/generated/sequences.fasta -query  /tmp/%s/query.fasta -evalue 0.01 -qcov_hsp_perc 80  -outfmt 5  -max_hsps 1 > /tmp/%s/result.xml"
        sp.call(cmd % (bid, bid), shell=True)
        return {"id": bid}
    else:
        blast_id = request.GET["jid"]
        result = []
        for q in bpsio.parse("/tmp/%s/result.xml" % blast_id, "blast-xml"):
            for h in q:
                for hsp in h:
                    g = list(Globin.objects.filter(Globin.aln_id == hsp.hit_id))[0]
                    res = serialize_search_globin(g)
                    res["identity"] = identity(hsp)
                    res["coverage"] = coverage(q, hsp)
                    res["alignment"] = {
                        hsp.query_id + " " + str(hsp.query_start) + ":" + str(hsp.query_end): str(hsp.aln[0].seq),
                        hsp.hit_id + " " + str(hsp.hit_start) + ":" + str(hsp.hit_end): str(hsp.aln[1].seq),
                    }
                    result.append(res)

        return {"globins": result}





def upload(request):
    if request.method != "POST":
        return HttpResponseNotFound("upload")
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


def del_contrib(request):
    data = json.loads(request.body.read())
    c = Contribution.objects.get(id=data["contrib_id"])
    c.last_update = datetime.datetime.now()
    c.removed = True
    c.save()
    return {"id": data["globin_id"]}


def add_pdb(request):
    from GlobinQ.db.update_pdb_alignments import process_globin_structure

    from Bio.PDB import PDBParser, parse_pdb_header
    data = json.loads(request.body.read())
    pdb = data["pdb"]
    globin_id = data["globin"]
    globin = Globin.objects.get(id=globin_id)
    error = ""

    if pdb in [x.pdb for x in globin.structures.all()]:
        error = "PDB code already related to the globin"
        return {"error": error}

    try:

        pdb_path = "/data/databases/pdb/divided/" + pdb[1:3] + "/pdb" + pdb + ".ent"
        if not os.path.exists(pdb_path):
            r = requests.get('https://files.rcsb.org/download/' + pdb.upper() + ".pdb")
            if r.status_code == 404:
                error = "PDB code does not exists"
                return {"error": error}
            if r.status_code == 200:
                if not os.path.exists("/data/databases/pdb/divided/" + pdb[1:3]):
                    os.mkdir("/data/databases/pdb/divided/" + pdb[1:3])
                with open(pdb_path, "w") as h:
                    h.write(r.text)

        if not os.path.exists("/tmp/globinq/"):
            os.mkdir("/tmp/globinq/")
        pdb_seq_path = "/tmp/globinq/" + pdb + ".fasta"
        globin_seq_path = "/tmp/globinq/" + str(globin.id) + ".fasta"

        with open(globin_seq_path, "w") as h:
            bpio.write(SeqRecord(id=str(globin.id), name="", description="", seq=Seq(globin.sequence)), h,
                       "fasta")

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

        if not os.path.exists("/tmp/{pdb}_{globin}/".format(pdb=pdb, globin=globin.id)):
            os.mkdir("/tmp/{pdb}_{globin}/".format(pdb=pdb, globin=globin.id))
        result = "/tmp/{pdb}_{globin}/result.xml".format(pdb=pdb, globin=globin.id)
        cmd = "makeblastdb -dbtype prot -in " + pdb_seq_path
        sp.call(cmd, shell=True)
        cmd = "blastp -db /tmp/globinq/{pdb}.fasta -query  /tmp/globinq/{seq}.fasta -evalue 0.01 -qcov_hsp_perc 80  -outfmt 5  -max_hsps 1 > {result}"
        sp.call(cmd.format(pdb=pdb, seq=globin.id, result=result), shell=True)

        alns = defaultdict(lambda: {})

        with open(pdb_path) as h:
            header = parse_pdb_header(h)

        blast_results = {q.id: q for q in bpsio.parse(result, "blast-xml")}
        for q in blast_results.values():
            for hit in q:
                for hsp in hit:
                    alns[q.id]["_".join(hit.id.split("_")[0:2])] = hsp

        if alns:
            for hit in alns[q.id]:
                with transaction.atomic():
                    struct = PDB(globin=globin, pdb=pdb, chain=hit.split("_")[1], description=header["name"])
                    if (("source" in header) and header["source"]
                        and ("organism_scientific" in header["source"].values()[0])):
                        struct.organism = header["source"].values()[0]["organism_scientific"]
                    struct.save(force_insert=True)
                    process_globin_structure(globin, struct, alns, polypeps, lambda g: str(g.id))
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


def del_globin(request):
    data = json.loads(request.body.read())
    g = Globin.objects.get(id=data["globin_id"])
    if g.owner.id == data["user_id"]:
        Globin.objects.filter(id == int(data["globin_id"])).update(removed=True)
        return {"id": data["globin_id"]}
    else:
        return HttpResponseNotFound()


def addData(request):
    postdata = json.loads(request.body.read())
    with transaction.atomic():
        try:
            if "id" in postdata:
                contrib = Contribution.objects.get(id=postdata["id"])
            else:
                contrib = Contribution()
                contrib.user = User.objects.get(id=int(postdata["user"]))
                contrib.ctype = postdata["ctype"].strip().lower()
                contrib.creation = datetime.datetime.now()
            contrib.last_update = datetime.datetime.now()

            contrib.paper = postdata["paper"]
            contrib.description = postdata["description"]

            if contrib.ctype == "exp":
                if "id" in postdata:
                    exp = contrib.experimental.all()
                else:
                    exp = ExperimentalData(globin=Globin.objects.get(id=int(postdata["protein"])))

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

            return {"error": "error processing the contribution"}


# @post("/login")
# def login():
#     credentials = json.loads(request.body.read())
#
#     user = list(User.objects.filter(
#         (User.email == str(credentials["email"])) &
#         (User.password == str(credentials["password"]))))
#     if user:
#         user = user[0]
#         save_session_var("user", user.id)
#         return {"name": user.name, "email": user.email, "id": user.id,
#                 "institution": user.institution}
#     else:
#         return {"error": "Login incorrect"}
#
# @post("/ask_reset")
# def recover():
#     credentials = json.loads(request.body.read())
#     user = list(User.objects.filter((User.email == str(credentials["email"]))))
#     if not user:
#         return {"error": "User not found"}
#     else:
#         user = user[0]
#         server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
#         server.ehlo()
#         server.login(config["email"]["gmail_user"], config["email"]["gmail_password"])
#         email_text = """
# User %s (%i) asked for a password reset
# """ % (user.email, user.id)
#         server.sendmail(gmail_user, config["gmail_user"], email_text)
#         server.close()
#         return {"info": "We will check your request and send you your new password as soon as possible!"}
#
# @post("/register")
# def register():
#     credentials = json.loads(request.body.read())
#
#     user = list(User.objects.filter(
#         User.email == str(credentials["email"])))
#
#     if user:
#         return {"error": "Email already used"}
#
#     else:
#         user = User.create(**credentials)
#         credentials["id"] = user.id
#         return credentials


from django.shortcuts import redirect, reverse
from django.shortcuts import render


def about(request):
    return render(request, 'pages/about.html', {})


def downloads(request):
    return render(request, 'pages/downloads.html', {})


def methodology(request):
    return render(request, 'pages/methodology.html', {})


def tutorial(request):
    return render(request, 'pages/tutorial.html', {})


def statistics(request):
    globin_groups = ["N", "O", "P", "Q"]

    sites = {
        "sa": ["B10", "CD1", "E7", "E11", "G8"],
        "lt": ["B2", "E11", "E15", "G8", "H5", "H9"],
        "e7": ["B10", "CD1", "E7", "E11"],
        "g8": ["G8", "G9", "H9"]
    }

    site_codes = {"lt": "LT", "e7": "E7G", "g8": "STG8", "sa": "AS"}
    site_names = {"lt": 'Long tunnel', "e7": 'Short Tunnel E7 myoglobin-like gate', "g8": 'Short Tunnel G8',
                  "sa": 'Active site'};

    # group,site,site_name,sites

    groups = []
    for g in globin_groups:
        for site_code, positions in sites.items():
            groups.append([g, site_code, site_codes[site_code], site_names[site_code], positions])

    return render(request, 'pages/statistics.html', {"groups": groups})


def clan(request):
    return render(request, 'pages/clan.html', {"clan": ""})


def home(request):
    return render(request, 'pages/home.html', {"clan": ""})
