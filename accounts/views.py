# Create your views here.
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.template import RequestContext
from Seating.accounts.forms import UserForm, UserProfileForm, PartnerForm
from Seating.accounts.models import UserProfile, Partner
from django.shortcuts import render_to_response, get_object_or_404, get_list_or_404
from django.contrib.auth.models import User 

#@login_required
def is_login(request):
	if request.user.is_authenticated():
		first_name_partners_list = get_list_or_404(Partner, userPartner=request.user.username)
		first_name_partners = ''
        for item in first_name_partners_list:
                if first_name_partners == '':
                   first_name_partners = first_name_partners + item.first_name
                else:
                   first_name_partners = first_name_partners + ',' + item.first_name
		return HttpResponse('Wellcome ' + first_name_partners_list[0].first_name + first_name_partners_list[1].first_name + ': ' + '<BR> <form action=/accounts/logout> <input type=submit value=Logout> </form>')
	else: # Nothing has been posted
		return HttpResponse('Please login')


def create_user(request):
	if request.method == 'POST': # If the form has been submitted...
		userprofile_form = UserProfileForm(request.POST)
		user_form = UserForm(request.POST)
		partner1_form = PartnerForm(request.POST)
		partner2_form = PartnerForm(request.POST)
		if userprofile_form.is_valid() and user_form.is_valid() and partner1_form.is_valid() and partner2_form.is_valid():	
			user_clean_data = user_form.cleaned_data
			created_user = User.objects.create_user(user_clean_data['username'], user_clean_data['email'], user_clean_data['password1'])
			created_user.save()
			userprofile = userprofile_form.save(commit=False)
			userprofile.user = created_user
			userprofile.save()
			partner1 = partner1_form.save(commit=False)
			partner1.userPartner = user_clean_data['username']
			partner1.save()
			partner2 = partner2_form.save(commit=False)
			partner2.userPartner = user_clean_data['username']
			partner2.save()
			return HttpResponse('Thank you for your registration.<BR><a href=/accounts/login>Login</a>')
	else:
		userprofile_form = UserProfileForm()
		user_form = UserForm()
		partner1_form = PartnerForm();
		partner2_form = PartnerForm();
	return render_to_response('registration/create_user.html', { 'userprofile_form': userprofile_form, 'user_form': user_form, 'partner1_form': partner1_form, 'partner2_form': partner2_form}, context_instance=RequestContext(request))
