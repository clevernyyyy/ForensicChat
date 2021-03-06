﻿//$(document).ready(function () {
    // Disable console
    // $.connection.chatHub.server.sendMessageToAll('hey', 'what', 0);
//});

// TODO - set timeout.
$(function () {
    // Declare a proxy to reference the hub. 
    var chatHub = $.connection.chatHub;

    // Declare sound as true initially
    $('#hdSound').val(true);

    registerClientMethods(chatHub);

    // Start Hub
    $.connection.hub.start().done(function () {
        registerEvents(chatHub);
    });

    $('#sound-anchor').click(function (event) {
        var isSoundOn = $('#hdSound').val();
        $('#hdSound').val(setSound(isSoundOn));
        event.stopPropagation();
    });
});

function registerEvents(chatHub) {
    var isSecureChat = false;
    
    $("#btnStartChat").click(function (e) {
        var chkSecureChat = $("#chkSecureChat");
        var name = $("#txtNickName").val();
        var proceedLogin = false;

        if (chkSecureChat.is(":checked")) {
            var userClickText = 'Single Use';
            var userClickDesc = 'This option means that the user is responsible for running the executable we download upon logout.  We will prompt you to remember to run it, but it will require user interaction each time you use ForensiChat.';
            var registryText = 'Repeat Customer';
            var registryDesc = 'The repeat customer option is for users who are willing to implicitly trust ForensiChat to perform all cleaning actions for them.  This trust requires a one-time user interaction upon initial download of our cleaning tools, but no interaction after that.  ForensiChat will change registry files and create a custom search engine in Chrome in order to escape the Chrome sandbox to manage our cleaning tools on the user computer.';

            e.preventDefault();

            var $popUpExeType =
                $('<div>' +
                        '<input type="radio" id="userClick" style="margin-right:5px;" name="exe" value="user" checked>' + userClickText + '<br><p class="exeChoiceDesc">' + userClickDesc + '</p>' +
                        '<input type="radio" id="registryClick" style="margin-right:5px;" name="exe" value="registry">' + registryText + '<br><p class="exeChoiceDesc">' + registryDesc + '</p>' +
                        '<br><p class="exeChoiceDesc">Confused?  Close out of this popup and read our Terms and Conditions found on the login page.</p>' +
                '</div>');

            $popUpExeType.dialog({
                autoOpen: true,
                height: 415,
                width: 400,
                position: ["bottom", 150],
                title: "Choose your Cleaner",
                modal: true, 
                open: function() {
                    $('.ui-widget-overlay').addClass('custom-overlay');
                },
                close: function() {
                    $('.ui-widget-overlay').removeClass('custom-overlay');
                },     
                buttons: {
                    Cancel: function () {
                        $(this).dialog("close");
                    },
                    Proceed: function () {
                        $(this).dialog("close");
                        var radioValue = $("input:radio[name=exe]:checked").val();
                        callback(radioValue)
                    }
                }
            }).prev('.ui-dialog-titlebar').css("background","#337ab7");

            function callback(exeChoice) {
                proceedLogin = downloadFile(exeChoice);
                if (proceedLogin == true) {
                    name = adamitize(name);
                    if (name.trim().length > 0 && name.trim().length < 14) {
                        chatHub.server.connect(name);
                    }
                    else {
                        // TODO - bootstrap error notification perhaps instead of alert (ugly)
                        alert("Please enter valid name.  Less than 14 characters without any xss.");
                        $("#txtNickName").val('');
                        $("#txtNickName").focus();
                    }
                } else {
                    alert("There was an error when attempting to download our cleaner.  Please reload the page and attempt to download again.\nThe downloaded file should be located in your\nC:\\User\\Downloads\\ folder.")
                }
            }
        } else {
            proceedLogin = true;
        }

        if (proceedLogin == true) {
            name = adamitize(name);
            if (name.trim().length > 0 && name.trim().length < 14) {
                chatHub.server.connect(name);
            }
            else {
                // TODO - bootstrap error notification perhaps instead of alert (ugly)
                alert("Please enter valid name.  Less than 14 characters without any xss.");
                $("#txtNickName").val('');
                $("#txtNickName").focus();
            }
        } else {
           // alert("There was an error when attempting to download our cleaner.  Please reload the page and attempt to download again.\nThe downloaded file should be located in your\nC:\\User\\Downloads\\ folder.")
        }
    });

    $('#btnSendMsg').click(function () {
        var id = $('#hdId').val();
        var msg = $("#txtMessage").val();
        msg = adamitize(msg);
        if (msg.trim().length > 0) {
            var userName = $('#hdUserName').val();
            chatHub.server.sendMessageToAll(userName, msg, id, isSecureChat);
            $("#txtMessage").val('');
        } else {
            // TODO - alert?
            alert("Nice try...");
            $("#txtMessage").val('');
            $("#txtMessage").focus();
        }
    });

    $("#txtNickName").keypress(function (e) {
        if (e.which == 13) {
            $("#btnStartChat").click();
        }
    });

    $("#txtMessage").keypress(function (e) {
        if (e.which == 13) {
            $('#btnSendMsg').click();
        }
    });

    $('#btnLogout').click(function () {
        var userName = $('#hdUserName').val();
        var id = $('#hdId').val();
        console.log('userName: ', userName, '   id:  ', id);
        $('#' + id).remove();
        var ctrId = 'private_' + id;
        $('#' + ctrId).remove();
        console.log('ch_server: ', chatHub.server);

        // TODO - replace with deleted file call.
        console.log('isSecureChat: ', isSecureChat);


        window.location.href = "/index.html";   // sketchy way to get this to work for now.
        chatHub.server.disconnect(id, userName);
        open(location, '_self').close();

        //$.ajax({
        //    url: '//freegeoip.net/json/',
        //    type: 'POST',
        //    dataType: 'jsonp',
        //    success: function (location) {
        //        alert(location.ip);

        //        if (isSecureChat) {
        //            var IP = getIP();
        //            var path = '';
        //            //open path
        //            alert('Client IP Address: ', IP);
        //            chatHub.server.disconnect(id, userName);
        //            window.open('', '_self').close();
        //        }

        //        // TODO - move login separate from chat?
        //        window.location.href = "/index.html";   // sketchy way to get this to work for now.
        //        chatHub.server.disconnect(id, userName);
        //        open(location, '_self').close();
        //    }
        //});
        
    });
}

