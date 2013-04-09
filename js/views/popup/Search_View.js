define(['jquery', 'backbone', 'underscore', 'application', 'text!templates/search.html'
], function($, Backbone, _, App, SearchTemplate) {

	var Search_View = Backbone.View.extend({

		template : SearchTemplate,

		events : function() {
			return App.isiPad ? {
				'touchstart ul.sideBtns li' : 'onSideBtnClick',
				'keypress input.searchField' : 'displayResults',
				'touchstart .searchCover' : 'hideSearchBar'
			} : {
				'click ul.sideBtns li' : 'onSideBtnClick',
				'keypress input.searchField' : 'displayResults',
				'click .searchCover' : 'hideSearchBar'
			}
		},
		el : "div#iv_app",

		initialize : function() {
			console.log("init searchView");
			_.bindAll(this, 'render', 'displayResults', 'toggleSearchBar', 'showSearchBar','hideSearchBar', 'onSideBtnClick', 'slideList', 'getActualHeight');
			App.eventManager.on("searchClicked", this.toggleSearchBar);
			App.eventManager.on("hideSearch", this.hideSearchBar)
			this.render();
		},

		render : function() {

			$(this.el).append("<div class='searchCover'></div>");
			$(this.el).append(_.template(this.template));
			this.toggleSearchBar();
			

			return this;
		},

		toggleSearchBar : function() {
			if ($('div.barWrapper').css('display') == 'none') {
				this.showSearchBar();
			} else {
				this.hideSearchBar();
			}
		},
		
		showSearchBar : function() {
				$('.searchView').before("<div class='searchCover'></div>");
				$('div.barWrapper').show();
				$('div.searchView').removeClass('fadeOut').addClass('fadeIn');
		},

		hideSearchBar : function() {
			$('.searchCover').remove();
			var self = this;
			$('div.searchView').removeClass('fadeIn').addClass('fadeOut');
			setTimeout(function() {
				$('div.listWrapper').scrollTop(0);
				$('div.resultsWrapper').hide();
				$('div.barWrapper input.searchField').val("");
				$('div.barWrapper').hide();
				$('div.resultsWrapper div.sideNav ul.sideBtns li').removeClass('on');
				$('div.resultsWrapper ul.sideBtns li#book').addClass('on');
			}, 300)
		},

		displayResults : function() {
			var spacingHeight = this.getActualHeight($(".searchView ul.resultsList li").filter(":last"));
			$('div.scrollAssist').css("margin-top", spacingHeight * -1);
			$("div.resultsWrapper").show();
		},

		onSideBtnClick : function() {
			$('div.resultsWrapper div.sideNav ul.sideBtns li').removeClass('on');
			switch(event.target.id) {
				case "book":
					this.slideList(0);
					$(event.target).addClass("on");
					break;
				case "portfolio":
					this.slideList(13);
					$(event.target).addClass("on");
					break;
				case "insight":
					this.slideList(23);
					$(event.target).addClass("on");
					break;
				default:
					break;
			}
		},

		slideList : function(targetIndex) {
			var lis = $('ul.resultsList li');
			var targetLi = targetIndex;
			var distance = 0;
			var duration;
			var self = this;

			lis.each(function() {
				if ($(this).index() < targetLi) {
					distance += self.getActualHeight($(this));
				}
			});
			duration = .5 * Math.abs($('div.listWrapper').scrollTop() - distance);

			$('div.listWrapper').animate({
				scrollTop : distance
			}, duration);
		},

		getActualHeight : function(listItem) {
			var height = 0;
			height += parseInt(listItem.css('height').replace("px", ""));
			height += parseInt(listItem.css('margin-top').replace("px", ""));
			height += parseInt(listItem.css('margin-bottom').replace("px", ""));
			height += parseInt(listItem.css('padding-top').replace("px", ""));
			height += parseInt(listItem.css('padding-bottom').replace("px", ""));
			height += parseInt(listItem.css('border-top-width').replace("px", ""));
			height += parseInt(listItem.css('border-bottom-width').replace("px", ""));
			return height;
		}
		/*
		 * 		DO NOT DELETE: Code for scrolling a list to a given list item based on the li's index using translate3d

		 onSideBtnClick : function() {
		 $('div.resultsWrapper div.sideNav ul.sideBtns li').removeClass('on');
		 switch(event.target.id) {
		 case "book":
		 this.slideList(0);
		 $(event.target).addClass("on");
		 break;
		 case "portfolio":
		 this.slideList(11);
		 $(event.target).addClass("on");
		 break;
		 case "insight":
		 this.slideList(23);
		 $(event.target).addClass("on");
		 break;
		 default:
		 break;
		 }
		 },

		 slideList : function(targetIndex) {
		 var lis = $('ul.resultsList li');
		 var targetLi = targetIndex;
		 var distance = 0;
		 var translate3dValue;
		 var self = this;

		 lis.each(function() {
		 if ($(this).index() < targetLi) {
		 distance += self.getActualHeight($(this));
		 }
		 });
		 translate3dValue = "translate3d(0px, " + (distance * -1) + "px, 0px)";

		 $('ul.resultsList').css({
		 "transform" : translate3dValue,
		 "-webkit-transform" : translate3dValue,
		 "-moz-transform" : translate3dValue
		 });

		 },

		 getActualHeight : function(listItem) {
		 var height = 0;
		 height += parseInt(listItem.css('height').replace("px", ""));
		 height += parseInt(listItem.css('margin-top').replace("px", ""));
		 height += parseInt(listItem.css('margin-bottom').replace("px", ""));
		 height += parseInt(listItem.css('padding-top').replace("px", ""));
		 height += parseInt(listItem.css('padding-bottom').replace("px", ""));
		 height += parseInt(listItem.css('border-top-width').replace("px", ""));
		 height += parseInt(listItem.css('border-bottom-width').replace("px", ""));
		 return height;
		 }
		 */
	});

	return Search_View;

});

