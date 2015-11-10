import socket
import sys

closeip = sys.argv[1]
clientsocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
clientsocket.connect(('192.168.0.119', 8089))
clientsocket.send(closeip)