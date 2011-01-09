# Create your views here.
from django.utils import simplejson as json
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render_to_response, get_object_or_404
from django.contrib.auth.models import User
from Seating.canvas.models import SingleElement


@login_required
def edit_canvas(request):
	single_element = get_object_or_404(SingleElement, user=request.user, elem_num=1)
	x_cord = single_element.x_cord
	y_cord = single_element.y_cord
	c = {}
	c['x_cord'] = x_cord
	c['y_cord'] = y_cord
	return render_to_response('canvas/canvas.html', c)

@login_required
def save_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(request.POST['elem_num']))
		single_element.x_cord = float(request.POST['X']);
		single_element.y_cord = float(request.POST['Y']);
		single_element.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

