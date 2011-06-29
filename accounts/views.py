# Create your views here.
import random
from tempfile import TemporaryFile
from xlwt import Workbook, Style
import xlrd
from django.core.context_processors import csrf
from django.contrib.auth.decorators import login_required
from django.utils import simplejson as json
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.template import RequestContext
from Seating.accounts.forms import UserForm, UserProfileForm, PartnersForm, UploadFileForm
from Seating.accounts.models import UserProfile, Partners , Guest, DupGuest
from django.shortcuts import render_to_response, get_object_or_404, get_list_or_404
from django.contrib.auth.models import User

#@login_required
def is_login(request):
	if request.user.is_authenticated():
		partners = get_object_or_404(Partners, userPartner = request.user)
		profile = get_object_or_404(UserProfile, user = request.user)
		date = profile.occasion_date.strftime("%d/%m/%Y")
		if partners.partner1_gender == 'M':
			last_name = partners.partner1_last_name
		else:
			last_name = partners.partner2_last_name
		c = {}
		c['partners'] = partners
		c['last_name'] = last_name
		c['date'] = date
		return render_to_response('accounts/after_login.html', c)
	else: # Nothing has been posted
		return HttpResponse('Please login')


def create_user(request):
	if request.method == 'POST': # If the form has been submitted...
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
			return HttpResponse('Thank you for your registration.<BR><a href=/accounts/login>Login</a>')
	else:
		userprofile_form = UserProfileForm()
		user_form = UserForm()
		partners_form = PartnersForm()
	return render_to_response('registration/create_user.html', { 'userprofile_form': userprofile_form, 'user_form': user_form, 'partners_form': partners_form}, context_instance=RequestContext(request))
	

def convertXLS2CSV(aFile): 
	'''converts a MS Excel file to csv w/ the same name in the same directory'''

	print "------ beginning to convert XLS to CSV ------"
	xlsIsOpen = False
	xlsFile = None
	try:
		import os
		import win32com.client
		
		excel = win32com.client.Dispatch('Excel.Application')
		fileDir, fileName = os.path.split(aFile)
		nameOnly = os.path.splitext(fileName)
		newName = nameOnly[0] + ".csv"
		outCSV = os.path.join(fileDir, newName)
		excel.Visible = False
		workbook = excel.Workbooks.Open(aFile)
		xlsFile = workbook
		xlsIsOpen = True
		workbook.SaveAs(outCSV, FileFormat=24)
		workbook.Close(False)
		xlsIsOpen = False 
		excel.Quit()
		del excel
		
		print "...Converted " + str(nameOnly) + " to CSV"
	except:
		print ">>>>>>> FAILED to convert " + aFile + " to CSV!"
		if xlsIsOpen and xlsFile is not None:
			xlsFile.Close(False)
			win32com.client.Dispatch('Excel.Application').Quit()

		
def readCSV(aFile, User):
	
	try:
		import csv

		reader = csv.reader(open(aFile), dialect='excel')
		for row in reader:
			guest = Guest.objects.create(user = User, guest_first_name = row[0], guest_last_name = row[1])
			guest.save()
		print ">>>>>>> read succes CSV!"

	except:
		print ">>>>>>> read succes CSV!"

@login_required
def add_person(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		new_person = Guest(user=request.user, guest_first_name=request.POST['first'], guest_last_name=request.POST['last'])
		new_person.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

def handle_uploaded_file(f):
	destination = open('/tmp/curfile.xls', 'wb+')
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
			handle_uploaded_file(request.FILES['file'])
			book = xlrd.open_workbook("/tmp/curfile.xls")
			shX = book.sheet_by_index(1)
			starting_row = shX.cell_value(0,0)
			cur_hash = shX.cell_value(0,1)
			cur_user = UserProfile.objects.get(user=request.user)
			cur_list = Guest.objects.filter(user=request.user)
			DupGuest.objects.filter(user=request.user).delete()
			duplicate_list = []
			if cur_user.excel_hash != cur_hash : return HttpResponse('Hash not match - contact Gabi')
			if starting_row == 0 : 
				starting_row = 3
			sh = book.sheet_by_index(0)
			sheet = [] 
			for r in range(sh.nrows)[int(starting_row):]:
				privName=sh.cell_value(r,0)
				lastName=sh.cell_value(r,1)
				phoneNum=sh.cell_value(r,2)
				mailAddr=sh.cell_value(r,3)
				faceAcnt=sh.cell_value(r,4)
				groupNme=sh.cell_value(r,5)
				giftAmnt=sh.cell_value(r,6)
				if privName <> "" or lastName <> "" :
					if check_person(privName, lastName, cur_list):
						dup_person = DupGuest(user=request.user, guest_first_name=privName, guest_last_name=lastName, phone_number=phoneNum, guest_email=mailAddr)
						dup_person.save()
					else:
						new_person = Guest(user=request.user, guest_first_name=privName, guest_last_name=lastName, phone_number=phoneNum, guest_email=mailAddr)
						new_person.save()
				
			cur_user.excel_hash='Locked'
			cur_user.save()

			duplicate_list = DupGuest.objects.filter(user=request.user)
			if duplicate_list:
				c= {}
				c.update(csrf(request))
				c['duplicate_list']=duplicate_list
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
	row_num = 0
	row1 = sheet1.row(row_num)
	row1.write(0, 'First name', Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(1, 'Last name', Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(2, 'Phone numer', Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(3, 'E-mail', Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(4, 'Facebook', Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(5, 'Group', Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row1.write(6, 'Present', Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	row_num+=1
	for g in Guests:
		row1 = sheet1.row(row_num)
		row1.write(0,g.guest_first_name, Style.easyxf('pattern: pattern solid, fore_colour gray40'))
		row1.write(1,g.guest_last_name, Style.easyxf('pattern: pattern solid, fore_colour gray40'))
		row1.set_cell_text(2,g.phone_number, Style.easyxf('pattern: pattern solid, fore_colour gray40'))
		row1.write(3,g.guest_email, Style.easyxf('pattern: pattern solid, fore_colour gray40'))
		row1.write(4,g.facebook_account, Style.easyxf('pattern: pattern solid, fore_colour gray40'))
		ggroup='' #Replacing g.group
		row1.write(5,ggroup, Style.easyxf('pattern: pattern solid, fore_colour gray40'))
		row1.write(6,g.present_amount, Style.easyxf('pattern: pattern solid, fore_colour gray40'))
		row_num+=1
	sheet1.col(0).width = 4000
	sheet1.col(1).width = 4000
	sheet1.col(2).width = 5000
	sheet1.col(3).width = 9000
	sheet1.col(4).width = 5000
	sheet1.col(5).width = 4000
	sheet1.col(6).width = 4000
	sheet2 = book.add_sheet('X')
	sheet2.write(0,0,row_num)
	random.seed()
	hash = random.getrandbits(128)
	sheet2.write(0,1,str(hash))	
	book.save('static/excel_output/guests.xls')
	book.save(TemporaryFile())
	cur_user = UserProfile.objects.get(user=request.user)
	cur_user.excel_hash=str(hash)
	cur_user.save()
	return render_to_response('accounts/download_excel.html')

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
	return HttpResponseRedirect('/canvas/edit')
