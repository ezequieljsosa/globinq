"""
Created on Dec 29, 2016

@author: eze
"""

import os
import shutil

import Bio.SeqIO as bpio
import math
import pandas as pd
from Bio.PDB.PDBList import PDBList
from Bio.PDB.parse_pdb_header import parse_pdb_header

from tqdm import tqdm

from globinq import reduced_code, sites, site_pos
from globinq.models import Tax, Globin, Channel, PDB, GlobinPosition, GlobinDomain, \
    IndexKeyword, GlobinPDBPosition, ExperimentalData, PosInsertion, User, Contribution

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction


def globinName(tax_name,trHb_group):
    orgCod = ""
    vec = tax_name.split()
    if "sp" in map(lambda x: x.lower(), vec):
        vec2 = vec[0:map(lambda x: x.lower(), vec).index("sp")]
        if len(vec2) > 1:
            orgCod = "".join([vec2[0][0].upper()] + [y.lower() for y in vec2[1:]] + ["-"])
    elif "by" in map(lambda x: x.lower(), vec):
        vec2 = vec[0:map(lambda x: x.lower(), vec).index("by")]
        if len(vec2) > 1:
            orgCod = "".join([vec2[0][0].upper()] + [y.lower() for y in vec2[1:]] + ["-"])
    else:
        for i, word in enumerate(vec, 1):
            if len([x for x in word if x == x.upper()]) > 2:
                break
        if i > 1:
            vec2 = vec[0:i]
            # orgCod = "".join([vec2[0][0].upper()] + [ y[0].lower() for y in vec2[1:] ] + ["-"])
            orgCod = "".join([vec2[0][0].upper(), vec2[1][0].lower(), "-"])

    return orgCod + "trHb" + trHb_group



