'''
Created on Mar 1, 2017

@author: eze
'''
import configparser
import subprocess as sp
from peewee import MySQLDatabase

from GlobinQ.db import mysql_db
from GlobinQ.db.Model import Tax

config = configparser.ConfigParser()
config.read("./globinq.config")

mysqldb2 = MySQLDatabase('globinq', user=config["mysql"]["user"], password=config["mysql"]["pass"])
mysql_db.initialize(mysqldb2)

if __name__ == '__main__':

    if Tax.table_exists():
        Tax.drop_table()
    Tax.create_table()

    sql = """
    ALTER TABLE tax ADD FULLTEXT index_name(name);
    SET FOREIGN_KEY_CHECKS=0;
    insert into tax (id,parent_id,name,rank)  
    select t.ncbi_taxon_id, t2.ncbi_taxon_id,tn.name,t.node_rank 
    from  bioseqdb.taxon as t ,  bioseqdb.taxon as t2, bioseqdb.taxon_name as tn 
    WHERE (t.taxon_id = tn.taxon_id) AND (tn.name_class = 'scientific name') 
    AND (t.parent_taxon_id = t2.taxon_id);
    SET FOREIGN_KEY_CHECKS=1;
    """.replace("\n"," ")
    cmd = ('mysql --user "%s" --password="%s" --database="globinq" --execute="%s"'
           % (config["mysql"]["user"], config["mysql"]["pass"], sql))
    print cmd
    sp.check_output(cmd, shell=True)

    with open("data/taxIDs_CepasOrganismos") as h:
        taxids = set([x.split()[0][:-1] for x in h])

    processed = {}


    def walk(taxid):
        if taxid and taxid not in processed:
            processed[taxid] = 1
            try:
                dbTax = Tax.get(Tax.id == taxid)
                dbTax.with_globin = True
                dbTax.save()
                walk(dbTax.parent)
            except Exception:
                dbTax = Tax(id=taxid, name="?", rank="?")
                dbTax.save(force_insert=True)


    for gtaxid in taxids:
        walk(gtaxid)
