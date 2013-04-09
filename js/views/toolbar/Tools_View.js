define([
        'jquery', 
        'backbone', 
        'underscore', 
        'views/buttons/Button_RelationshipNavigator_View',
        'views/buttons/Button_Transactions_View',
        'views/buttons/Button_Opportunities_View',
        'views/buttons/Button_Alerts_View',
        'views/buttons/Button_Chat_View',
        'views/buttons/Button_Folder_View',
        'views/buttons/Button_Search_View'
    ], 
	function(
	    $, 
	    Backbone, 
	    _, 
	    Button_RelationshipNavigator_View,
        Button_Transactions_View,
        Button_Opportunities_View,
        Button_Alerts_View,
        Button_Chat_View,
        Button_Folder_View,
        Button_Search_View
	
	){

	var Tools_View = Backbone.View.extend({
	    tagName: "ul",
	    className: "tools",

		initialize : function() {
			_.bindAll(this, 'render');
		},

		render : function() {
            $(this.el).append(new Button_RelationshipNavigator_View().render().el);		    
            $(this.el).append(new Button_Transactions_View().render().el);         
            $(this.el).append(new Button_Opportunities_View().render().el);         
            $(this.el).append(new Button_Alerts_View().render().el);         
            $(this.el).append(new Button_Chat_View().render().el);
            $(this.el).append(new Button_Folder_View().render().el);
            $(this.el).append(new Button_Search_View().render().el);
            return this;
		},
	});

	return Tools_View;

});

