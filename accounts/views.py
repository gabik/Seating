# Create your views here.
# -*- coding: utf-8 -*-
import csv, codecs, cStringIO
from django.core.mail import EmailMultiAlternatives
from django.core.mail import send_mail
import math, re 
import random
from tempfile import TemporaryFile
from xlwt import Workbook, Style
import xlrd, xlwt
from django.views.decorators.csrf import csrf_exempt
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
from xml.etree.ElementTree import parse
import sys
sys.path.append("/Seating/static/locale/he")
import he
from he import u
from hashlib import md5

def escapeSpecialCharacters ( text ):
    characters='"&\',?><.:;}{[]+=)(*^%$#@!~`|/'
    for character in characters:
        text = text.replace( character, '' )
    return text


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
		if userprofile_form.is_valid() and user_form.is_valid() and partners_form.is_valid() and agree_form.is_valid():	
			user_clean_data = user_form.cleaned_data
			created_user = User.objects.create_user(user_clean_data['username'], user_clean_data['email'], user_clean_data['password1'])
			created_user.save()
			userprofile = userprofile_form.save(commit=False)
			userprofile.user = created_user
			userprofile.occasion_date = user_clean_data['occasiondate'];
			userprofile.excel_hash = 'New'
			userprofile.send_feedback_flag = True
			userprofile.save()
			partners = partners_form.save(commit=False)
			partners.userPartner = created_user
			partners.save()
			'''convertXLS2CSV(r"/tmp/list.xls")
			readCSV(r"/tmp/list.csv", created_user)'''
			new_user = authenticate(username=request.POST['username'], password=request.POST['password1'])
			login(request, new_user)

			subject=unicode('תודה על הצטרפותך לאתר 2Seat', "UTF-8")
			#html_message=unicode('<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><div dir="ltr"><div style="direction:rtl"><font color="#598DA2" size="6">חברת 2seat מברכת אותך על הצטרפותך. </font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><font color="#000000" size="4" style="">אנו בחברה מאמינים בקבלת משובים מלקוחותינו השונים על מנת שנוכל ללמוד ולהשתפר.</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl">הצטרף אלינו לדף בפייסבוק ורשום חוות דעתך.<BR>תודה ונתראה בשמחות </a></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><a border=0 href="http://2seat.co.il"><img src="http://2seat.co.il/site/images/email.jpg"></a></div>', "UTF-8")
		#	html_message=unicode('<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><div dir="ltr"><div style="direction:rtl"><font color="#598DA2" size="6">ראשית, תודה רבה על התענינותכם באתר 2Seat.</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><font color="#000000" size="4" style="">השרות שלנו הינו שירות חינם לחלוטין, וכולל אפשרויות רבות כגון: יצירת רשימת מוזמנים אוןליין או מקובץ אקסל, גרירת מוזמנים נוחה וידידותית לשולחנות, אישורי הגעה אוטומטיים, פתקיות הושבה וכדומה.<BR><br>את כל המידע תוכלו לקבל במדריך העזרה באתר, <a href=http://2seat.co.il/site/mainHelp.html> למעבר לחץ כאן </a> <br></font></div><div style="direction:rtl"> <br></div><div style="direction:rtl">הצטרף אלינו לדף בפייסבוק ורשום חוות דעתך.<BR><br>כמו כן, אנו ממליצים לכם להצטרף אלינו לדף הפייסבוק וכך לקבל מידע ועדכונים לגבי אפשרויות חדשות באתר<a href=http://www.facebook.com/pages/2seat-%D7%90%D7%AA%D7%A8-%D7%A1%D7%99%D7%93%D7%95%D7%A8%D7%99-%D7%94%D7%99%D7%A9%D7%99%D7%91%D7%94-%D7%A9%D7%9C-%D7%99%D7%A9%D7%A8%D7%90%D7%9C/266220463433352>לינק לעמוד שלנו בפייסבוק</a><br><br>הינכם מוזמנים ליצור עימנו קשר בכל בעיה או שאלה<br><br>תודה ונתראה בשמחות </div><div style="direction:rtl"> <br></div><div style="direction:rtl"><a border=0 href="http://2seat.co.il"><img src="http://2seat.co.il/site/images/email.jpg"></a></div>', "UTF-8")
			html_message=unicode('<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><div dir="ltr"><div style="direction:rtl"><font color="#598DA2" size="6">ראשית, תודה רבה על התענינותכם באתר 2Seat.</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><font color="#000000" size="4" style="">השרות שלנו הינו שירות חינם לחלוטין, וכולל אפשרויות רבות כגון: יצירת רשימת מוזמנים אוןליין או מקובץ אקסל, גרירת מוזמנים נוחה וידידותית לשולחנות, אישורי הגעה אוטומטיים, פתקיות הושבה וכדומה.<BR><br>את כל המידע תוכלו לקבל במדריך העזרה באתר, <a href=http://2seat.co.il/site/mainHelp.html> למעבר לחץ כאן </a> <br></font></div><div style="direction:rtl"> <br></div><div style="direction:rtl">כמו כן, אנו ממליצים לכם להצטרף אלינו לדף הפייסבוק וכך לקבל מידע ועדכונים לגבי אפשרויות חדשות באתר<a href=http://www.facebook.com/pages/2seat-%D7%90%D7%AA%D7%A8-%D7%A1%D7%99%D7%93%D7%95%D7%A8%D7%99-%D7%94%D7%99%D7%A9%D7%99%D7%91%D7%94-%D7%A9%D7%9C-%D7%99%D7%A9%D7%A8%D7%90%D7%9C/266220463433352> לינק לעמוד שלנו בפייסבוק</a><br><br>אנו משיקים שירות חדש בשם <a href=http://2seat.co.il/site/giveAHand.html> תן לי יד </a> מתוך מטרה לעזור ולייעל את סידור הישיבה באירוע. <br> כל מה שעליכם לעשות הוא לשלוח לנו את רשימת המוזמנים יחד עם שם המשתמש והסיסמא שלכם וכן את סוג השולחנות וכמה מקומות ישיבה. <br>אנו נעלה את כל הנתונים לאתר ולכם יישאר רק לגרור את המוזמנים בקלות ובמהירות.<br>השירות חינמי לחלוטין<br> <br>הינכם מוזמנים ליצור עימנו קשר בכל בעיה או שאלה<br><br>תודה ונתראה בשמחות </div><div style="direction:rtl"> <br></div><div style="direction:rtl"><a border=0 href="http://2seat.co.il"><img src="http://2seat.co.il/site/images/email.jpg"></a></div>', "UTF-8")
			text_message=unicode('חברת 2seat מברכת אותך על הצטרפותך. אנו בחברה מאמינים בקבלת משובים מלקוחותינו השונים על מנת שנוכל ללמוד ולהשתפר. הצטרף אלינו לדף בפייסבוק ורשום חוות דעתך. תודה ונתראה בשמחות',  "UTF-8")
			user_mail=created_user.email
			msg = EmailMultiAlternatives(subject, text_message, 'אתר 2Seat<contact@2seat.co.il>', [user_mail])
			msg.attach_alternative(html_message,"text/html")
			msg.send()

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
			exist_num =  Guest.objects.filter(user=request.user,guest_first_name=request.POST['first'], guest_last_name=request.POST['last'] + str(len(max_match) + 1))
			if (len(exist_num) <= 0):
				addStr = len(max_match) + 1
			else:
				addStr = len(max_match) + 2
		last_name = request.POST['last'] + str(addStr)
		hash = str(str(request.user) + request.POST['first'].encode('utf-8') + last_name.encode('utf-8'))
		new_person = Guest(user=request.user, guest_first_name=request.POST['first'], guest_last_name=last_name, group=request.POST['group'],gender=request.POST['gender'],invation_status = "T", guest_hash = str(md5(hash).hexdigest()))
		new_person.save()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

