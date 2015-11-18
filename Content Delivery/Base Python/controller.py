import subprocess
import time
import signal
import os
import socket

dev = 1

serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('172.245.240.131', 8089))
serversocket.listen(5) # become a server socket, maximum 5 connections
p = subprocess.Popen(['python', 'pupysh.py'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)

while True:
    connection, address = serversocket.accept()
    spec = connection.recv(13)
    print spec
    if len(spec) > 0:
	run = "run -f "+str(spec)+" pyexec --file /root/Desktop/test.py"
	print run
	print >>p.stdin, run
	#p.stdin.write(run)
	p.stdin.flush()
	time.sleep(10)
	kill = "killme -f "+spec
	print kill
	print >>p.stdin, kill
	#p.stdin.write("killme -f "+spec)

	if dev == 1:
		p = subprocess.Popen(['ps', '-ax'], stdout=subprocess.PIPE)
		out, err = p.communicate()
		for line in out.splitlines():
			if 'pupysh' in line:
				print repr(line)
				pid = int(line[2:6])
				os.kill(pid, signal.SIGKILL)
		exit(0)
