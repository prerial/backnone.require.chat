define([
    'jquery', 
    'backbone', 
    'underscore',
    'text!templates/foot.html'
],	function ($, Backbone, _, Tpl) {
	var view = Backbone.View.extend({
	    id: 'foot',
	    tagName: 'inv_footer',
	    initialize: function () {
			_.bindAll(this, 'render');
		},
        render: function () {
		    var template = _.template(Tpl);
            $(this.el).html(template);            
            return this;
		}
	});

	return view;
});

