import os
import re
import subprocess as sp
import uuid

import Bio.SearchIO as bpsio
import Bio.SeqIO as bpio
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio.SubsMat import MatrixInfo as matlist

from peewee import MySQLDatabase

from GlobinQ.db import reduced_code, sites, mysql_db, site_pos
from GlobinQ.db.Model import Globin, Tax, Channel, PosInsertion, \
    ExperimentalData, GlobinPosition, GlobinPDBPosition, PDB, User


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
    cmd = "blastp -db data/generated/sequences.fasta -query  /tmp/%s/query.fasta -evalue 0.00001  -outfmt 5  -max_hsps 1 > /tmp/%s/result.xml"
    sp.check_output(cmd % (bid, bid), shell=True)

    hits = []
    for q in bpsio.parse("/tmp/%s/result.xml" % bid, "blast-xml"):
        for h in q:
            for hsp in h:
                if (coverage(q, hsp) > 0.8) and (hit_coverage(q, hsp) > 0.8):
                    hits.append([identity(hsp), hsp.hit_id])

    if hits:
        hit_id = [x[1] for x in sorted(hits, key=lambda y: y[0])][-1]

        g = Globin.select().where(Globin.aln_id == hit_id).first()

        from Bio import pairwise2
        matrix = matlist.blosum62
        alignment = pairwise2.align.globaldx(
            sequence,
            g.sequence, matrix
        )[0]
        aln_q, aln_h = alignment[0:2]

        q_pos = -1

        blast_aln_pos = -1

        msa_new_globin_seq = ""  # build extended alignment
        old_globin_map = {}  # map from exended alignmento to curated msa
        extended_msa_pos = -1

        pos_aditions = {x: 0 for x in site_pos.keys()}

        for msa1_pos, aa in enumerate(g.aln_seq):
            if aa == "-":
                extended_msa_pos += 1
                old_globin_map[extended_msa_pos] = msa1_pos
                msa_new_globin_seq += "-"
            else:
                q_pos += 1
                blast_aln_pos += 1
                while (aln_q[blast_aln_pos] == "-" or aln_h[blast_aln_pos] == "-"):
                    extended_msa_pos += 1
                    old_globin_map[extended_msa_pos] = msa1_pos
                    msa_new_globin_seq += aln_q[blast_aln_pos]
                    blast_aln_pos += 1

                    for pos_name, pos_idx_in_msa in site_pos.items():
                        if pos_idx_in_msa >= msa1_pos:
                            pos_aditions[pos_name] += 1

                extended_msa_pos += 1
                old_globin_map[extended_msa_pos] = msa1_pos
                msa_new_globin_seq += aln_q[blast_aln_pos]

        positions = {p.seq_pos: p for p in g.positions}
        pos_aa = {p.g_position: g.sequence[p.seq_pos] for p in g.positions}
        tax = Tax.select().where(Tax.id == postdata["tax"]["id"]).get()

        rcod = "".join(
            [reduced_code("sa", pos, pos_aa[pos]) for pos in sites["sa"]])
        scod = "".join([pos_aa[pos] for pos in sites["sa"]])

        new_globin = Globin(
            uniprot=postdata.get("uniprot","unknown"),
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
        new_globin.l_channel.sequence = "".join([pos_aa[pos] for pos in sites["lt"]])
        new_globin.g8_channel.sequence = "".join([pos_aa[pos] for pos in sites["g8"]])
        new_globin.e7_portal.sequence = "".join([pos_aa[pos] for pos in sites["e7"]])

        new_globin.l_channel.sequence_red = "".join([
            reduced_code("tl", pos, pos_aa[pos]) for pos in sites["lt"]])
        new_globin.g8_channel.sequence_red = "".join([
            reduced_code("g8", pos, pos_aa[pos]) for pos in sites["g8"]])
        new_globin.e7_portal.sequence_red = "".join([
            reduced_code("e7", pos, pos_aa[pos]) for pos in sites["e7"]])
        new_globin.closest_curated = g
        new_globin.save(force_insert=True)

        for experimental in postdata["experimental"]:
            ExperimentalData(k_on_o2_exp=experimental["k_on_o2_exp"],
                             k_off_o2_exp=experimental["k_off_o2_exp"],
                             globin=new_globin,
                             sequence_red=experimental["name"]).save()

        q_pos = -1
        h_pos = -1
        for i in range(len(aln_q)):
            if aln_q[i] != "-":
                q_pos += 1
            if aln_h[i] != "-":
                h_pos += 1

            if h_pos in positions:
                gp = GlobinPosition(globin=new_globin, seq_pos=q_pos,
                                    g_position=positions[h_pos].g_position)
                gp.save(force_insert=True)
                for r in positions[h_pos].residues:
                    pdb = PDB.select().where((PDB.pdb == r.pdb.pdb) &
                                             (PDB.globin == new_globin))
                    pdb = list(pdb)
                    if pdb:
                        pdb = pdb[0]
                    else:

                        pdb_aln_seq = ""
                        processed_pos = []
                        for ext_msa_idx, aa in enumerate(msa_new_globin_seq):
                            if aa == "-":
                                pdb_aln_seq += "-"
                            else:
                                pos = old_globin_map[ext_msa_idx]
                                if pos not in processed_pos:
                                    processed_pos.append(pos)
                                    pdb_aln_seq += r.pdb.aln_seq[pos]
                                else:
                                    pdb_aln_seq += "-"

                        pdb = PDB(
                            tax=tax,
                            globin=new_globin,
                            pdb=r.pdb.pdb,
                            description=r.pdb.description,
                            organism=r.pdb.organism,
                            chain=r.pdb.chain,
                            aln_seq=pdb_aln_seq
                        )
                        pdb.save(force_insert=True)

                    gpdb = GlobinPDBPosition(pdb=pdb, globin_pos=gp,
                                             pdb_res_id=r.pdb_res_id)
                    gpdb.save()
                del positions[h_pos]

        for pos_name, additions_count in pos_aditions.items():
            pi = PosInsertion(globin=new_globin, g_position=pos_name, insertions=additions_count)
            pi.save()

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
