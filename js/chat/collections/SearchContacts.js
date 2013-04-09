define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'chat/models/ChatContacts'
], function ($, Backbone, _, App, ChatContacts) {

    return Backbone.Collection.extend({
        url: 'data/searchContactList.js',
        initialize: function () {
            this.url = 'data/searchContactList.js';
        }
    });
});
