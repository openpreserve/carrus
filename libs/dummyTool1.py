#!python3

import sys
import os
import xml.etree.ElementTree as xml
from time import strftime
from os import path

filePath = sys.argv[1]
action = sys.argv[2]
tool = sys.argv[3]
option = sys.argv[4]
mime = sys.argv[5]
time = strftime("%Y-%m-%d %H-%M-%S")

str_to_write = f'name - {os.path.basename(filePath)},\naction - {action},\noption - {option},\ndate - {time},\ntool - dummytool1,\nmime - {mime}'

print (str_to_write)
