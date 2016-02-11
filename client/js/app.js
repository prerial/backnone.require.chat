define(['jquery', 'backbone', 'underscore', 'application', 'socketio', 'websocket', 'utils',
    'common/Config',
    'comcenter/models/Contact',
    'views/Dialog',
    'comcenter/ComCenter'
], function ($, Backbone, _, App, SocketIO, Websocket, Utils, Config, ContactModel, Dialog, ComCenter) {

    var _this = this;
    var initialize = function () {
        if (blnTest) {
            Appl = App;
        }
        App.authenticated = false;
        App.eventManager = _.extend({}, Backbone.Events);
        App.eventManager.on("authenticated", appWorkflow);
        App.eventManager.on("un-authenticated", appWorkflow);
        App.eventManager.on("serverMessage", checkAvalable);
        $('.topmenu_chat')[0].addEventListener('click', function () {
            openComCenter();
        }, false);
        /*********************** end Communication Center *********************/
        $(window).on('resize', function () {
            App.eventManager.trigger('app:resize');
        });
        App.root = $('body');
        var AppRouter = Backbone.Router.extend({
            routes: {
                "section/:place": "goToPlace",
                "*actions": "defaultRoute" // matches http://example.com/#anything-here
            }
        });
        var app_router = new AppRouter;
        app_router.on('route:goToPlace', function (place) {
            App.eventManager.trigger("authenticated", { 'type': 'authenticated', 'place': place });
            App.model.set("auth", true);
        });
        app_router.on('route:defaultRoute', function () {
            if (App.authenticated === false) {
                App.eventManager.trigger("un-authenticated", { 'type': 'login' });
            }
        });
        Backbone.history.start();
    };
    var checkAvalable = function () {
        var arg = arguments[0];
        var result = jQuery.parseJSON(arg.data);
        if (result && result.type && result.type === 'conversation') {
            if (!App.chat.visible) {
                App.chat.alerts[result.chidFrom] = result;
                App.eventManager.trigger('showAlert', true);
            }
        }
    };
    var openComCenter = function () {
        if (App.chat.visible) {
            setTimeout(function () {
                App.eventManager.trigger('hideChat');
            }, 100);
        } else {
            setTimeout(function () {
                App.eventManager.trigger('showChat');
                App.eventManager.trigger('hideAllPopUps');
            }, 100);
        }
//        console.log("clicked button Comcenter")
    };
    var removeCall = function () {
        setTimeout(function () {
            App.eventManager.trigger('removeCall');
        }, 100);
//        console.log("clicked button removeCall")
    };
    var appWorkflow = function () {
        var arg = arguments[0];
        switch (arg.type) {
            case 'login':
                var dialog = null;
                var cView = new Dialog({ scope: this, mode: 'login', text: 'Do you want to join Video Call?', callback: function () {
                        this.scope.closeDialog();
                    }
                });
                dialog = Utils.createDialog({ view: cView });
                dialog.open();
//                console.debug("Dialog Login Opened");
               break;
            case 'authenticated':
                /////////////////////// Test for Chat /////////////////////////////////////
                InviewApp.Config.User = InviewApp.Config.TestChatList[arg.user];
                //////////////////////////////////////////////////////////////////////////////
                App.authenticated = true;
                App.user = InviewApp.Config.User;
                App.video = {
                    moderator: false,
                    started: false,
                    videoRoom: null
                };
                App.audio = {
                    moderator: false,
                    started: false,
                    audioRoom: null
                };
                App.chat = {
                    models: {
                        UserContact: new ContactModel(InviewApp.Config.User),
                        DefaultContact: new ContactModel(InviewApp.Config.InitContactData)
                    },
                    alerts: {},
                    visible: false,
                    conversations: {
                    active: null,
                        display: {},
                        connections: {}
                    }
                };

                App.chat.conversations.webSocket = new NodeWebSocket({
                    websocket: SocketIO,
                    evt:'message',
                    onmessage:     function(data){
                        App.eventManager.trigger("serverMessage", { data: data });
                    },
                    userid: App.chat.models.UserContact.get('chid'),
                    useStatus: true
                });
/*
                App.chat.conversations.webSocket = new Websocket({
                    url: 'https://chat.firebaseIO.com/prerial/',
                    userid: App.chat.models.UserContact.get('chid'),
                    useStatus: true
                });
                App.chat.conversations.webSocket.initialize();
 */
                $('.topmenu_chat').css('display', 'block');
                    if (!_this.chatPopup) {
                        _this.chatPopup = new ComCenter({
                            el: 'div#comcenter'
                        });
                    }
                break;
        }
    };

    return {
        initialize: initialize
    };

});

