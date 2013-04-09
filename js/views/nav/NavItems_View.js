define([
'jquery',
'backbone',
'underscore',
'views/nav/NavItem_View',
'text!templates/navItems.html'
], function($, Backbone, _, NavItem_View, NavItems_Tpl) {

	var view = Backbone.View.extend({
		tagName: "aside",
		className: "menu",
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll', 'render');
            this.collection.bind('reset', this.addAll);
        },
        addOne: function(m){
            $(this.el).find("ul:last").append(new NavItem_View({ model: m }).render().el);
        },
        addAll: function(m){
            var template = _.template( NavItems_Tpl );
            $(this.el).append(template);
            this.collection.each(this.addOne);
        }, 
        render: function () {
            return this;
        }		
	});

	return view;
});

