define([
    'backbone',
    'underscore',
    'application'
], function( Backbone, _, Application) {

	var App_Model = Backbone.Model.extend({
		defaults : {
			'title' : 'Inview',
			'currentPlaceID' : '12',
			'isNavOpen': '0',
			'auth': false
		},

		initialize : function(options) {
			this.bind("change:isNavOpen", function(){
//                console.log("changed isNavOpen: "+this.get('isNavOpen')); 
            }); 
            this.bind("change:currentPlaceID", function(){
	            Application.eventManager.trigger("e_changePlace", this.get('currentPlaceID'));
            }); 
		}
	})

	return App_Model;
});


