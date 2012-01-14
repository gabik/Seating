# Create your views here.
from django.utils.safestring import SafeString, EscapeData
import re
#from django.utils.html import escapejs
from Seating.accounts.models import Guest
from Seating.accounts.models import UserProfile, Partners
from Seating.accounts.models import OccasionOperationItem
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
from datetime import datetime
from django.core.mail import send_mail
from hashlib import md5

def escapeSpecialCharacters ( text ):
    characters='"&\',?><.:;}{[]+=)(*^%$#@!~`|/'
    for character in characters:
        text = text.replace( character, '' )
    return text

@login_required
def edit_canvas(request):
	user_elements = SingleElement.objects.filter(user=request.user)
	elements_nums = user_elements.values_list('elem_num', flat=1)
	Guests = Guest.objects.filter(user=request.user)
	userProfile = UserProfile.objects.filter(user=request.user)
	cur_width = 90
	if len(elements_nums) > 40:
		cur_width = int(90*45/len(elements_nums))
	profile = get_object_or_404(UserProfile, user = request.user)
	partners = get_object_or_404(Partners, userPartner = request.user)
	#single_element = get_object_or_404(SingleElement, user=request.user, elem_num=1)
	#x_cord = single_element.x_cord
	#y_cord = single_element.y_cord
	c = {}
	c.update(csrf(request))

	#c['x_cord'] = x_cord
	#c['y_cord'] = y_cord
	c['elements'] = user_elements
	c['elements_nums'] = elements_nums
	c['guests'] = Guests
	c['user_profile'] = userProfile
	c['width'] = cur_width
	date = profile.occasion_date.strftime("%d/%m/%Y")
	place = profile.occasion_place
	phone = profile.phone_number
	if partners.partner1_gender == 'M':
		last_name = partners.partner1_last_name
	else:
		last_name = partners.partner2_last_name
	if last_name == "":
		last_name = partners.partner1_last_name
	c['partners'] = partners
	c['last_name'] = last_name
	c['date'] = date
	c['place'] = place
	c['phone_num'] = phone
	if partners.partner2_first_name != "":
	 	c['addChar'] = "&"
	if (user_elements):
		return render_to_response('canvas/canvas.html', c)
	else:
		return render_to_response('canvas/new.html')

