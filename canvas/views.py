# Create your views here.
from Seating.accounts.models import Guest
from Seating.accounts.models import UserProfile
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
from django.utils.translation import ugettext

@login_required
def edit_canvas(request):
	user_elements = SingleElement.objects.filter(user=request.user)
	elements_nums = user_elements.values_list('elem_num', flat=1)
	Guests = Guest.objects.filter(user=request.user)
	userProfile = UserProfile.objects.filter(user=request.user)
	#single_element = get_object_or_404(SingleElement, user=request.user, elem_num=1)
	#x_cord = single_element.x_cord
	#y_cord = single_element.y_cord
	c = {}
	#c['x_cord'] = x_cord
	#c['y_cord'] = y_cord
	c['elements'] = user_elements
	c['elements_nums'] = elements_nums
	c['guests'] = Guests
	c['user_profile'] = userProfile
	print user_elements
	if (user_elements):
		return render_to_response('canvas/canvas.html', c)
	else:
		return render_to_response('canvas/new.html')

@login_required
def new_canvas(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		if 'start_canvas' in request.POST:
			return HttpResponseRedirect('/canvas/edit/')
		else:
			table_kind = request.POST['tables_kind']
			amount = int(request.POST['tables_num'])
			size = int(request.POST['tables_size'])
			cordx = int(request.POST['tables_startx'])
			cordy = int(request.POST['tables_starty'])
			user_elements = SingleElement.objects.filter(user=request.user)
			if (len(user_elements) <= 0):
				max_num = 1
			else:
				max_num = user_elements.all().aggregate(Max('elem_num'))['elem_num__max'] + 1

			for i in range(0, amount):
				single_element = SingleElement(elem_num=(max_num+i), x_cord=cordx, y_cord=(cordy + i*18), user=request.user, kind=table_kind, caption="Element-"+ str(max_num+i), current_sitting=0, max_sitting=size)
				single_element.save()
			json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

@login_required
def save_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
		user_profile = get_object_or_404(UserProfile, user=request.user)
		single_element.x_cord = float(request.POST['X']);
		single_element.y_cord = float(request.POST['Y']);
		if request.POST['caption'] != "":
			newCaption = ugettext(request.POST['caption']);
			single_element.caption = newCaption;
		if request.POST['size'] != "": 
			single_element.max_sitting = request.POST['size'];
		if request.POST['sumGuests'] != "": 
			user_profile.num_of_guests = int(request.POST['sumGuests']);
		single_element.save()
		user_profile.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

@login_required
def update_Num_Of_Guests(request):
	json_dump = json.dumps({'status': "Error"})
	user_profile = get_object_or_404(UserProfile, user=request.user)
	if request.POST['sumGuests'] != "": 
		user_profile.num_of_guests = int(request.POST['sumGuests']);
		user_profile.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)
	
@login_required
def get_Num_Of_Guests(request):
	json_dump = json.dumps({'status': "Error"})
	user_profile = get_object_or_404(UserProfile, user=request.user)
	json_dump = json.dumps({'status': "OK", 'numOfGuests' : user_profile.num_of_guests})
	return HttpResponse(json_dump)
	
@login_required
def drop_person(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		person_id = ugettext(request.POST['person_id'])
		person_delim = person_id.index('_')
		person_first = person_id[:person_delim]
		person_last = person_id[person_delim+1:]
		single_person = Guest.objects.filter(user=request.user, guest_first_name=person_first, guest_last_name=person_last)
		if (len(single_person) > 0):
			elem_delim = request.POST['table_id'].index('-')
			elem_num=request.POST['table_id'][elem_delim+1:]
			table_id = request.POST['table_id']
			free_position = 1
			if (len(Guest.objects.filter(user=request.user, elem_num=int(elem_num))) > 0):
				element_persons = Guest.objects.filter(user=request.user, elem_num=int(elem_num)).order_by('position')
				for element_person in element_persons:
					if element_person.position == free_position:
						free_position = free_position + 1
					else:
						break
			single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
			if single_element.current_sitting < single_element.max_sitting:
				single_element.current_sitting = single_element.current_sitting + 1
				single_element.save()
				single_person[0].elem_num = elem_num
				single_person[0].position = free_position
				single_person[0].save()
				if (single_element.current_sitting >= single_element.max_sitting):
					json_dump = json.dumps({'status': "OK", 'table_id': table_id,'table_status':"Green", 'free_position': single_person[0].position})
				else:
					json_dump = json.dumps({'status': "OK", 'table_id': table_id,'table_status':"Yellow", 'free_position': single_person[0].position})
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
		amount = int(request.POST['amount'])
		for i in range(0, amount):
			if max_num+i < 48:
				single_element = SingleElement(elem_num=(max_num+i), x_cord=(50+i*10), y_cord=(50+i*10), user=request.user, kind=table_kind, caption="Element"+ str(max_num+i), current_sitting=0, max_sitting=8)
				single_element.save()
		if max_num+amount < 48:
			json_dump = json.dumps({'status': "OK", 'kind': table_kind})
		else:
			json_dump = json.dumps({'status': "LIMIT", 'kind': table_kind})
	return HttpResponse(json_dump)

@login_required
def del_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
		single_element.delete()
		element_persons = Guest.objects.filter(user=request.user, elem_num = elem_num)
		for person in element_persons:
			person.elem_num = 0
			person.position = 0
			person.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)
	
