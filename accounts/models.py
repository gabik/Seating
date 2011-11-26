from django.db import models
from django.contrib.auth.models import User

group_choices = [
  'Friends',
  'Family',
  'Work',
  'Other',
];


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
	phone_number = models.CharField(max_length=30, blank=True)
	excel_hash = models.CharField(max_length=100)
	occasion_date = models.DateField()
	num_of_guests = IntegerRangeField(min_value=1, max_value=2000)
	occasion_place = models.CharField(max_length=30)
        def __unicode__(self):
                printy = self.user.username 
                return printy
	
class Partners(models.Model):
        userPartner = models.ForeignKey(User, unique=True)
	gender_choices = (
		('M', 'Male'),
		('F', 'Female'),
	)
	partner1_first_name = models.CharField(max_length=30)
	partner1_last_name = models.CharField(max_length=30)
	partner1_gender = models.CharField(max_length=1, choices=gender_choices)
	partner1_age = IntegerRangeField(min_value=1, max_value=120)
	partner2_first_name = models.CharField(max_length=30, blank=True)
	partner2_last_name = models.CharField(max_length=30, blank=True)
	partner2_gender = models.CharField(max_length=1, choices=gender_choices, blank=True)
	
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
	group = models.CharField(max_length=30, default='')
	gender_choices = (
		('M', 'Male'),
		('F', 'Female'),
		('U', 'Unknon'),
	)
	gender = models.CharField(max_length=6, choices=gender_choices, default='U')
        def __unicode__(self):
                printy = self.user.username + "- " + self.guest_first_name+ " " +self.guest_last_name
                return printy

class DupGuest(models.Model):
        user = models.ForeignKey(User, unique=False)
	guest_first_name = models.CharField(max_length=30)
	guest_last_name = models.CharField(max_length=30)
	phone_number = models.CharField(max_length=30)
	guest_email = models.EmailField()
	present_amount = models.IntegerField(default=0)
	facebook_account = models.CharField(max_length=30, blank=True)
	group = models.CharField(max_length=30, blank=True)
	
class OccasionOperationItem(models.Model):
        user = models.ForeignKey(User, unique=False)
	operation_number = models.IntegerField(default=0)
	operation_date = models.DateTimeField()
	operation_info = models.CharField(max_length=50)
	

class UnknownGroups(models.Model):
	user = models.ForeignKey(User, unique=False)
	group = models.CharField(max_length=30, blank=True)
