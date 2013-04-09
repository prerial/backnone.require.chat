define(['jquery', 'backbone', 'underscore', 'application'], 
	function($, Backbone, _, App) {

	var Button_Opportunities_View = Backbone.View.extend({
	    
	    // id: "buttonMainNav",
	    tagName: "li",
	    className: "topmenu_opps",

		events: function(){
		    return App.isiPad ?
		    {
		      "touchstart": "clickedButton"
		    } :
		    {
		      "click": "clickedButton"
		    }
		},

		initialize : function() {
			_.bindAll(this, 'render', 'clickedButton');
		},

		render : function() {
            return this;
		},

		clickedButton: function(){
		    console.log("clicked button_Opportunities")
        }
		
		
	});

	return Button_Opportunities_View;

});