def handle_uploaded_file(f, request):
	destination = open('/tmp/' + str(request.user.id) + 'curfile.xls', 'wb+')
	for chunk in f.chunks():
		destination.write(chunk)
	destination.close()

def check_person(first, last, user):
	list = Guest.objects.filter(user=user)
	for i in list:
		ifirst,ilast = unicode(i.guest_first_name,"UTF-8"),unicode(i.guest_last_name,"UTF-8")
		if ifirst == first and ilast == last:
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
			#cur_list = Guest.objects.filter(user=request.user)
			DupGuest.objects.filter(user=request.user).delete()
			UnknownGroups.objects.filter(user=request.user).delete()
			duplicate_list = []
			if cur_user.excel_hash != cur_hash : return HttpResponse('Hash not match - contact Gabi')
			if starting_row == 0 : 
				starting_row = 3
			sh = book.sheet_by_index(0)
			sheet = [] 
			male_valid=[u('ז'), u('זכר'), u('גבר'), 'm', 'M', 'Male', 'male']
			female_valid=[u('נ'), u('נקבה'), u('אשה'), u('אישה'), 'f', 'F', 'female', 'Female']
			for r in range(sh.nrows)[int(starting_row):]:
				privName=escapeSpecialCharacters(sh.cell_value(r,0))
				lastName=escapeSpecialCharacters(sh.cell_value(r,1))
				gender=sh.cell_value(r,2)
				if gender == "":
					gender="U"
				if gender in male_valid:
					gender='M'
				elif gender in female_valid:
					gender='F'
				else: 
					gender="U"	
				quantity=sh.cell_value(r,3)
				if quantity == "":
					quantity=1
				phoneNum=escapeSpecialCharacters(sh.cell_value(r,4))
				mailAddr=sh.cell_value(r,5)
				faceAcnt=sh.cell_value(r,6)
				groupNme=sh.cell_value(r,7)
				if groupNme == "":
					groupNme="Other"
				giftAmnt=sh.cell_value(r,8)

				#privName=he.u(privName)
				#lastName=he.u(lastName)
				#groupNme=he.u(groupNme)


				if privName <> "" or lastName <> "" :
					addStr=""
					if check_person(privName, lastName, request.user):
						#dup_person = DupGuest(user=request.user, guest_first_name=privName, guest_last_name=lastName, gender=gender, phone_number=phoneNum, guest_email=mailAddr, group=groupNme)
						#dup_person.save()
						max_match = Guest.objects.filter(user=request.user,guest_first_name=privName, guest_last_name__gt=lastName)
						exist_num =  Guest.objects.filter(user=request.user,guest_first_name=privName, guest_last_name=lastName + " " + str(len(max_match) + 1))
						if (len(exist_num) <= 0):
							addStr = len(max_match) + 1
						else:
							addStr = len(max_match) + 2


					#else:
					lastName=lastName + " " + str(addStr)
					lastName=lastName.strip()
					if quantity > 1:
						for i in range(1,int(quantity)+1):
							hash = str(str(request.user) + privName.encode('utf-8') + " " + str(i) + lastName.encode('utf-8'))
							new_person = Guest(user=request.user, guest_first_name=privName+" "+str(i), guest_last_name=lastName, gender=gender, phone_number=phoneNum, guest_email=mailAddr, group=groupNme, guest_hash = str(md5(hash).hexdigest()))
							new_person.save()
					else:
						hash = str(str(request.user) + privName.encode('utf-8') + lastName.encode('utf-8'))
						new_person = Guest(user=request.user, guest_first_name=privName, guest_last_name=lastName, gender=gender, phone_number=phoneNum, guest_email=mailAddr, group=groupNme, guest_hash=str(md5(hash).hexdigest()))
						new_person.save()

				if groupNme not in group_choices:
					un_group = UnknownGroups(user=request.user, group=groupNme);
					un_group.save()
				
			cur_user.excel_hash='Locked'
			cur_user.save()

			#duplicate_list = DupGuest.objects.filter(user=request.user)
			un_group_list = UnknownGroups.objects.filter(user=request.user)
			#if duplicate_list or un_group_list:
			if un_group_list:
				c= {}
				c.update(csrf(request))
				#c['duplicate_list']=duplicate_list
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
	partners=get_object_or_404(Partners, userPartner = request.user)
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
	row1.write(0, he.first_name, Style.easyxf('pattern: pattern solid, fore_colour aqua;'))
	row1.write(1, he.last_name, Style.easyxf('pattern: pattern solid, fore_colour aqua;'))
	row1.write(2, he.gender, Style.easyxf('pattern: pattern solid, fore_colour aqua;'))
	row1.write(3, he.quantity, Style.easyxf('pattern: pattern solid, fore_colour aqua;'))
	row1.write(4, he.phone_number, Style.easyxf('pattern: pattern solid, fore_colour aqua;'))
	row1.write(5, he.email, Style.easyxf('pattern: pattern solid, fore_colour aqua;'))
	row1.write(6, he.facebook, Style.easyxf('pattern: pattern solid, fore_colour aqua;'))
	row1.write(7, he.group, Style.easyxf('pattern: pattern solid, fore_colour aqua;'))
	row1.write(8, he.present, Style.easyxf('pattern: pattern solid, fore_colour aqua;'))
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
	p1name=partners.partner1_first_name
	p2name=partners.partner2_first_name.strip()
	for g in Guests:
		row1 = sheet1.row(row_num)
		gfirst=unicode(g.guest_first_name, "UTF-8")
		row1.write(0,gfirst, style)
		glast=unicode(g.guest_last_name, "UTF-8")
		row1.write(1,glast, style)
		gender_trans={'M':'זכר', 'F':'נקבה', 'U':'אחר'}
		ggender=unicode(gender_trans[g.gender], "UTF-8")
		row1.write(2,ggender, style)
		row1.write(3,1, style)
		row1.set_cell_text(4,g.phone_number, style)
		gemail=unicode(g.guest_email, "UTF-8")
		row1.write(5,g.guest_email, style)
		gfacebook=unicode(g.facebook_account, "UTF-8")
		row1.write(6,gfacebook, style)
		if p2name == "" :
			p2back=" כללי"
		else:
			p2name=" " + p2name
			p2back=p2name
		group_trans={'Family '+p1name: "משפחה "+p1name,
'Friends '+p1name: 'חברים '+p1name,
'Work '+p1name: 'עבודה '+p1name,
'Family'+p2name: 'עבודה '+p2back,
'Friends'+p2name: 'עבודה '+p2back,
'Work'+p2name: 'עבודה '+p2back,
'Other': 'אחר'}
		ggroup=unicode(group_trans[g.group], "UTF-8")
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
	row1.write(4, he.is_come, Style.easyxf('pattern: pattern solid, fore_colour pink;'))
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
		row1.write(0,unicode(g.guest_last_name, "UTF-8"), style)
		row1.write(1,unicode(g.guest_first_name, "UTF-8"), style)
		cur_caption = unicode("ללא שולחן", "UTF-8")
		cur_fix_num = 0
		for h in user_elements:
			if h.elem_num == g.elem_num:
				cur_caption=unicode(h.caption,"UTF-8")
				cur_fix_num=h.fix_num
		row1.write(2,cur_caption, style)
		row1.write(3,cur_fix_num, style)
		invation_choices_heb={'A': 'מגיע', 'N': 'לא מגיע', 'T': 'ממתין לאישור'}
		is_come=invation_choices_heb[g.invation_status]
		row1.write(4,unicode(is_come, "UTF-8"), style)
		row_num+=1
	sheet1.col(0).width = 6000
	sheet1.col(1).width = 6000
	sheet1.col(2).width = 5000
	sheet1.col(3).width = 4000
	sheet1.col(4).width = 5000
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
		element_name=unicode(g.caption, "UTF-8")
		sitting_on_element=Guest.objects.filter(user=request.user,elem_num=g.elem_num)
		if len(sitting_on_element) > max_sitting_row:
			max_sitting_row=len(sitting_on_element)
		if (cur_3_cul > 0) and (cur_3_cul % 8 == 0):
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
			row1.write(cur_3_cul,unicode(s.guest_first_name, "UTF-8") + " " + unicode(s.guest_last_name, "UTF-8"), styleIn)
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

