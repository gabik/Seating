from django.contrib.auth.views import login, logout, password_reset_confirm
from django.conf.urls.defaults import *
from Seating.accounts import views

urlpatterns = patterns('accounts.views',
	(r'^login/$', login),
	(r'^new/$', 'create_user'),
	(r'^logout/$', logout),
	(r'^is_login/$', 'is_login'),
)
