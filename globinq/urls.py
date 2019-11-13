from django.urls import path

from globinq.views import (
    tax_search,search,protein,user_page,
    blast,upload,del_contrib,
    del_globin,add_pdb,addData,about,downloads,
    methodology,tutorial,statistics,clan,home
)

app_name = "globinq"
urlpatterns = [
    path("tax/", view=tax_search, name="tax_search"),
    path("search/", view=search, name="search"),
    path("protein/<int:protein_id>/", view=protein, name="protein"),
    path("user/<int:user_id>/", view=user_page, name="user"),
    path("blast/", view=blast, name="blast"),
    # path("blast/", view=blast_result, name="blast_result"),
    path("upload/", view=upload, name="upload"),
    path("del_contrib/", view=del_contrib, name="del_contrib"),
    path("add_pdb/", view=add_pdb, name="add_pdb"),
    path("del_globin/", view=del_globin, name="del_globin"),
    path("addData/", view=addData, name="addData"),


    path("", view=home, name="home"),
    path("about/", view=about, name="about"),
    path("downloads/", view=downloads, name="downloads"),
    path("methodology/", view=methodology, name="methodology"),
    path("tutorial/", view=tutorial, name="tutorial"),
    path("statistics/", view=statistics, name="statistics"),
    path("clan/", view=clan, name="clan"),

    path("job/", view=clan, name="job"),




#     global
#     statistics
#     upload
#     /


#

]
