Walking through the setup process for our Content Delivery System  
  
NOTE: Assuming x86 windows payload  
From the location you want to install pupy  
1.    pip install rpyc  
      pip install pefile  
      (dependencies)  
2. git clone https://github.com/n1nj4sec/pupy   
3. follow their setup to edit the .conf correctly and generate a payload for your server  
4. cd back to the installation directory  
5. git clone https://github.com/clevernyyyy/ForensicChat  
6. copy the ForensicChat/Content Delivery/Base Python/forensichatpupymodule.py file into pupy/pupy/modules  
7. copy the ForensicChat/Content Delivery/Base Python/controller.py into pupy/pupy  
8. copy your local _sqlite3.pyd and _sqlite3.dll/sqlite3.dll into pupy/pupy/packages/windows/x86   
9. config controller.py to coincide with what your caller is calling  
10. run sudo python controller.py  
11. you're good to go  
