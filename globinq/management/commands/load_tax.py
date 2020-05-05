'''
Created on Mar 1, 2017

@author: eze
'''
import os
from tqdm import tqdm

from globinq.models import Tax

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction,connection

from collections import defaultdict
from django.apps import apps


class BulkCreateManager(object):
    """
    This helper class keeps track of ORM objects to be created for multiple
    model classes, and automatically creates those objects with `bulk_create`
    when the number of objects accumulated for a given model class exceeds
    `chunk_size`.
    Upon completion of the loop that's `add()`ing objects, the developer must
    call `done()` to ensure the final set of objects is created for all models.
    """

    def __init__(self, chunk_size=100):
        self._create_queues = defaultdict(list)
        self.chunk_size = chunk_size

    def _commit(self, model_class):
        model_key = model_class._meta.label
        model_class.objects.bulk_create(self._create_queues[model_key])
        self._create_queues[model_key] = []

    def add(self, obj):
        """
        Add an object to the queue to be created, and call bulk_create if we
        have enough objs.
        """
        model_class = type(obj)
        model_key = model_class._meta.label
        self._create_queues[model_key].append(obj)
        if len(self._create_queues[model_key]) >= self.chunk_size:
            self._commit(model_class)

    def done(self):
        """
        Always call this upon completion to make sure the final partial chunk
        is saved.
        """
        for model_name, objs in self._create_queues.items():
            if len(objs) > 0:
                self._commit(apps.get_model(model_name))

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--nodes',  default="data/generated/nodes.dmp")
        parser.add_argument('--names',   default='data/generated/names.dmp')
        parser.add_argument('--chunk_size',   default=200)


    def handle(self, *args, **options):
        assert os.path.exists(options['nodes']),options['nodes'] + " does no exists"
        assert os.path.exists(options['names']),options['names'] + " does no exists"
        chunk_size = options['chunk_size']

        parents = {}
        with open(options['nodes']) as h:
            for i,line in enumerate(tqdm(h, total=2231889)):
                r = [x.strip() for x in line.strip().split("|")]
                bulk_mgr = BulkCreateManager(chunk_size=chunk_size)
                bulk_mgr.add(Tax(id=int(r[0]), rank=r[2]))
                parents[int(r[0])] = int(r[1])
                bulk_mgr.done()
                if i and ((i % chunk_size) == 0) :
                    for n,p in tqdm(parents.items()):
                        if p in parents:
                            Tax.objects.filter(id=n).update(parent=p)
                            del parents[n]

        if i and ((i % chunk_size) == 0) :
            for n,p in tqdm(parents.items()):
                    Tax.objects.filter(id=n).update(parent=p)
                    del parents[n]


        names = defaultdict(list)
        snames = {}
        with open(options['names']) as h:
            for i,line in enumerate(tqdm(h, total=3166573)):
                tid, name, _, ntype = [x.strip() for x in line.strip().split("|")]
                if ntype == "scientific name":
                    snames[tid] = name
                names[tid] .append(name)
                if i and ((i % chunk_size) == 0) :
                    for n,p in tqdm(names.items()):
                        Tax.objects.filter(id=n).update(name=snames[n] if n in snames else "",names=" ".join(p))



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