@login_required
def online_excel(request):
	Guests = Guest.objects.filter(user=request.user)
	#response = HttpResponse(mimetype='text/csv')
	#response['Content-Disposition'] = 'attachment; /Seating/static/excel_output/' + str(request.user.id) + 'guests.csv'
	f = open('/Seating/static/excel_output/' + str(request.user.id) + 'guests.csv', "w")
	writer = csv.writer(f)
	row_num = 1
	partners = get_object_or_404(Partners, userPartner = request.user)
	names=[partners.partner1_first_name,partners.partner2_first_name]

	#writer.writerow(['0', 'first', 'last', 'gender', 'qty', 'phone', 'email', 'facebook', 'group', 'present'])
	for g in Guests:
		gfirst=unicode(g.guest_first_name, "UTF-8")
		glast=unicode(g.guest_last_name, "UTF-8")
		ggender=unicode(g.gender, "UTF-8")
		gemail=unicode(g.guest_email, "UTF-8")
		gfacebook=unicode(g.facebook_account, "UTF-8")
		ggroup=unicode(g.group, "UTF-8")
		writer.writerow([row_num, gfirst.encode('utf-8'), glast.encode('utf-8'), ggender.encode('utf-8'), 1, g.phone_number.encode('utf-8'), gemail.encode('utf-8'), gfacebook.encode('utf-8'), ggroup.encode('utf-8'),g.invation_status ,g.present_amount])
		row_num+=1
	f.close()
        c = {}
	c.update(csrf(request))
	c['rows']=row_num
	c['partner1']=names[0]
	c['partner2']=names[1]
	c['filename']='/static/excel_output/' + str(request.user.id) + 'guests.csv'
        return render_to_response('accounts/online_xls.html', c)

