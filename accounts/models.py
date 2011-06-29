from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
        user = models.ForeignKey(User, unique=True)
	phone_number = models.CharField(max_length=30)
	excel_hash = models.CharField(max_length=100)
	occasion_date = models.DateField()
	
class Partners(models.Model):
        userPartner = models.ForeignKey(User, unique=True)
	gender_choices = (
		('M', 'Male'),
		('F', 'Female'),
	)
	partner1_first_name = models.CharField(max_length=30)
	partner1_last_name = models.CharField(max_length=30)
	partner1_gender = models.CharField(max_length=1, choices=gender_choices)
	partner2_first_name = models.CharField(max_length=30)
	partner2_last_name = models.CharField(max_length=30)
	partner2_gender = models.CharField(max_length=1, choices=gender_choices)
	

class Guest(models.Model):
        user = models.ForeignKey(User, unique=False)
	elem_num = models.IntegerField(default=0)
	position = models.IntegerField(default=0)
	guest_first_name = models.CharField(max_length=30)
	guest_last_name = models.CharField(max_length=30)
	phone_number = models.CharField(max_length=30)
	guest_email = models.EmailField()
	present_amount = models.IntegerField(default=0)
	facebook_account = models.CharField(max_length=30, blank=True)

class DupGuest(models.Model):
        user = models.ForeignKey(User, unique=False)
	guest_first_name = models.CharField(max_length=30)
	guest_last_name = models.CharField(max_length=30)
	phone_number = models.CharField(max_length=30)
	guest_email = models.EmailField()
	present_amount = models.IntegerField(default=0)
	facebook_account = models.CharField(max_length=30, blank=True)
