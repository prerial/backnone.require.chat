define(['jquery', 'backbone', 'underscore', 'application', 
    'views/PlaceHead_View', 
    'text!templates/preview.html'
    ], 
	function($, Backbone, _, Mediator,
	    PlaceHead_View,
	    Preview_Tpl
    ){

	var Preview_View = Backbone.View.extend({
		events: {
		},

		initialize : function() {
		    console.log("init previewView");
			_.bindAll(this, 'render');

		},

		render : function() {

            var template = _.template( Preview_Tpl );
            $(this.el).append(template);
           
            return this;
		}

		
		
	});

	return Preview_View;

});

