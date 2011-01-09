from django.conf.urls.defaults import *

urlpatterns = patterns('canvas.views',
	(r'^edit/$', 'edit_canvas'),
	#(r'^save/(?P<elem_id>\d+)/(?P<X>\d{1,4})/(?P<Y>\d{1,4})/$', 'save_element'),
	(r'^save/$', 'save_element'),
)
