define([
    'jquery',
    'backbone',
    'underscore',
    'application'
], function ($, Backbone, _, Application) {

	var Button_MainNav_View = Backbone.View.extend({
	    tagName: "li",
	    className: "topmenu_menuBtn_off",
		events: function(){
		    return Application.isiPad ?
		    {
		      "touchstart": "clickedButtonMainNav"
		    } :
		    {
		      "click": "clickedButtonMainNav"
		    }
		},
		initialize : function() {
			_.bindAll(this, 'render', 'clickedButtonMainNav');
		},
		render : function() {
            return this;
		},
		clickedButtonMainNav: function(){
	        Application.eventManager.trigger("e_clickedButtonMainNav");
        }
	});

	return Button_MainNav_View;
});

