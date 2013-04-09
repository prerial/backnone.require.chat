define([
    'jquery',
    'application'
], function ($, App) {

    return function () {
        var _this = this;
        var arg = arguments[0];
        var websocket = null;
        var userid = arg.userid;
        var wsUri = arg.url;
        var useStatus = arg.useStatus;
        var blnConnected = false;

        this.initialize = function () {
            try {
                websocket = new WebSocket(wsUri);
                websocket.onopen = function (evt) { onOpen(evt) };
                websocket.onclose = function (evt) { onClose(evt) };
                websocket.onmessage = function (evt) { onMessage(evt) };
                websocket.onerror = function (evt) { onError(evt) };
                blnConnected = true;
            } catch (ex) {
                console.log("Browser does not support Web socket");
            }
        };
        var keyUp = function (e) {
            if (e.keyCode === 13) {
                doSendOnClick();
            }
        };
        var onOpen = function (evt) {
            console.log('User ' + userid + " CONNECTED");
            if (useStatus) $("#webSocketStatus").html('User ' + userid + " CONNECTED");
            App.chat.models.UserContact.set('presence', 'online');
            var msg = JSON.stringify({ type: 'update', action: 'updatePresence', chid: userid, presence: "online" });
            _this.doSend(msg);
        };
        var onClose = function () {
            console.log('DISCONNECTED');
            if (useStatus) $("#webSocketStatus").html("DISCONNECTED");
            App.chat.models.UserContact.set('presence', 'offline');
//            App.eventManager.trigger("updatePresence", App.chat.models.UserContact.attributes);
            blnConnected = false;
        };
        var onMessage = function (evt) {
            if (blnConnected) {
                App.eventManager.trigger("serverMessage", { data: evt.data });
            }
        };
        var onError = function (evt) {
            if (blnConnected) {
                console.log('ERROR');
                if (useStatus) $("#webSocketStatus").html("ERROR");
            }
        };
        this.doSend = function (msg) {
            if (blnConnected) {
                websocket.send(msg);
            }
        };
        this.close = function () {
            $('input#sendMessage').blur();
            onClose();
        };
    };
});

