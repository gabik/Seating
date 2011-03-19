# Create your views here.
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.template import RequestContext
from Seating.accounts.forms import UserForm, UserProfileForm, PartnersForm
from Seating.accounts.models import UserProfile, Partners
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
		return HttpResponse('The Wedding Of ' + partners.partner1_first_name + ' and ' + partners.partner2_first_name + ' ' + last_name + '<BR> at date ' + date + '<BR> <form action=/accounts/logout> <input type=submit value=Logout> </form>')
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
			return HttpResponse('Thank you for your registration.<BR><a href=/accounts/login>Login</a>')
	else:
		userprofile_form = UserProfileForm()
		user_form = UserForm()
		partners_form = PartnersForm()
	return render_to_response('registration/create_user.html', { 'userprofile_form': userprofile_form, 'user_form': user_form, 'partners_form': partners_form}, context_instance=RequestContext(request))
