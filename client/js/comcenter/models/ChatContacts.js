define([
    'jquery',
    'backbone',
    'underscore'
], function ($, Backbone, _) {

    return Backbone.Model.extend({
//        url: 'data/chatContactList.js',
        defaults: function () {
            return {
                title: '',
                presence: '',
                gender: '' 
           };
        }
    });
});