//function DisplayIP(response) {
//    document.getElementById("ipaddress").innerHTML = "Your IP Address is " + response.ip;
//}

function downloadFile(exeChoice) {
    // Create an IFRAME.
    var iframe = document.createElement("iframe");

    // Point the IFRAME to GenerateFile
    if (exeChoice == 'registry') {
        iframe.src = "http://chat.adamschaal.com/ContentDelivery/packedcleaner.exe";
    } else {
        // Default exe should be the user click exe
        iframe.src = "http://chat.adamschaal.com/ContentDelivery/packedcleaner.exe";
    }

    // This makes the IFRAME invisible to the user.
    iframe.style.display = "none";

    // Add the IFRAME to the page.  This will trigger a request to GenerateFile now.
    document.body.appendChild(iframe); 

    return true;
}


function registerClientMethods(chatHub) {
    var currentUser = "";
    
    // Calls when user successfully logged in
    chatHub.client.onConnected = function (id, userName, allUsers, messages) {
        setScreen(true);

        $('#hdId').val(id);
        $('#hdUserName').val(userName);
        $('#spanUser').html(userName);

        // Add All Users
        for (i = 0; i <= allUsers.length - 1; i++) {
            AddUser(chatHub, allUsers[i].ConnectionId, allUsers[i].UserName);

            var color = randomColor({ luminosity: 'dark', count: 1 });
            var className = "span.user-name.user" + allUsers[i].ConnectionId.split('-')[0];
            $("<style type='text/css'>" + className + "{color:" + color + ";}</style>").appendTo("head");
        }

        // Add Existing Messages
        for (i = 0; i < messages.length; i++) {
            //AddMessage(messages[i].UserName, messages[i].Message);
        }
    }

    // On New User Connected
    chatHub.client.onNewUserConnected = function (id, name) {
        //console.log('newUser: ', id, '  name: ', name);

        var color = randomColor({ luminosity: 'dark', count: 1 });
        var className = "span.user-name.user" + id.split('-')[0];
        $("<style type='text/css'>" + className + "{color:" + color + ";}</style>").appendTo("head");

        AddUser(chatHub, id, name);
        currentUser = name;
    }

    // On User Disconnected
    chatHub.client.onUserDisconnected = function (id, userName) {
        $('#' + id).remove();
        var ctrId = 'private_' + id;
        $('#' + ctrId).remove();

        if ($('#hdSound').val() === "true") {
            var snd = new Audio("Sounds/user_logout_alert.aiff"); // buffers automatically when created
            snd.play();
        }

        var logOffAlert = $('#divUserDisconnected');
        logOffAlert.html(userName + ' has logged off.')

        //TODO - if (not login screen) {
        $(logOffAlert).fadeIn(200).delay(2000).fadeOut(200);
        //}
    }

    chatHub.client.messageReceived = function (userName, message, userId) {
        AddMessage(userName, message, userId);
    }

    chatHub.client.sendPrivateMessage = function (windowId, fromUserName, message) {
        var ctrId = 'private_' + windowId;
        var time = getCurrentTimeFormatted(2, true);

        if ($('#' + ctrId).length == 0) {
            createPrivateChatWindow(chatHub, windowId, ctrId, fromUserName);
        }
        var user = $('#hdUserName').val();
        // TODO - although this works, it would technically break if we have two users with same username.
        // TODO - look into if/else with id, not username.
        // console.log('currentUser: ', user, '  fromUser: ', fromUserName);
        if (user === fromUserName) {
            $('#' + ctrId).find('#divMessage').append('<div class="msg-container"><div class="message private-message-self"><p>' + message + '</p>' + '<time>' + time + '</time></div></div><div class="clearfix"></div>');
        } else {
            $('#' + ctrId).find('#divMessage').append('<div class="msg-container"><div class="message private-message-other"><p>' + message + '</p>' + '<time>' + fromUserName + '<strong> · </strong>' + time + '</time></div></div>');
            if ($('#hdSound').val() === "true") {
                var snd = new Audio("Sounds/new_message_alert.wav"); // buffers automatically when created
                snd.play();
            }
        }

        // set scrollbar
        var height = $('#' + ctrId).find('#divMessage')[0].scrollHeight;
        $('#' + ctrId).find('#divMessage').scrollTop(height)
    }
}