@login_required
def online_save(request):
	if request.method == 'POST': # If the form has been submitted...
		tmpXmlFile=open('/tmp/'+str(request.user.id)+'xmlsave.xml', 'w')
		tmpXmlFile.write(request.POST['xml'].encode('utf-8'))
		tmpXmlFile.close()
		tmpXmlFile=open('/tmp/'+str(request.user.id)+'xmlsave.xml', 'r')
                userXml = parse(tmpXmlFile).getroot()
		tmpXmlFile.close()
		starting_row=request.POST['start_row']
		gender_choice=["U","M","F"]
		partners = get_object_or_404(Partners, userPartner = request.user)
		names=[partners.partner1_first_name,partners.partner2_first_name]
		if names[1] != "":
			names[1]=" "+names[1]
		group_choice=["Family "+names[0],"Friends "+names[0],"Work "+names[0],"Family"+names[1],"Friends"+names[1],"Work"+names[1],"Other"]
		#xxml=""
		DupGuest.objects.filter(user=request.user).delete()
		for row in userXml.findall('row'):
			if int(row.get('id')) >= int(starting_row):
				cur_col=0
				cur_list=[]
				for cell in row.findall('cell'):
					if type(cell.text).__name__=='unicode':
						celltext=cell.text.encode('utf-8')
					elif type(cell.text).__name__=='NoneType':
						celltext=""
					else:
						celltext=str(cell.text)
					cur_list.append(celltext)
				ffirst, flast, fgender, fqty, fphone, femail, ffacebook, fgroup, farive, fpresent = cur_list
				ffirst=escapeSpecialCharacters(ffirst)
				flast=escapeSpecialCharacters(flast)
				fphone=escapeSpecialCharacters(fphone)
				cells=row.findall('cell')
				if (ffirst != "" or flast != ""): 
					if fgroup in group_choice:
						if fgender not in gender_choice :
							fgender="U"
						if fqty <> "":
							fqty=re.sub("\D", "", fqty)
						else:
							fqty=1
						addStr=""
						if check_person(unicode(ffirst,"UTF-8"), unicode(flast,"UTF-8"), request.user):
							#dup_person=DupGuest(user=request.user, guest_first_name=ffirst, guest_last_name=flast, gender=fgender, phone_number=fphone, guest_email=femail, group=fgroup, present_amount=fpresent, invation_status=farive)
							#dup_person.save()
							max_match = Guest.objects.filter(user=request.user,guest_first_name=ffirst, guest_last_name__gt=flast)
							exist_num =  Guest.objects.filter(user=request.user,guest_first_name=ffirst, guest_last_name=flast + " " + str(len(max_match) + 1))
							if (len(exist_num) <= 0):
								addStr = len(max_match) + 1
							else:
								addStr = len(max_match) + 2
						#else:
						flast=flast + " " + str(addStr)
						flast=flast.strip()
						if int(fqty) > 1:
							for i in range(1,int(fqty)+1):
								hash = str(str(request.user) + ffirst + " " + str(i) + flast)
								new_person = Guest(user=request.user, guest_first_name=ffirst+" "+str(i), guest_last_name=flast, gender=fgender, phone_number=fphone, guest_email=femail, group=fgroup, present_amount=fpresent, invation_status=farive, guest_hash = str(md5(hash).hexdigest()))
								new_person.save()
						else:
							hash = str(str(request.user) + ffirst +  flast)
							new_person = Guest(user=request.user, guest_first_name=ffirst, guest_last_name=flast, gender=fgender, phone_number=fphone, guest_email=femail, group=fgroup, present_amount=fpresent, invation_status=farive, guest_hash = str(md5(hash).hexdigest()))
							new_person.save()

	#duplicate_list = DupGuest.objects.filter(user=request.user)
	#if duplicate_list :
		#c= {}
		#c.update(csrf(request))
		#c['duplicate_list']=duplicate_list
		#return render_to_response('accounts/duplicate.html', c)
 	#else:
	return HttpResponse('<HTML><script> parent.location.reload();  </script></HTML> ')

@csrf_exempt
def contact_view(request):
	c={}
	c.update(csrf(request))
	if request.META['REQUEST_URI'] == '/site/contact.html':
		return render_to_response('site/contact.html', c)
	elif request.method == 'POST':
		send_mail(request.POST['subject'], request.POST['message'], request.POST['email'], ['contact@2seat.co.il'], fail_silently=False)
		return HttpResponseRedirect('/site/sent.html')

