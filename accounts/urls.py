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
	(r'^list_dates/$', 'list_dates'),
	(r'^sendWelcome/$', 'SendWelcome'),
	(r'^registered/$', 'registered'),
	(r'^do_duplicates/$', 'do_duplicates'),
	(r'^invation/TEST/$', 'invation_test'),
	(r'^invation/(?P<guestHash>\w+)/$', 'invation'),
	(r'^unsubscribe/(?P<guestHash>\w+)/$', 'unsubscribe'),
	(r'^sendNotif/$', 'SendNotifications'),
	(r'^forgotMail/$', 'forgot_mail'),
)
