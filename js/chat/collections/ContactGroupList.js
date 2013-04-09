define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'chat/models/ChatGroupContacts'
], function ($, Backbone, _, App, ChatContacts) {

    return Backbone.Collection.extend({
        url: 'data/chatContactGroupList.js',
        initialize: function () {
            url: 'data/chatContactGroupList.js'
//            this.url = 'data/chatContactList'+ InviewApp.Config.User.chid +'.js';
        }
    });
});
