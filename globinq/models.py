import datetime

from django.db import models

from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from django.utils.timezone import make_aware

from globinq.users.models import User

def default_timestamp():
    return make_aware(datetime.datetime.now())


class Tax(models.Model):
    id = models.IntegerField(primary_key=True)
    parent = models.ForeignKey('Tax', related_name='children', null=True, default=None, on_delete=models.PROTECT)
    name = models.TextField(null=True)
    names = models.TextField(null=True)
    rank = models.TextField()
    with_globin = models.BooleanField(default=False)

    @classmethod
    def parent_ids(cls, tax):
        if tax.parent:
            return [tax.id] + Tax.parent_ids(tax.parent)
        else:
            return [tax.id]





class Globin(models.Model):
    tax = models.ForeignKey(Tax, related_name='globins', on_delete=models.PROTECT)
    uniprot = models.CharField(max_length=20)
    name = models.CharField(max_length=100)

    group = models.CharField(max_length=10)
    family = models.CharField(max_length=10)
    sequence = models.TextField(default="")

    # l_channel = models.ForeignKey(Channel,related_name="l_channel", null=True, on_delete=models.CASCADE)  # ,backref="lch_set"
    # g8_channel = models.ForeignKey(Channel,related_name="g8_channel",null=True, on_delete=models.CASCADE)  # ,backref="g8_set"
    # e7_portal = models.ForeignKey(Channel,related_name="e7_portal",null=True, on_delete=models.CASCADE)  # ,backref="e7_set"


    owner = models.ForeignKey(User, related_name='globins', null=True, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=default_timestamp)
    closest_curated = models.ForeignKey('self', related_name='non_curated', null=True, default=None,
                                        on_delete=models.CASCADE)


    removed = models.BooleanField(default=False)

    def hasExperimental(self):

        return bool(list(self.experimental.all()))

    def hasPredicted(self):

        return (bool(self.k_on_o2_pred) or bool(self.k_off_o2_pred))



    def exp_txt(self):
        txt = ""
        exp = list(self.experimental.all())
        if exp:
            txt += ""
            for x in self.experimental.all():
                txt += "<b>" + x.sequence_red + "</b><br /> "
                if x.k_on_o2_exp != None:
                    txt += "&nbsp;&nbsp;kon = %.2E <br />" % x.k_on_o2_exp
                if x.k_off_o2_exp != None:
                    txt += "&nbsp;&nbsp;koff = %.2E <br />" % x.k_off_o2_exp
                txt += "  "
            txt += ""

        return txt

    def calc_txt(self):
        txt = ""
        if bool(self.k_on_o2_pred) | bool(self.k_off_o2_pred) | bool(self.p50):
            txt = "<b>WT</b><br />"
            if self.k_on_o2_pred != None:
                txt += "&nbsp;&nbsp;kon = %.2E<br />" % self.k_on_o2_pred
            if self.k_off_o2_pred != None:
                txt += "&nbsp;&nbsp;koff = %.2E<br />" % self.k_off_o2_pred
            if self.p50 != None:
                txt += "&nbsp;&nbsp;p50 = %.2E" % self.p50
        return txt

    def save(self, *args, **kwargs):
        for x in [self.l_channel, self.g8_channel, self.e7_portal]:
            if x:
                x.save(force_insert=True)

        me = super(Globin, self).save(*args, **kwargs)
        return me

class GlobinDomain(models.Model):
    sequence = models.TextField()
    start = models.IntegerField()
    end = models.IntegerField()
    globin = models.ForeignKey(Globin, related_name="domains", on_delete=models.CASCADE)
    internal_code = models.TextField()

    sequence_red = models.TextField(default="")

    aln_id = models.CharField(max_length=100)
    aln_seq = models.TextField(null=True)

    active_site = models.TextField()
    active_site_red = models.TextField()

    p50 = models.FloatField(null=True)
    k_on_o2_pred = models.FloatField(null=True)
    k_off_o2_pred = models.FloatField(null=True)

class Channel(models.Model):
    domain = models.ForeignKey(GlobinDomain, related_name="channels", on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    sequence = models.TextField()
    sequence_red = models.TextField()
    openness = models.FloatField(null=True)
    e_bar_contrib = models.FloatField(null=True)  # % Energetic barrier contribution

    def hasExperimental(self):
        return bool(self.openness)  # or bool(self.e_bar_contrib)

class ExperimentalData(models.Model):
    ctype = models.TextField(choices=[("exp", "exp"), ("pdb", "pdb")])
    k_on_o2_exp = models.FloatField()
    k_off_o2_exp = models.FloatField(null=True)
    globin = models.ForeignKey(Globin, related_name="experimental", on_delete=models.CASCADE)


class PDB(models.Model):
    tax = models.ForeignKey(Tax, related_name='structures', null=True, on_delete=models.PROTECT)
    globin = models.ForeignKey(Globin, related_name='structures', on_delete=models.CASCADE)
    pdb = models.TextField()
    description = models.TextField(default="")
    organism = models.TextField(default="")
    chain = models.TextField()
    aln_seq = models.TextField(null=True)


class Contribution(models.Model):
    ctype = models.TextField(choices=[("exp", "exp"), ("pdb", "pdb")])
    user = models.ForeignKey(User, related_name='contributions', on_delete=models.PROTECT)
    experimental = models.ForeignKey(ExperimentalData, related_name='contribuited', null=True, on_delete=models.CASCADE)
    pdb = models.ForeignKey(PDB, related_name='contribuited', null=True, on_delete=models.CASCADE)
    paper = models.TextField(default="")
    description = models.TextField(default="")
    creation = models.DateTimeField()
    last_update = models.DateTimeField()
    removed = models.BooleanField(default=False)


class PosInsertion(models.Model):
    globin = models.ForeignKey(Globin, related_name='insertions', on_delete=models.CASCADE)
    g_position = models.TextField()
    insertions = models.IntegerField()


class GlobinPosition(models.Model):
    globin = models.ForeignKey(Globin, related_name='positions', on_delete=models.CASCADE)
    seq_pos = models.IntegerField()

    g_position = models.CharField(max_length=10)


class GlobinPDBPosition(models.Model):
    globin_pos = models.ForeignKey(GlobinPosition, related_name='residues', on_delete=models.CASCADE)
    pdb = models.ForeignKey(PDB, on_delete=models.CASCADE)
    pdb_res_id = models.TextField()
    order = models.IntegerField(null=True)


class IndexKeyword(models.Model):
    globin = models.ForeignKey(Globin, related_name='keywords', null=True, on_delete=models.CASCADE)
    keyword = models.TextField()
