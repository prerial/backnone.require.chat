define(['jquery', 'backbone', 'underscore', 'application', 'views/popup/PopUp_ViewA'
], function ($, Backbone, _, App, PopUp_ViewA) {

	var Button_Transactions_View = Backbone.View.extend({

		tagName : "li",
		className : "topmenu_trans",

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
			if (!this.popupViewA) {
				this.popupViewA = new PopUp_ViewA({
					el : 'div#iv_app'
				});
			};
			if ($('div#recentTransactions').hasClass('active')) {
				setTimeout(function() {
				    App.eventManager.trigger('hidePopUpA');
				}, 100);
			} else {
				setTimeout(function() {
				    App.eventManager.trigger('showPopUpA');
				    App.eventManager.trigger('hidePopUpB');
				    App.eventManager.trigger('hideSearch');
				}, 100);
			}

			console.log("clicked button_Transactions")
		}
	});

	return Button_Transactions_View;

});