@login_required
def invation_test(request):
	if request.method == 'POST':
		return render_to_response('accounts/invation_updated.html')
	else:
		partners=get_object_or_404(Partners, userPartner = request.user)
		profile=get_object_or_404(UserProfile, user = request.user)
		persondata = {}
		persondata['first_name'] = unicode(partners.partner1_first_name, "UTF-8")
		persondata['last_name'] = unicode(partners.partner1_last_name, "UTF-8")
		date = profile.occasion_date.strftime("%d/%m/%Y")
		persondata['date'] = date
		persondata['place'] = profile.occasion_place
		persondata['addChar'] = "&"
		persondata['user1_first_name'] = unicode(partners.partner1_first_name, "UTF-8")
		persondata['user2_first_name'] = unicode(partners.partner2_first_name, "UTF-8")
		if partners.partner1_gender == 'M':
			last_name = unicode(partners.partner1_last_name, "UTF-8")
		else:
			last_name = unicode(partners.partner2_last_name, "UTF-8")
		persondata['user_last_name'] = last_name
		persondata.update(csrf(request))
		return render_to_response('accounts/invation.html', persondata)	
		
def invation(request, guestHash):
	if request.method == 'POST':
		guestHashCode = str(guestHash)
		persons = Guest.objects.filter(guest_hash = guestHashCode)
		if (len(persons) > 0):
			persons[0].invation_status=request.POST['personInvationStatus']
			persons[0].meal=request.POST['personMeal']
			persons[0].save()
		'''if userprofile.send_feedback_flag = 1 ==> send user feedback mail'''
		profile = UserProfile.objects.get(user=request.user)
		email_addr = request.user.email
		if profile.send_feedback_flag == True:
			guest_name=unicode(persons[0].guest_first_name + " " + persons[0].guest_last_name, "UTF-8")
			subject=unicode('שינוי סטטוס הגעה - ', "UTF-8") + guest_name
			html_message=unicode('<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><div dir="ltr"><div style="direction:rtl"><font color="#598DA2" size="5">שינוי סטטוס הגעה:</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><font color="#000000" size="4" style="">האורח GUEST בחר STATUS<BR>הפרטים עודכנו אוטומטית במערכת</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><a border=0 href="http://2seat.co.il"><img src="http://2seat.co.il/site/images/email.jpg"></a></div>', "UTF-8")
			text_message=unicode('האורח GUEST בחר STATUS', "UTF-8")
			
			if  persons[0].invation_status == 'N':
				status_text=unicode('שלא להגיע לארוע.', "UTF-8")
			elif persons[0].invation_status == 'T':
				status_text=unicode('כי אינו בטוח עדיין באשר אם מגיע לארוע. ', "UTF-8")
			else:
				status_text=unicode('להגיע לארוע. ', "UTF-8")

			if persons[0].invation_status != 'N':
				if persons[0].meal == 'M':
					status_text=status_text+unicode('האורח בחר מנה בשרית. ', "UTF-8")
				elif persons[0].meal == 'V':
					status_text=status_text+unicode('האורח בחר מנה צמחונית. ', "UTF-8")
				elif persons[0].meal == 'G':
					status_text=status_text+unicode('האורח בחר מנת גלאט כשר. ', "UTF-8")
			new_html_message1=html_message.replace("GUEST", guest_name)
			new_html_message=new_html_message1.replace("STATUS", status_text)
			new_text_message1=text_message.replace("GUEST", guest_name)
			new_text_message=new_text_message1.replace("STATUS", status_text)

			msg = EmailMultiAlternatives(subject, new_text_message, '2Seat <contact@2seat.co.il>', [email_addr])
			msg.attach_alternative(new_html_message,"text/html")
			msg.send()

		return render_to_response('accounts/invation_updated.html')
	else:
		guestHashCode = str(guestHash)
		persons = Guest.objects.filter(guest_hash = guestHashCode)
		if (len(persons) > 0):
			persondata = {}
			persondata['first_name'] = persons[0].guest_first_name
			persondata['last_name'] = persons[0].guest_last_name
			partners = get_object_or_404(Partners, userPartner = persons[0].user)
			profile = get_object_or_404(UserProfile, user = persons[0].user)
			date = profile.occasion_date.strftime("%d/%m/%Y")
			place = profile.occasion_place
			persondata['date'] = date
			persondata['place'] = place
			user_last_name = ""
			if partners.partner1_gender == 'M':
				user_last_name = partners.partner1_last_name
			else:
				user_last_name = partners.partner2_last_name
			if user_last_name == "":
				user_last_name = partners.partner1_last_name
			persondata['addChar'] = ""
			if partners.partner2_first_name != "":
				persondata['addChar'] = "&"
			persondata['user1_first_name'] = partners.partner1_first_name
			persondata['user2_first_name'] = partners.partner2_first_name
			persondata['user_last_name'] = user_last_name
			persondata.update(csrf(request))
			return render_to_response('accounts/invation.html', persondata)
		else:
			return HttpResponse('Guest not exist')		
			
def unsubscribe(request, guestHash):
	if request.method == 'POST':
		guestHashCode = str(guestHash)
		persons = Guest.objects.filter(guest_hash = guestHashCode)
		if (len(persons) > 0):
			if request.POST['unsubscribe'] == 'V':
				persons[0].send_mail_flag = 0
				persons[0].save()
		return render_to_response('accounts/unsubscribe_updated.html')
	else:
		guestHashCode = str(guestHash)
		persons = Guest.objects.filter(guest_hash = guestHashCode)
		if (len(persons) > 0):
			persondata = {}
			persondata['first_name'] = persons[0].guest_first_name
			persondata['last_name'] = persons[0].guest_last_name
			partners = get_object_or_404(Partners, userPartner = persons[0].user)
			profile = get_object_or_404(UserProfile, user = persons[0].user)
			date = profile.occasion_date.strftime("%d/%m/%Y")
			place = profile.occasion_place
			persondata['date'] = date
			persondata['place'] = place
			user_last_name = ""
			if partners.partner1_gender == 'M':
				user_last_name = partners.partner1_last_name
			else:
				user_last_name = partners.partner2_last_name
			if user_last_name == "":
				user_last_name = partners.partner1_last_name
			persondata['addChar'] = ""
			if partners.partner2_first_name != "":
				persondata['addChar'] = "&"
			persondata['user1_first_name'] = partners.partner1_first_name
			persondata['user2_first_name'] = partners.partner2_first_name
			persondata['user_last_name'] = user_last_name
			persondata.update(csrf(request))
			return render_to_response('accounts/unsubscribe.html', persondata)
		else:
			return HttpResponse('Guest not exist')

