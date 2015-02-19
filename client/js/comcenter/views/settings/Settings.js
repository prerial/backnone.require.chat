define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'comcenter/views/settings/Presence',
    'comcenter/views/settings/Profile',
    'text!comcenter/templates/settings/settings.html'
], function ($, Backbone, _, App, Presence, Profile, Tpl) {

    return Backbone.View.extend({
        events: function () {
            return App.isiPad ? {
                "touchstart .select-presence": "openPresence",
                "touchstart .select-profile": "openProfile"
            } : {
                "click .select-presence": "openPresence",
                "click .select-profile": "openProfile"
            }
        },
        openPresence: function () {
            App.chat.displaySlider.slide(5);
        },
        openProfile: function () {
            App.chat.displaySlider.slide(6);
        },
        initialize: function () {
            _.bindAll(this, 'render');
            this.model = App.chat.models.UserContact;
            this.model.on('change', this.update, this);
            this.render();
        },
        update: function () {
            var arg = arguments[0];
            var template = _.template(Tpl, { user: this.model.attributes });
            $(this.el).html(template);
            return this;
        },
        render: function () {
            console.log("render chat Settings");
            var template = _.template(Tpl, { user: this.model.attributes });
            $(this.el).html(template);
            var presence = new Presence({ model: this.model });
            $('#chatPresence').append(presence.$el);
            $('#chatPresence').find('.settings-' + this.model.attributes.presence).addClass('settings-' + this.model.attributes.presence + '-selected');
            var profile = new Profile({ model: this.model });
            $('#chatProfile').append(profile.$el);
/*
*/
            return this;
        }
    });
});

