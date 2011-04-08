from django.contrib import admin
from Seating.accounts.models import UserProfile ,Partners, FloatingGuest

admin.site.register(UserProfile)
admin.site.register(Partners)
admin.site.register(FloatingGuest)
