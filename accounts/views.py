# Create your views here.
# -*- coding: utf-8 -*-
import math
import random
from tempfile import TemporaryFile
from xlwt import Workbook, Style
import xlrd, xlwt
from django.core.context_processors import csrf
from django.contrib.auth.decorators import login_required
from django.utils import simplejson as json
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.template import RequestContext
from Seating.accounts.forms import UserForm, UserProfileForm, PartnersForm, UploadFileForm, AgreeForm
from Seating.accounts.models import UserProfile, Partners , Guest, DupGuest, group_choices, UnknownGroups
from Seating.canvas.models import SingleElement
from django.shortcuts import render_to_response, get_object_or_404, get_list_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
import sys
sys.path.append("/Seating/static/locale/he")
import he

#@login_required
def is_login(request):
	if request.user.is_authenticated():
		partners = get_object_or_404(Partners, userPartner = request.user)
		profile = get_object_or_404(UserProfile, user = request.user)
		date = profile.occasion_date.strftime("%d/%m/%Y")
		place = profile.occasion_place
		if partners.partner1_gender == 'M':
			last_name = partners.partner1_last_name
		else:
			last_name = partners.partner2_last_name
		if last_name == "":
			last_name = partners.partner1_last_name
		c = {}
		c['partners'] = partners
		c['last_name'] = last_name
		c['date'] = date
		c['place'] = place
		if partners.partner2_first_name != "":
			c['addChar'] = "&"
		return render_to_response('accounts/after_login.html', c)
	else: # Nothing has been posted
		return HttpResponse('Please login')

def registered(request):
	if request.method == 'POST':
		return render_to_response('registration/login.html');
	else:
		return render_to_response('registration/registered.html')

def create_user(request):
	if request.method == 'POST': # If the form has been submitted...
		agree_form = AgreeForm(request.POST)
		userprofile_form = UserProfileForm(request.POST)
		user_form = UserForm(request.POST)
		partners_form = PartnersForm(request.POST)
		if userprofile_form.is_valid() and user_form.is_valid() and partners_form.is_valid():	
			user_clean_data = user_form.cleaned_data
			created_user = User.objects.create_user(user_clean_data['username'], user_clean_data['email'], user_clean_data['password1'])
			created_user.save()
			userprofile = userprofile_form.save(commit=False)
			userprofile.user = created_user
			userprofile.occasion_date = user_clean_data['occasiondate'];
			userprofile.excel_hash = 'New'
			userprofile.save()
			partners = partners_form.save(commit=False)
			partners.userPartner = created_user
			partners.save()
			'''convertXLS2CSV(r"/tmp/list.xls")
			readCSV(r"/tmp/list.csv", created_user)'''
			new_user = authenticate(username=request.POST['username'], password=request.POST['password1'])
			login(request, new_user)
			return HttpResponseRedirect('/accounts/registered')
	else:
		userprofile_form = UserProfileForm()
		user_form = UserForm()
		partners_form = PartnersForm()
		agree_form = AgreeForm()
	return render_to_response('registration/create_user.html', { 'userprofile_form': userprofile_form, 'user_form': user_form, 'partners_form': partners_form, 'agree_form': agree_form}, context_instance=RequestContext(request))
	

