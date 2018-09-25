'''
Created on Mar 6, 2017

@author: eze
'''

import Bio.SeqIO as bpio

from peewee import MySQLDatabase

from Bio import Phylo
from GlobinQ.db import mysql_db
from GlobinQ.db.Model import Globin
import json


mysqldb = MySQLDatabase('globinq', user="root", password="mito")
mysql_db.initialize(mysqldb)


with open('../../data/tree.nexus') as g:
    pepe = {"x": g.read(),"i":0} 



def walkTree( node, depth, json_data):    
    
    if node.name:
        g = Globin.select().where(Globin.aln_id == node.name.replace("_", ""))
        if g:
            g = g.get()
            node_name = g.tax.name.replace(" ","_") + "_" + str(g.id)
            
            pepe["x"] = pepe["x"].replace(node.name ,node.name )
            exp = g.hasExperimental()
            
            json_data[node.name]  = { "organism": node_name ,"g": g.globin_group, "s": len(g.structures), "e": exp }
            
                    
    
    
        
    for clade in node.clades:
        walkTree( clade, depth + 1,json_data)
    
    
    
        
        


if __name__ == '__main__':
   
    # id, name, uniprot, organism, group, hasPDB, hasExperimental
    trees = list(Phylo.parse('../../data/tree.nexus', 'nexus'))    
    root = trees[0].root.clades[0]
    root.name = "root"
    json_data = {}
    walkTree( root, 0,json_data)
    with open('../../data/generated/tree_data.json',"w") as h:
        json.dump(json_data,h)

    with open('../../data/generated/msa.fasta',"w") as h:
        for x in bpio.parse("../../data/MSA.fasta","fasta"):
            g = Globin.select().where(Globin.aln_id == x.id.replace("_", "")).get()
            node_name = g.tax.name.replace(" ","_")
            #x.id = 
            x.description = node_name 
            bpio.write(x,h,"fasta")
    print "ok"

