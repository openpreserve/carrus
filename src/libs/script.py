import sys
import xml.etree.ElementTree as xml

url = sys.argv[2] + '/report.xml'


def createXML(filename):
    root = xml.Element("xml")
    appt = xml.Element("report")

    root.append(appt)

    filePath = xml.SubElement(appt, "filePath")
    filePath.text = sys.argv[1]

    tool = xml.SubElement(appt, "tool")
    tool.text = sys.argv[3]

    action = xml.SubElement(appt, "action")
    action.text = sys.argv[4]

    tree = xml.ElementTree(root)

    with open(filename, "w") as fh:
        tree.write(fh)


try:
    createXML(url)
    print('success')
except:
    print('error')