#def convertXLS2CSV(aFile): 
#	'''converts a MS Excel file to csv w/ the same name in the same directory'''
#
#	print "------ beginning to convert XLS to CSV ------"
#	xlsIsOpen = False
#	xlsFile = None
#	try:
#		import os
#		import win32com.client
#		
#		excel = win32com.client.Dispatch('Excel.Application')
#		fileDir, fileName = os.path.split(aFile)
#		nameOnly = os.path.splitext(fileName)
#		newName = nameOnly[0] + ".csv"
#		outCSV = os.path.join(fileDir, newName)
#		excel.Visible = False
#		workbook = excel.Workbooks.Open(aFile)
#		xlsFile = workbook
#		xlsIsOpen = True
#		workbook.SaveAs(outCSV, FileFormat=24)
#		workbook.Close(False)
#		xlsIsOpen = False 
#		excel.Quit()
#		del excel
#		
#		print "...Converted " + str(nameOnly) + " to CSV"
#	except:
#		print ">>>>>>> FAILED to convert " + aFile + " to CSV!"
#		if xlsIsOpen and xlsFile is not None:
#			xlsFile.Close(False)
#			win32com.client.Dispatch('Excel.Application').Quit()

		
#def readCSV(aFile, User):
#	
#	try:
#		import csv
#
#		reader = csv.reader(open(aFile), dialect='excel')
#		for row in reader:
#			guest = Guest.objects.create(user = User, guest_first_name = row[0], guest_last_name = row[1])
#			guest.save()
#		print ">>>>>>> read succes CSV!"
#
#	except:
#		print ">>>>>>> read succes CSV!"