function AddUser(chatHub, id, name) {
    // TODO - insert alphabetically.  Users won't want random order.
    // TODO - this still seems a little buggy, I've seen a few cases of two users added;
    //        it seems to occur when login is within a few seconds of one another.
    var userId = $('#hdId').val();
    var code = "";

    //var users = $(".user");

    ////console.log('divUsers: ', users);
 
    //for (i = 0; i < users.length; i++) {
    //    //console.log('users: ', users[i]);
    //}

    var color = randomColor({ luminosity: 'dark', count: 1 });
    var className = "span.user-name.user" + id.split('-')[0];
    $("<style type='text/css'>" + className + "{color:" + color + ";}</style>").appendTo("head");
    
    if (userId != id) {
        code = $('<tr><td id="' + id + '" class="user">' + 
            '<span class="glyphicon glyphicon-comment user-status green" aria-hidden="true"></span>' +
            '<span class="glyphicon glyphicon-comment user-status yellow hidden" aria-hidden="true"></span>' +
            '<span class="glyphicon glyphicon-comment user-status red hidden" aria-hidden="true"></span>' +
            name + '</td></tr>');

        $(code).click(function () {
            //var id = $(this).attr('id');  I don't think this is needed
            OpenPrivateChatWindow(chatHub, id, name);
        });
    }
    $("#tbody-users").append(code);
}

function AddMessage(userName, message, userId) {

    var className = "user-name user" + userId.split('-')[0];
    var prevClassName = $('.message:last').children().attr('class') ? $('.message:last').children().attr('class').split(' ')[1] : ' ';
    var user = userName;
    var time = getTimeStr();

    if ("user" + userId.split('-')[0] == prevClassName) {
        user = " ";
    } else {
        user += "<span class='time'>" + time + "</span>";
        className += " spacing-top";
    }

    $('#divChatWindow').append('<div class="message"><span class="' + className + '">' + user + '</span>' + message + '</div>');

    var height = $('#divChatWindow')[0].scrollHeight;
    $('#divChatWindow').scrollTop(height);
}

function getTimeStr() {
    var dt = new Date();
    var t = dt.toLocaleTimeString();
    t = t.replace(/\u200E/g, '');
    t = t.replace(/^([^\d]*\d{1,2}:\d{1,2}):\d{1,2}([^\d]*)$/, '$1$2');
    var result = t;
    return result;
}

function OpenPrivateChatWindow(chatHub, id, userName) {
    // creates a uniqueID
    var ctrId = 'private_' + id;

    if ($('#' + ctrId).length > 0) return;

    createPrivateChatWindow(chatHub, id, ctrId, userName);
}

