import socket
import sys

closeip = sys.argv[1]
clientsocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
clientsocket.connect(('172.245.240.131', 139))
clientsocket.send(closeip)