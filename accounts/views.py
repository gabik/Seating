# Create your views here.
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse, Http404


#@login_required
def is_login(request):
	if request.user.is_authenticated():
		return HttpResponse('Hi ' +  request.user.username + ': ' + request.user.get_full_name() + '<BR> <form action=/users/logout> <input type=submit value=Logout> </form>')
	else: # Nothing has been posted
		return HttpResponse('Please login')
