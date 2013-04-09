define([
    'jquery', 
    'backbone', 
    'underscore', 
    'application',
    'chat/views/ChatController'
], function ($, Backbone, _, App, Chat) {

    var Button_Chat_View = Backbone.View.extend({

        tagName: "li",
        className: "topmenu_chat",

        events: function () {
            return App.isiPad ? {
                "touchstart": "clickedButton"
            } : {
                "click" : "clickedButton"
            }
        },

        initialize: function () {
            App.eventManager.on('showAlert', this.showAlert, this);
            _.bindAll(this, 'render', 'clickedButton');
        },

        render: function () {
            return this;
        },

        showAlert: function () {
            arguments[0]? $(this.el).addClass('alerted') : $(this.el).removeClass('alerted');
        },

        clickedButton: function () {
            var _this = this;
            if (!this.popupViewA) {
                this.popupViewA = new Chat({
                    el: 'div#iv_app'
                });
            };
            if (this.popupViewA.hidden) {
                setTimeout(function () {
                    _this.popupViewA.hidden = false;
                    App.eventManager.trigger('hideChat');
                }, 100);
            } else {
                setTimeout(function () {
                    _this.popupViewA.hidden = true;
                    App.eventManager.trigger('showChat');
                    App.eventManager.trigger('hideAllPopUps');
                }, 100);
            }
            console.log("clicked button_Chat")
        }
    });

    return Button_Chat_View;

});

