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
dest = sys.argv[5]
time = strftime("%Y-%m-%d %H-%M-%S")
print(time)
url = os.path.join(dest, f"{os.path.basename(filePath)}-{action}_{time}.txt")
str_to_write = f"name - {os.path.basename(filePath)}, action - {action}, option - {option}, date - {time}, tool - dummytool1"
with open(url, "w") as fh:
    fh.write(str_to_write)
print (str_to_write)
