from django.db import models
from django.contrib.auth.models import User


class SingleElement(models.Model):
        user = models.ForeignKey(User, unique=False)
	elem_num = models.IntegerField()
	x_cord = models.FloatField()
	y_cord = models.FloatField()
	kind = models.CharField(max_length=100)
	current_sitting = models.IntegerField()
	max_sitting = models.IntegerField()

class Guest(models.Model):
        user = models.ForeignKey(User, unique=False)
	elem_num = models.IntegerField()
	position = models.IntegerField()
	guest_first_name = models.CharField(max_length=30)
	guest_last_name = models.CharField(max_length=30)
	phone_number = models.CharField(max_length=30)
	guest_email = models.EmailField()
