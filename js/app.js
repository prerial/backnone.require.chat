define(['jquery', 'backbone', 'underscore', 'application', 'websocket',
    'common/Config',
    'common/Dialog',
    'common/DisplayModal',
    'chat/models/Contact',
    'models/App_Model',
    'views/Login_View',
    'views/nav/Nav_View',
    'views/content/Place_View',
    'views/Foot_View',
    'text!templates/main.html'
], function ($, Backbone, _, App, Websocket, Config, Dialog, DisplayModal, ContactModel, App_Model, Login_View, Nav_View, Place_View, Foot_View, Main_Tpl) {

    var ua = navigator.userAgent;
    App.isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);
    if (App.isiPad) {
        $('body').addClass("iPad");
    } else {
        $('body').addClass("desktop");
    }

    var initialize = function () {
        if (blnTest) {
            Appl = App;
            debugger
        }
        App.eventManager = _.extend({}, Backbone.Events);
        App.model = new App_Model(); ;
        App.eventManager.on("authenticated", appWorkflow);
        App.eventManager.on("un-authenticated", appWorkflow);
        App.eventManager.on("serverMessage", checkAvalable);
        var template = _.template(Main_Tpl);
        $('body').append(template);
        App.dialog = new Dialog();
        $('body').append(App.dialog.$el);
        App.dialog.$el.hide();
        //        App.modal = new DisplayModal();
        //        App.modal.$el.css('top', $('body').height());
        //        App.modal.$el.css('left', '560px');
        //        $('body').append(App.modal.$el);
        App.root = $('#iv_app');
        var AppRouter = Backbone.Router.extend({
            routes: {
                "section/:place": "goToPlace",
                "*actions": "defaultRoute" // matches http://example.com/#anything-here
            }
        });
        var app_router = new AppRouter;
        app_router.on('route:goToPlace', function (place) {
            debugger
            App.eventManager.trigger("authenticated", { 'type': 'authenticated', 'place': place });
            App.model.set("auth", true);
        });
        app_router.on('route:defaultRoute', function (actions) {
            if (App.model.get("auth") == false) {
                App.eventManager.trigger("un-authenticated", { 'type': 'login' });
            }
        });
        Backbone.history.start();
    };
    var checkAvalable = function () {
        var arg = arguments[0];
        var result = jQuery.parseJSON(arg.data);
        if (result.type && result.type === 'conversation') {
            if (!App.chat.visible) {
                App.chat.alerts[result.chidFrom] = result;
                App.eventManager.trigger('showAlert', true);
            }
        }
    };
    var appWorkflow = function () {
        var arg = arguments[0];
        switch (arg.type) {
            case 'login':
                App.login_view = new Login_View();
                App.root.append(App.login_view.render().el);
                break;
            //	        case 'login':                
            case 'authenticated':
                /////////////////////// Test for Chat /////////////////////////////////////
                InviewApp.Config.User = InviewApp.Config.TestChatList[arg.user];
                //////////////////////////////////////////////////////////////////////////////
                App.model.set("auth", true);
                App.model.set("currentPlaceID", arg.place);
                App.nav_view = new Nav_View({ el: '#iv_nav' });
                App.place_view = new Place_View({ el: '#iv_main' });
                App.foot_view = new Foot_View({ el: '#iv_foot' }).render().el;
                App.chat = {};
                App.chat.models = {};
                App.chat.scrolls = {};
                App.chat.alerts = {};
                App.chat.visible = false;
                App.chat.conversations = {};
                App.chat.conversations.display = {};
                App.chat.conversations.connections = {};
                //                App.chat.conversations.connections[InviewApp.Config.User.chid] = {};
                App.chat.models.UserContact = new ContactModel(InviewApp.Config.User);
                App.chat.conversations.webSocket = new Websocket({
                    url: 'ws://node.remysharp.com:8001/' + App.chat.models.UserContact.get('cnport') + '/',
                    userid: App.chat.models.UserContact.get('chid'),
                    useStatus: true
                });
                App.chat.conversations.webSocket.initialize();
                break;
        }
    };

    return {
        initialize: initialize
    };

});

