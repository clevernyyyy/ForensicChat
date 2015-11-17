import _winreg as wreg
import getpass

user = getpass.getuser()
key = wreg.CreateKey(wreg.HKEY_CLASSES_ROOT, '')
wreg.SetValue(key,'forensichat',wreg.REG_SZ,'URL:forensichat Protocol')
# Create new subkey
kkey = wreg.CreateKey(wreg.HKEY_CLASSES_ROOT, 'forensichat')
wreg.SetValueEx(kkey, 'URL Protocol', 0, wreg.REG_SZ,'')
# prints 'testsubkey'
# Create new value
wreg.CreateKey(wreg.HKEY_CLASSES_ROOT,"forensichat\shell")
nkey = wreg.CreateKey(wreg.HKEY_CLASSES_ROOT,"forensichat\shell\open")
wreg.SetValue(nkey,"command",wreg.REG_SZ,'C:\Users\\'+user+'\Downloads\\forensicleaner.exe')

# prints (u'testvalue', 1)
key.Close()