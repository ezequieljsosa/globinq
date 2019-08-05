'''
Created on Jun 9, 2017

@author: eze
'''
from django.core.management.base import BaseCommand, CommandError

from _collections import defaultdict
from tqdm import tqdm

from globinq import globin_groups, sites
from globinq.models import Globin


class Command(BaseCommand):

    def handle(self, *args, **options):
        for group in tqdm(globin_groups):
            for site, site_postions in sites.items():
                abundances = defaultdict(lambda: 0)
                for globin in Globin.objects.filter(globin_group=group):
                    if not globin.sequence:
                        print(globin.id)
                        continue
                    positions = {x.g_position: x.seq_pos for x in globin.positions.all() if x.g_position in site_postions}
                    site_seq = []
                    try:
                        sorted_positions = sorted(site_postions, key=lambda x: positions[x])
                    except:
                        print(positions)
                        raise
                    for site_pos in sorted_positions:
                        site_seq.append(globin.sequence[positions[site_pos]])
                    pos_cod = "-".join(site_seq)
                    abundances[pos_cod] += 1
                with open("data/generated/abundances_%s_%s.csv" % (group, site), "w") as h:
                    for pos_cod, abundance in abundances.items():
                        h.write(pos_cod + "," + str(abundance) + "\n")
