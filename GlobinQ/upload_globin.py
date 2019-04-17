import os
import re
import subprocess as sp
import uuid

import Bio.SearchIO as bpsio
import Bio.SeqIO as bpio
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio.SubsMat import MatrixInfo as matlist
from collections import  defaultdict
from peewee import MySQLDatabase

from GlobinQ.db import reduced_code, sites, mysql_db, site_pos
from GlobinQ.db.Model import Globin, Tax, Channel, PosInsertion, \
    ExperimentalData, GlobinPosition, GlobinPDBPosition, PDB, User
from Bio.PDB import PDBParser,parse_pdb_header
from db.update_pdb_alignments import process_globin_structure

from Bio.PDB import *

def identity(hsp):
    return 1.0 * hsp.ident_num / hsp.aln_span


def coverage(query_result, hsp):
    # return 1.0 * hsp.aln_span / hsp.query_span
    return 1.0 * hsp.query_span / query_result.seq_len


def hit_coverage(hit, hsp):
    # return 1.0 * hsp.aln_span /  hsp.hit_span
    return 1.0 * hsp.hit_span / hit.seq_len


def upload_globin(postdata):
    bid = str(uuid.uuid1())
    owner = list(User.select().where(User.id == postdata["owner"]["id"]))[0]
    sequence = "".join(filter(lambda x: not re.match(r'^\s*$', x), postdata["sequence"]))
    os.mkdir("/tmp/" + bid)
    bpio.write(SeqRecord(id="query", seq=Seq(sequence)), "/tmp/" + bid + "/query.fasta", "fasta")
    cmd = "blastp -db data/generated/sequences.fasta -query  /tmp/%s/query.fasta -evalue 0.0000001  -outfmt 5  -max_hsps 1 > /tmp/%s/result.xml"
    sp.check_output(cmd % (bid, bid), shell=True)

    hits = []
    for q in bpsio.parse("/tmp/%s/result.xml" % bid, "blast-xml"):
        for h in q:
            for hsp in h:
                if (coverage(q, hsp) > 0.85) and (hit_coverage(q, hsp) > 0.85) and identity(hsp) > 0.55:
                    hits.append([identity(hsp), hsp.hit_id])

    if not hits:
        return {"error": "No curated globins found for that sequence"}

    if hits:
        hit_id = [x[1] for x in sorted(hits, key=lambda y: y[0])][-1]

        g = Globin.select().where(Globin.aln_id == hit_id).first()

        # from Bio import pairwise2
        # matrix = matlist.blosum62
        # alignment = pairwise2.align.globaldx(
        #     sequence,
        #     g.sequence, matrix
        # )[0]
        # aln_q, aln_h = alignment[0:2]
        #
        # q_pos = -1
        #
        # blast_aln_pos = -1
        #
        # msa_new_globin_seq = ""  # build extended alignment
        # old_globin_map = {}  # map from exended alignmento to curated msa
        # extended_msa_pos = -1
        #
        # pos_aditions = {x: 0 for x in site_pos.keys()}
        #
        # for msa1_pos, aa in enumerate(g.aln_seq):
        #     if aa == "-":
        #         extended_msa_pos += 1
        #         old_globin_map[extended_msa_pos] = msa1_pos
        #         msa_new_globin_seq += "-"
        #     else:
        #         q_pos += 1
        #         blast_aln_pos += 1
        #         while (aln_q[blast_aln_pos] == "-" or aln_h[blast_aln_pos] == "-"):
        #             extended_msa_pos += 1
        #             old_globin_map[extended_msa_pos] = msa1_pos
        #             msa_new_globin_seq += aln_q[blast_aln_pos]
        #             blast_aln_pos += 1
        #
        #             for pos_name, pos_idx_in_msa in site_pos.items():
        #                 if pos_idx_in_msa >= msa1_pos:
        #                     pos_aditions[pos_name] += 1
        #
        #         extended_msa_pos += 1
        #         old_globin_map[extended_msa_pos] = msa1_pos
        #         msa_new_globin_seq += aln_q[blast_aln_pos]
        cmd = "mafft --keeplength --mapout --addfull /tmp/{bid}/query.fasta  data/generated/msa.fasta >  /tmp/{bid}/msa.fasta"
        sp.call(cmd.format(bid=bid), shell=True)
        for r in bpio.parse("/tmp/" + bid + "/msa.fasta", "fasta"):
            if r.id == "query":
                msa_new_globin_seq = str(r.seq)

        # positions = {p.seq_pos: p for p in g.positions}
        # pos_aa = {p.g_position: g.sequence[p.seq_pos] for p in g.positions}

        tax = Tax.select().where(Tax.id == postdata["tax"]["id"]).get()
        # pos_aa = {}
        seq_pos_from_aln_pos = {x.strip().split(", ")[-1]:int(x.strip().split(", ")[1])
                  for x in open("/tmp/" + bid + "/query.fasta.map").readlines()[2:] }

        rcod = "".join(
            [reduced_code("sa", pos, msa_new_globin_seq[site_pos[pos]]) for pos in sites["sa"]])
        scod = "".join([msa_new_globin_seq[site_pos[pos]] for pos in sites["sa"]])

        new_globin = Globin(
            uniprot=postdata.get("uniprot", "unknown"),
            tax=tax,
            globin_group=g.globin_group,
            sequence=sequence,

            aln_seq=msa_new_globin_seq,
            owner=owner,
            l_channel=Channel(),
            g8_channel=Channel(),
            e7_portal=Channel(),
            active_site=scod,
            active_site_red=rcod
        )
        new_globin.name = new_globin.globinName()
        new_globin.l_channel.sequence = "".join([msa_new_globin_seq[site_pos[pos]] for pos in sites["lt"]])
        new_globin.g8_channel.sequence = "".join([msa_new_globin_seq[site_pos[pos]] for pos in sites["g8"]])
        new_globin.e7_portal.sequence = "".join([msa_new_globin_seq[site_pos[pos]] for pos in sites["e7"]])

        new_globin.l_channel.sequence_red = "".join([
            reduced_code("tl", pos, msa_new_globin_seq[site_pos[pos]]) for pos in sites["lt"]])
        new_globin.g8_channel.sequence_red = "".join([
            reduced_code("g8", pos, msa_new_globin_seq[site_pos[pos]]) for pos in sites["g8"]])
        new_globin.e7_portal.sequence_red = "".join([
            reduced_code("e7", pos, msa_new_globin_seq[site_pos[pos]]) for pos in sites["e7"]])
        new_globin.closest_curated = g
        new_globin.save(force_insert=True)

        for experimental in postdata["experimental"]:
            ExperimentalData(k_on_o2_exp=experimental["k_on_o2_exp"],
                             k_off_o2_exp=experimental["k_off_o2_exp"],
                             globin=new_globin,
                             sequence_red=experimental["name"]).save()
        result = "/tmp/{bid}/pdb_blast.xml".format(bid=bid)
        cmd = "blastp -db /data/databases/pdb/processed/seqs_from_pdb.fasta -query  /tmp/{bid}/query.fasta -evalue 0.0001 -qcov_hsp_perc 80  -outfmt 5  -max_hsps 1 > {result}"
        sp.call(cmd.format(bid=bid, result=result), shell=True)


        alns = defaultdict(lambda :{})
        blast_results = {q.id: q for q in bpsio.parse(result, "blast-xml")}
        for q in blast_results.values():
            for hit in q:
                for hsp in hit:
                    if identity(hsp) > 0.95:
                        alns[q.id]["_".join(hit.id.split("_")[0:2])] = hsp

        for p  in g.positions:
            gpos = site_pos[p.g_position]
            while str(gpos) not in seq_pos_from_aln_pos:
                gpos += 1

            gp = GlobinPosition(globin=new_globin, seq_pos=seq_pos_from_aln_pos[str(gpos)],
                            g_position=p.g_position)
            gp.save(force_insert=True)


        if alns:
            polypeps=defaultdict(lambda :{})
            for hit in alns["query"]:
                if len(hit.split("_")[0]) == 4:
                    pdb = hit.split("_")[0]
                    pdb_path = "/data/databases/pdb/divided/" + pdb[1:3] + "/pdb" + pdb + ".ent"
                    with open(pdb_path) as h:
                        header = parse_pdb_header(h)
                    struct = PDB(globin=new_globin, pdb=hit.split("_")[0], chain=hit.split("_")[1],
                                 description=header["name"])
                    if (("source" in header) and header["source"]
                            and ("organism_scientific" in header["source"].values()[0])):
                        struct.organism = header["source"].values()[0]["organism_scientific"]
                    struct.save(force_insert=True)

                    parser = PDBParser(QUIET=True)
                    structure = parser.get_structure(pdb, pdb_path)
                    ppb = CaPPBuilder()
                    polipep = list(ppb.build_peptides(structure[0][struct.chain]))[0]
                    polypeps[pdb][struct.chain] = polipep

                    process_globin_structure(new_globin, struct, alns, polypeps, lambda g: "query")


        return {"id": new_globin.id}

    else:
        return {"error": "No curated globins found for that sequence"}