@login_required
def del_float_person(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		person_id = request.POST['person_id']
		person_delim = person_id.index('_')
		person_first = person_id[:person_delim]
		person_last = person_id[person_delim+1:]
		single_person = Guest.objects.filter(user=request.user, guest_first_name=person_first, guest_last_name=person_last)
		if (len(single_person) > 0):
			single_person.delete()
			json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)
	
@login_required
def get_element_item(request):
	json_dump = json.dumps({'status': "EMPTY"})
	if request.method == 'POST':
		person_position = request.POST['position']
		if person_position == "":
			person_position = 0
		if (person_position > 0):
			json_dump = json.dumps({'status': "EMPTY", 'position': person_position})
			elem_delim = request.POST['elem_num'].index('-')
			elem_num=request.POST['elem_num'][elem_delim+1:]
			element_persons = Guest.objects.filter(user=request.user, elem_num=int(elem_num))
			if (len(element_persons) > 0):
				for person in element_persons:
					if (int(person.position) == int(person_position)):
						json_dump = json.dumps({'status': "OK", 'position': person.position, 'first_name': person.guest_first_name, 'last_name': person.guest_last_name, 'phone_num': person.phone_number, 'person_email': person.guest_email, 'present_amount' : person.present_amount, 'facebook_account': person.facebook_account, 'group': person.group})
						break
		else:
			first_name = request.POST['firstName']
			last_name = request.POST['lastName']
			person = get_object_or_404(Guest, user=request.user, guest_first_name = first_name, guest_last_name = last_name)
			if person is not None:
				json_dump = json.dumps({'status': "OK", 'elem_num': person.elem_num, 'position': person.position, 'first_name': person.guest_first_name, 'last_name': person.guest_last_name, 'phone_num': person.phone_number, 'person_email': person.guest_email, 'present_amount' : person.present_amount, 'facebook_account': person.facebook_account, 'group': person.group})
	return HttpResponse(json_dump)
	
