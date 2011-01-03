from django.db import models
from django.contrib.auth.models import User


class SingleElement(models.Model):
        user = models.ForeignKey(User, unique=False)
	elem_num = models.IntegerField()
	x_cord = models.FloatField()
	y_cord = models.FloatField()

