from django.contrib import admin
from Seating.canvas.models import SingleElement

#class SingleElement(admin.ModelAdmin):
	#list_display = ('user', 'elem_num')

admin.site.register(SingleElement)
