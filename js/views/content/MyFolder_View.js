define([
    'jquery',
    'backbone', 
    'underscore', 
    'views/MyFunds_View',
    'collections/MyFunds_Collection',
    'text!../../templates/myFunds.html'
], function($, Backbone, _,
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
            $(this.el).html(template);    
            return this;
		}
	});

	return MyFolder_View;
});

