define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'text!chat/templates/settings/presence.html'
], function ($, Backbone, _, App, Tpl) {

    return Backbone.View.extend({
        tagName: 'li',
        events: function () {
            return App.isiPad ? {
                "touchstart .presenceSettings": "changePresenceSettings",
                "touchstart .btn-cancel": "goBack"
            } : {
                "click .presenceSettings": "changePresenceSettings",
                "click .btn-cancel": "goBack"
            }
        },
        goBack: function () {
            App.chat.displaySlider.slide(4);
        },
        initialize: function () {
            this.presenceIdx = {
                'online': 0,
                'busy': 1,
                'away': 2,
                'offline': 3
            };
            _.bindAll(this, 'render');
            this.model = App.chat.models.UserContact;
            this.model.on('change', this.update, this);
            this.render();
        },
        update: function () {
            $('section.presenceSettings').removeClass('settings-online-selected').removeClass('settings-busy-selected').removeClass('settings-offline-selected').removeClass('settings-away-selected');
            $($('section.presenceSettings')[this.presenceIdx[this.model.attributes.presence]]).addClass('settings-' + this.model.attributes.presence + '-selected');
        },
        render: function () {
            console.log("render Presence");
            var template = _.template(Tpl);
            $(this.el).html(template);
            return this;
        },
        changePresenceSettings: function (evt) {
            var presence = $(evt.target).attr('presence') || $(evt.target).parent().attr('presence');
            InviewApp.Config.User.presence = presence.substr(presence.indexOf('-') + 1);
            App.chat.models.UserContact.set('presence', presence.substr(presence.indexOf('-') + 1));
        }
    });
});

