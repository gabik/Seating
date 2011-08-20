from django.db import models
from django.contrib.auth.models import User

class IntegerRangeField(models.IntegerField):
    def __init__(self, verbose_name=None, name=None, min_value=None, max_value=None, **kwargs):
        self.min_value, self.max_value = min_value, max_value
        models.IntegerField.__init__(self, verbose_name, name, **kwargs)
    def formfield(self, **kwargs):
        defaults = {'min_value': self.min_value, 'max_value':self.max_value}
        defaults.update(kwargs)
        return super(IntegerRangeField, self).formfield(**defaults)
		
class UserProfile(models.Model):
        user = models.ForeignKey(User, unique=True)
	phone_number = models.CharField(max_length=30)
	excel_hash = models.CharField(max_length=100)
	occasion_date = models.DateField()
	num_of_guests = IntegerRangeField(min_value=1, max_value=1056)
	
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
	group_choices = (
		('Friends', 'Friends'),
		('Family', 'Family'),
		('Work', 'Work'),
		('Other', 'Other'),
	)
	group = models.CharField(max_length=7, choices=group_choices, default='Other')

class DupGuest(models.Model):
        user = models.ForeignKey(User, unique=False)
	guest_first_name = models.CharField(max_length=30)
	guest_last_name = models.CharField(max_length=30)
	phone_number = models.CharField(max_length=30)
	guest_email = models.EmailField()
	present_amount = models.IntegerField(default=0)
	facebook_account = models.CharField(max_length=30, blank=True)
