define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'comcenter/models/ChatContacts'
], function ($, Backbone) {

    return Backbone.Collection.extend({
        url: 'data/chatContactList.js',
        initialize: function () {
            this.url = 'data/chatContactList'+ InviewApp.Config.User.chid +'.js';
        }
    });
});
