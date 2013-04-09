define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'text!templates/navItem.html'
], function($, Backbone, _, Application, NavItem_Tpl) {

	var NavItem_View = Backbone.View.extend({
        tagName: "li",
        initialize: function(){
            _.bindAll(this, 'render', 'clickedNavItem');
        },
		events: function(){
		    return Application.isiPad ?
		    {
		      "touchstart": "clickedNavItem"
		    } :
		    {
		      "click": "clickedNavItem"
		    }
		},
        clickedNavItem: function(){
            Application.model.set('currentPlaceID', this.model.get('title'));
            console.log("clicked: " + Application.model.get('currentPlaceID'));  
        },
        render: function(){
            var template = _.template( NavItem_Tpl, {title: this.model.get('title')} );
            $(this.el).addClass(this.model.get('className'));
            $(this.el).html(template);
            return this;
        }
	});

	return NavItem_View;
});

