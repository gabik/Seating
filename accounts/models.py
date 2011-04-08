from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
        user = models.ForeignKey(User, unique=True)
	phone_number = models.CharField(max_length=30)
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
	
class FloatingGuest(models.Model):
        user = models.ForeignKey(User, unique=False)
	floatingguest_first_name = models.CharField(max_length=30)
	floatingguest_last_name = models.CharField(max_length=30)