if __name__ == '__main__':
    exact = "MKFETINQESIAKLMEIFYEKVRKDKDLGPIFNNAIGTSDEEWKEHKAKIG\nNFWAGMLLGEGDYNGQPLKKHLDLPPFPQEFFEVWLGLFEESLNMVYNEEM\nKAVILQRAQMIASHFQNMLYKYGGH"
    inser = "MKFETINQESIAKLMEIFYEKVRKDKDLGPIFNNAIGTSDEEWKEHKAKIG\nNFWAGMLLGEGDYNGQPLKKHLDLPPFPQEFFEVWLGLFEESLNMMMVYNEEM\nKAVILQRAQMIASHFQNMLYKYGGH"
    postdata = {u'e7_portal': {u'openness': None, u'e_bar_contrib': None}, u'name': u'',
                u'sequence': inser,
                u'active_site': u'', u'g8_channel': {u'openness': None, u'e_bar_contrib': None},
                u'tax': {u'id': 2264, u'name': u'Thermococcus celer'},
                u'l_channel': {u'openness': None, u'e_bar_contrib': None}, u'uniprot': u'sdfasd', u'owner':
                    {"name": "test", u'institute': u'aaaa', u'email': u'123', "id": "1"},
                u'p50': None, u'experimental': []}

    mysqldb = MySQLDatabase('globinq', user="root", password="mito")
    mysql_db.initialize(mysqldb)
    print upload_globin(postdata)
