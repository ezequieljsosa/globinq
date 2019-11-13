from urllib.parse import urlparse, parse_qsl

from django import template
from django.conf import settings

register = template.Library()


@register.inclusion_tag('tags/sequence_abundance.html')
def sequence_abundance(group,site_code, site, positions):
    return {"group": group, "site": site, "positions": positions,
            "label": group + "_" + site,
            "csv_url": "/generated/abundances_" + group + "_" + site_code + ".csv"}

@register.inclusion_tag('tags/search_box.html')
def search_box():
    return {}