@login_required
def add_person(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		addStr = ""
		persons = Guest.objects.filter(user=request.user,guest_first_name=request.POST['first'], guest_last_name=request.POST['last'])
		if (len(persons) > 0):
			max_match = Guest.objects.filter(user=request.user,guest_first_name=request.POST['first'], guest_last_name__gt=request.POST['last'])
			exist_num =  Guest.objects.filter(user=request.user,guest_first_name=request.POST['first'], guest_last_name=request.POST['last'] + str(addStr))
			if (len(exist_num) <= 0):
				addStr = len(max_match)
			else:
				addStr = len(max_match) + 1
		last_name = request.POST['last'] + str(addStr)
		new_person = Guest(user=request.user, guest_first_name=request.POST['first'], guest_last_name=last_name, group=request.POST['group'],gender=request.POST['gender'],invation_status = "T")
		new_person.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

def handle_uploaded_file(f, request):
	destination = open('/tmp/' + str(request.user.id) + 'curfile.xls', 'wb+')
	for chunk in f.chunks():
		destination.write(chunk)
	destination.close()

def check_person(first, last, list):
	for i in list:
		if i.guest_first_name == first and i.guest_last_name == last:
			return True
	
	return False

@login_required
def upload_file(request):
	if request.method == 'POST':
		form = UploadFileForm(request.POST, request.FILES)
		if form.is_valid():
			handle_uploaded_file(request.FILES['file'], request)
			book = xlrd.open_workbook("/tmp/" + str(request.user.id) + "curfile.xls")
			shX = book.sheet_by_index(1)
			starting_row = shX.cell_value(0,0)
			cur_hash = shX.cell_value(0,1)
			cur_user = UserProfile.objects.get(user=request.user)
			cur_list = Guest.objects.filter(user=request.user)
			DupGuest.objects.filter(user=request.user).delete()
			UnknownGroups.objects.filter(user=request.user).delete()
			duplicate_list = []
			if cur_user.excel_hash != cur_hash : return HttpResponse('Hash not match - contact Gabi')
			if starting_row == 0 : 
				starting_row = 3
			sh = book.sheet_by_index(0)
			sheet = [] 
			for r in range(sh.nrows)[int(starting_row):]:
				privName=sh.cell_value(r,0)
				lastName=sh.cell_value(r,1)
				gender=sh.cell_value(r,2)
				if gender == "":
					gender="U"
				quantity=sh.cell_value(r,3)
				if quantity == "":
					quantity=1
				phoneNum=sh.cell_value(r,4)
				mailAddr=sh.cell_value(r,5)
				faceAcnt=sh.cell_value(r,6)
				groupNme=sh.cell_value(r,7)
				giftAmnt=sh.cell_value(r,8)

				#privName=he.u(privName)
				#lastName=he.u(lastName)
				#groupNme=he.u(groupNme)


				if privName <> "" or lastName <> "" :
					if check_person(privName, lastName, cur_list):
						dup_person = DupGuest(user=request.user, guest_first_name=privName, guest_last_name=lastName, gender=gender, phone_number=phoneNum, guest_email=mailAddr, group=groupNme)
						dup_person.save()
					else:
						if quantity > 1:
							for i in range(1,int(quantity)+1):
								new_person = Guest(user=request.user, guest_first_name=privName+" "+str(i), guest_last_name=lastName, gender=gender, phone_number=phoneNum, guest_email=mailAddr, group=groupNme)
								new_person.save()
						else:
							new_person = Guest(user=request.user, guest_first_name=privName, guest_last_name=lastName, gender=gender, phone_number=phoneNum, guest_email=mailAddr, group=groupNme)
							new_person.save()

				if groupNme not in group_choices:
					un_group = UnknownGroups(user=request.user, group=groupNme);
					un_group.save()
				
			cur_user.excel_hash='Locked'
			cur_user.save()

			duplicate_list = DupGuest.objects.filter(user=request.user)
			un_group_list = UnknownGroups.objects.filter(user=request.user)
			if duplicate_list or un_group_list:
				c= {}
				c.update(csrf(request))
				c['duplicate_list']=duplicate_list
				c['un_group_list']=un_group_list
				c['group_choices']=group_choices
				return render_to_response('accounts/duplicate.html', c)
			else:
				return HttpResponseRedirect('/canvas/edit')
				#return render_to_response('accounts/uploaded.html', {'sheet': sheet})
	else:
		form = UploadFileForm()
	c= {}
	c.update(csrf(request))
	c['form'] = form
	return render_to_response('accounts/upload.html', c)

@login_required
def download_excel(request):
	Guests = Guest.objects.filter(user=request.user)
	book = Workbook()
	sheet1 = book.add_sheet('2Seat.co.il')
	sheet1.cols_right_to_left = True
	borders = xlwt.Borders()
	borders.left = xlwt.Borders.THIN
	borders.right = xlwt.Borders.THIN
	borders.top = xlwt.Borders.THIN
	borders.bottom = xlwt.Borders.THIN
	borders.left_colour = 0x40
	borders.right_colour = 0x40
	borders.top_colour = 0x40
	borders.bottom_colour = 0x40
	row_num = 0
	row1 = sheet1.row(row_num)
	row1.write(0, he.first_name, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(1, he.last_name, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(2, he.gender, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(3, he.quantity, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(4, he.phone_number, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(5, he.email, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(6, he.facebook, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(7, he.group, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(8, he.present, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
        pattern = xlwt.Pattern()
        pattern.pattern = xlwt.Pattern.SOLID_PATTERN
        pattern.pattern_fore_colour = 22 
        style = xlwt.XFStyle()
	protection = xlwt.Protection()
	protection.cell_locked = 1
	style.protection = protection
        style.pattern = pattern
        style.borders = borders
	row_num+=1
	for g in Guests:
		row1 = sheet1.row(row_num)
		row1.write(0,g.guest_first_name, style)
		row1.write(1,g.guest_last_name, style)
		row1.write(2,g.gender, style)
		row1.write(3,1, style)
		row1.set_cell_text(4,g.phone_number, style)
		row1.write(5,g.guest_email, style)
		row1.write(6,g.facebook_account, style)
		ggroup=g.group
		row1.write(7,ggroup, style)
		row1.write(8,g.present_amount, style)
		row_num+=1
	pattern = xlwt.Pattern()
	pattern.pattern = xlwt.Pattern.SOLID_PATTERN
	pattern.pattern_fore_colour = 1
        protection = xlwt.Protection()
        protection.cell_locked = False
	style = xlwt.XFStyle()
        style.protection = protection
	style.pattern = pattern
	style.borders = borders
	for k in range(row_num,1000):
		row1 = sheet1.row(k)
		for g in range(0,9):
			row1.write(g, "", style)
	sheet1.col(0).width = 4000
	sheet1.col(1).width = 4000
	sheet1.col(2).width = 4000
	sheet1.col(3).width = 4000
	sheet1.col(4).width = 5000
	sheet1.col(5).width = 9000
	sheet1.col(6).width = 5000
	sheet1.col(7).width = 4000
	sheet1.col(8).width = 4000
	sheet2 = book.add_sheet('X')
	sheet2.write(0,0,row_num)
	random.seed()
	hash = random.getrandbits(128)
	sheet2.write(0,1,str(hash))	
	sheet1.protect = True
	sheet2.protect = True
	sheet1.password = "DubaGdola"
	sheet2.password = "DubaGdola"
        c = {}
        c['filename'] = str(request.user.id) + 'guests.xls'
        book.save('/Seating/static/excel_output/' + c['filename'])
	book.save(TemporaryFile())
	cur_user = UserProfile.objects.get(user=request.user)
	cur_user.excel_hash=str(hash)
	cur_user.save()
        return render_to_response('accounts/xls.html', c)

@login_required
def sorted_excel(request):
	Guests = Guest.objects.filter(user=request.user).order_by('guest_last_name')
	book = Workbook()
	sheet1 = book.add_sheet('2Seat.co.il')
	sheet1.cols_right_to_left = True
	borders = xlwt.Borders()
	borders.left = xlwt.Borders.THIN
	borders.right = xlwt.Borders.THIN
	borders.top = xlwt.Borders.THIN
	borders.bottom = xlwt.Borders.THIN
	borders.left_colour = 0x40
	borders.right_colour = 0x40
	borders.top_colour = 0x40
	borders.bottom_colour = 0x40
	row_num = 0
	row1 = sheet1.row(row_num)
	row1.write(0, he.last_name, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(1, he.first_name, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(2, he.table_name, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(3, he.table_num, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
        pattern = xlwt.Pattern()
        pattern.pattern = xlwt.Pattern.SOLID_PATTERN
        pattern.pattern_fore_colour = 1 
        style = xlwt.XFStyle()
	protection = xlwt.Protection()
	protection.cell_locked = 1
	style.protection = protection
        style.pattern = pattern
        style.borders = borders
	row_num+=1
	user_elements = SingleElement.objects.filter(user=request.user)
	for g in Guests:
		row1 = sheet1.row(row_num)
		row1.write(0,g.guest_last_name, style)
		row1.write(1,g.guest_first_name, style)
		cur_caption = "No Table"
		cur_fix_num = 0
		for h in user_elements:
			if h.elem_num == g.elem_num:
				cur_caption=h.caption
				cur_fix_num=h.fix_num
		row1.write(2,cur_caption, style)
		row1.write(3,cur_fix_num, style)
		row_num+=1
	sheet1.col(0).width = 6000
	sheet1.col(1).width = 6000
	sheet1.col(2).width = 8000
	sheet1.col(3).width = 5000
	sheet1.protect = True
	sheet1.password = "DubaGdola"
	c = {}
	c['filename'] = str(request.user.id) + 'sorted.xls'
	book.save('/Seating/static/excel_output/' + c['filename'])
	book.save(TemporaryFile())
	return render_to_response('accounts/xls.html', c)

@login_required
def do_duplicates(request):
	duplicate_list=DupGuest.objects.filter(user=request.user)
	for i in duplicate_list:
		cur_check = i.guest_first_name + '-' + i.guest_last_name
		if cur_check in request.POST:
			if request.POST[cur_check] == "on":
				new_person = Guest(user=request.user, guest_first_name=i.guest_first_name, guest_last_name=i.guest_last_name, phone_number=i.phone_number, guest_email=i.guest_email, present_amount=i.present_amount, facebook_account=i.facebook_account)
				new_person.save()
	DupGuest.objects.filter(user=request.user).delete()

	un_group_list = UnknownGroups.objects.filter(user=request.user)
	for i in un_group_list:
		fix_list=Guest.objects.filter(user=request.user, group=i.group)
		for f in fix_list:
			f.group=request.POST[f.group]
			f.save()
	UnknownGroups.objects.filter(user=request.user).delete()	
	return HttpResponseRedirect('/canvas/edit')

@login_required
def download_map(request):
	#Guests = Guest.objects.filter(user=request.user)
	user_elements = SingleElement.objects.filter(user=request.user)
        #elements_nums = user_elements.values_list('elem_num', flat=1)
	#max_rows = math.ceil(len(elements_nums)/3)
	book = Workbook()
	sheet1 = book.add_sheet('2Seat.co.il')
	sheet1.cols_right_to_left = True
	row_num = 0
	#row1.write(6, 'Present', Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	#for g in elements_nums:
	cur_3_cul=0
	cur_row=1
	max_sitting_row=0
	for g in user_elements:
		#element_name=user_elements[g].caption
		#element_name=SingleElement.objects.filter(user=request.user,elem_num=g).caption
		element_name=g.caption
		sitting_on_element=Guest.objects.filter(user=request.user,elem_num=g.elem_num)
		if len(sitting_on_element) > max_sitting_row:
			max_sitting_row=len(sitting_on_element)
		if (cur_3_cul > 0) and (cur_3_cul % 12 == 0):
			cur_3_cul=1
			cur_row+=(max_sitting_row / 3)
			if (max_sitting_row % 3 != 0) or (max_sitting_row == 0):
				cur_row+=1
			cur_row+=3
			max_sitting_row=0
		else:
			cur_3_cul+=1
		row_num=cur_row
		
	        borders = xlwt.Borders()
        	borders.left = xlwt.Borders.THIN
        	borders.right = xlwt.Borders.THIN
        	borders.top = xlwt.Borders.THIN
        	borders.bottom = xlwt.Borders.THIN
        	borders.left_colour = 0x40
        	borders.right_colour = 0x40
        	borders.top_colour = 0x40
        	borders.bottom_colour = 0x40
	        pattern = xlwt.Pattern()
        	pattern.pattern = xlwt.Pattern.SOLID_PATTERN
        	pattern.pattern_fore_colour = 49
        	style = xlwt.XFStyle()
        	protection = xlwt.Protection()
        	protection.cell_locked = 1
        	style.protection = protection
        	style.pattern = pattern
        	style.borders = borders

		row1 = sheet1.row(row_num)
		row1.write(cur_3_cul+1,element_name, style)
		row1.write(cur_3_cul+2,"", style)
		row1.write(cur_3_cul,"", style)
		row_num+=1
		row1 = sheet1.row(row_num)
		
		styleIn=xlwt.XFStyle()
		patternIn = xlwt.Pattern()
		patternIn.pattern = xlwt.Pattern.SOLID_PATTERN
		patternIn.pattern_fore_colour = 22
		styleIn.protection = protection
		styleIn.borders = borders
		styleIn.pattern = patternIn
		for s in sitting_on_element:
			if (cur_3_cul == 4) or (cur_3_cul == 8) or (cur_3_cul == 12):
				cur_3_cul-=3
				row_num+=1
				row1 = sheet1.row(row_num)
			row1.write(cur_3_cul,s.guest_first_name + " " + s.guest_last_name, styleIn)
			cur_3_cul+=1
		row_num+=1
		if cur_3_cul <= 4:
			cur_3_cul=3
		elif cur_3_cul <= 8:
			cur_3_cul=7
		elif cur_3_cul > 8:
			cur_3_cul=11
		#while ( cur_3_cul % 3 != 0) :
		#	cur_3_cul+=1
		row1 = sheet1.row(row_num)
		row1.write(cur_3_cul-1,len(sitting_on_element), style)
		row1.write(cur_3_cul-2,"", style)
		row1.write(cur_3_cul,"", style)
		cur_3_cul+=1
	sheet1.col(0).width = 400
	for i in range(1,12):
		sheet1.col(i).width = 5000
	sheet1.protect = True
	sheet1.password = "DubaGdola"
        c = {}
        c['filename'] = str(request.user.id) + 'map.xls'
        book.save('/Seating/static/excel_output/' + c['filename'])
	book.save(TemporaryFile())
        return render_to_response('accounts/xls.html', c)
