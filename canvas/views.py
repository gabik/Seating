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
from Seating.canvas.forms import InitCanvas
from django.core.context_processors import csrf



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
		return new_canvas(request)
		#return render_to_response('canvas/new.html')

@login_required
def new_canvas(request):
	c = {}
	if request.method == 'POST':
		form = InitCanvas(request.POST)
		if form.is_valid():
			table_kind = request.POST['table_kind']
			amount = int(request.POST['tables_num'])
			user_elements = SingleElement.objects.filter(user=request.user)
			if (len(user_elements) <= 0):
				max_num = 1
			else:
				max_num = user_elements.all().aggregate(Max('elem_num'))['elem_num__max'] + 1

			for i in range(0, amount):
				single_element = SingleElement(elem_num=(max_num+i), x_cord=(50+(max_num+i)*10), y_cord=(50+(max_num+i)*10), user=request.user, kind=table_kind, current_sitting=0, max_sitting=request.POST['table_size'])
				single_element.save()

			if 'AddMore' in request.POST:
				return HttpResponseRedirect('/canvas/new/')
			else:
				return HttpResponseRedirect('/canvas/edit/')
	else:
		form = InitCanvas()

	c.update(csrf(request))
	c['form'] = form
	return render_to_response('canvas/new.html', c)

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
def drop_person(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		person_id = request.POST['person_id']
		person_delim = person_id.index('_')
		person_first = person_id[:person_delim]
		person_last = person_id[person_delim+1:]
		single_person = FloatingGuest.objects.filter(user=request.user, floatingguest_first_name=person_first, floatingguest_last_name=person_last)
		if (len(single_person) > 0):
			elem_delim = request.POST['table_id'].index('-')
			elem_num=request.POST['table_id'][elem_delim+1:]
			table_id = request.POST['table_id']
			single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
			if single_element.current_sitting < single_element.max_sitting:
				single_element.current_sitting = single_element.current_sitting + 1
				single_element.save()
				single_person[0].sit_on_table = elem_num
				single_person[0].save()
				json_dump = json.dumps({'status': "OK", 'table_id': table_id})
			else:
				json_dump = json.dumps({'status': "FULL", 'table_id': table_id})
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