@login_required
def stickers(request):
	Guests = Guest.objects.filter(user=request.user)
	user_elements = SingleElement.objects.filter(user=request.user)
	partners=get_object_or_404(Partners, userPartner = request.user)
        #elements_nums = user_elements.values_list('elem_num', flat=1)
	#max_rows = math.ceil(len(elements_nums)/3)
	book = Workbook()
	sheet1 = book.add_sheet('2Seat.co.il')
	sheet1.cols_right_to_left = True
	row_num = 0
	#row1.write(6, 'Present', Style.easyxf('pattern: pattern solid, fore_colour pink;'))
	#for g in elements_nums:
	cur_3_cul=-1
	cur_row=0
	max_sitting_row=0
	for g in Guests:
		#element_name=user_elements[g].caption
		#element_name=SingleElement.objects.filter(user=request.user,elem_num=g).caption
		firstname=unicode(g.guest_first_name, "UTF-8")
		lastname=unicode(g.guest_last_name, "UTF-8")
		if g.elem_num != 0:
			table=SingleElement.objects.get(user=request.user,elem_num=g.elem_num)
			table_name=unicode(table.caption, "UTF-8")
			table_num=table.fix_num
		else:
			table_name=unicode("ללא שולחן", "UTF-8")
			table_num=""
		p1name=partners.partner1_first_name
		p2name=partners.partner2_first_name.strip()
		if p2name == "" :
			p2back=" כללי"
		else:
			p2name=" " + p2name
			p2back=p2name
		group_trans={'Family '+p1name: "משפחה "+p1name,
'Friends '+p1name: 'חברים '+p1name,
'Work '+p1name: 'עבודה '+p1name,
'Family'+p2name: 'עבודה '+p2back,
'Friends'+p2name: 'עבודה '+p2back,
'Work'+p2name: 'עבודה '+p2back,
'Other': 'אחר'}
		group_name=unicode(group_trans[g.group], "UTF-8")
		if (cur_3_cul > 0) and (cur_3_cul % 2 == 0):
			cur_3_cul=0
			cur_row+=5
		else:
			cur_3_cul+=1
		row_num=cur_row
		
		alignment = xlwt.Alignment()
		alignment.horz = xlwt.Alignment.HORZ_CENTER
		alignment.vert = xlwt.Alignment.VERT_CENTER
		alignment2 = xlwt.Alignment()
		alignment2.horz = xlwt.Alignment.HORZ_LEFT
		alignment2.vert = xlwt.Alignment.VERT_TOP
	        border1 = xlwt.Borders()
	        border2 = xlwt.Borders()
	        border3 = xlwt.Borders()
        	border1.left = xlwt.Borders.DOUBLE
        	border1.right = xlwt.Borders.DOUBLE
        	border2.left = xlwt.Borders.DOUBLE
        	border2.right = xlwt.Borders.DOUBLE
        	border3.left = xlwt.Borders.DOUBLE
        	border3.right = xlwt.Borders.DOUBLE
        	border2.top = xlwt.Borders.DOUBLE
        	border3.bottom = xlwt.Borders.DOUBLE
        	border1.left_colour = 0x40
        	border1.right_colour = 0x40
        	border2.left_colour = 0x40
        	border2.right_colour = 0x40
        	border3.left_colour = 0x40
        	border3.right_colour = 0x40
        	border2.top_colour = 0x40
        	border3.bottom_colour = 0x40
	        pattern = xlwt.Pattern()
        	pattern.pattern = xlwt.Pattern.SOLID_PATTERN
        	pattern.pattern_fore_colour = 1
		font1 = xlwt.Font()
		font2 = xlwt.Font()
		font1.name = 'David'
		font1.bold = True
		font1.height = 0x00C8
		font2.height = 0x00C5
        	style1 = xlwt.XFStyle()
        	style2 = xlwt.XFStyle()
        	style3 = xlwt.XFStyle()
        	protection = xlwt.Protection()
        	protection.cell_locked = 1
        	style1.protection = protection
        	style1.pattern = pattern
		style1.alignment = alignment
		style1.font = font1
        	style2.protection = protection
        	style2.pattern = pattern
		style2.alignment = alignment2
		style2.font = font2
        	style3.protection = protection
        	style3.pattern = pattern
		style3.alignment = alignment
        	style1.borders = border1
        	style2.borders = border2
        	style3.borders = border3
		
		row1 = sheet1.row(row_num)
		row1.write(cur_3_cul,"2seat.co.il", style2)
		row_num+=1
		row1 = sheet1.row(row_num)
		row1.write(cur_3_cul,firstname + " " + lastname, style1)
		row_num+=1
		row1 = sheet1.row(row_num)
		row1.write(cur_3_cul,group_name, style1)
		row_num+=1
		row1 = sheet1.row(row_num)
		row1.write(cur_3_cul,table_name + " - " + str(table_num), style1)
		row_num+=1
		row1 = sheet1.row(row_num)
		row1.write(cur_3_cul,"", style3)
	for i in range(0,3):
		sheet1.col(i).width = 8000
	for i in range(0,row_num+1):
		sheet1.row(i).height=450
		sheet1.row(i).height_mismatch = True
	sheet1.protect = True
	sheet1.password = "242424"
        c = {}
        c['filename'] = str(request.user.id) + 'stickers.xls'
        book.save('/Seating/static/excel_output/' + c['filename'])
	book.save(TemporaryFile())
        return render_to_response('accounts/xls.html', c)

