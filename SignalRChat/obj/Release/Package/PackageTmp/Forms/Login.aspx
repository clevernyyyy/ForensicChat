<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="SignalRChat.Forms.Login" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
<div id="divContainer" class="container" style="text-align:center;">
    <!-- LOGIN -->
    <div id="divLogin" class="login">
        <div id="divLoginBox" class="login-box">
            <div class="input-group" style="margin-bottom:5px;">
                <span id="basic-username" class="input-group-addon glyphicon glyphicon-user"></span>
                <input id="txtNickName" type="text" class="form-control" placeholder="Username" aria-describedby="basic-username" style="margin-top:1px;"/>
            </div>
            <div class="input-group" style="margin-bottom:3px;">
                <span class="input-group-addon glyphicon glyphicon-option-horizontal" id="basic-password"></span>
                <input id="password" type="text" class="form-control" placeholder="Password" aria-describedby="basic-password" style="margin-top:1px;"/>
            </div>
            <div id="divButton" style="margin-bottom:10px;">
                <div id="checkbox" style="float:left; margin-top:5px;">
                    <input id="chkSecureChat" type="checkbox" class="checkbox-inline" style="margin-top:5px;"/> <!--checked> (this defaults checked attribute)-->
                    <label style="vertical-align:sub;">Secure Chat</label>
                </div>
                <input id="btnStartChat" type="button" class="btn btn-info" value="Start Chat" />
            </div>
            <div id="divSecureWarning"class="alert alert-warning warning-box" style="display:none;">
                <span>By checking <strong>Secure Chat</strong>, you agree to the following:</span>
                <ul class="warning-ul">
                    <li class="warning-ul warning-li">You will download the executable in order to forensically secure this chat session.  The chat session will not start without the executable downloaded and the <strong>Secure Chat</strong> box checked.</li>
                    <li class="warning-ul warning-li warning-last-li">We will not cache your messages.</li>
                </ul>
                <span class="warning-TOC"><a id="warning-toc">Terms and Conditions</a></span>
            </div>
            <div id="divWarningTOC" class="alert alert-info info-box" style="display:none;">
                <a href="#" class="close" data-hide="alert" aria-label="close">&times;</a>
                <span style="margin-top: 5px;"><strong>Terms and Conditions</strong></span>
                <ol class="warning-ul">
                    <li class="warning-ul warning-li">This secure chat requires the use of Google Chrome Version 45.0.2454.99 or later.</li>
                    <li class="warning-ul warning-li">Multiple browser support will be available, check out <a href="https://github.com/clevernyyyy/ForensicChat">github</a> for more information.</li>
                    <li class="warning-ul warning-li">We will gain administrator access if needed in order to forensically secure this chat session.</li>
                </ol>
            </div>
            <div id="anchor-div" style="text-align: right;">
                <a style="font-size: 0.9em; text-align:center;" href="#">Tell me more about this site!</a>
            </div>
        </div>
        <!-- TODO - slide the login box left, open up a text area that explains the site in more detail. -->
        <!-- TODO - figure out how to center this text without centering every other text item. -->
    </div>
    <!-- MORE INFO-->
    <div id="divMoreInfo" style="background-color:blue; width:250px; display:inline-block;">
        <!-- TODO - fill out this div with large text explaining the site more specifically. -->   
        MORE INFOT 
    </div>
</div>

</asp:Content>
