define(['jquery', 'backbone', 'underscore', 'application', 'views/popup/Search_View'
], function($, Backbone, _, App, Search_View) {

	var Button_Search_View = Backbone.View.extend({

		// id: "buttonMainNav",
		tagName : "li",
		className : "topmenu_search",

		events : function() {
			return App.isiPad ? {
				"touchstart" : "clickedButton"
			} : {
				"click" : "clickedButton"
			}
		},

		initialize : function() {
			_.bindAll(this, 'render', 'clickedButton');
		},

		render : function() {
			return this;
		},

		clickedButton : function() {
			if (!this.searchView) {
				this.searchView = new Search_View({});
				App.eventManager.trigger("hidePopUpA");
				App.eventManager.trigger("hidePopUpB")
			} else {
                App.eventManager.trigger("searchClicked");
                App.eventManager.trigger("hidePopUpA");
                App.eventManager.trigger("hidePopUpB")
			}
			console.log("clicked button_Search")
		}
	});

	return Button_Search_View;

});

