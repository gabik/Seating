from django.db import models
from django.contrib.auth.models import User


class SingleElement(models.Model):
        user = models.ForeignKey(User, unique=False)
	elem_num = models.IntegerField()
	fix_num = models.IntegerField()
	x_cord = models.FloatField()
	y_cord = models.FloatField()
	width = models.FloatField()
	height = models.FloatField()
	kind = models.CharField(max_length=100)
	current_sitting = models.IntegerField()
	max_sitting = models.IntegerField()
	caption = models.CharField(max_length=80)
	orientation_choices = (
		('V', 'Vertical'),
		('H', 'Horizontal'),
		('FH', 'Horizontal'),
		('FV', 'Horizontal'),
	)
	orientation =  models.CharField(max_length=10, choices=orientation_choices, default='V')
	def __unicode__(self):
		printy = self.user.username + " " + str(self.elem_num)
		return printy.decode('utf8')
