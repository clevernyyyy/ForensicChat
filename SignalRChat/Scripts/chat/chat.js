$(document).ready(function () {
});

$(function () {
    // this portion is responsible for the actions in the login box (bootstrap alerts)
    // it must be ready upon document load
    $('#chkSecureChat').change(function () {
        if (this.checked)
            $('#divSecureWarning').fadeIn('slow');
        else
            $('#divSecureWarning').slideUp('slow');
    });
    $("#warning-toc").click(function () {
        $('.alert-info').show()
    });
    $("[data-hide]").on("click", function () {
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });

    setScreen(false);

    // Calculating margin-left to align it to center;
    var width = $('.navbar-center').width();
    $('.navbar-center').css('margin-left', '-' + (width / 2) + 'px');

    // Declare a proxy to reference the hub. 
    var chatHub = $.connection.chatHub;

    registerClientMethods(chatHub);

    // Start Hub
    $.connection.hub.start().done(function () {
        registerEvents(chatHub);
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
    var isSecureChat = false;

    $("#btnStartChat").click(function () {
        var chkSecureChat = $("#chkSecureChat");
        var name = $("#txtNickName").val();
        var proceedLogin = false;

        if (chkSecureChat.is(":checked")) {
            // TODO - force download to proceed
            //console.log('secure chat is checked');
            isSecureChat = true;
            proceedLogin = true;
        } else {
            //console.log('secure chat is unchecked.');
            proceedLogin = true;
        }

        if (proceedLogin) {
            if (name.length > 0) {
                chatHub.server.connect(name);
            }
            else {
                // TODO - bootstrap error notification perhaps instead of alert (ugly)
                alert("Please enter name");
            }
        } else {
            // TODO - error message - didn't download exe
        }
    });

    $('#btnSendMsg').click(function () {
        var msg = $("#txtMessage").val();
        if (msg.length > 0) {
            var userName = $('#hdUserName').val();
            chatHub.server.sendMessageToAll(userName, msg, isSecureChat);
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
        $('#' + ctrId).find('#divMessage').scrollTop(height)
    }
}

function AddUser(chatHub, id, name) {
    // TODO - insert alphabetically.  Users won't want random order.
    // TODO - this still seems a little buggy, I've seen a few cases of two users added, but I've been unable to replicate.
    var userId = $('#hdId').val();
    var code = "";

    if (userId == id) {
        code = $('<div class="loginUser">' + name + "</div>");
    }
    else {
        code = $('<a id="' + id + '" class="user" >' + name + '<a>');

        $(code).click(function () {
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
    // creates a uniqueID
    var ctrId = 'private_' + id;

    if ($('#' + ctrId).length > 0) return;

    createPrivateChatWindow(chatHub, id, ctrId, userName);
}

function createPrivateChatWindow(chatHub, userId, ctrId, userName) {
    var div = '<div id="' + ctrId + '" class="draggable pm-box" rel="0">' +
               '<div class="header">' +
                  '<div style="float:right;">' +
                      '<a id="popup-pm" class="pm-glyphs pm-glyphs-blue hidden"><span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></a>' +
                      '<a id="minimize-pm" class="pm-glyphs pm-glyphs-blue"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></a>' +
                      '<a id="close-pm" class="pm-glyphs pm-close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
                   '</div>' +
                   '<span class="glyphicon glyphicon-user pm-user" aria-hidden="true"></span>' +
                   '<span class="selText" rel="0">' + userName + '</span>' +
               '</div>' +
               '<div id="divMessage" class="messageArea pm-message-' + ctrId + '">' +
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
    // TODO - When minimizing - ensure the browser doesn't feel the need to add a scrollbar. 
    // (i.e. - Don't minimize past the bottom of the browser.)
    $div.find('#minimize-pm').click(function () {
        // toggle the glyphs
        $(this).addClass('hidden');
        $div.find('#popup-pm').removeClass('hidden');

        // hide messaging content
        $('.pm-message-' + ctrId).hide();
        $('.pm-sendbar-' + ctrId).hide();
    });

    // PopUp Private Message
    $div.find('#popup-pm').click(function () {
        // toggle the glyphs
        $(this).addClass('hidden');
        $div.find('#minimize-pm').removeClass('hidden');

        // hide messaging content
        $('.pm-message-' + ctrId).show();
        $('.pm-sendbar-' + ctrId).show();
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

    // Move all PM boxes to the right, append one after another
    // TODO - I believe the added Private Message should append to the left, NOT the right-hand corner
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

    // I don't think dragging them is necessary.  If anything, allow rearranging on the bottom line, but don't allow dragging all over screen.
    //$div.draggable({
    //    handle: ".header",
    //    stop: function () {
    //    }
    //});
}
