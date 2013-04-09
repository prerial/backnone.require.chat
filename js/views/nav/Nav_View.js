define([
    'jquery',
    'backbone',
    'underscore',
    'views/nav/NavItems_View',
    'collections/MainNav_Collection',  
], 
function($, Backbone, _, NavItems_View, MainNav_Collection) {

	var view = Backbone.View.extend({
		initialize : function() {
			_.bindAll(this, 'render');
			this.render();
		},
		render : function() {
            var mainNav_model = Backbone.Model.extend();
            var mainNav_collection = new MainNav_Collection({model: mainNav_model});
            mainNav_collection.fetch();
            var navItems_view  = new NavItems_View({ collection: mainNav_collection});
            $(this.el).html(navItems_view.render().el);
		}
	});

	return view;
});

