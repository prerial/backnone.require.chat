define(['jquery', 'backbone', 'underscore', 'application', 'views/popup/PopUp_ViewB'
], function($, Backbone, _, App, PopUp_ViewB) {

	var Button_RelationshipNavigator_View = Backbone.View.extend({

		tagName : "li",
		className : "topmenu_relNav",

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
			if (!this.popupViewB) {
				this.popupViewB = new PopUp_ViewB({
					el : 'div#iv_app'
				});
			};
			if ($('div#rn').hasClass('active')) {
				setTimeout(function() {
					App.eventManager.trigger('hidePopUpB');
				}, 100);
			} else {
				setTimeout(function() {
				    App.eventManager.trigger('showPopUpB');
				    App.eventManager.trigger('hidePopUpA');
				    App.eventManager.trigger('hideSearch');
				}, 100);
			}
			console.log("clicked button_relNav")
		}
	});

	return Button_RelationshipNavigator_View;

});

