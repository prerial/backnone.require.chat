define([
    'require',
    'jquery',
    'backbone',
    'underscore',
//    'slide',
    'utils',
    'application',
    'websocket',
    'views/Dialog',
    'comcenter/views/Contact',
    'comcenter/views/Toolbar',
    'comcenter/views/ContactList',
    'comcenter/views/contact/ContactGroupList',
    'comcenter/views/panes/Chat',
    'comcenter/views/panes/ChatGroup',
    'comcenter/views/panes/PhoneController',
    'comcenter/views/panes/VideoController',
    'comcenter/views/contact/ContactInfo',
    'comcenter/views/contact/ContactAdd',
    'comcenter/views/settings/Settings',
    'text!comcenter/templates/comcenter.html'
], function (require, $, Backbone, _, /*Slide, */Utils, App, Websocket, Dialog, Contact, Toolbar, ContactList, ContacGrouptList, ContactDisplay, ChatGroup, ChatPhone, ChatVideo, ContactInfo, ContactAdd, ChatSettings, PopUpTemplate) {

    var _this = this;
    return Backbone.View.extend({

        events: function () {
            return App.isiPad ? {
                "touchstart .contListButton": "showContactsEdit",
                "touchstart .chatCover": "hideChat",
                "touchstart .icon-settings": "showSettings"
            } : {
                "click #btn-audio-add": "startPhoneCall",
                "click #btn-video-add": "startVideoCall",
                "click .contListButton": "showContactsEdit",
                "click .chatCover": "hideChat",
                "click .icon-settings": "showSettings"
            }
        },

        startPhoneCall: function () {
            App.eventManager.trigger("startPhoneCall");
        },

        startVideoCall: function () {
            App.eventManager.trigger("startVideoCall");
        },

        initialize: function () {
            var _this = this;
            _.bindAll(this, 'render', 'showChat', 'hideChat');
            this.id = "comcenter-container";
            this.chatsettings = null;
            this.chatsettings_visible = false;
            this.websocket = null;
            App.eventManager.on("resize", this.resize);
            App.eventManager.on("showChat", this.showChat);
            App.eventManager.on("hideChat", this.hideChat);
            App.eventManager.on("hideAll", this.hideAll);
            App.eventManager.on("startConversation", this.startConversation, this);
            App.eventManager.on("serverMessage", this.onServerMessage, this);
            App.isiPad ? $('.chatCover').live("touchstart", this.hideChat) : $('.chatCover').live("click", this.hideChat);
            $('#sendMessage').live("keypress", function (evt) {
                if (evt.keyCode === 13) {
                    _this.doSendOnClick();
                }
            });
            App.eventManager.on('toolbarClick', this.onToolbarClick, this);
            App.eventManager.on('closeAllPopUps', this.closeAllPopUps, this);
            App.eventManager.on("toolbarClicked", this.onToolbarClicked);
            require(['text!comcenter/templates/comcenter_content.html'], function (loadedTmp) {
                _this.template = _.template(loadedTmp);
                _this.render();
//                App.chat.displaySlider = new Slide($('#chatDisplaySlider'));
            });
            $(window).on('resize', this.resize);
            $(window).on('beforeunload', function () {
                console.debug('Update presence: offline' + ' Id: ' + App.chat.models.UserContact.attributes.chid);
                App.chat.models.UserContact.set('presence', 'offline');
            });

        },
        resize: function () {
//			this.hideAll();
            var height = $(window).height() - (HEADER_HEIGHT + FOOTER_HEIGHT);
            $('.comcenter').height(height);
            $('.chat-pane-left').height(height-66);
            $('.contactGroupList').height(height - 100);
            $('#chatContacts, #chatGroupContacts').height(height - 220);
            $('#chatDisplaySlider').height(height-50);
            $('#chat-container, #video-container, #phone-container').height(height-136);
            $('#chat_display_holder,#chat_display_holder1').height(height-210);

            /*
             $('.comcenter, .work-container, .contacts-container').height(height);
             $('#contact-list-content').height(height - 120);
             $('.contact-info-container').height(height - 60);
             $('#video-panel-container').height(height - 60);

             //               this.hideAll();
             var height = $('#iv_app').height() - (App.HEADER_HEIGHT + App.BASELINE_HEIGHT);
             //                $('#contact-list-content').height(height - 120);
             //                $('#message-list-content').height(height - 170);
             //                $('#video-panel-container').height(height - 60);
             $('.chat, .chat-container, #video-container, #chatDisplaySlider').height(height);
             //               $('.contact, .contactList, #chatContacts, .contactGroupList').height(height-160);
             $('.contactGroupList').height(height - 160);
             $('#chatContacts').height(height - 160);
             $('.contactSearch').height(height - 140);

             console.log('Message Center height: ' + height);
             */
        },

        onToolbarClicked: function (evt) {
            if (arguments[0].type === 1) {
//                App.dialog.$el.find('ul').html(InviewApp.Config.Dialogs.EditGroupContacts);
                $('.contact-list-title').html('Group&nbsp;/&nbsp;Contact&nbsp;List');
                this.contactGroupList = new ContacGrouptList;
                $('.contactGroupList').html(this.contactGroupList.$el);
                $('.contact').addClass('flip');
                App.eventManager.trigger('resize');
            } else {
//                App.dialog.$el.find('ul').html(InviewApp.Config.Dialogs.EditContacts);
                $('.contact-list-title').html('Contact List');
                $('.contact').removeClass('flip');
            }
        },

        render: function () {
            $(this.el).append(this.template(this.id));
            App.chat.UserContact = new Contact({ displayonly: true, user: true, model: App.chat.models.UserContact });
            App.chat.UserContact.render();
            App.chat.UserContact.$el.width(250)//.css('border','1px solid red');
            $('.userContact').append(App.chat.UserContact.$el);
            var toolbar = new Toolbar;
            $('.chatToolbar').append(toolbar.$el);
            this.contactList = new ContactList;
            $('.contactList').append(this.contactList.$el);
            var chmodel = InviewApp.Utils.setContactModel(InviewApp.Config.InitContactData);
            var chat = new ContactDisplay({ model: chmodel });
            $('#chat-container').append(chat.$el);

//            var chatGroup = new ChatGroup();
//            $('#group-container').append(chatGroup.$el);

            var chatSettings = new ChatSettings();
            $('#chatSettings').append(chatSettings.$el);
            var contactInfo = new ContactInfo();
            $('#contactInfo').append(contactInfo.$el);
            var contactAdd = new ContactAdd();
            $('#contactAdd').append(contactAdd.$el);
            /*
             */
            var chatPhone = new ChatPhone();
            $('#phone-container').append(chatPhone.$el);
            /*
             App.audio.audioRoom = new Utils.audio('audio', 'local-audio-stream', 'remote-audio-streams');
             */
            App.audio.audioRoom = new Utils.mediaRoom({
                'type': 'audio',
                'localcontainer':  'local-audio-stream',
                'remotecontainer': 'remote-audio-streams',
                'minicontainer':   null
            });
            App.audio.audioRoom.initialize();
            App.audio.audioRoom.gotLocalStream = chatPhone.gotLocalStream;

            var chatVideo = new ChatVideo();
            $('#video-container').append(chatVideo.$el);
            App.video.videoRoom = new Utils.mediaRoom({
                'type': 'video',
                'localcontainer':  'local-media-stream',
                'remotecontainer': 'remote-media-streams',
                'minicontainer':   'mini-media-stream'
            });
            App.video.videoRoom.initialize();
            App.video.videoRoom.gotLocalStream = chatVideo.gotLocalStream;




            $('.comcenter').width(0);
            toolbar.hideAll();
            this.resize();
            App.chat.models.UserContact.set('presence', 'online');
            App.chat.DefaultContact = new Contact({ displayonly: true, user: false, model: App.chat.models.DefaultContact });
            App.eventManager.trigger("updateUser", App.chat.DefaultContact);
            return this;
        },

        onToolbarClick: function (evt) {
            $('.chat').width(750);
            $('.infoContact').hide();
            $('.deleteContact').hide();
            //           this.contactList.showedit = false;
            //           this.contactList.showinfo = false;
        },

        closeAllPopUps: function (evt) {
            if (App.dialog && App.dialog.$el) {
                App.dialog.$el.hide();
            }
        },

        showContactsEdit: function (evt) {
            App.dialog.$el.css('position', 'absolute').css('top', $(evt.target).offset().top + 32).css('left', $(evt.target).offset().left - 2);
            App.dialog.$el.show();
        },

        doSendOnClick: function () {
            if ($('#sendMessage').val() !== '' && App.chat.conversations.active) {
                var message = $('#sendMessage').val();
                var pre = $('<div class="bubble"></div>');
//                pre.css('word-wrap', 'break-word');
//                pre.css('color', '#666');
                pre.html("Me: " + message);
                App.chat.conversations.display[App.chat.conversations.active].popup.append(pre);
                App.chat.conversations.webSocket.doSend(JSON.stringify({ type: 'conversation', 'chidTo': App.chat.conversations.active, 'chidFrom': InviewApp.Config.User.chid, 'message': message }))
            }
            window.setTimeout(function () {
                $('#sendMessage').val('');
                $('#sendMessage').blur();
            }, 100);
        },

        hideSettings: function () {
            if (this.chatsettings !== null) {
                $('.chat-settings').hide();
                $('#chatSettings').hide();

                this.chatsettings_visible = false;
            }
        },

        hideAll: function () {
            $('#video-container').width(0);
        },

        showSettings: function () {
            App.eventManager.trigger("resetToolbar");
            if ($('.icon-settings').hasClass('selected') && App.chat.displaySlider.getPos() === 4) {
                $('.chatToolbar ul').find('div[idx=0]').addClass('selected');
                $('.icon-settings').removeClass('selected');
                App.chat.displaySlider.slide(0);
            } else {
                $('#chat-settings').width(400);
                $('#chatSettings').width(400);

//                App.chat.displaySlider.slide(4);
                $('.icon-settings').addClass('selected');
            }
        },

        onServerMessage: function () {
            var arg = arguments[0];
            var result = jQuery.parseJSON(arg.data);
            if (result.type) {
                switch (result.type) {
                    case 'getRemotePresence':
                        if (InviewApp.Config.User.chid === result.chid) {
                            var presence = App.chat.models.UserContact.get('presence');
                            App.chat.conversations.webSocket.doSend(JSON.stringify({ 'type': 'updatePresense', 'chid': App.chat.models.UserContact.attributes.chid, 'data': App.chat.models.UserContact.attributes }))
                            //                            App.chat.models.UserContact.set('presence', 'offline');
                            console.debug('Update presence: ' + presence + ' Id: ' + App.chat.models.UserContact.attributes.chid);
                            App.chat.models.UserContact.set('presence', presence);
                        }
                        break;
                    case 'sessionStarted':
                        App.video.videoRoom.sessionInitialized = true;
                        if (!App.video.moderator && App.video.videoRoom.sessionInitialized && App.chat.models.UserContact.get('chid') === result.contact) {
                            App.video.videoRoom.blnJoinedRoom = false;
                            App.video.videoRoom.isInitiator = false;
                            App.eventManager.trigger('joinSession', { user: result.user, contact: result.contact });
                            //                           App.video.videoRoom.blnJoinedRoom = true;
                            $('.chat').width(750);
                            $('#video-container').width(404);
                            $('#btn-video-add').hide();
                            $('#btn-audio-add').hide();
                            $('.contactList1').css('opacity', '1');
                            $('.contactList2').css('opacity', '0');
                        }
                        break;
                    case 'permission':
                        if (result.permission) {
                            if (App.video.moderator && !App.video.started && App.chat.models.UserContact.get('chid') === result.user) {
                                App.video.videoRoom.blnJoinedRoom = false;
                                App.eventManager.trigger('startSession', { user: result.user, contact: result.contact });
                                App.video.started = true;
                            }
                            /*
                             if (!App.video.moderator && App.video.videoRoom.sessionInitialized && App.chat.models.UserContact.get('chid') === result.contact) {
                             App.video.videoRoom.blnJoinedRoom = false;
                             App.video.videoRoom.isInitiator = false;
                             App.eventManager.trigger('joinSession', { user: result.user, contact: result.contact });
                             $('.chat').width(750);
                             $('#video-container').width(404);
                             $('#btn-video-add').hide();
                             $('.contactList1').css('opacity', '1');
                             $('.contactList2').css('opacity', '0');
                             }
                             */
                        } else {
                            if (App.video.moderator) {
                                var cView = new Dialog({ mode: 'alert', text: 'Invitatiobn to join Video Call was declined!' });
                                var dialog = Utils.createDialog({ view: cView });
                                dialog.open();
                            }
                        }
                        break;
                    case 'videoinvite':
                        var _this = this;
                        var dialog = null;
                        this.closeDialog = function () {
                            dialog.close();
                        };
                        if (InviewApp.Config.User.chid !== result.user && InviewApp.Config.User.chid === result.contact) {
                            var cView = new Dialog({ scope: _this, mode: 'confirm', text: 'Do you want to join Video Call?', callback: function (par) {
                                this.scope.closeDialog();
                                App.chat.conversations.webSocket.doSend(JSON.stringify({
                                    type: 'permission',
                                    sessionid: result.sessionid,
                                    contact: result.contact,
                                    user: result.user,
                                    permission: par
                                }));
                            }
                            });
                            dialog = Utils.createDialog({ view: cView });
                            dialog.open();
                        }
                        break;
                    case 'updatePresense':
                        try {
                            if (App.chat.ContactList[result.chid]) {
                                //                                App.chat.ContactList.presence = result.data.presence;
                                console.debug('Update presence: ' + result.data.presence + ' Id: ' + result.chid);
                                App.chat.ContactList[result.chid].model.attributes['presence'] = result.data.presence;
                                App.chat.ContactList[result.chid].el.find('.presence').removeClass('offline').removeClass('online').removeClass('busy').removeClass('away').addClass(result.data.presence);
                            }
                        } catch (ex) {
                        }
                        if(result.chid === App.chat.models.ContactDisplay.model.get('chid')){
                            App.chat.models.ContactDisplay.model.set('presence', result.data.presence);
                        }
                        break;
                    case 'updateContact':
                        try {
                            if (App.chat.ContactList[result.chid]) {
                                App.chat.ContactList[result.chid].model.set(result.data);
                            }
                        } catch (ex) {
                        }
                        try {
                            if (App.chat.ContactDisplay.model.get('chid') === result.chid) {
                                App.chat.ContactDisplay.model.set(result.data);
                            }
                        } catch (ex) {
                        }
                        break;
                    case 'update':
                        App.eventManager.trigger(result.action, { chid: result.chid, presence: result.presence });
                        break;
                    case 'start':
                        //                        if (InviewApp.Config.User.chid === result.chid) $('#chatNotification').html(result.message);
                        break;
                    case 'conversation':
                        if (InviewApp.Config.User.chid === result.chidTo) {
                            var pre = $('<div class="bubble bubble--alt"></div>');
//                            pre.css('word-wrap', 'break-word');
//                            pre.css('color', '#109E9C');
                            pre.html(App.chat.ContactList[result.chidFrom].title + ': ' + result.message);
                            console.log(result.message);
                            App.chat.conversations.display[result.chidFrom].popup.append(pre)
                        }
                        break;
                }
            }
        },

        startConversation: function (evt) {
            var arg = arguments[0];
            //           App.chat.slider.slide(arg.collection.indexOf(arg));
            App.chat.conversations.active = arg.attributes.chid;
            App.chat.conversations.activeContact = arg.attributes;
            App.chat.conversations.webSocket.doSend(JSON.stringify({ type: 'start', 'chid': arg.attributes.chid, message: 'Message from ' + InviewApp.Config.User.title }))
            App.eventManager.trigger("updateUser", arg.attributes);
        },

        showChat: function () {
            this.hidden = true;
            App.chat.visible = true;
            if(!$('.modeItem').hasClass('selected')){
                $('.chatToolbar').find('li')[0].click();
            }
            setTimeout(function(){
                $('.comcenter').width(750);
            },400);
//           $(this.el).append("<div class='chatCover'></div>");
        },

        hideChat: function () {
            this.closeAllPopUps();
            this.hideSettings();
            App.chat.visible = false;
            $('.chatCover').remove();
            $('#video-container').width(0);
            $('.comcenter').width(0);
            $('.modeItem').removeClass('selected');
        }
    });
});
