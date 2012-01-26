from django.contrib.auth.views import login, logout, password_reset_confirm
from django.conf.urls.defaults import *
from Seating.accounts import views

urlpatterns = patterns('accounts.views',
	(r'^login/$', login),
	(r'^add_person/$', 'add_person'),
	(r'^new/$', 'create_user'),
	(r'^logout/$', logout),
	(r'^is_login/$', 'is_login'),
	(r'^upload/$', 'upload_file'),
	(r'^download/$', 'download_excel'),
	(r'^stickers/$', 'stickers'),
	(r'^online/$', 'online_excel'),
	(r'^online_save/$', 'online_save'),
	(r'^sorted/$', 'sorted_excel'),
	(r'^map/$', 'download_map'),
	(r'^registered/$', 'registered'),
	(r'^do_duplicates/$', 'do_duplicates'),
	(r'^invation/(?P<guestHash>\w+)/$', 'invation'),
)
