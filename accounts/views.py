# Create your views here.
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.template import RequestContext
from Seating.accounts.forms import UserForm, UserProfileForm
from Seating.accounts.models import UserProfile
from django.shortcuts import render_to_response, get_object_or_404
from django.contrib.auth.models import User


#@login_required
def is_login(request):
	if request.user.is_authenticated():
		phone_number = get_object_or_404(UserProfile, user=request.user).phone_number
		return HttpResponse('Hi ' +  request.user.username + ': ' + phone_number + '<BR> <form action=/accounts/logout> <input type=submit value=Logout> </form>')
	else: # Nothing has been posted
		return HttpResponse('Please login')


def create_user(request):
        if request.method == 'POST': # If the form has been submitted...
                userprofile_form = UserProfileForm(request.POST)
                user_form = UserForm(request.POST)
		if userprofile_form.is_valid() and user_form.is_valid() :	
			user_clean_data = user_form.cleaned_data
			created_user = User.objects.create_user(user_clean_data['username'], user_clean_data['email'], user_clean_data['password1'])
			created_user.save()
			userprofile = userprofile_form.save(commit=False)
			userprofile.user = created_user
			userprofile.save()
			return HttpResponse('Thank you for your registration.<BR><a href=/accounts/login>Login</a>')
	else:
		userprofile_form = UserProfileForm()
		user_form = UserForm()
	return render_to_response('registration/create_user.html', { 'userprofile_form': userprofile_form, 'user_form': user_form }, context_instance=RequestContext(request))
