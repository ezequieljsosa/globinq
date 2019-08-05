'''
Created on Jun 17, 2017

@author: eze
'''

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction


import warnings
from _collections import defaultdict

from Bio import BiopythonWarning, BiopythonExperimentalWarning
from tqdm import tqdm

warnings.simplefilter('ignore', BiopythonWarning)
warnings.simplefilter('ignore', BiopythonExperimentalWarning)

import Bio.SearchIO as bpsio
import Bio.SeqIO as bpio
from Bio.PDB import *
from Bio.SeqRecord import SeqRecord

from globinq import  site_pos
from globinq.models import Globin, PDB, GlobinPDBPosition
from globinq.upload_globin import process_globin_structure

def identity(hsp):
    return 1.0 * hsp.ident_num / hsp.aln_span





class Command(BaseCommand):

    def handle(self, *args, **options):

        pdbl = PDBList(pdb="/data/databases/pdb/divided/")
        msa = {x.id: x for x in bpio.parse("data/MSA.fasta", "fasta")}
        alns = defaultdict(lambda: {})

        blast_results = {q.id: q for q in bpsio.parse("data/generated/blast_pdb.xml", "blast-xml")}
        for q in tqdm(blast_results.values()):
            for hit in q:
                for hsp in hit:
                    alns[q.id]["_".join(hit.id.split("_")[0:2])] = hsp



        pdbs = []
        qs = Globin.objects.filter(structures__isnull=False)
        for g in tqdm(qs, total=qs.count()):
            for s in g.structures.all():
                assert alns[str(g.aln_id)], g.aln_id
        #     for pdb in pdbs:
        #         pdbdir = "/data/databases/pdb/divided/" + pdb[1:3]
        #         if not os.path.exists(pdbdir):
        #             os.makedirs(pdbdir)
        #         os.chdir(pdbdir)
        #         sp.call("wget  https://files.rcsb.org/download/" + pdb + ".pdb",shell=True)
        pdbs_fasta = "data/generated/pdbs.fasta"
        GlobinPDBPosition.objects.all().delete()

        polypeps = defaultdict(lambda: {})
        qs = Globin.objects.filter(structures__isnull=False)
        with open(pdbs_fasta, "w") as h:
            for g in tqdm(qs, total=qs.count()):

                for s in g.structures.all():
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
        self.stderr.write("updating dbs")
        assert alns
        qs = Globin.objects.filter(structures__isnull=False)
        for g in tqdm(qs, total=qs.count()):
            with transaction.atomic():
                for s in g.structures.all():
                    process_globin_structure(g, s, alns, polypeps)

        self.stderr.write("finished")