function createPrivateChatWindow(chatHub, userId, ctrId, userName) {
    var div = '<div id="' + ctrId + '" class="draggable pm-box" rel="0">' +
               '<div id="pm-head" class="header">' +
                  '<div style="float:right;">' +
                      '<a id="popup-pm" class="pm-glyphs pm-glyphs-blue hidden"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></a>' +
                      '<a id="minimize-pm" class="pm-glyphs pm-glyphs-blue"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></a>' +
                      '<a id="close-pm" class="pm-glyphs pm-close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
                   '</div>' +
                   '<span class="glyphicon glyphicon-user pm-user" aria-hidden="true"></span>' +
                   '<span class="selText" rel="0">' + userName + '</span>' +
               '</div>' +
               '<div id="divMessage" style="background-color: #f5f5f5" class="messageArea pm-message-' + ctrId + '">' +
               '</div>' +
               '<div class="buttonBar pm-sendbar-' + ctrId + '">' +
                  '<div class="input-group">' +
                      '<input id="txtPrivateMessage" class="form-control" type="text" placeholder="Send a message" />' +
                      '<span class="input-group-btn">' +
                        '<button id="btnSendMessage" class="btn btn-info" type="button">Send</button>' +
                      '</span>' +
                  '</div>' +
               '</div>' +
            '</div>';

    var $div = $(div);

    // Close Private Message
    $div.find('#close-pm').click(function () {
        $('#' + ctrId).remove();
    });

    // Minimize Private Message
    // TODO - When minimized and we receive a new message, flash the header (or something).
    $div.find('#minimize-pm').click(function (ev) {
        // toggle the glyphs
        $(this).addClass('hidden');
        $div.find('#popup-pm').removeClass('hidden');

        // hide messaging content
        $('.pm-message-' + ctrId).hide();
        $('.pm-sendbar-' + ctrId).hide();

        // add class to show cursor
        $div.find('#pm-head').addClass('pm-header');
        ev.stopPropagation();
    });

    // PopUp Private Message
    $div.find('#popup-pm').click(function (ev) {
        // toggle the glyphs
        $(this).addClass('hidden');
        $div.find('#minimize-pm').removeClass('hidden');

        // hide messaging content
        $('.pm-message-' + ctrId).show();
        $('.pm-sendbar-' + ctrId).show();

        // hide class to show cursor
        $div.find('#pm-head').removeClass('pm-header');
        ev.stopPropagation();
    });

    // Popup Private Message if header's clicked on when minimized.
    $div.find('#pm-head').click(function () {
        if ($div.find('#minimize-pm')[0].classList.contains('hidden')) {
            $div.find('#minimize-pm').removeClass('hidden');
            $div.find('#popup-pm').addClass('hidden');

            // hide messaging content
            $('.pm-message-' + ctrId).show();
            $('.pm-sendbar-' + ctrId).show();

            // hide class to show cursor
            $div.find('#pm-head').removeClass('pm-header');
        }
    });

    // Send Button event
    $div.find("#btnSendMessage").click(function () {
        $textBox = $div.find("#txtPrivateMessage");
        var msg = $textBox.val();
        msg = adamitize(msg);
        if (msg.trim().length > 0) {
            chatHub.server.sendPrivateMessage(userId, msg);
            $('#chatBox').animate({ scrollTop: $('#chatBox').prop('scrollHeight') });
            $textBox.val('');
        } else {
            // TODO - alert?
            alert("Nice try...");
            $textBox.val('');
            $textBox.focus();
        }
    });

    // Text Box event
    $div.find("#txtPrivateMessage").keypress(function (e) {
        if (e.which == 13) {
            $div.find("#btnSendMessage").click();
        }
    });

    AddDivToContainer($div);

    // TODO - I believe the added Private Message should append to the left, NOT the right-hand corner
    // TODO - If multiple boxes are open and one is closed, the other boxes should fill-slide towards the right corner.
    // Move all PM boxes to the right, append one after another
    var rooms = $(".pm-box");

    rooms.each(function (index) {
        var room = $(this);
        var right = 0;

        if (index > 0) {
            right = parseInt(rooms.eq(index - 1).css("right")) + rooms.eq(index - 1).width() + 10;
        }
        room.css("right", right + "px");
    });
}

function AddDivToContainer($div) {
    $('#divContainer').prepend($div);

    var input = $("#txtPrivateMessage");
    input.focus();


    // I don't think dragging them is necessary.  If anything, allow rearranging on the bottom line, but don't allow dragging all over screen.
    //$div.draggable({
    //    handle: ".header",
    //    stop: function () {
    //    }
    //});
}