@login_required
def SendNotifications(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		#emails=request.POST.getlist('mailList')
		emails=request.POST['mailList'].split('|')[:-1]
		#org_message=request.POST['message']
		partners=get_object_or_404(Partners, userPartner = request.user)
		occasion=get_object_or_404(UserProfile, user = request.user)
		if partners.partner1_gender == 'M':
			last_name = unicode(partners.partner1_last_name, "UTF-8")
		else:
			last_name = unicode(partners.partner2_last_name, "UTF-8")
		names=unicode(partners.partner1_first_name, "UTF-8")
		if partners.partner2_first_name != "":
			names=names+unicode(' ו', "UTF-8") + unicode(partners.partner2_first_name, "UTF-8")
		names=names+' '+last_name
		if int(request.POST['sendValue']) == 1:
			subject=unicode('הארוע של ', "UTF-8") + names + unicode(' המתקיים בתאריך ', "UTF-8") + str(occasion.occasion_date) + unicode(' ב', "UTF-8") + unicode(occasion.occasion_place, "UTF-8")
			html_message=unicode('<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><div dir="ltr"><div style="direction:rtl"><font color="#598DA2" size="6">אנו מתכבדים להזמינך לארוע שלנו</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><font color="#000000" size="4" style="">נשמח לראותך,</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><a href=LINK >לאישור/ביטול הגעה ושינוי פרטים נוספים לחץ כאן! </a></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><a border=0 href="http://2seat.co.il"><img src="http://2seat.co.il/site/images/email.jpg"></a></div> <div style=direction:rtl> OR_PHONE </div> <a href=UNSUBSCRIBE>להסרה מרשימת התפוצה לחץ כאן</a></div>', "UTF-8")
			text_message=unicode('אנו מתכבדים להזמינך לארוע שלנו, נשמח לראותך, לאישור הגעה נא לחץ על הקישור הנ"ל LINK OR_PHONE            להסרה עבור לקישור UNSUBSCRIBE',  "UTF-8")
			OR_PHONE=""
			if occasion.phone_number.strip() <> "":
				OR_PHONE=unicode(" או בטלפון " + occasion.phone_number, "UTF-8")
			for cur_mail in emails:
				guests=Guest.objects.filter(user=request.user, guest_email=cur_mail)
				if cur_mail=="TEST":
					user_mail=request.user.email
					link='http://2seat.co.il/accounts/invation/TEST/'
					unsubs='http://2seat.co.il/accounts/unsubscribe/TEST/'
					new_html_message2=html_message.replace("LINK", link)
					new_text_message2=text_message.replace("LINK", link)
					new_html_message1=new_html_message2.replace("OR_PHONE", OR_PHONE)
					new_text_message1=new_text_message2.replace("OR_PHONE", OR_PHONE)
					new_html_message=new_html_message1.replace("UNSUBSCRIBE", unsubs)
					new_text_message=new_text_message1.replace("UNSUBSCRIBE", unsubs)
					msg = EmailMultiAlternatives(subject, new_text_message, names+'<contact@2seat.co.il>', [user_mail])
					#send_mail(subject, message, names+'<contact@2seat.co.il>', [cur_mail], fail_silently=False)
					msg.attach_alternative(new_html_message,"text/html")
					msg.send()
				else:
					for cur_guest in guests:
						hash=cur_guest.guest_hash
						link='http://2seat.co.il/accounts/invation/'+hash+'/'
						unsubs='http://2seat.co.il/accounts/unsubscribe/'+hash+'/'
						new_html_message2=html_message.replace("LINK", link)
						new_text_message2=text_message.replace("LINK", link)
						new_html_message1=new_html_message2.replace("OR_PHONE", OR_PHONE)
						new_text_message1=new_text_message2.replace("OR_PHONE", OR_PHONE)
						new_html_message=new_html_message1.replace("UNSUBSCRIBE", unsubs)
						new_text_message=new_text_message1.replace("UNSUBSCRIBE", unsubs)
						msg = EmailMultiAlternatives(subject, new_text_message, names+'<contact@2seat.co.il>', [cur_mail])
						#send_mail(subject, message, names+'<contact@2seat.co.il>', [cur_mail], fail_silently=False)
						msg.attach_alternative(new_html_message,"text/html")
						msg.send()
		else:
			subject=unicode('תודה מ', "UTF-8") + names
			html_message=unicode('<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><div dir="ltr"><div style="direction:rtl"><font color="#598DA2" size="6">תודה שהשתתפתם באירוע שלנו,</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><font color="#000000" size="4" style="">נתראה בשמחות.</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"> NAMES </div><div style="direction:rtl"> <br></div><div style="direction:rtl"><a border=0 href="http://2seat.co.il"><img src="http://2seat.co.il/site/images/email.jpg"></a></div></div>', "UTF-8")
			text_message=unicode('תודה שהגעתם לאירוע שלנו, נתראה בשמחות, NAMES',  "UTF-8")
			new_html_message=html_message.replace("NAMES", names)
			new_text_message=text_message.replace("NAMES", names)
			if emails[0]=="TEST":
				user_mail=request.user.email
				msg = EmailMultiAlternatives(subject, new_text_message, names+'<contact@2seat.co.il>', [user_mail])
				msg.attach_alternative(new_html_message,"text/html")
				msg.send()
			else:
				for cur_mail in emails:
					msg = EmailMultiAlternatives(subject, new_text_message, names+'<contact@2seat.co.il>', [cur_mail])
					msg.attach_alternative(new_html_message,"text/html")
					msg.send()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)

	
