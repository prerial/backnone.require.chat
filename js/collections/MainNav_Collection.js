define([
    'underscore',
    'backbone'
], function( _, Backbone ) {

    var MainNav_Collection = Backbone.Collection.extend({
        url: 'data/mainNavigation.js'
    });
        
    return MainNav_Collection;
});