@login_required
def new_canvas(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		dataString = request.POST['DataString'].split('|')
		for string in dataString:
			if (string != ""):
				dataArray = string.split(',')
				
				table_kind = dataArray[0]
				amount = int(dataArray[1])
				size = int(dataArray[2])
				cordx = int(dataArray[3])
				cordy = int(dataArray[4])
				
				fixNum = -1;
				user_elements = SingleElement.objects.filter(user=request.user)
				if (len(user_elements) <= 0):
					max_num = 1
					if (table_kind == "Square" or table_kind == "Round" or table_kind == "Rect" or table_kind == "Lozenge"):
						fixNum = 1
				else:
					max_num = user_elements.all().aggregate(Max('elem_num'))['elem_num__max'] + 1
					if (table_kind == "Square" or table_kind == "Round" or table_kind == "Rect" or table_kind == "Lozenge"):
						fixNum = user_elements.all().aggregate(Max('fix_num'))['fix_num__max'] + 1
						if (fixNum < 0):
							fixNum = 0

				for i in range(0, amount):
					single_element = SingleElement(elem_num=(max_num+i), fix_num=(fixNum+i), x_cord=cordx, y_cord=(cordy + i*18), width = 90 , height = 90, user=request.user, kind=table_kind, caption="Element"+ str(fixNum+i), current_sitting=0, max_sitting=size)
					single_element.save()

				add_char =""
				if (amount > 0):
					add_char = "s"

				info = "Add " + str(amount) +" New "+ table_kind +" Table"+add_char
				writeOpertationFunc(request,info)
				
		json_dump = json.dumps({'status': "OK"})
		print json_dump
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
		if request.POST['fixNumber'] != "": 
			single_element.fix_num = int(request.POST['fixNumber']);
		single_element.save()
		user_profile.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

@login_required
def save_element_width_height(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
		single_element.width = float(request.POST['width']);
		single_element.height = float(request.POST['height']);
		single_element.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)
	
@login_required
def fix_number_status(request):
	json_dump = json.dumps({'status': "Empty"})
	result = ""
	if request.method == 'POST':
		if request.POST['fixNumber'] != "":  
			SingleElements = SingleElement.objects.filter(user=request.user, fix_num=int(request.POST['fixNumber']))
			elem_delim = request.POST['elem_num'].index('-')
			elem_num=request.POST['elem_num'][elem_delim+1:]
			print str(elem_num)
			if len(SingleElements) > 0:
				for singel_element in SingleElements:
					if int(elem_num) != int(singel_element.elem_num):
						result = result + singel_element.caption + "," 
				json_dump = json.dumps({'status': "OK", 'result':result})
	return HttpResponse(json_dump)
	

def get_fix_number(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
		json_dump = json.dumps({'status': "OK", 'fix_num':single_element.fix_num})
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
			place = request.POST['place']
			if (place == "" or place < 1):
				free_position = 1
				if (len(Guest.objects.filter(user=request.user, elem_num=int(elem_num))) > 0):
					element_persons = Guest.objects.filter(user=request.user, elem_num=int(elem_num)).order_by('position')
					for element_person in element_persons:
						if element_person.position == free_position:
							free_position = free_position + 1
						else:
							break
			else:
				free_position = place;
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
					if (single_element.current_sitting == 0):
						json_dump = json.dumps({'status': "OK", 'table_id': table_id,'table_status':"Red", 'free_position': single_person[0].position})
					else:
						json_dump = json.dumps({'status': "OK", 'table_id': table_id,'table_status':"Yellow", 'free_position': single_person[0].position})
			else:
				json_dump = json.dumps({'status': "FULL", 'table_id': table_id})
	return HttpResponse(json_dump)

@login_required
def add_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		table_kind = request.POST['kind']
		fixNum = -1;
		user_elements = SingleElement.objects.filter(user=request.user)
		if (len(user_elements) <= 0):
			max_num = 1
			if (table_kind == "Square" or table_kind == "Round" or table_kind == "Rect" or table_kind == "Lozenge"):
				fixNum = 1
		else:
			max_num = user_elements.all().aggregate(Max('elem_num'))['elem_num__max'] + 1
			if (table_kind == "Square" or table_kind == "Round" or table_kind == "Rect" or table_kind == "Lozenge"):
				fixNum = user_elements.all().aggregate(Max('fix_num'))['fix_num__max'] + 1
				if (fixNum < 0):
					fixNum = 0

		amount = int(request.POST['amount'])
		for i in range(0, amount):
			if max_num+i < 500:
				single_element = SingleElement(elem_num=(max_num+i), fix_num=(fixNum+i),x_cord=(50+i*10), y_cord=(50+i*10), width = float(request.POST['width']), height = float(request.POST['height']), user=request.user, kind=table_kind, caption="Element"+ str(fixNum+i), current_sitting=0, max_sitting=8)
				single_element.save()
		if max_num+amount < 500:
#			single_element = SingleElement(elem_num=(max_num+i), x_cord=(50+i*10), y_cord=(50+i*10), user=request.user, kind=table_kind, caption="Element"+ str(max_num+i), current_sitting=0, max_sitting=8)
#			single_element.save()
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
						safe_first = escapeSpecialCharacters(person.guest_first_name) 
						safe_last  = escapeSpecialCharacters(person.guest_last_name)
						json_dump = json.dumps({'status': "OK", 'position': person.position, 'first_name': safe_first, 'last_name': safe_last, 'phone_num': person.phone_number, 'person_email': person.guest_email, 'present_amount' : person.present_amount, 'facebook_account': person.facebook_account, 'group': person.group, 'gender':person.gender,'invation_status':person.invation_status,'meal':person.meal})
						break
		else:
			first_name = request.POST['firstName']
			last_name = request.POST['lastName']
			person = get_object_or_404(Guest, user=request.user, guest_first_name = first_name, guest_last_name = last_name)
			if person is not None:
				safe_first = escapeSpecialCharacters(person.guest_first_name)
				safe_last  = person.guest_last_name
				json_dump = json.dumps({'status': "OK", 'elem_num': person.elem_num, 'position': person.position, 'first_name': safe_first, 'last_name': safe_last, 'phone_num': person.phone_number, 'person_email': person.guest_email, 'present_amount' : person.present_amount, 'facebook_account': person.facebook_account, 'group': person.group, 'gender':person.gender,'invation_status':person.invation_status,'meal':person.meal})
	return HttpResponse(json_dump)

@login_required
def get_element_item_by_full_name(request):
	json_dump = json.dumps({'status': "EMPTY"})
	element_persons = Guest.objects.filter(user=request.user)
	if (len(element_persons) > 0):
		for person in element_persons:
			if (person.guest_first_name + " " + person.guest_last_name == request.POST['full_name']):
				json_dump = json.dumps({'status': "OK", 'elem_num': person.elem_num, 'position': person.position, 'first_name': person.guest_first_name, 'last_name': person.guest_last_name})
				break
	return HttpResponse(json_dump)
	
@login_required
def swap_position(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		first_person_position = request.POST['first_position']
		second_person_position = request.POST['second_position']
		print first_person_position
		print second_person_position
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
			else:
				second_element_persons = Guest.objects.filter(user=request.user, elem_num=int(elem_num), position=int(second_person_position))
				if (len(second_element_persons) > 0):
					second_element_persons[0].position = int(first_person_position)
					second_element_persons[0].save()
					json_dump = json.dumps({'status': "OK"})	
	return HttpResponse(json_dump)

@login_required
def save_person_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		first_name = request.POST['old_first_name']
		last_name = request.POST['old_last_name']
		person = get_object_or_404(Guest, user=request.user, guest_first_name = request.POST['old_first_name'], guest_last_name = request.POST['old_last_name'])
		if person is not None:
			person.guest_first_name = request.POST['first_name']
			person.guest_last_name = request.POST['last_name']
			person.phone_number = request.POST['phone_num']
			person.guest_email = request.POST['person_email']
			person.present_amount = request.POST['present_amount']
			person.facebook_account = request.POST['facebook_account']
			person.group = request.POST['group']
			person.gender = request.POST['gender']
			person.meal = request.POST['meal']
			person.invation_status = request.POST['invation_status']
			person.save()
			json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)
	
@login_required
def save_dup_person_element(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		first_name = request.POST['old_first_name']
		last_name = request.POST['old_last_name']
		persons = Guest.objects.filter(user=request.user,guest_first_name=request.POST['old_first_name'], guest_last_name=request.POST['old_last_name'])
		if (len(persons) > 0):
			max_match = Guest.objects.filter(user=request.user,guest_first_name=request.POST['first_name'], guest_last_name__gt=request.POST['last_name'])
			exist_num =  Guest.objects.filter(user=request.user,guest_first_name=request.POST['first_name'], guest_last_name=request.POST['last_name'] + str(len(max_match) + 1))
			if (len(exist_num) <= 0):
				addStr = len(max_match) + 1
			else:
				addStr = len(max_match) + 2
			last_name = request.POST['last_name'] + str(addStr)
			persons[0].guest_first_name = request.POST['first_name']
			persons[0].guest_last_name = last_name
			persons[0].phone_number = request.POST['phone_num']
			persons[0].guest_email = request.POST['person_email']
			persons[0].present_amount = request.POST['present_amount']
			persons[0].facebook_account = request.POST['facebook_account']
			persons[0].group = request.POST['group']
			persons[0].gender = request.POST['gender']
			persons[0].meal = request.POST['meal']
			persons[0].invation_status = request.POST['invation_status']
			hash = str(str(request.user) + request.POST['first_name'].encode('utf-8') + last_name.encode('utf-8'))
			persons[0].guest_hash = str(md5(hash).hexdigest())
			persons[0].save()
			json_dump = json.dumps({'status': "OK", 'new_last_name':last_name})
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
	partners = get_object_or_404(Partners, userPartner = request.user)
	totalSum = 0;
	totalOtherSum = 0;
	totalFirstFamilySum = 0;
	totalFirstFriendsSum = 0;
	totalFirstWorkSum = 0;
	totalSecondFamilySum = 0;
	totalSecondFriendsSum = 0;
	totalSecondWorkSum = 0;
	persons = Guest.objects.filter(user=request.user)
	if partners.partner2_first_name != "":
		for person in persons:
			totalSum = totalSum + person.present_amount
			if person.group == 'Other':
				totalOtherSum = totalOtherSum + person.present_amount
			else:
				if person.group == 'Family '+ partners.partner2_first_name:
					totalSecondFamilySum = totalSecondFamilySum + person.present_amount
				else:
					if person.group == 'Friends '+ partners.partner2_first_name:
						totalSecondFriendsSum = totalSecondFriendsSum + person.present_amount
					else:
						if person.group == 'Work '+ partners.partner2_first_name:
							totalSecondWorkSum = totalSecondWorkSum + person.present_amount
						else:
							if person.group == 'Family '+ partners.partner1_first_name:
								totalFirstFamilySum = totalFirstFamilySum + person.present_amount
							else:
								if person.group == 'Friends '+ partners.partner1_first_name:
									totalFirstFriendsSum = totalFirstFriendsSum + person.present_amount
								else:
									if person.group == 'Work '+ partners.partner1_first_name:
										totalFirstWorkSum = totalFirstWorkSum + person.present_amount
		json_dump = json.dumps({'status': "OK", 'totalSum': totalSum, 'totalOtherSum':totalOtherSum, 'totalFirstFamilySum':totalFirstFamilySum, 'totalFirstFriendsSum':totalFirstFriendsSum, 'totalFirstWorkSum':totalFirstWorkSum, 'totalSecondFamilySum':totalSecondFamilySum, 'totalSecondFriendsSum':totalSecondFriendsSum, 'totalSecondWorkSum':totalSecondWorkSum})
	else:
		for person in persons:
			totalSum = totalSum + person.present_amount
			if person.group == 'Other':
				totalOtherSum = totalOtherSum + person.present_amount
			else:
				if person.group == 'Family':
					totalSecondFamilySum = totalSecondFamilySum + person.present_amount
				else:
					if person.group == 'Friends':
						totalSecondFriendsSum = totalSecondFriendsSum + person.present_amount
					else:
						if person.group == 'Work':
							totalSecondWorkSum = totalSecondWorkSum + person.present_amount
						else:
							if person.group == 'Family '+ partners.partner1_first_name:
								totalFirstFamilySum = totalFirstFamilySum + person.present_amount
							else:
								if person.group == 'Friends '+ partners.partner1_first_name:
									totalFirstFriendsSum = totalFirstFriendsSum + person.present_amount
								else:
									if person.group == 'Work '+ partners.partner1_first_name:
										totalFirstWorkSum = totalFirstWorkSum + person.present_amount
		json_dump = json.dumps({'status': "OK", 'totalSum': totalSum, 'totalOtherSum':totalOtherSum, 'totalFirstFamilySum':totalFirstFamilySum, 'totalFirstFriendsSum':totalFirstFriendsSum, 'totalFirstWorkSum':totalFirstWorkSum, 'totalSecondFamilySum':totalSecondFamilySum, 'totalSecondFriendsSum':totalSecondFriendsSum, 'totalSecondWorkSum':totalSecondWorkSum})
	return HttpResponse(json_dump)

		
@login_required
def write_Operation(request):
	json_dump = json.dumps({'status': "Error"})
	info = request.POST['info']
	writeOpertationFunc(request, info)
	json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)
	
def writeOpertationFunc(request, info):
	user_OccasionOperations = OccasionOperationItem.objects.filter(user=request.user)
	if (len(user_OccasionOperations) <= 0):
		max_num = 1
	else:
		max_num = user_OccasionOperations.all().aggregate(Max('operation_number'))['operation_number__max'] + 1
	single_item = OccasionOperationItem(user=request.user, operation_number=max_num, operation_date=datetime.now() ,operation_info=info)
	single_item.save()

@login_required
def get_OperationsInfoNum(request):
	json_dump = json.dumps({'status': "Error"})
	user_OccasionOperations = OccasionOperationItem.objects.filter(user=request.user)
	if (len(user_OccasionOperations) <= 0):
		max_num = 0
	else:
		max_num = user_OccasionOperations.all().aggregate(Max('operation_number'))['operation_number__max']
	json_dump = json.dumps({'status': "OK",'Total':max_num})
	return HttpResponse(json_dump)
	
@login_required
def get_Operations(request):
	json_dump = json.dumps({'status': "Error"})
	num = int(request.POST['num'])
	user_OccasionOperations = OccasionOperationItem.objects.filter(user=request.user , operation_number = num)
	if (len(user_OccasionOperations) == 1):
		for OccasionOperation in user_OccasionOperations:
			opdate = OccasionOperation.operation_date.strftime("%d/%m/%Y - %H:%M:%S")
			opinfo = OccasionOperation.operation_info
			json_dump = json.dumps({'status': "OK", 'opnum': num, 'date':opdate , 'info':opinfo})
	return HttpResponse(json_dump)
	
@login_required
def get_GuestsEmails(request):
	json_dump = json.dumps({'status': "Error"})
	result = ""
	user_GuestsEmails = Guest.objects.filter(user=request.user , guest_email__gt = '').order_by('guest_last_name')
	if (len(user_GuestsEmails) > 0):
		for guest in user_GuestsEmails:
			name = guest.guest_last_name + " " + guest.guest_first_name
			email = guest.guest_email;
			result = result + name + "," + email + "|"
		json_dump = json.dumps({'status': "OK" ,'emailList': result, 'count': len(user_GuestsEmails)})
	else:
		json_dump = json.dumps({'status': "OK" ,'emailList': result, 'count':"0"})
	return HttpResponse(json_dump)
	
@login_required
def get_element_orientation(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
		if single_element is not None:
			json_dump = json.dumps({'status': "OK",'orientation': single_element.orientation ,'elem_num':elem_num})
	return HttpResponse(json_dump)
	
@login_required
def change_element_orientation(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		elem_delim = request.POST['elem_num'].index('-')
		elem_num=request.POST['elem_num'][elem_delim+1:]
		single_element = get_object_or_404(SingleElement, user=request.user, elem_num=int(elem_num))
		if single_element is not None:
			if single_element.orientation == 'V':
				single_element.orientation = 'H'
			else:
				if single_element.orientation == 'H':
					single_element.orientation = 'FV'
				else:
					if single_element.orientation == 'FV':
						single_element.orientation = 'FH'
					else:
						single_element.orientation = 'V'
			single_element.save()
			json_dump = json.dumps({'status': "OK"})				
	return HttpResponse(json_dump)


@login_required
def change_user_profile(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		profile = get_object_or_404(UserProfile, user = request.user)
		if profile is not None:
			print profile
			profile.occasion_date = datetime.strptime(request.POST['date'],'%d/%m/%Y')
			profile.occasion_place = ugettext(request.POST['place'])
			profile.phone_number = ugettext(request.POST['phone'])
			profile.save()
			json_dump = json.dumps({'status': "OK"})				
	return HttpResponse(json_dump)
	
@login_required
def get_occasion_meal_and_inv_details(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		GuestsInvAccept = Guest.objects.filter(user=request.user , invation_status = 'A')
		GuestsNotInvAccept = Guest.objects.filter(user=request.user , invation_status = 'N')
		GuestsTentativeInv = Guest.objects.filter(user=request.user , invation_status = 'T')
		GuestsMeatMeal = Guest.objects.filter(user=request.user , meal = 'M')
		GuestsVegMeal = Guest.objects.filter(user=request.user , meal= 'V')
		GuestsGlatMeal = Guest.objects.filter(user=request.user , meal = 'G')
		json_dump = json.dumps({'status': "OK",	'GuestsInvAccept' : str(len(GuestsInvAccept)),	'GuestsInvNotAccept' : str(len(GuestsNotInvAccept)),	'GuestsTentativeInv' : str(len(GuestsTentativeInv)),	'GuestsMeatMeal' : str(len(GuestsMeatMeal)),	'GuestsVegMeal' : str(len(GuestsVegMeal)),	'GuestsGlatMeal' : str(len(GuestsGlatMeal))})
	return HttpResponse(json_dump)
