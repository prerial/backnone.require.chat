define([
    'jquery',
    'backbone',
    'underscore',
    'application'
], function ($, Backbone, _, App) {

    var phones = Backbone.Model.extend({});

    var profile = Backbone.Model.extend({
        initialize: function () {
            this.phones = new phones(this.attributes.phones);
        }
    });

    return Backbone.Model.extend({
        initialize: function () {
            this.profile = new profile(this.attributes.profile);
            this.profile.phones.on('change', this.onPhonesChange, this);
            this.profile.on('change', this.onProfileChange, this);
            this.on('change', this.notify, this);
            instance = this;
        },
        set: function (attributes, options) {
            Backbone.Model.prototype.set.apply(this, arguments);
        },
        onPhonesChange: function () {
            var arg = arguments[0];
            _.extend(this.attributes.profile.phones, arg.attributes);
            this._pending = { 'profile': { 'phones': arg.attributes} };
            this.change({ 'profile': { 'phones': arg.attributes} });
        },
        onProfileChange: function () {
            var arg = arguments[0];
            _.extend(this.attributes.profile, arg.attributes );
            this._pending = { 'profile': arg.attributes };
            this.change({ 'profile': arg.attributes });
        },
        notify: function () {
            App.chat.conversations.webSocket.doSend(JSON.stringify({ 'type': 'updateContact', 'chid': this.attributes.chid, 'data': this.attributes }))
        }
    });
});


