define([
    'jquery',
    'backbone',
    'underscore',
    'utils',
    'application', 'socketio',
    'views/Dialog',
    'text!comcenter/templates/panes/phone.html'
], function ($, Backbone, _, Utils, App, SocketIO, Dialog, Tpl) {

    var sessionid = null;
    var user = null;
    var contact = null;
    var sessionid = null;
    var user = null;
    function onRemoteDescriptionSuccess(){};
    function onRemoteDescriptionFailure(){
        var arg = arguments[0];
        console.debug('----- onRemoteDescriptionFailure:', arg);
    };

    return Backbone.View.extend({

        events: function () {
            return App.isiPad ?
            {
                "touchstart #btn-phone-add": "openSession",
                "touchstart #btn-phone-stop": "stopPhoneCall"
            } :
            {
                "click #btn-phone-add": "openSession",
                "click #btn-phone-stop": "stopPhoneCall"
            }
        },

        initialize: function () {
            var _this = this;
            _.bindAll(this, 'render');
            App.audio.audioSocket = new NodeWebSocket({
                websocket: SocketIO,
                evt:'audio',
                channel: 'prerial-audio',
                userid: App.chat.models.UserContact.get('chid'),
                onmessage: this.workflow,
                scope: this
            });
/*
            App.audio.audioSocket = new WebSocket({
                channel: 'prerial-audio',
                userid: App.chat.models.UserContact.get('chid'),
                onmessage: this.workflow,
                scope: this
            });
*/
            App.eventManager.on('startPhoneCall', this.openSession, this);
            App.eventManager.on('setPresence', this.setPresence, this);
            App.eventManager.on('joinSession', this.joinSession, this);
            App.eventManager.on('startSession', this.startSession, this);
            App.eventManager.on('removeCall', this.removeCall, this);
            this.render();
        },

        removeCall: function () {
            App.audio.audioSocket.send({
                type: 'cancelcall',
                sessionid: App.audio.audioRoom.sessionid,
                contact: App.audio.audioRoom.user,
                user: App.audio.audioRoom.targetUser
            });
            $("#btn-audio-add").removeClass('disabled')
        },

        workflow: function (response) {
            var _this = this;
            var arg = arguments[0];
console.debug('---------------response.type: ', response.type);
            if (response.type) {
                switch (response.type) {
                    case 'cancelcall':
                        if(InviewApp.Config.Dialogs.Invite !== null) InviewApp.Config.Dialogs.Invite.close();
                        $("#btn-audio-add").removeClass('disabled');
                        if(App.chat.models.UserContact.attributes.chid === response.user){
                            $('#btn-audio-stop').click();
                        }
                        break;
                    case 'audiooffer':
                        if (!App.audio.moderator) {
                            console.debug("Received Offer");
                            response.type = 'offer';
                            App.audio.audioRoom.peers[App.audio.audioRoom.user].setRemoteDescription(new RTCSessionDescription(response), onRemoteDescriptionSuccess, onRemoteDescriptionFailure);
                            App.audio.audioRoom.doAnswer();
                        }
                        break;
                    case 'audioanswer':
                        if (App.audio.moderator) {
                            console.debug("Received Answer");
                            response.type = 'answer';
                            var sesc = new RTCSessionDescription(response);
                            App.audio.audioRoom.peers[App.audio.audioRoom.user].setRemoteDescription(sesc, onRemoteDescriptionSuccess, onRemoteDescriptionFailure);
                        }
                        break;
                    case 'audiocandidate':
                        var candidate = new RTCIceCandidate({ sdpMLineIndex: response.label,
                            candidate: response.candidate
                        });
                        App.audio.audioRoom.peers[App.audio.audioRoom.user].addIceCandidate(candidate);
                        break;
                    case 'audiohangup':
                        if (response.mode === 'window') {
                            App.audio.audioRoom.onRemoteHangup();
                            App.eventManager.trigger('setPresence', 'offline');
                        } else if (response.mode === 'local') {
                            if (!App.audio.moderator) {
                                App.audio.audioRoom.onRemoteHangup();
                            }
                            App.eventManager.trigger('setPresence', 'online');
                        } else {
                            App.audio.audioRoom.onRemoteHangup();
                            App.eventManager.trigger('setPresence', 'online');
                        }
                        $("#btn-audio-add").removeClass('disabled');
                        break;
                    case 'localAudioStreamStarted':
                        if (InviewApp.Config.User.chid !== response.targetUser) {
                            App.audio.audioRoom.call({
                                sessionid: response.sessionid,
                                user: response.user,
                                targetUser: response.targetUser
                            });
                        }
                        break;
                    case 'startAudioContact':
                        if (InviewApp.Config.User.chid === response.user) {
                            if (!App.audio.moderator) {
                                console.debug("Start Contact" + response.user);
                                $('.modePhone').click();
                            }
                            App.audio.audioRoom.start({
                                sessionid: App.audio.audioRoom.sessionid,
                                user: response.user,
                                targetUser: response.targetUser
                            });
                            App.eventManager.trigger('setPresence', 'busy');
                        }
                        break;
                    case 'audiopermission':
                        if (response.permission) {
                            if (App.audio.moderator && !App.audio.started && App.chat.models.UserContact.get('chid') === response.user) {
                                App.audio.moderator = true;
                                this.scope.startSession({ user: response.user, contact: response.contact });
                                App.audio.started = true;
                                App.eventManager.trigger('setPresence', 'busy');
                            }
                        } else {
                            if (App.audio.moderator) {
                                var cView = new Dialog({ mode: 'alert', text: 'Invitatiobn to join Video Call was declined!' });
                                var dialog = InviewApp.Config.Dialogs.Invite = Utils.createDialog({ view: cView });
                                dialog.open();
                            }
                        }
                        break;
                    case 'audioinvite':
                        var dialog = null;
                        this.closeDialog = function () {
                            dialog.close();
                        };
                        if (InviewApp.Config.User.chid !== response.user && InviewApp.Config.User.chid === response.contact) {
                            var cView = new Dialog({ scope: this, mode: 'confirm', text: 'Do you want to join Audio Call?', callback: function (par) {
                                    this.scope.closeDialog();
                                    App.audio.audioRoom.sessionid = response.sessionid;
                                    App.audio.audioSocket.send({
                                        type: 'audiopermission',
                                        sessionid: response.sessionid,
                                        contact: response.contact,
                                        user: response.user,
                                        permission: par
                                    });
                                    $("#btn-audio-add").addClass('disabled');
                                    var user = App.chat.ContactListCollection.where({chid: response.user});
                                    App.chat.ContactList[user[0].attributes.chid].el[0].click();
                                    App.eventManager.trigger("showChat");
                                    snd.pause();
                                }
                            });
                            dialog = InviewApp.Config.Dialogs.Invite = Utils.createDialog({ view: cView });
                            dialog.open();
                            var snd = new Audio("../../sound/ringring.wav"); // buffers automatically when created
                            snd.loop = true;
                            snd.play();
                        }
                        break;
                }
            }
        },

        openSession: function () {
            if(!$("#btn-audio-add").hasClass('disabled')){
                user = App.user.chid;
                App.audio.started = false;
                App.audio.audioRoom.localMediaContainer = $('#local-media-stream');
                App.audio.audioRoom.remoteMediaContainer = $('#remote-media-streams');
                var contact = App.chat.conversations.active;
                var presence = contact !== null ? App.chat.ContactList[contact].presence : '';
                App.audio.audioRoom.sessionid = getToken();
                sessionid = App.audio.audioRoom.sessionid;
                App.audio.audioRoom.user = App.user.chid;
                App.audio.audioRoom.targetUser = contact;
                if (contact !== null && presence === 'online') {
                    if (!App.audio.moderator) App.audio.moderator = true;
                    App.audio.audioSocket.send({
                        type: 'audioinvite',
                        sessionid: App.audio.audioRoom.sessionid,
                        contact: contact,
                        user: user
                    });
                    $("#btn-audio-add").addClass('disabled')
                } else {
                    if (contact === null) {
                        var text = 'Please select Contact&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                    } else if (presence !== 'online') {
                        var text = 'Selected Contact is not Online&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                    }
                    var cView = InviewApp.Config.Dialogs.Invite = new Dialog({ mode: 'alert', text: text, callback: function (par) {
                    }
                    });
                    var dialog = InviewApp.Config.Dialogs.Invite = Utils.createDialog({ view: cView });
                    dialog.open();
                }
            }
        },

        stopPhoneCall: function () {
            App.audio.audioRoom.hangup();
            $("#btn-audio-add").removeClass('disabled')
        },

        startSession: function () {
            sessionid = 'prerial-1111111';
            user = App.user.chid;
            App.audio.audioRoom.start({
                sessionid: App.audio.audioRoom.sessionid,
                user: App.chat.models.UserContact.attributes.chid,
                targetUser: App.chat.conversations.active
            });
        },

        gotLocalStream: function (stream) {
            console.log("Received local stream");
            localVideo = $('#localPhone')[0];
            remoteVideo = $('#remotePhone')[0];
            localVideo.src = URL.createObjectURL(stream);
            App.audio.audioRoom.localStream = stream;
            if (App.audio.moderator) {
                App.audio.audioSocket.send({
                    type: 'startAudioContact',
                    sessionid: App.audio.audioRoom.sessionid,
                    user: App.chat.conversations.active,
                    targetUser: App.chat.models.UserContact.attributes.chid
                });
            } else {
                App.audio.audioSocket.send({
                    type: 'localAudioStreamStarted',
                    sessionid: App.audio.audioRoom.sessionid,
                    contact: App.audio.audioRoom.user,
                    user: App.audio.audioRoom.targetUser
                });
            }
        },

        setPresence: function (type) {
            console.debug('Update presence: ' + type + ' Id: ' + App.chat.models.UserContact.attributes.chid);
            App.chat.models.UserContact.attributes['presence'] = type;
            App.chat.conversations.webSocket.doSend(JSON.stringify({ 'type': 'updatePresense', 'chid': App.chat.models.UserContact.attributes.chid, 'data': App.chat.models.UserContact.attributes }))
            App.chat.UserContact.model.attributes['presence'] = type;
            $(App.chat.UserContact.el).find('.presence').removeClass('offline').removeClass('online').removeClass('busy').removeClass('away').addClass(type);
        },

        render: function () {
            console.log("render chatAudio");
            var template = _.template(Tpl);
            $(this.el).html(template);
            $("#btn-audio-add").on('click', this.openSession)
            return this;
        }
    });
});

