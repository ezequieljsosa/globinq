'''
Created on Jun 17, 2017

@author: eze
'''
import warnings
from _collections import defaultdict
import configparser

from Bio import BiopythonWarning, BiopythonExperimentalWarning
from tqdm import tqdm

warnings.simplefilter('ignore', BiopythonWarning)
warnings.simplefilter('ignore', BiopythonExperimentalWarning)

import Bio.SearchIO as bpsio
import Bio.SeqIO as bpio
from Bio.PDB import *
from Bio.SeqRecord import SeqRecord
from peewee import MySQLDatabase

from GlobinQ.db import mysql_db, site_pos
from GlobinQ.db.Model import Globin, PDB, GlobinPDBPosition


def identity(hsp):
    return 1.0 * hsp.ident_num / hsp.aln_span


"""
g320 = Globin.select().where(Globin.id == 320).get()
p2gkn = PDB.select().where((PDB.globin == g320) &  (PDB.pdb=="2gkn") & (PDB.chain == "A")  ).get()
"""


def process_globin_structure(g,s,alns,polypeps,gid=lambda g:g.aln_id):
    """

    :param g: Globin
    :param s: PDB
    :param alns: dict<globin_id,dict<pdb_chain,alignment>>
    :return:
    """
    hsp = alns[gid(g)][s.pdb + "_" + s.chain]
    posmap = {}
    posmap_aa = {}

    gpos = 0
    pdbpos = 0
    for hsp_pos in range(len(hsp.aln[0])):
        aa_g = hsp.aln[0][hsp_pos]
        aa_pdb = hsp.aln[1][hsp_pos]
        # if aa_g != "-" and aa_pdb != "-":
        if aa_pdb != "-":
            if aa_g != "-":
                posmap[hsp.query_start + gpos] = hsp.hit_start + pdbpos
                posmap_aa[hsp.query_start + gpos] = aa_pdb
            # else:
            #     raise Exception("There should not be any insertion")
        if aa_g != "-":
            gpos += 1
        if aa_pdb != "-":
            pdbpos += 1

    gpos = 0
    seq_pdb = ""
    for aln_pos, aln_aa in enumerate(g.aln_seq):
        if aln_aa == "-":
            aa = "-"
        else:
            if gpos in posmap:
                aa = posmap_aa[gpos]
            else:
                aa = "-"
            gpos += 1
        seq_pdb = seq_pdb + aa

    if seq_pdb:
        s.aln_seq = seq_pdb
        s.save()
        for gpos in g.positions:
            if gpos.seq_pos in posmap:
                seq_pos = posmap[gpos.seq_pos]
                seq_pdb = seq_pdb[:site_pos[gpos.g_position] + 1]
                if s.chain in polypeps[s.pdb]:
                    res_id = polypeps[s.pdb][s.chain][seq_pos]
                    res_id = str(res_id.id[0]) + str(res_id.id[1])
                    GlobinPDBPosition(pdb=s, globin_pos=gpos, pdb_res_id=res_id).save()

if __name__ == '__main__':

    pdbl = PDBList(pdb="/data/databases/pdb/divided/")
    msa = {x.id: x for x in bpio.parse("data/MSA.fasta", "fasta")}
    alns = defaultdict(lambda: {})

    blast_results = {q.id: q for q in bpsio.parse("data/generated/blast_pdb.xml", "blast-xml")}
    for q in tqdm(blast_results.values()):
        for hit in q:
            for hsp in hit:
                alns[q.id]["_".join(hit.id.split("_")[0:2])] = hsp


    config = configparser.ConfigParser()
    config.read("./globinq.config")

    mysqldb = MySQLDatabase('globinq', user=config["mysql"]["user"], password=config["mysql"]["pass"])
    mysql_db.initialize(mysqldb)

    pdbs = []
    total = Globin.select().join(PDB).count()
    for g in tqdm(Globin.select().join(PDB), total=total):
        for s in g.structures:
            assert alns[str(g.aln_id)], g.aln_id
    #     for pdb in pdbs:
    #         pdbdir = "/data/databases/pdb/divided/" + pdb[1:3]
    #         if not os.path.exists(pdbdir):
    #             os.makedirs(pdbdir)
    #         os.chdir(pdbdir)
    #         sp.call("wget  https://files.rcsb.org/download/" + pdb + ".pdb",shell=True)
    pdbs_fasta = "data/generated/pdbs.fasta"
    GlobinPDBPosition.delete()

    polypeps = defaultdict(lambda: {})
    with open(pdbs_fasta, "w") as h:
        for g in tqdm(Globin.select().join(PDB), total=total):

            for s in g.structures:
                pdb = s.pdb
                if (pdb + "_" + s.chain) not in pdbs:
                    pdbs.append(pdb + "_" + s.chain)
                    parser = PDBParser(QUIET=True)
                    pdb_path = "/data/databases/pdb/divided/" + pdb[1:3] + "/pdb" + pdb + ".ent"
                    # downloaded = pdbl.retrieve_pdb_file(cod,file_format="pdb")
                    # shutil.move(downloaded,pdb_path)
                    structure = parser.get_structure(pdb, pdb_path)
                    ppb = CaPPBuilder()
                    polipep = list(ppb.build_peptides(structure[0][s.chain]))[0]
                    polypeps[pdb][s.chain] = polipep
                    seq = polipep.get_sequence()
                if len(seq):
                    bpio.write(SeqRecord(id=pdb + "_" + s.chain, seq=seq), h, "fasta")

    #     sp.call( "hmmbuild --amino  --fragthresh 0  data/generated/globin.hmm data/generated/msa.fasta" ,shell=True )
    #     sp.call( "hmmalign --mapali data/generated/msa.fasta  -o  data/generated/pdbs.hmm data/generated/globin.hmm " + pdbs_fasta + " ",shell=True )
    #     sp.call( "hmmalign -o  data/generated/pdbs.hmm data/generated/globin.hmm " + pdbs_fasta + " ",shell=True )
    #     msa = bpaio.read("data/generated/pdbs.hmm","stockholm")
    # sp.call( "psiblast -db seqs.fasta -in_msa msa.fasta -out_ascii_pssm pssm.txt",shell=True )
    # sp.call( "clustalo -i data/generated/pdbs.fasta --hmm-in data/generated/globin.hmm > data/generated/aln.fasta",shell=True )
    # msa = bpaio.read("data/generated/aln.fasta","fasta")
    print "updating db"
    assert alns




    for g in tqdm(Globin.select().join(PDB), total=total):
        with mysqldb.atomic():
            for s in g.structures:
                process_globin_structure(g,s,alns,polypeps)


    print "ok"
