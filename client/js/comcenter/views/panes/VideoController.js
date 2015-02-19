define([
    'jquery',
    'backbone',
    'underscore',
    'utils',
    'application', 'socketio',
    'views/Dialog',
    'text!comcenter/templates/panes/video.html'
], function ($, Backbone, _, Utils, App, SocketIO, Dialog, Tpl) {

    return Backbone.View.extend({

        events: function () {
            return App.isiPad ?
            {
                "touchstart #btn-video-add": "openSession",
                "touchstart #btn-video-stop": "stopVideoCall"
            } :
            {
                "click #btn-video-mute": "toggleVideo",
                "click #btn-audio-mute": "toggleAudio",
                "click #btn-video-add": "openSession",
                "click #btn-video-stop": "stopVideoCall"
            }
        },

        initialize: function () {
            var _this = this;
            _.bindAll(this, 'render');
            App.video.videoSocket = new NodeWebSocket({
                websocket: SocketIO,
                evt:'video',
                channel: 'prerial-video',
                userid: App.chat.models.UserContact.get('chid'),
                onmessage: this.workflow,
                scope: this
            });
/*
            App.video.videoSocket = new WebSocket({
                channel: 'prerial-video',
                userid: App.chat.models.UserContact.get('chid'),
                onmessage: this.workflow,
                scope: this
            });
*/
            App.eventManager.on('startVideoCall', this.openSession, this);
            App.eventManager.on('setPresence', this.setPresence, this);
            App.eventManager.on('joinSession', this.joinSession);
            App.eventManager.on('startSession', this.startSession);
            App.eventManager.on('removeCall', this.removeCall);
            this.render();
        },

        removeCall: function () {
            App.video.videoSocket.send({
                type: 'cancelcall',
                sessionid: App.video.videoRoom.sessionid,
                contact: App.video.videoRoom.user,
                user: App.video.videoRoom.targetUser
            });
            $("#btn-video-add").removeClass('disabled')
        },

        workflow: function (response) {
            var _this = this;
            var arg = arguments[0];
            if (response.type) {
                switch (response.type) {
                    case 'cancelcall':
                        if(InviewApp.Config.Dialogs.Invite !== null) InviewApp.Config.Dialogs.Invite.close();
                        $("#btn-video-add").removeClass('disabled');
                        if(App.chat.models.UserContact.attributes.chid === response.user){
                            $('#btn-video-stop').click();
                        }
                        break;
                    case 'videooffer':
                        if (!App.video.moderator) {
                            console.debug('Received Offer: ', response.sdp);
                            response.type = 'offer';
                            var sessionDescription = new RTCSessionDescription(response);
                            App.video.videoRoom.peers[App.video.videoRoom.user].setRemoteDescription(sessionDescription);
                            App.video.videoRoom.doAnswer();
                        }
                        break;
                    case 'videoanswer':
                        if (App.video.moderator) {
                            console.debug('Received Answer: ', response.sdp);
                            response.type = 'answer';
                            App.video.videoRoom.peers[App.video.videoRoom.user].setRemoteDescription(new RTCSessionDescription(response));
                        }
                        break;
                    case 'videocandidate':
                        var candidate = new RTCIceCandidate({ sdpMLineIndex: response.label, candidate: response.candidate });
                        App.video.videoRoom.peers[App.video.videoRoom.user].addIceCandidate(candidate);
                        break;
                    case 'videohangup':
                        if (response.mode === 'window') {
                            App.video.videoRoom.onRemoteHangup();
                            App.eventManager.trigger('setPresence', 'offline', 'window');
                        } else if (response.mode === 'local') {
                            if (!App.video.moderator) {
                                App.video.videoRoom.onRemoteHangup();
                            }
                            App.eventManager.trigger('setPresence', 'online');
                        } else {
                            App.video.videoRoom.onRemoteHangup();
                            App.eventManager.trigger('setPresence', 'online');
                        }
                        $("#btn-video-add").removeClass('disabled');
                        break;
                    case 'localVideoStreamStarted':
                        if (InviewApp.Config.User.chid !== response.targetUser) {
                            App.video.videoRoom.call({
                                sessionid: response.sessionid,
                                user: response.user,
                                targetUser: response.targetUser
                            });
                        }
                        break;
                    case 'startVideoContact':
                        if (InviewApp.Config.User.chid === response.user) {
                            if (!App.video.moderator) {
                                console.debug("Start Contact" + response.user);
                                $('.modeVideo').click();
                            }
                            App.video.videoRoom.start({
                                sessionid: App.video.videoRoom.sessionid,
                                user: response.user,
                                targetUser: response.targetUser
                            });
                            App.eventManager.trigger('setPresence', 'busy');
                        }
                        break;
                    case 'videopermission':
                        if (response.permission) {
                            if (App.video.moderator && !App.video.started && App.chat.models.UserContact.get('chid') === response.user) {
                                App.video.moderator = true;
                                this.scope.startSession({ user: response.user, contact: response.contact });
                                App.video.started = true;
                                App.eventManager.trigger('setPresence', 'busy');
                            }
                        } else {
                            if (App.video.moderator) {
                                var cView = new Dialog({ mode: 'alert', text: 'Invitatiobn to join Video Call was declined!' });
                                var dialog = InviewApp.Config.Dialogs.Invite = Utils.createDialog({ view: cView });
                                dialog.open();
                            }
                        }
                        break;
                    case 'videoinvite':
                        var dialog = null;
                        this.closeDialog = function () {
                            dialog.close();
                        };
                        if (InviewApp.Config.User.chid !== response.user && InviewApp.Config.User.chid === response.contact) {
                            var cView = new Dialog({ scope: this, mode: 'confirm', text: 'Do you want to join Video Call?', callback: function (par) {
                                    this.scope.closeDialog();
                                    App.video.videoRoom.sessionid = response.sessionid;
                                    App.video.videoSocket.send({
                                        type: 'videopermission',
                                        sessionid: response.sessionid,
                                        contact: response.contact,
                                        user: response.user,
                                        permission: par
                                    });
                                    $("#btn-video-add").addClass('disabled');
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
            if(!$("#btn-video-add").hasClass('disabled')){
                App.video.videoRoom.user = App.user.chid;
                App.video.videoRoom.sessionid = getToken();
                App.video.started = false;
                App.video.videoRoom.miniMediaContainer = $('#mini-media-stream');
                App.video.videoRoom.localMediaContainer = $('#local-media-stream');
                App.video.videoRoom.remoteMediaContainer = $('#remote-media-streams');
                var contact = App.chat.conversations.active;
                var presence = contact !== null ? App.chat.ContactList[contact].presence : '';
                App.video.videoRoom.targetUser = contact;
                if (contact !== null && presence === 'online') {
                    if (!App.video.moderator) App.video.moderator = true;
                    App.video.videoSocket.send({
                        type: 'videoinvite',
                        sessionid: App.video.videoRoom.sessionid,
                        contact: contact,
                        user: App.video.videoRoom.user
                    });
                    $("#btn-video-add").addClass('disabled')
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

        stopVideoCall: function () {
            App.video.videoRoom.hangup();
            $("#btn-video-add").removeClass('disabled')
        },

        startSession: function () {
            App.video.videoRoom.user = App.user.chid;
            App.video.videoRoom.start({
                sessionid: App.video.videoRoom.sessionid,
                user: App.chat.models.UserContact.attributes.chid,
                targetUser: App.chat.conversations.active
            });
        },

        gotLocalStream: function (stream) {
            console.debug('Video Room: ', App.video.videoRoom);
            console.log("Received local stream");
            localVideo = $('#localVideo')[0];
            remoteVideo = $('#remoteVideo')[0];
            miniVideo = $('#miniVideo')[0];
            $('#local-media-stream')[0].style.opacity = 1;
            localVideo.src = URL.createObjectURL(stream);
            App.video.videoRoom.localStream = stream;
            if (App.video.moderator) {
                App.video.videoSocket.send({
                    type: 'startVideoContact',
                    sessionid: App.video.videoRoom.sessionid,
                    user: App.chat.conversations.active,
                    targetUser: App.chat.models.UserContact.attributes.chid
                });
            } else {
                App.video.videoSocket.send({
                    type: 'localVideoStreamStarted',
                    sessionid: App.video.videoRoom.sessionid,
                    contact: App.video.videoRoom.user,
                    user: App.video.videoRoom.targetUser
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

        toggleVideo: function () {
            App.video.videoRoom.toggleVideoMute();
        },

        toggleAudio: function () {
            App.video.videoRoom.toggleAudioMute();
        },

        render: function () {
            console.log("render chatVideo");
            var template = _.template(Tpl);
            $(this.el).html(template);
            return this;
        }
    });
});

