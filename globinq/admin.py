from django.contrib import admin
from django.contrib.auth import admin as auth_admin

from globinq.models import Globin, GlobinPDBPosition, GlobinPosition, PDB, ExperimentalData, Channel, Contribution, \
    IndexKeyword, PosInsertion, Tax


@admin.register(Globin)
class UserAdmin(admin.ModelAdmin):
    pass
@admin.register(GlobinPDBPosition)
class UserAdmin(admin.ModelAdmin):
    pass
@admin.register(GlobinPosition)
class UserAdmin(admin.ModelAdmin):
    pass
@admin.register(PDB)
class UserAdmin(admin.ModelAdmin):
    pass
@admin.register(ExperimentalData)
class UserAdmin(admin.ModelAdmin):
    pass
@admin.register(Channel)
class UserAdmin(admin.ModelAdmin):
    pass
@admin.register(Contribution)
class UserAdmin(admin.ModelAdmin):
    pass
@admin.register(IndexKeyword)
class UserAdmin(admin.ModelAdmin):
    pass
@admin.register(PosInsertion)
class UserAdmin(admin.ModelAdmin):
    pass
@admin.register(Tax)
class UserAdmin(admin.ModelAdmin):
    pass
