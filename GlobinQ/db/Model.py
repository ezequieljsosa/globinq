'''
Created on Dec 29, 2016

@author: eze
'''
import datetime
import json


from peewee import Model, CharField, FloatField, ForeignKeyField, IntegerField, \
    BooleanField, TextField, DateTimeField,SQL

from GlobinQ.db import mysql_db


class GlobinqModel(Model):

    class Meta:
        database = mysql_db

    def __str__(self):
        return json.dumps({str(k): v for k, v in self.__data__.items()}, sort_keys=True)

    def __repr__(self):
        return self.__str__()


class User(GlobinqModel):
    name = CharField()
    email = CharField(unique=True)
    institution = CharField()
    password = CharField()

    class Meta:
        database = mysql_db


class Tax(GlobinqModel):
    id = IntegerField(primary_key=True)
    parent = ForeignKeyField('self', related_name='children', null=True, default=None)
    name = CharField()
    rank = CharField()
    with_globin = BooleanField(default=0,constraints=[SQL('DEFAULT 0')])

    class Meta:
        database = mysql_db

    @classmethod
    def parent_ids(cls, tax):
        if tax.parent:
            return [tax.id] + Tax.parent_ids(tax.parent)
        else:
            return [tax.id]


class TaxKeyword(GlobinqModel):
    class Meta:
        database = mysql_db


class Channel(GlobinqModel):
    sequence = CharField()
    sequence_red = CharField()
    openness = FloatField(null=True)
    e_bar_contrib = FloatField(null=True)  # % Energetic barrier contribution

    def hasExperimental(self):
        return bool(self.openness)  # or bool(self.e_bar_contrib)

    class Meta:
        database = mysql_db


class Globin(GlobinqModel):

    tax = ForeignKeyField(Tax, related_name='globins')
    owner = ForeignKeyField(User, related_name='globins', null=True)
    uniprot = CharField(null=True)
    name = CharField()
    globin_group = CharField()
    sequence = CharField(default="")

    aln_id = CharField(null=True)
    aln_seq = TextField(null=True)

    l_channel = ForeignKeyField(Channel)  # ,backref="lch_set"
    g8_channel = ForeignKeyField(Channel)  # ,backref="g8_set"
    e7_portal = ForeignKeyField(Channel)  # ,backref="e7_set"
    active_site = CharField()
    active_site_red = CharField()

    timestamp = DateTimeField(default=datetime.datetime.now)
    closest_curated = ForeignKeyField('self', related_name='non_curated', null=True, default=None)

    p50 = FloatField(null=True)
    k_on_o2_pred = FloatField(null=True)
    k_off_o2_pred = FloatField(null=True)

    def hasExperimental(self):

        return bool(list(self.experimental))

    def hasPredicted(self):

        return (bool(self.k_on_o2_pred) or bool(self.k_off_o2_pred)  )

    def globinName(self):
        orgCod = ""
        vec = self.tax.name.split()
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

        return orgCod + "trHb" + self.globin_group

    def exp_txt(self):
        txt = ""
        exp = list(self.experimental)
        if exp:
            txt += ""
            for x in self.experimental:
                txt += "<b>"  + x.sequence_red + "</b><br /> "
                if x.k_on_o2_exp != None:
                    txt += "&nbsp;&nbsp;kon = %.2E <br />" % x.k_on_o2_exp
                if x.k_off_o2_exp != None:
                    txt += "&nbsp;&nbsp;koff = %.2E <br />" % x.k_off_o2_exp
                txt += "  "
            txt += ""


        return txt

    def calc_txt(self):
        txt = ""
        if bool(self.k_on_o2_pred) |  bool(self.k_off_o2_pred) | bool(self.p50):
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

    class Meta:
        database = mysql_db


class ExperimentalData(GlobinqModel):
    sequence_red = CharField()
    k_on_o2_exp = FloatField()
    k_off_o2_exp = FloatField(null=True)
    globin = ForeignKeyField(Globin, related_name="experimental")

    class Meta:
        database = mysql_db


class PDB(GlobinqModel):
    tax = ForeignKeyField(Tax, related_name='structures', null=True)
    globin = ForeignKeyField(Globin, related_name='structures')
    pdb = CharField()
    description = CharField(default="")
    organism = CharField(default="")
    chain = CharField()
    aln_seq = TextField(null=True)

    class Meta:
        database = mysql_db


class PosInsertion(GlobinqModel):
    globin = ForeignKeyField(Globin, related_name='insertions')
    g_position = CharField()
    insertions = IntegerField()

    class Meta:
        database = mysql_db


class GlobinPosition(GlobinqModel):
    globin = ForeignKeyField(Globin, related_name='positions')
    seq_pos = IntegerField()

    g_position = CharField()

    class Meta:
        database = mysql_db


class GlobinPDBPosition(GlobinqModel):
    globin_pos = ForeignKeyField(GlobinPosition, related_name='residues')
    pdb = ForeignKeyField(PDB)
    pdb_res_id = CharField()
    order = IntegerField(null=True)

    class Meta:
        database = mysql_db


class IndexKeyword(GlobinqModel):
    globin = ForeignKeyField(Globin, related_name='keywords', null=True)
    keyword = CharField()

    class Meta:
        database = mysql_db


if __name__ == '__main__':
    g = Globin(tax=Tax(name="Triticum aestivum"), globin_group="O")
    print g.globinName()
