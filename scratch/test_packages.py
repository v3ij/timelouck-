import sys
try:
    import docx
    print("docx ok")
except ImportError:
    print("docx fail")

try:
    import openpyxl
    print("openpyxl ok")
except ImportError:
    print("openpyxl fail")

try:
    import pandas
    print("pandas ok")
except ImportError:
    print("pandas fail")