def list_dates(request):
	users=User.objects.all()
	profile_users=UserProfile.objects.all()
 	list=[]
 	for user in users:
		userexist=0
		for curprof in profile_users:
			if curprof.user == user:
				userexist=1
		if userexist == 1:
			curprofile=UserProfile.objects.get(user=user)
			curpartners=Partners.objects.get(userPartner=user)
			curname=curpartners.partner1_first_name + " " + curpartners.partner2_first_name
			curuser={'id': user.id, 'name': curname, 'email': user.email, 'date': curprofile.occasion_date, 'join': user.date_joined, 'login': user.last_login}
			list.append(curuser)
	c={}
	c.update(csrf(request))
	c['list'] = list
	return render_to_response('accounts/list_dates.html', c)


def SendWelcome(request):
	json_dump = json.dumps({'status': "Error"})
	if request.method == 'POST':
		email=request.POST['mail']
		partners=request.POST['partners']
		#html_message=unicode('<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><div dir="rtl" style="text-align:right"><u><b><font size="4">XXX שלום,</font></b></u><br><br>ראשית, תודה רבה על התענינותכם באתר 2Seat.<br><br>השרות שלנו הינו שירות חינם לחלוטין, וכולל אפשרויות רבות כגון: יצירת רשימת מוזמנים אוןליין או מקובץ אקסל, גרירת מוזמנים נוחה וידידותית לשולחנות, אישורי הגעה אוטומטיים, פתקיות הושבה וכדומה..<br><br>את כל המידע תוכלו לקבל במדריך העזרה באתר, כתובתו <a href="http://2seat.co.il/site/mainHelp.html" target="_blank">http://2seat.co.il/site/<wbr>mainHelp.html</a><br><br>כמו כן, אנו ממליצים לכם להצטרף אלינו לדף הפייסבוק וכך לקבל מידע ועדכונים לגבי אפשרויות חדשות באתר. <a href="http://www.facebook.com/pages/2seat-%D7%90%D7%AA%D7%A8-%D7%A1%D7%99%D7%93%D7%95%D7%A8%D7%99-%D7%94%D7%99%D7%A9%D7%99%D7%91%D7%94-%D7%A9%D7%9C-%D7%99%D7%A9%D7%A8%D7%90%D7%9C/266220463433352" target="_blank">לינק לעמוד שלנו בפייסבוק</a>.<br><br>הינכם מוזמנים ליצור עימנו קשר בכל בעיה או שאלה.<br><br>תודה והרבה מזל טוב,<br><font size="4">צוות 2Seat.</font><br></div><div style="direction:rtl"><a border=0 href="http://2seat.co.il"><img src="http://2seat.co.il/site/images/email.jpg"></a></div>', "UTF-8")
		html_message=unicode('<meta http-equiv="Content-Type" content="text/html; charset=utf-8"><div dir="ltr"><div style="direction:rtl"><font color="#598DA2" size="6">ראשית, תודה רבה על התענינותכם באתר 2Seat.</font></div><div style="direction:rtl"> <br></div><div style="direction:rtl"><font color="#000000" size="4" style="">השרות שלנו הינו שירות חינם לחלוטין, וכולל אפשרויות רבות כגון: יצירת רשימת מוזמנים אוןליין או מקובץ אקסל, גרירת מוזמנים נוחה וידידותית לשולחנות, אישורי הגעה אוטומטיים, פתקיות הושבה וכדומה.<BR><br>את כל המידע תוכלו לקבל במדריך העזרה באתר, <a href=http://2seat.co.il/site/mainHelp.html> למעבר לחץ כאן </a> <br></font></div><div style="direction:rtl"> <br></div><div style="direction:rtl">כמו כן, אנו ממליצים לכם להצטרף אלינו לדף הפייסבוק וכך לקבל מידע ועדכונים לגבי אפשרויות חדשות באתר<a href=http://www.facebook.com/pages/2seat-%D7%90%D7%AA%D7%A8-%D7%A1%D7%99%D7%93%D7%95%D7%A8%D7%99-%D7%94%D7%99%D7%A9%D7%99%D7%91%D7%94-%D7%A9%D7%9C-%D7%99%D7%A9%D7%A8%D7%90%D7%9C/266220463433352>לינק לעמוד שלנו בפייסבוק</a><br>אנו משיקים שירות חדש בשם<a href=http://2seat.co.il/site/giveAHand.html>תן לי יד</a> מתוך מטרה לעזור ולייעל את סידור הישיבה באירוע. <br> כל מה שעליכם לעשות הוא לשלוח לנו את רשימת המוזמנים יחד עם שם המשתמש והסיסמא שלכם וכן את סוג השולחנות וכמה מקומות ישיבה. <br>אנו נעלה את כל הנתונים לאתר ולכם יישאר רק לגרור את המוזמנים בקלות ובמהירות.<br>השירות חינמי לחלוטין<br> <br>הינכם מוזמנים ליצור עימנו קשר בכל בעיה או שאלה<br><br>תודה ונתראה בשמחות </div><div style="direction:rtl"> <br></div><div style="direction:rtl"><a border=0 href="http://2seat.co.il"><img src="http://2seat.co.il/site/images/email.jpg"></a></div>', "UTF-8")

		subject=unicode('פנייה מאתר 2Seat', "UTF-8")
		text_message=unicode('',  "UTF-8")
		new_html_message=html_message.replace("XXX", partners)
		new_text_message=text_message.replace("XXX", partners)
		msg = EmailMultiAlternatives(subject, new_text_message, '2Seat<contact@2seat.co.il>', [email])
		#send_mail(subject, message, names+'<contact@2seat.co.il>', [cur_mail], fail_silently=False)
		msg.attach_alternative(new_html_message,"text/html")
		msg.send()
		json_dump = json.dumps({'status': "OK"})
	return HttpResponse(json_dump)
