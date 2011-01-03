from django.conf.urls.defaults import *
from django.contrib import admin
admin.autodiscover()


# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
	(r'^accounts/', include('accounts.urls')),
	(r'^canvas/', include('canvas.urls')),
        (r'^admin/', include(admin.site.urls)),

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
