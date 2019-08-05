'''
Created on Mar 1, 2017

@author: eze
'''

from tqdm import tqdm

from globinq.models import Tax

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction,connection

class Command(BaseCommand):

    def handle(self, *args, **options):



        with connection.cursor() as cursor:
            sql = """
            ALTER TABLE globinq_tax ADD FULLTEXT index_name(name);
            SET FOREIGN_KEY_CHECKS=0;
            insert into globinq_tax (id,parent_id,name,rank)
            select t.ncbi_taxon_id, t2.ncbi_taxon_id,tn.name,t.node_rank
            from  bioseqdb.taxon as t ,  bioseqdb.taxon as t2, bioseqdb.taxon_name as tn
            WHERE (t.taxon_id = tn.taxon_id) AND (tn.name_class = 'scientific name')
            AND (t.parent_taxon_id = t2.taxon_id);
            SET FOREIGN_KEY_CHECKS=1;
            """.replace("\n"," ")
            self.stderr.write(sql)
            cursor.execute(sql)



        with open("data/taxIDs_CepasOrganismos") as h:
            taxids = set([x.split()[0][:-1] for x in h])

        processed = {}


        def walk(taxid):
            if taxid and taxid not in processed:
                processed[taxid] = 1
                try:
                    dbTax = Tax.objects.get(id = taxid)
                    dbTax.with_globin = True
                    dbTax.save()
                    walk(dbTax.parent)
                except Exception:
                    dbTax = Tax(id=taxid, name="?", rank="?")
                    dbTax.save(force_insert=True)


        for gtaxid in tqdm(taxids):
            walk(gtaxid)
