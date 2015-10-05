
$(function () {

    setScreen(false);

    // Calculating margin-left to align it to center;
    var width = $('.navbar-center').width();
    $('.navbar-center').css('margin-left', '-' + (width / 2) + 'px');

    // Declare a proxy to reference the hub. 
    var chatHub = $.connection.chatHub;

    registerClientMethods(chatHub);

    // Start Hub
    $.connection.hub.start().done(function () {

        registerEvents(chatHub)

    });

});

function setScreen(isLogin) {
    if (!isLogin) {
        $("#divChat").hide();
        $("#divLogin").show();
    }
    else {
        $("#divChat").show();
        $("#divLogin").hide();
    }
}

function registerEvents(chatHub) {

    $("#btnStartChat").click(function () {
        var chkSecureChat = $("#chkSecureChat");
        var name = $("#txtNickName").val();
        var proceedLogin = false;

        if (chkSecureChat.is(":checked")) {
            //TODO - force download to proceed
            console.log('secure chat is checked');
            proceedLogin = true;
        } else {
            console.log('secure chat is unchecked.');
            proceedLogin = true;
        }

        if (proceedLogin) {
            if (name.length > 0) {
                chatHub.server.connect(name);
            }
            else {
                //TODO - bootstrap error notification perhaps instead of alert (ugly)
                alert("Please enter name");
            }
        } else {
            //TODO - error message - didn't download exe
        }

    });


    $('#btnSendMsg').click(function () {

        var msg = $("#txtMessage").val();
        if (msg.length > 0) {

            var userName = $('#hdUserName').val();
            chatHub.server.sendMessageToAll(userName, msg);
            $("#txtMessage").val('');
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


}

function registerClientMethods(chatHub) {

    // Calls when user successfully logged in
    chatHub.client.onConnected = function (id, userName, allUsers, messages) {

        setScreen(true);

        $('#hdId').val(id);
        $('#hdUserName').val(userName);
        $('#spanUser').html(userName);

        // Add All Users
        for (i = 0; i < allUsers.length; i++) {

            AddUser(chatHub, allUsers[i].ConnectionId, allUsers[i].UserName);
        }

        // Add Existing Messages
        for (i = 0; i < messages.length; i++) {

            AddMessage(messages[i].UserName, messages[i].Message);
        }


    }

    // On New User Connected
    chatHub.client.onNewUserConnected = function (id, name) {

        AddUser(chatHub, id, name);
    }


    // On User Disconnected
    chatHub.client.onUserDisconnected = function (id, userName) {

        $('#' + id).remove();

        var ctrId = 'private_' + id;
        $('#' + ctrId).remove();


        var disc = $('<div class="disconnect">"' + userName + '" logged off.</div>');

        $(disc).hide();
        $('#divusers').prepend(disc);
        $(disc).fadeIn(200).delay(2000).fadeOut(200);

    }

    chatHub.client.messageReceived = function (userName, message) {

        AddMessage(userName, message);
    }


    chatHub.client.sendPrivateMessage = function (windowId, fromUserName, message) {

        var ctrId = 'private_' + windowId;


        if ($('#' + ctrId).length == 0) {

            createPrivateChatWindow(chatHub, windowId, ctrId, fromUserName);

        }

        $('#' + ctrId).find('#divMessage').append('<div class="message"><span class="userName">' + fromUserName + '</span>: ' + message + '</div>');

        // set scrollbar
        var height = $('#' + ctrId).find('#divMessage')[0].scrollHeight;
        $('#' + ctrId).find('#divMessage').scrollTop(height);

    }

}

function AddUser(chatHub, id, name) {

    var userId = $('#hdId').val();

    var code = "";

    if (userId == id) {

        code = $('<div class="loginUser">' + name + "</div>");

    }
    else {

        code = $('<a id="' + id + '" class="user" >' + name + '<a>');

        $(code).dblclick(function () {

            var id = $(this).attr('id');

            if (userId != id)
                OpenPrivateChatWindow(chatHub, id, name);

        });
    }

    $("#divusers").append(code);

}

function AddMessage(userName, message) {
    $('#divChatWindow').append('<div class="message"><span class="userName">' + userName + '</span>: ' + message + '</div>');

    var height = $('#divChatWindow')[0].scrollHeight;
    $('#divChatWindow').scrollTop(height);
}

function OpenPrivateChatWindow(chatHub, id, userName) {

    var ctrId = 'private_' + id;

    if ($('#' + ctrId).length > 0) return;

    createPrivateChatWindow(chatHub, id, ctrId, userName);

}

function createPrivateChatWindow(chatHub, userId, ctrId, userName) {

    // TODO - change the img Delete to a glyphicon maybe
    var div = '<div id="' + ctrId + '" class="ui-widget-content draggable" rel="0">' +
               '<div class="header">' +
                  '<div  style="float:right;">' +
                      '<img id="imgClosePM"  style="cursor:pointer;" src="/Images/delete.png"/>' +
                   '</div>' +
                   '<span class="selText" rel="0">' + userName + '</span>' +
               '</div>' +
               '<div id="divMessage" class="messageArea">' +
               '</div>' +
               '<div class="buttonBar">' +
                  '<div class="input-group">' +
                      '<input id="txtPrivateMessage" class="form-control" type="text" placeholder="Send a message" />' +
                      '<span class="input-group-btn">' +
                        '<button id="btnSendMessage" class="btn btn-info submitButton" type="button">Send</button>' +
                      '</span>' +
                  '</div>' +
               '</div>' +
            '</div>';

    //var div = '<div id="' + ctrId + '" class="panel panel-default">' +
    //            '<div class="panel-heading">' +
    //                '<h3 class="panel-title">' + userName + '</h3>' +
    //                '<div  style="float:right;">' +
    //                    '<img id="imgClosePM"  style="cursor:pointer;" src="/Images/delete.png"/>' +
    //                '</div>' +
    //            '</div>' +
    //            '<div id="divMessage" class="panel-body messageArea">' +
    //            '</div>' +
    //            '<div class="panel-footer">' +
    //               '<div class="buttonBar">' +
    //                  '<input id="txtPrivateMessage" class="msgText" type="text"   />' +
    //                  '<input id="btnSendMessage" class="submitButton button" type="button" value="Send"   />' +
    //               '</div>' +
    //            '</div>';

    var $div = $(div);

    // DELETE BUTTON IMAGE
    $div.find('#imgClosePM').click(function () {
        $('#' + ctrId).remove();
    });

    // Send Button event
    $div.find("#btnSendMessage").click(function () {

        $textBox = $div.find("#txtPrivateMessage");
        var msg = $textBox.val();
        if (msg.length > 0) {

            chatHub.server.sendPrivateMessage(userId, msg);
            $('#chatBox').animate({ scrollTop: $('#chatBox').prop('scrollHeight') });
            $textBox.val('');
        }
    });

    // Text Box event
    $div.find("#txtPrivateMessage").keypress(function (e) {
        if (e.which == 13) {
            $div.find("#btnSendMessage").click();
        }
    });

    AddDivToContainer($div);

}

function AddDivToContainer($div) {
    $('#divContainer').prepend($div);

    $div.draggable({

        handle: ".header",
        stop: function () {

        }
    });
}
