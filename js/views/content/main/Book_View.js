define(['jquery', 'backbone', 'underscore','mediator', 
    'views/PlaceHead_View',
    'text!templates/book.html' 
    ], 
	function($, Backbone, _, Mediator,
	    PlaceHead_View,
	    Book_Tpl
    ){

	var Book_View = Backbone.View.extend({
		events: {
		},

		initialize : function() {
		    console.log("init bookView");
			_.bindAll(this, 'render');
			
			//Mediator.subscribe("portfolio:CreateClient", this.createClient);
            //Mediator.subscribe("portfolio:SetInvestobjective", this.setInvestObjective);
		},

		render : function() {
            
            var template = _.template( Book_Tpl );
            $(this.el).append(template);
            
		    if (Inview.isiPad)  setTimeout(loaded, 200); 
		   
		    
		    
		    function loaded() {
                myScroll = new iScroll('wrapper');
            }
		    
		    return this;
		}
		
		
	});

	return Book_View;

});

