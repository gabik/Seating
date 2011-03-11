from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
        user = models.ForeignKey(User, unique=True)
	phone_number = models.CharField(max_length=30)
	occasion_date = models.DateField(blank=True, null=True)
	
class Partner(models.Model):
        userPartner = models.CharField(max_length=30)
	first_name = models.CharField(max_length=30)
	last_name = models.CharField(max_length=30)
	gender_choices = (
		('M', 'Male'),
		('F', 'Female'),
	)
	gender = models.CharField(max_length=1, choices=gender_choices)