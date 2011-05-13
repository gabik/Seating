from django.conf.urls.defaults import *

urlpatterns = patterns('canvas.views',
	(r'^edit/$', 'edit_canvas'),
	(r'^new/$', 'new_canvas'),
	#(r'^save/(?P<elem_id>\d+)/(?P<X>\d{1,4})/(?P<Y>\d{1,4})/$', 'save_element'),
	(r'^save/$', 'save_element'),
	(r'^sit/$', 'drop_person'),
	(r'^delfp/$', 'del_float_person'),
	(r'^add/$', 'add_element'),
	(r'^delete/$', 'del_element'),
	(r'^getItem/$', 'get_element_item_at_position'),
)
