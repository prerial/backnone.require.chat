define(['jquery', 'backbone', 'underscore', 'application', 
        
        'views/MyFunds_View',
        'collections/MyFunds_Collection',
        'text!templates/myFunds.html'
        
        
    ], 
	function($, Backbone, _, Mediator, 
	    MyFunds_View,
	    MyFunds_Collection,
	    MyFunds_Tpl
    ){

	var MyFolder_View = Backbone.View.extend({
		id: "myFolder",
		className: "myFolder",
		
		initialize : function() {
			_.bindAll(this, 'render');

		},

		render : function() {
            console.log("render myFolder");
            
            
            var template = _.template(MyFunds_Tpl);
            
            
            /*var myFund_model = Backbone.Model.extend();
            var myFunds_collection = new MyFunds_Collection({model: myFund_model});
            myFunds_collection.fetch();
            
            var myFunds_view  = new MyFunds_View({ collection: myFunds_collection});
            */
            
            //console.log(navItems_view);
            //$(this.el).html(myFunds_view.render().el);            
            $(this.el).html(template);    
            
     
            return this;
		}
		


		
		
	});

	return MyFolder_View;

});

