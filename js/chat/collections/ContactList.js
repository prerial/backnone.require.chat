define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'chat/models/ChatContacts'
], function ($, Backbone, _, App, ChatContacts) {

    return Backbone.Collection.extend({
        url: 'data/chatContactList.js',
        initialize: function () {
            this.url = 'data/chatContactList'+ InviewApp.Config.User.chid +'.js';
        }
    });
});
