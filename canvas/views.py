# Create your views here.
from Seating.accounts.models import FloatingGuest
from django.db.models import Max
from django.utils import simplejson as json
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.template import RequestContext
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.contrib.auth.models import User
from Seating.canvas.models import SingleElement


@login_required
def edit_canvas(request):
	user_elements = SingleElement.objects.filter(user=request.user)
	elements_nums = user_elements.values_list('elem_num', flat=1)
	FloatingGuests = FloatingGuest.objects.filter(user=request.user)
	#single_element = get_object_or_404(SingleElement, user=request.user, elem_num=1)
	#x_cord = single_element.x_cord
	#y_cord = single_element.y_cord
	c = {}
	#c['x_cord'] = x_cord
	#c['y_cord'] = y_cord
	c['elements'] = user_elements
	c['elements_nums'] = elements_nums
	c['guests'] = FloatingGuests
	if (user_elements):
		return render_to_response('canvas/canvas.html', c)
	else:
		return render_to_response('canvas/new.html')

@login_required
def save_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
		single_element.x_cord = float(request.POST['X']);
		single_element.y_cord = float(request.POST['Y']);
		single_element.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

@login_required
def add_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		user_elements = SingleElement.objects.filter(user=request.user)
		if (len(user_elements) <= 0):
			max_num = 1
		else:
	        	max_num = user_elements.all().aggregate(Max('elem_num'))['elem_num__max'] + 1
		table_kind = request.POST['kind']
		single_element = SingleElement(elem_num=max_num, x_cord="50", y_cord="50", user=request.user, kind=table_kind)
		single_element.save()
		json_dump = json.dumps({'status': "OK", 'kind': table_kind})
	return HttpResponse(json_dump)

@login_required
def del_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
                elem_delim = request.POST['elem_num'].index('-')
                elem_num=request.POST['elem_num'][elem_delim+1:]
                single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
		single_element.delete()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

