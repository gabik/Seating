# Create your views here.
import xlrd
from django.core.context_processors import csrf
from django.contrib.auth.decorators import login_required
from django.utils import simplejson as json
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.template import RequestContext
from Seating.accounts.forms import UserForm, UserProfileForm, PartnersForm, UploadFileForm
from Seating.accounts.models import UserProfile, Partners , Guest
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
		new_person = Guest(user=request.user, guest_first_name=request.POST['first'], guest_last_name=request.POST['last'], group=request.POST['group'])
		new_person.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

def handle_uploaded_file(f):
	destination = open('/tmp/curfile.xls', 'wb+')
	for chunk in f.chunks():
		destination.write(chunk)
	destination.close()

@login_required
def upload_file(request):
	if request.method == 'POST':
		form = UploadFileForm(request.POST, request.FILES)
		if form.is_valid():
			handle_uploaded_file(request.FILES['file'])
			book = xlrd.open_workbook("/tmp/curfile.xls")
			sh = book.sheet_by_index(0)
			sheet = [] 
			for r in range(sh.nrows)[3:]:
						privName=sh.cell_value(r,0)
						lastName=sh.cell_value(r,1)
						phoneNum=sh.cell_value(r,2)
						mailAddr=sh.cell_value(r,3)
						faceAcnt=sh.cell_value(r,4)
						groupNme=sh.cell_value(r,5)
						giftAmnt=sh.cell_value(r,6)
						new_person = Guest(user=request.user, guest_first_name=privName, guest_last_name=lastName, phone_number=phoneNum, guest_email=mailAddr)
						new_person.save()

			return render_to_response('accounts/uploaded.html', {'sheet': sheet})
	else:
		form = UploadFileForm()
	c= {}
	c.update(csrf(request))
	c['form'] = form
	return render_to_response('accounts/upload.html', c)

