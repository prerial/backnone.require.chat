define([
    'jquery', 
    'backbone', 
    'underscore',
    'views/toolbar/PlaceLogoBlock_View',
    'views/toolbar/Tools_View',
    'views/toolbar/PlaceBar_View',  
    'text!templates/placeHead.html'
], function(	    $, 	    Backbone, 	    _, 
	    PlaceLogoBlock_View, 
	    Tools_View,
	    PlaceBar_View,  
	    PlaceHead_Tpl
	){

	var PlaceHead_View = Backbone.View.extend({
	    id: 'placeHead',
		initialize : function() {
			_.bindAll(this, 'render');
		},
		render : function() {
            var placeLogoBlock_view = new PlaceLogoBlock_View();
            $(this.el).append(placeLogoBlock_view.render().el);
            var tools_view = new Tools_View();
            $(this.el).append(tools_view.render().el);
            
/*

            var placeBar_view = new PlaceBar_View();
            $(this.el).append(placeBar_view.render().el);
*/
            return this;
		}
	});

	return PlaceHead_View;
});

