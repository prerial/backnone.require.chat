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
            /*
            var channel = _socket.channel;
            var dataRef = new window.Firebase('https://chat.firebaseIO.com/' + channel);
            dataRef.channel = channel;
            dataRef.on('child_added', function (data) {
            _socket.onmessage(data.val());
            });
            dataRef.send = function (data) {
            this.push(data);
            };
            if (_socket.isInitiator === true) {
            console.log('WebSocket channel removed: ' + channel)
            dataRef.onDisconnect().remove();
            }
            if (_socket.onopen) setTimeout(_socket.onopen, 1);
            console.log('WebSocket Socket: ' + channel)
            return dataRef;
            debugger
            */
            try {
                //               websocket = new WebSocket(wsUri);
                //                websocket = new window.Firebase('https://chat.firebaseIO.com/' + channel);
                websocket = new window.Firebase(wsUri);
                websocket.limit(10).on('child_added', function (data) {
                    onMessage(data.val());
                });
                websocket.send = function (data) {
                    this.push(data);
                };
                websocket.onopen = function (evt) { onOpen(evt) };
                websocket.onclose = function (evt) { onClose(evt) };
                //                websocket.onmessage = function (evt) { onMessage(evt) };
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
		console.debug('Update presence: online' + ' Id: ' + App.chat.models.UserContact.attributes.chid);
            //            if (useStatus) $("#webSocketStatus").html('User ' + userid + " CONNECTED");
            App.chat.models.UserContact.set('presence', 'online');
//            var msg = JSON.stringify({ type: 'update', action: 'updatePresence', chid: userid, presence: "online" });
            _this.doSend(msg);
        };
        var onClose = function () {
            console.log('DISCONNECTED');
            //            if (useStatus) $("#webSocketStatus").html("DISCONNECTED");
		console.debug('Update presence: offline' + ' Id: ' + App.chat.models.UserContact.attributes.chid);
            App.chat.models.UserContact.set('presence', 'offline');
            //            App.eventManager.trigger("updatePresence", App.chat.models.UserContact.attributes);
            blnConnected = false;
        };
        var onMessage = function (evt) {
            if (blnConnected) {
                App.eventManager.trigger("serverMessage", { data: evt });
                //                App.eventManager.trigger("serverMessage", { data: evt.data });
            }
        };
        var onError = function (evt) {
            if (blnConnected) {
                console.log('ERROR');
                //                if (useStatus) $("#webSocketStatus").html("ERROR");
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

