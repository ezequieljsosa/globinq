#/var/www/html/globinq_api/app.wsgi
import os

#os.chdir(os.path.dirname(__file__))
os.chdir("/home/eze/globinator")

python_home = '/home/eze/PYENV/'

activate_this = python_home + '/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))
import sys
sys.path.append("/home/eze/globinator")
sys.path.append("/home/eze/biopython")
from  GlobinQ.web import bapp


# ... build or import your bottle application here ...
# Do NOT use bottle.run() with mod_wsgi
application = bapp