@login_required
def swap_position(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		first_person_position = request.POST['first_position']
		second_person_position = request.POST['second_position']
		if (int(first_person_position) > 0 and int(second_person_position) > 0):
			element_persons = Guest.objects.filter(user=request.user, elem_num=int(elem_num), position=int(first_person_position))
			if (len(element_persons) > 0):
				element_persons[0].position = int(second_person_position)
				second_element_persons = Guest.objects.filter(user=request.user, elem_num=int(elem_num), position=int(second_person_position))
				if (len(second_element_persons) > 0):
					second_element_persons[0].position = int(first_person_position)
					second_element_persons[0].save()
				element_persons[0].save()
				json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

@login_required
def save_person_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		first_name = request.POST['old_first_name']
		last_name = request.POST['old_last_name']
		person = get_object_or_404(Guest, user=request.user, guest_first_name = first_name, guest_last_name = last_name)
		if person is not None:
			person.guest_first_name = request.POST['first_name']
			person.guest_last_name = request.POST['last_name']
			person.phone_number = request.POST['phone_num']
			person.guest_email = request.POST['person_email']
			person.present_amount = request.POST['present_amount']
			person.facebook_account = request.POST['facebook_account']
			person.group = request.POST['group']
			person.save()
			json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

@login_required
def bring_person_to_float_list_by_position(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		person_position = request.POST['position']
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		element_persons = Guest.objects.filter(user=request.user, elem_num = elem_num)
		for person in element_persons:
			if (int(person.position) == int(person_position)):
				person.elem_num = 0
				person.position = 0
				person.save()
				single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
				single_element.current_sitting = single_element.current_sitting - 1
				single_element.save()
				json_dump = json.dumps({'status': "OK"})
				break
	return HttpResponse(json_dump)

@login_required
def find_tables_strings(request):
	json_dump = json.dumps({'status': "Empty"})
	if request.method == 'POST':
		name = request.POST['name']
		matching_tables = "";
		num_of_results = 0;
		single_elements = SingleElement.objects.filter(user=request.user)
		for element in single_elements:
			lowname = element.caption.lower()
			if (lowname.find(name.lower()) >= 0):
				matching_tables = matching_tables + "," + element.caption
				num_of_results = num_of_results + 1;
		if (num_of_results > 0):
			json_dump = json.dumps({'status': "OK", 'objects':matching_tables, 'numOfResults':num_of_results})
	return HttpResponse(json_dump)
	
@login_required
def find_persons_strings(request):
	json_dump = json.dumps({'status': "Empty"})
	if request.method == 'POST':
		name = request.POST['name']
		matching_tables = "";
		num_of_results = 0;
		person_elements = Guest.objects.filter(user=request.user)
		for element in person_elements:
			lowfirstname = element.guest_first_name.lower()
			lowlastname = element.guest_last_name.lower()
			if ((lowfirstname.find(name.lower()) >= 0) or (lowlastname.find(name.lower()) >= 0)):
				matching_tables = matching_tables + "," + element.guest_first_name + " " + element.guest_last_name
				num_of_results = num_of_results + 1;
		if (num_of_results > 0):
			json_dump = json.dumps({'status': "OK", 'objects':matching_tables, 'numOfResults':num_of_results})
	return HttpResponse(json_dump)
	
@login_required
def is_persons_on_higher_position(request):
	json_dump = json.dumps({'status': "False"})
	if request.method == 'POST':
		newSize = request.POST['new_size']
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		element_persons = Guest.objects.filter(user=request.user, elem_num = int(elem_num))
		for person in element_persons:
			if (person.position >= int(newSize)):
				json_dump = json.dumps({'status': "True"})
				break
	return HttpResponse(json_dump)
	
@login_required
def bring_person_to_floatlist_from_postion(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		floating_persons = "";
		numOfFloatingPersons = 0;
		newSize = request.POST['new_size']
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
		element_persons = Guest.objects.filter(user=request.user, elem_num = int(elem_num)).order_by('position')
		for i in range(int(newSize), len(element_persons)):
			single_element.current_sitting = single_element.current_sitting - 1
			single_element.save()
			element_persons[i].elem_num = 0
			element_persons[i].position = 0
			element_persons[i].save()
			floating_persons = floating_persons + "," + element_persons[i].guest_first_name + " " +  element_persons[i].guest_last_name
			numOfFloatingPersons = int(numOfFloatingPersons) + 1
		if (numOfFloatingPersons > 0):
			json_dump = json.dumps({'status': "OK", 'floating_persons': floating_persons, 'numOfFloatingPersons':numOfFloatingPersons, 'currentSitting':single_element.current_sitting})
	return HttpResponse(json_dump)
	
@login_required
def get_Money_Info(request):
	json_dump = json.dumps({'status': "Error"})
	totalSum = 0;
	totalOtherSum = 0;
	totalFamilySum = 0;
	totalFreindsSum = 0;
	totalWorkSum = 0;
	persons = Guest.objects.filter(user=request.user)
	for person in persons:
		totalSum = totalSum + person.present_amount
		if person.group == 'Other':
			totalOtherSum = totalOtherSum + person.present_amount
		else:
			if person.group == 'Family':
				totalFamilySum = totalFamilySum + person.present_amount
			else:
				if person.group == 'Friends':
					totalFreindsSum = totalFreindsSum + person.present_amount
				else:
					if person.group == 'Work':
						totalWorkSum = totalWorkSum + person.present_amount
	json_dump = json.dumps({'status': "OK", 'totalSum': totalSum, 'totalOtherSum':totalOtherSum, 'totalFamilySum':totalFamilySum, 'totalFreindsSum':totalFreindsSum, 'totalWorkSum':totalWorkSum})
	return HttpResponse(json_dump)
