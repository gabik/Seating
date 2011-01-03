# Create your views here.
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
def save_element(request, elem_id, X, Y):
	single_element = get_object_or_404(SingleElement, user=request.user, elem_num=elem_id)
	single_element.x_cord = X;
	single_element.y_cord = Y;
	single_element.save()
	return HttpResponse("")

