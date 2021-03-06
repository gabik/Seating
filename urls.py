from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings
admin.autodiscover()

# test koren
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
	(r'^accounts/', include('accounts.urls')),
	(r'^canvas/', include('canvas.urls')),
	(r'^admin/', include(admin.site.urls)),
	(r'^site/contact.*', 'accounts.views.contact_view'),
	(r'^site/canvas/edit/', 'django.views.generic.simple.redirect_to', {'url': '/canvas/edit'}),
	(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
	(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.ADMIN_MEDIA_ROOT}),
	(r'^site/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT + '/site'}),
	(r'^index.html', 'django.views.generic.simple.redirect_to', {'url': '/site/index.html'}),
	(r'^$', 'django.views.generic.simple.redirect_to', {'url': '/site/index.html'}),
    # Example:
    # (r'^Seating/', include('Seating.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # (r'^admin/', include(admin.site.urls)),
)


urlpatterns += patterns('django.views.generic.simple',
    (r'^test/$',             'direct_to_template', {'template': 'test.html'}),
)

urlpatterns += patterns('',
    url(r'^captcha/', include('captcha.urls')),
)

