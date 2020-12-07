import sys
import os
import xml.etree.ElementTree as xml
from time import strftime

url = sys.argv[2] + '/' + os.path.basename(
    sys.argv[1]) + '_' + sys.argv[3] + '_' + strftime("%Y.%m.%d-%H:%M:%S") + '.xml'


def createXML(filename):
    root = xml.Element("xml")
    appt = xml.Element("report")

    root.append(appt)

    filePath = xml.SubElement(appt, "filePath")
    filePath.text = sys.argv[1]

    tool = xml.SubElement(appt, "tool")
    tool.text = sys.argv[4]

    action = xml.SubElement(appt, "action")
    action.text = sys.argv[3]

    timestamp = xml.SubElement(appt, "timestamp")
    timestamp.text = strftime("%Y-%m-%d %H:%M:%S")

    tree = xml.ElementTree(root)

    with open(filename, "wb") as fh:
        tree.write(fh)

    print(xml.tostring(root, encoding='utf8', method='xml'))


try:
    createXML(url)
except Exception as inst:
    print(inst)
