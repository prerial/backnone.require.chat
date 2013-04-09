define(['jquery', 'backbone', 'underscore', 'application', 
    'views/PlaceHead_View', 
    'views/Portfolio_SetContext_View',
    'views/Portfolio_CreateClient_View',
    'views/Portfolio_SetInvestmentObjective_View',
    'views/SmartFeed_View'
    ], 
	function($, Backbone, _, Mediator,
	    PlaceHead_View, 
	    Portfolio_SetContext_View, 
	    Portfolio_CreateClient_View,
	    Portfolio_SetInvestmentObjective_View,
	    SmartFeed_View
    ){

	var Portfolio_View = Backbone.View.extend({
		events: {
		},

		initialize : function() {
		    console.log("init portfolioView");
			_.bindAll(this, 'render', 'createClient', 'setInvestObjective');
			
			Mediator.subscribe("portfolio:CreateClient", this.createClient);
            Mediator.subscribe("portfolio:SetInvestobjective", this.setInvestObjective);
		},

		render : function() {

            var portfolio_setContext_view = new Portfolio_SetContext_View();
            $(this.el).append(portfolio_setContext_view.render().el);
            
            
            var smartFeed_view = new SmartFeed_View();
            $(this.el).append(smartFeed_view.render().el);
           
            return this;
		},
		
		createClient: function(){
            var portfolio_createClient_view = new Portfolio_CreateClient_View();
            $(this.el).append(portfolio_createClient_view.render().el);
            return this;		    
		},
		setInvestObjective: function(){
		    var portfolio_setInvestObj_view = new Portfolio_SetInvestmentObjective_View();
            $(this.el).append(portfolio_setInvestObj_view.render().el);
            return this;            
        }

		
		
	});

	return Portfolio_View;

});

