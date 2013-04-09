define(['jquery', 'backbone', 'underscore', 'views/buttons/Button_MainNav_View'
], function($, Backbone, _, Button_MainNav_View) {

	var view = Backbone.View.extend({
	    tagName: "ul",
	    className: "place_logo_block",

		initialize : function() {
			_.bindAll(this, 'render');
		},

		render : function() {
            var button_mainnav_view = new Button_MainNav_View();
            $(this.el).append(button_mainnav_view.render().el);		    
		    $(this.el).append("<li class='topmenu_logo'></li>");
            return this;
		},
	});

	return view;

});

