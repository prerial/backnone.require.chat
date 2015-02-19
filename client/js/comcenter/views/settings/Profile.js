define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'comcenter/views/settings/EditProfile',
    'text!comcenter/templates/settings/profile.html'
], function ($, Backbone, _, App, EditProfile, Tpl) {

    return Backbone.View.extend({
        tagName: 'li',
        events: function () {
            return App.isiPad ? {
                "touchstart .select-icon": "showProfileSection",
                "touchstart .btn-cancel": "goBack"
            } : {
                "click .select-icon": "showProfileSection",
                "click .btn-cancel": "goBack"
            }
        },
        showProfileSection: function (evt) {
            if ($('#chatEditProfile').html() === '') {
                this.edit = new EditProfile({ model: this.model });
                $('#chatEditProfile').append(this.edit.$el);
            }
            this.edit.showSection($(evt.target).closest('section').attr('section'));
            $('.settings-' + this.model.attributes.profile.gender).addClass('settings-item-selected');
            $('.settings-country[country=' + this.model.attributes.profile.country+']').addClass('settings-item-selected');
            App.chat.displaySlider.slide(7);
        },
        goBack: function () {
            App.chat.displaySlider.slide(4);
        },
        initialize: function () {
            _.bindAll(this, 'render');
            this.model = App.chat.models.UserContact;
            this.model.on('change', this.render, this);
            this.render();
        },
        render: function () {
            console.log("render chat Profile");
            var template = _.template(Tpl, { user: this.model.attributes });
            $(this.el).html(template);
            return this;
        }
    });
});

