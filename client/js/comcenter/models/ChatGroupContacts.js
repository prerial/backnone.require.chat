define([
    'jquery',
    'backbone',
    'underscore'
], function ($, Backbone) {

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