class Command(BaseCommand):

    help = 'Loads data from 10.1371/journal.pcbi.1004701'

    def add_arguments(self, parser):
        parser.add_argument('--pdbs_path',  default="/data/pdb/divided")
        parser.add_argument('--pdb_blast',   default='data/generated/blast_pdb.tbl')

    def handle(self, *args, **options):
        pdbs_path = options['pdbs_path']
        pdb_blast = options['pdb_blast']

        assert os.path.exists(pdbs_path), f"{pdbs_path} does not exists"
        assert os.path.exists(pdb_blast), f"{pdb_blast} does not exists"

        from django.db import connection


        for x in reversed(
                [Contribution,Channel, User, Globin, ExperimentalData, PDB, GlobinPosition,
                 IndexKeyword, GlobinPDBPosition, PosInsertion]):
            cursor = connection.cursor()
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE `" + x._meta.db_table + "`;SET FOREIGN_KEY_CHECKS = 1;")


        pdbl = PDBList(pdb=pdbs_path)

        e7g_residues = pd.read_csv("data/e7g_residues.csv")
        e7g_residues["tax"] = map(lambda x: [y.split("(")[0].strip() for y in
                                             x.split(":")[1].split(",")], e7g_residues.specie_unip)
        unip_e7g_dict = {}
        for _, e7g_sit in e7g_residues.iterrows():
            for tp in e7g_sit.specie_unip.split("),"):
                for u in tp.split("(")[1].split(","):
                    unip_e7g_dict[u.strip()] = e7g_sit.to_dict()

        active_site_res = pd.read_csv("data/active_site_res.csv")
        unip_as_dict = {}
        for _, ac_sit in active_site_res.iterrows():
            for tp in ac_sit.specie_unip.split("),"):
                for u in tp.split("(")[1].split(","):
                    unip_as_dict[u.strip()] = ac_sit.to_dict()
        active_site_res["tax"] = map(lambda x: [y.split("(")[0].strip() for y in
                                                x.split(":")[1].split(",")], active_site_res.specie_unip)

        lt_residues = pd.read_csv("data/lt_residues.csv")
        lt_residues["tax"] = map(lambda x: [y.split("(")[0].strip() for y in
                                            x.split(":")[1].split(",")], lt_residues.specie_unip)
        unip_lt_dict = {}
        for _, lt_sit in lt_residues.iterrows():
            for tp in lt_sit.specie_unip.split("),"):
                for u in tp.split("(")[1].split(","):
                    unip_lt_dict[u.strip()] = lt_sit.to_dict()

        stg8_residues = pd.read_csv("data/stg8_residues.csv")
        stg8_residues["tax"] = map(lambda x: [y.split("(")[0].strip() for y in
                                              x.split(":")[1].split(",")], stg8_residues.specie_unip)
        unip_stg8_dict = {}
        for _, stg8_sit in lt_residues.iterrows():
            for tp in stg8_sit.specie_unip.split("),"):
                for u in tp.split("(")[1].split(","):
                    unip_stg8_dict[u.strip()] = stg8_sit.to_dict()

        with open("data/taxIDs_UniprotIDs") as h:
            tax_unip = {x.split("\t")[0]: " ".join(x.split("\t")[1:]).strip() for x in h.readlines()}

        with open("data/taxIDs_CepasOrganismos") as h:
            tax_cepa = {x.split()[0]: " ".join(x.split()[1:]).strip() for x in h.readlines()}

        group = {}
        for t in open("data/taxIDs_N").readlines():
            group[t.strip()] = "N"
        for t in open("data/taxIDs_O").readlines():
            group[t.strip()] = "O"
        for t in open("data/taxIDs_outliers").readlines():
            group[t.strip()] = "X"
        for t in open("data/taxIDs_Q").readlines():
            group[t.strip()] = "Q"
        for t in open("data/taxIDs_P").readlines():
            group[t.strip()] = "P"

        msa = {x.id: x for x in bpio.parse("data/MSA.fasta", "fasta")}

        openness_df = pd.read_csv("data/taxID_porcentajeOpenTunnels")
        openness_dic = {r.taxID: r.to_dict() for _, r in openness_df.iterrows()}

        p50 = {}
        for line in open("data/taxID_p50_koff_kon").readlines()[1:]:
            if "NA" not in line:
                tax, pp50, koff, kon = line.split("+")
                p50[tax] = {"p50": float(pp50), "kon": float(kon), "koff": float(koff)}

        df = pd.read_table(pdb_blast, sep="\t",
                           names=["query", "hit", "identity", "4", "5", "6", "7", "8", "9", "10", "11"],
                           index_col=False)
        df = df[df.identity > 95]
        df["tax"] = [x[:-1] for x in df["query"]]

        koff_exp = {
            "1078763a": {"WT": 0.0014, "Mt-O-WG8F": 0.548},
            "1773a": {"WT": 0.2, "Mt-N-YB10A": 45},
            "683083a": {"WT": 0.0041, "Cj-WG8F": 0.033, "Cj-HE7L": 0.0003},
            "224308a": {"WT": 0.0048},
            "2021a": {"WT": 0.07},
            "5885a": {"WT": 25.2}

        }
        kon_exp = {
            "1078763a": {"WT": math.pow(10, 5.04139),
                         "Mt-O-YCD1F": math.pow(10, 6.43136),
                         "Mt-O-WG8F": math.pow(10, 7.10380),
                         "Mt-O-WG8F-YCD1F": math.pow(10, 7.35984)},
            "1773a": {"WT": math.pow(10, 7.39794),
                      "Mt-N-YB10F": math.pow(10, 7.732239),
                      "Mt-N-YB10L": math.pow(10, 8.79323),
                      "Mt-N-QE11V": math.pow(10, 7.51322),
                      "Mt-N-QE11A": math.pow(10, 7.57403),
                      "Mt-N-YB10L-QE11V": math.pow(10, 9.25811)},
            "1769a": {"WT": math.pow(10, 5.04139)},
            "2021a": {"WT": math.pow(10, 5.95424), "Tf-O-WG8F": math.pow(10, 6.53148),
                      "Tf-O-WG8F-YB10F-YCD1F": math.pow(10, 6.57864)},
            "326442a": {"WT": math.pow(10, 5.95424)},
            "1050720a": {"WT": math.pow(10, 5.30103)},
            "224308a": {"WT": math.pow(10, 7.47712)},
            "471223a": {"WT": math.pow(10, 7.88366)},
            "683083a": {"WT": math.pow(10, 5.95904), "Cj-P-YB10F": math.pow(10, 5.07918),
                        "Cj-P-YB10F-HE7L": math.pow(10, 7.62325)},
            # "1773a":math.pow(10,7.73239),
            "5885a": {"WT": math.pow(10, 7.47712)},

        }

        for tax in tqdm(tax_cepa):

            g = Globin()
            g.tax = Tax.objects.filter(id=tax[:-1]).get()
            globin_group = group[tax] if tax in group else "?"

            g.group = globin_group
            g.name = globinName(g.tax.name,globin_group)
            g.family = "T"

            if tax in tax_unip:
                uniprot = tax_unip[tax]
                g.uniprot = uniprot

            else:
                self.stderr.write(tax + " sin uniprot ")

            domain = GlobinDomain(globin=g,start=0,end=len(g.sequence)-1)

            active_site = [(tax_cepa[str(tax)] in x) for x in active_site_res.tax]

            active_site = active_site_res[active_site]
            if not active_site.empty:
                if len(active_site) == 1:
                    domain.active_site = active_site.iloc[0].residues
                else:
                    pass
                    # print tax  + " sin active site"

            # g.l_channel = Channel()
            # g.g8_channel = Channel()
            # g.e7_portal = Channel()

            g.aln_id = tax
            if tax in msa:
                seq = msa[tax].seq
                g.sequence = str(seq.ungap("-"))
                domain.sequence = g.sequence
                seq = str(seq)
                domain.aln_seq = str(seq)

                site = "lt"
                channel = Channel(name=site,domain=domain)
                channel.sequence = "".join([str(seq[site_pos[pos]]) for pos in sites[site]])
                channel.sequence_red = "".join(
                    [reduced_code(site, pos, str(seq[site_pos[pos]])) for pos in sites[site]])
                if uniprot in unip_lt_dict:
                    #                 assert g.l_channel.sequence_red == unip_lt_dict[uniprot]["residues"]
                    channel.e_bar_contrib = float(unip_lt_dict[uniprot]["k"].replace(",", ".").lower())
                channel.save()
                if tax in openness_dic:
                    channel.openness = float(openness_dic[tax]["%LT"])


                site = "g8"
                channel = Channel(name=site,domain=domain)
                channel.sequence = "".join([str(seq[site_pos[pos]]) for pos in sites[site]])
                channel.sequence_red = "".join(
                    [reduced_code(site, pos, str(seq[site_pos[pos]])) for pos in sites[site]])
                if uniprot in unip_stg8_dict:
                    #                 assert g.g8_channel.sequence_red == unip_stg8_dict[uniprot]["residues"]
                    channel.e_bar_contrib = float(unip_stg8_dict[uniprot]["k"].replace(",", ".").lower())
                channel.save()
                if tax in openness_dic:
                    channel.openness = float(openness_dic[tax]["%STG8"])


                site = "e7"
                channel = Channel(name=site,domain=domain)
                channel.sequence = "".join([str(seq[site_pos[pos]]) for pos in sites[site]])
                channel.sequence_red = "".join(
                    [reduced_code(site, pos, str(seq[site_pos[pos]])) for pos in sites[site]])
                if uniprot in unip_e7g_dict:
                    #                 assert g.e7_portal.sequence_red == unip_e7g_dict[uniprot]["residues"]
                    channel.e_bar_contrib = float(unip_e7g_dict[uniprot]["k"].replace(",", ".").lower())
                channel.save()
                if tax in openness_dic:
                    channel.openness = float(openness_dic[tax]["%E7"])

                domain.active_site = "".join([str(seq[site_pos[pos]]) for pos in sites[site]])
                domain.active_site_red = "".join([reduced_code(site, pos, str(seq[site_pos[pos]])) for pos in sites[site]])


            if tax in p50:
                domain.p50 = float(p50[tax]["p50"])
                domain.k_on_o2_pred = float(p50[tax]["kon"])
                domain.k_off_o2_pred = float(p50[tax]["koff"])

            g.save(force_insert=True)
            domain.save(force_insert=True)

            if (tax in kon_exp) or (tax in koff_exp):
                all_exp_data = set((kon_exp[tax].keys() if tax in kon_exp else [] +
                        koff_exp[tax].keys() if tax in koff_exp else []))

                for exp_data in all_exp_data:
                    exp = ExperimentalData(sequence_red=exp_data, globin=g)
                    if (tax in kon_exp) and (exp_data in kon_exp[tax]):
                        exp.k_on_o2_exp = kon_exp[tax][exp_data]

                    if (tax in koff_exp) and (exp_data in koff_exp[tax]):
                        exp.k_off_o2_exp = koff_exp[tax][exp_data]
                    exp.save()

            pdbs = df[df["query"] == tax]
            df.loc[df["query"] == tax, "chain"] = [x.split("_")[1] for x in pdbs.hit]
            df.loc[df["query"] == tax, "cod"] = [x.split("_")[0] for x in pdbs.hit]
            pdbs = df[df["query"] == tax]

            if len(pdbs):
                rows = {}
                for _, pdb in pdbs.sort_values(by=["cod", "chain"]).iterrows():
                    if pdb.cod not in rows:
                        rows[pdb.cod] = pdb
                for pdb in rows.values():
                    pdb_path = pdbs_path + pdb.cod[1:3] + "/pdb" + pdb.cod + ".ent"
                    if not os.path.exists(pdb_path):
                        downloaded = pdbl.retrieve_pdb_file(pdb.cod, file_format="pdb")
                        shutil.move(downloaded, pdb_path)

                    with open(pdb_path) as h:
                        header = parse_pdb_header(h)

                    struct = PDB(globin=g, pdb=pdb.cod, chain=pdb.chain, description=header["name"])
                    # print (header)
                    if (("source" in header) and header["source"]
                        and ("organism_scientific" in list(header["source"].values())[0])):
                        struct.organism = list(header["source"].values())[0]["organism_scientific"]
                    struct.save(force_insert=True)

            if tax in msa:
                gps = []
                seq = msa[tax]
                for gpos in site_pos.keys():
                    seqpos = len(seq[:site_pos[gpos] + 1].seq.ungap("-"))
                    gp = GlobinPosition(globin=g, g_position=gpos, seq_pos=seqpos - 1)
                    gps.append(gp)
                with transaction.atomic():
                    for gp in gps:
                        gp.save()

            keywords = [globin_group, g.name] + g.tax.name.split()
            if g.uniprot:
                keywords.append(g.uniprot)

            if (tax in p50) or (tax in kon_exp) or (tax in koff_exp) or (tax in openness_dic):
                keywords.append("experimental")

            if len(pdbs):
                keywords.append("structure")

            if not g.sequence:
                print(g.id)

            with transaction.atomic():
                for k in keywords:
                    ik = IndexKeyword(globin=g, keyword=k)
                    ik.save()
