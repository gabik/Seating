from django.contrib import admin
from Seating.accounts.models import UserProfile ,Partners, Guest, OccasionOperationItem

admin.site.register(UserProfile)
admin.site.register(Partners)
admin.site.register(Guest)
admin.site.register(OccasionOperationItem)
