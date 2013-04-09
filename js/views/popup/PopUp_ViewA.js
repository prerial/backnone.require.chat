define(['require', 'jquery', 'backbone', 'underscore', 'application', 'text!templates/popup.html'
], function(require, $, Backbone, _, App, PopUpTemplate) {

	var PopUp_ViewA = Backbone.View.extend({

		events : function() {
			return App.isiPad ? {
				"touchstart .popupCoverA" : "hidePopUpA"
			} : {
				"click .popupCoverA" : "hidePopUpA"
			}
		},

		initialize : function() {
			_.bindAll(this, 'render', 'showPopUpA','hidePopUpA');

			this.id = "recentTransactions"

			App.eventManager.on("showPopUpA", this.showPopUpA);
			App.eventManager.on("hidePopUpA", this.hidePopUpA);

			var self = this;
			require(['text!templates/recentTransactions.html'], function(loadedTmpltA) {
				self.template = _.template(loadedTmpltA);
				self.render();
			});
		},

		render : function() {

			$(this.el).append(this.template(this.id));
			$(this.el).append("<div class='popupCoverA'></div>");

			return this;		},

		showPopUpA : function() {
			if (!$('div#recentTransactions').hasClass('active') && $.browser.msie) {
//            debugger
                $('div#recentTransactions').addClass('active');
                $('div#recentTransactions').fadeIn(1000);
				    $(this.el).append("<div class='popupCoverA'></div>");
            }else{
 			    if ($('div#recentTransactions').hasClass('paused')) {
				    $('div#recentTransactions').removeClass('paused');
				    $('div#recentTransactions').addClass('active');
				    $(this.el).append("<div class='popupCoverA'></div>");
			    }
           }
		},

		hidePopUpA : function() {
			$('.popupCoverA').remove();
			var targetPopUpA = $('div#recentTransactions');
			if (targetPopUpA.hasClass('active')) {
//            debugger
				targetPopUpA.removeClass('active');
                if($.browser.msie){
                    targetPopUpA.fadeOut(1000);
                }else{ 
				    targetPopUpA.removeClass('forwards');
				    targetPopUpA.addClass('reversed');
				    targetPopUpA.bind("webkitAnimationEnd", function(e) {
					    targetPopUpA.removeClass();
					    targetPopUpA.addClass('popup rt paused forwards');
					    targetPopUpA.unbind("webkitAnimationEnd");
				    })
                }
			}
		},
	});

	return PopUp_ViewA;
});
