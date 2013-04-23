#!/usr/bin/env python

import os
import sys
import shutil
import subprocess
from zipfile import ZipFile


if len(sys.argv) != 2:
    print 'Usage: release.py version-number'
    sys.exit(1)

version = sys.argv[1]
work_dir = 'minified'
name = 'goo-' + version

# Root directory inside zip file
zip_root = name + '/'

print 'Creating release', name
if os.path.isdir(work_dir):
    shutil.rmtree(work_dir)

subprocess.check_call(['cake', 'minify'])

with ZipFile(name + '.zip', 'w') as zipfile:
    zipfile.write('COPYING', zip_root + 'COPYING')
    goo_root = work_dir + '/goo'
    for root, dirs, files in os.walk(goo_root):
        for f in files:
            filename = root[len(goo_root) + 1:] + '/' + f
            zipfile.write(root + '/' + f, zip_root + filename)
