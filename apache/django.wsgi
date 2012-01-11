import os
import sys

sys.path.append('/koren/Seating')
sys.path.append('/')
os.environ['DJANGO_SETTINGS_MODULE'] = 'Seating.settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

