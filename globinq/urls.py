from django.urls import path

from globinq.views import (
    tax_search,search,protein,user_page,
    blast,blast_result,upload,del_contrib,
    del_globin,add_pdb,addData
)

app_name = "users"
urlpatterns = [
    path("tax/", view=tax_search, name="tax_search"),
    path("search/", view=search, name="search"),
    path("protein/<int:protein_id>/", view=protein, name="protein"),
    path("user/<int:user_id>/", view=user_page, name="user"),
    path("blast/", view=blast, name="blast"),
    path("blast/<int:blast_id>/", view=blast_result, name="blast_result"),
    path("upload/", view=upload, name="upload"),
    path("del_contrib/", view=del_contrib, name="del_contrib"),
    path("add_pdb/", view=add_pdb, name="add_pdb"),
    path("del_globin/", view=del_globin, name="del_globin"),
    path("addData/", view=addData, name="addData"),


]
