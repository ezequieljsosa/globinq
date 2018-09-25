'''
Created on Jun 9, 2017

@author: eze
'''

from _collections import defaultdict
from tqdm import tqdm
from peewee import MySQLDatabase

from GlobinQ.db import mysql_db, globin_groups, sites
from GlobinQ.db.Model import Globin

if __name__ == '__main__':
    mysqldb = MySQLDatabase('globinq', user="root", password="mito")
    mysql_db.initialize(mysqldb)

    for group in tqdm(globin_groups):
        for site, site_postions in sites.items():
            abundances = defaultdict(lambda: 0)
            for globin in Globin.select().where(Globin.globin_group == group):
                if not globin.sequence:
                    print globin.id
                    continue
                positions = {x.g_position: x.seq_pos for x in globin.positions if x.g_position in site_postions}
                site_seq = []
                for site_pos in sorted(site_postions, key=lambda x: positions[x]):
                    site_seq.append(globin.sequence[positions[site_pos]])
                pos_cod = "-".join(site_seq)
                abundances[pos_cod] += 1
            with open("data/generated/abundances_%s_%s.csv" % (group, site), "w") as h:
                for pos_cod, abundance in abundances.items():
                    h.write(pos_cod + "," + str(abundance) + "\n")
