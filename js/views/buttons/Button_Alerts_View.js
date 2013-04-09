define(['jquery', 'backbone', 'underscore', 'application'], 
	function($, Backbone, _, App) {

	var Button_Alerts_View = Backbone.View.extend({
	    
	    // id: "buttonMainNav",
	    tagName: "li",
	    className: "topmenu_alerts",

		events: {
		    click: "clickedButton"
		},

		initialize : function() {
			_.bindAll(this, 'render', 'clickedButton');
		},

		render : function() {
            return this;
		},

		clickedButton: function(){
		    console.log("clicked button_Alerts")
        }
		
		
	});

	return Button_Alerts_View;

});

