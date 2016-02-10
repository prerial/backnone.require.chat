define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'comcenter/models/ChatContacts'
], function ($, Backbone) {

    return Backbone.Collection.extend({
        url: 'data/searchContactList.js',
        initialize: function () {
            this.url = 'data/searchContactList.js';
        }
    });
});
