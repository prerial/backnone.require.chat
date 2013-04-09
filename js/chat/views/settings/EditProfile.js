define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'text!chat/templates/settings/edit_profile.html'
], function ($, Backbone, _, App, Tpl) {

    return Backbone.View.extend({
        tagName: 'li',
        events: function () {
            return App.isiPad ? {
                "touchstart .settings-country": "changeCountry",
                "touchstart .settings-gender": "changeGender",
                "touchstart .btn-done": "update",
                "touchstart .btn-cancel": "goBack"
            } : {
                "click .settings-country": "changeCountry",
                "click .settings-gender": "changeGender",
                "click .btn-done": "update",
                "click .btn-cancel": "goBack"
            }
        },
        changeGender: function (evt) {
            var gender = $(evt.target).attr('gender') || $(evt.target).parent().attr('gender');
            $('.settings-gender').removeClass('settings-item-selected');
            $('.settings-' + gender).addClass('settings-item-selected');
        },
        changeCountry: function (evt) {
            var country = $(evt.target).attr('country') || $(evt.target).parent().attr('country');
            $('.settings-country').removeClass('settings-item-selected');
//            $(evt.target).addClass('settings-item-selected');
            $('.settings-country[country=' + country + ']').addClass('settings-item-selected');
        },
        blurFields: function () {
            switch (this.type) {
                case 'phones':
                    window.setTimeout(function () {
                        $('#profile_phones_home').blur();
                        $('#profile_phones_office').blur();
                        $('#profile_phones_mobile').blur();
                    }, 100);
                    break;
                case 'name':
                    window.setTimeout(function () {
                        $('#profile_firstname').blur();
                        $('#profile_midname').blur();
                        $('#profile_lastname').blur();
                    }, 100);
                    break;
                case 'state':
                    window.setTimeout(function () {
                        $('#profile_state').blur();
                    }, 100);
                    break;
                case 'city':
                    window.setTimeout(function () {
                        $('#profile_city').blur();
                    }, 100);
                    break;
                case 'email':
                    window.setTimeout(function () {
                        $('#profile_email').blur();
                    }, 100);
                    break;
                case 'location':
                    window.setTimeout(function () {
                        $('#profile_location').blur();
                    }, 100);
                    break;
            };
        },
        updateModel: function () {
            switch (this.type) {
                case 'country':
                    App.chat.models.UserContact.profile.set('country', $('.settings-country.settings-item-selected').attr('country'));
                    break;
                case 'gender':
                    App.chat.models.UserContact.profile.set('gender', $('.settings-gender.settings-item-selected').attr('gender'));
                    break;
                case 'phones':
                    App.chat.models.UserContact.profile.phones.set({
                        'home': $('#profile_phones_home').val(),
                        'office': $('#profile_phones_office').val(),
                        'mobile': $('#profile_phones_mobile').val()
                    });
                    break;
                case 'name':
                    App.chat.models.UserContact.profile.set({
                        'firstname': $('#profile_firstname').val(),
                        'midname': $('#profile_midname').val(),
                        'lastname': $('#profile_lastname').val()
                    });
                    break;
                case 'state':
                    App.chat.models.UserContact.profile.set({
                        'state': $('#profile_state').val()
                    })
                    break;
                case 'city':
                    App.chat.models.UserContact.profile.set({
                        'city': $('#profile_city').val()
                    })
                    break;
                case 'email':
                    App.chat.models.UserContact.profile.set({
                        'email': $('#profile_email').val()
                    })
                    break;
                case 'location':
                    App.chat.models.UserContact.profile.set({
                        'location': $('#profile_location').val()
                    })
            };
        },
        update: function () {
            App.chat.displaySlider.slide(6);
            this.updateModel();
            this.blurFields();
        },
        showSection: function (arg) {
            this.type = arg;
            $(this.el).find('.selection-box').hide();
            $(this.el).find('.' + arg).show();
        },
        goBack: function () {
            this.render();
            App.chat.displaySlider.slide(6);
        },
        initialize: function () {
            var _this = this;
            _.bindAll(this, 'render');
            this.model = App.chat.models.UserContact;
            this.model.on('change', this.render, this);
            $('#profile_location, #profile_phones_home, #profile_phones_office, #profile_phones_mobile, #profile_firstname, #profile_midname, #profile_lastname, #profile_state, #profile_city, #profile_email, #profile_email').live("keypress", function (evt) {
                if (evt.keyCode === 13) {
                    _this.blurFields();
                }
            });
            this.render();
        },
        render: function () {
            console.log("render chat Edit Profile");
            var template = _.template(Tpl, { user: this.model.attributes });
            $(this.el).html(template);
            if (this.type) this.showSection(this.type);
            return this;
        }
    });
});

