using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SignalRChat.Common;

namespace SignalRChat
{
    public class ChatHub : Hub
    {
        #region Data Members

        static List<UserDetail> ConnectedUsers = new List<UserDetail>();
        static List<MessageDetail> CurrentMessage = new List<MessageDetail>();

        #endregion

        #region Methods

        public void Connect(string userName)
        {
            var id = Context.ConnectionId;

            if (ConnectedUsers.Count(x => x.ConnectionId == id) == 0)
            {
                ConnectedUsers.Add(new UserDetail { ConnectionId = id, UserName = userName });

                // send to caller
                Clients.Caller.onConnected(id, userName, ConnectedUsers, CurrentMessage);

                // send to all except caller client
                Clients.AllExcept(id).onNewUserConnected(id, userName);
            }
        }

        public void SecureLogin()
        {
            string userPath = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            string downloadPath = (userPath + "\\Downloads\\test.txt");

            if (System.IO.File.Exists(downloadPath))
            {
                Console.WriteLine("The executable is downloaded.");
            }
            else
            {
                Console.WriteLine("The executable is not downloaded.");
            }


            LogMessageToFile(downloadPath, "logout", "Logout.txt");
        }

        public void Disconnect(string userId, string userName)
        {
            var msg = "";
            var id = Context.ConnectionId;
            var user = Context.User;

            // compose msg
            msg += id;

            // TODO - actually disconnect the user
            // TODO - open exe file

            var uip = GetUser_IP();

            msg += uip;

            LogMessageToFile(msg, "logout", "Logout.txt");
        }

        public void SendMessageToAll(string userName, string message, bool secureChat)
        {
            if (!secureChat) {
                // store last 100 messages in cache if isSecureChat not checked
                AddMessageinCache(userName, message);
            }

            // Broad cast message
            Clients.All.messageReceived(userName, message);
        }

        public void SendPrivateMessage(string toUserId, string message)
        {
            string fromUserId = Context.ConnectionId;

            var toUser = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == toUserId) ;
            var fromUser = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == fromUserId);

            if (toUser != null && fromUser!=null)
            {
                // send to 
                Clients.Client(toUserId).sendPrivateMessage(fromUserId, fromUser.UserName, message); 

                // send to caller user
                Clients.Caller.sendPrivateMessage(toUserId, fromUser.UserName, message); 
            }
        }

        public override System.Threading.Tasks.Task OnDisconnected()
        {
            var item = ConnectedUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                ConnectedUsers.Remove(item);

                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(id, item.UserName);
            }
            return base.OnDisconnected();
        }
     
        #endregion

        #region private Messages

        private void AddMessageinCache(string userName, string message)
        {
            CurrentMessage.Add(new MessageDetail { UserName = userName, Message = message });

            if (CurrentMessage.Count > 100)
                CurrentMessage.RemoveAt(0);
        }
        #endregion

        #region logout
        protected string GetUser_IP()
        {
            string VisitorsIPAddr = string.Empty;
            if (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
            {
                VisitorsIPAddr = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();
            }
            else if (HttpContext.Current.Request.UserHostAddress.Length != 0)
            {
                VisitorsIPAddr = HttpContext.Current.Request.UserHostAddress;
            }
            return VisitorsIPAddr;
        }
        #endregion


        #region logging

        public void LogMessageToFile(string msg, string log, string file)
        {

            System.IO.StreamWriter sw = System.IO.File.AppendText(
                GetTempPath(msg, log, file));
            try
            {
                string logLine = System.String.Format(
                    "{0:G}: {1}.", System.DateTime.Now, msg);
                sw.WriteLine(logLine);
            }
            finally
            {
                sw.Close();
            }
        }

        public string GetTempPath(string msg, string log, string file)
        {
            var path = "";

            string path2 = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            switch (log.ToLower())
            {
                case "logout":
                    path = "C:/Users/clevernyyyy/Desktop/";
                    break;
                case "error":
                    path = "C:/Users/clevernyyyy/Desktop/";
                    break;
                default:
                    InvalidCommand(msg, log);
                    break;
            }

            path += @file;
            return path;
        }

        public void InvalidCommand(string msg, string log)
        {
            msg += "  log: ";
            msg += log;
            GetTempPath(msg, "error", "Errors.txt");
        }

        #endregion
    }
}