define(['jquery', 'backbone', 'underscore', 'mediator', 
'views/PlaceHead_View', 'views/Insight_Pubs_View', 'views/Stack_View', 
'collections/Insight_Pubs_Collection', 'collections/Insight_Pubs_Collection2', 
'collections/Insight_Pubs_Collection3'
], function($, Backbone, _, Mediator, PlaceHead_View, Insight_Pubs_View, Stack_View, Insight_Pubs_Collection, Insight_Pubs_Collection2, Insight_Pubs_Collection3) {

	var Insight_View = Backbone.View.extend({
		events : function() {
			// return Inview.isiPad ? {
			// "touchstart .insightBtn_L" : "onArrowBtnClick",
			// "touchstart .insightBtn_R" : "onArrowBtnClick"
			// } : {
			// "click .insightBtn_L" : "onArrowBtnClick",
			// "click .insightBtn_R" : "onArrowBtnClick"
			// }
		},

		initialize : function() {
			console.log("init insightView");
			_.bindAll(this, 'render'); //, 'onArrowBtnClick');

		},
		className : "fpWrapper",

		render : function() {

			console.log("render insight View");
			var stackArr = new Array();

			var insight_pub_model = Backbone.Model.extend();
			var insight_pubs_collection = new Insight_Pubs_Collection({
				model : insight_pub_model
			});
			insight_pubs_collection.fetch();
			var insight_pubs_view = new Insight_Pubs_View({
				collection : insight_pubs_collection
			});
			stackArr[0] = insight_pubs_view.render().el;

			var insight_pubs_collection2 = new Insight_Pubs_Collection2({
				model : insight_pub_model
			});
			insight_pubs_collection2.fetch();
			var insight_pubs_view2 = new Insight_Pubs_View({
				collection : insight_pubs_collection2
			});
			stackArr[1] = insight_pubs_view2.render().el;

			var insight_pubs_collection3 = new Insight_Pubs_Collection3({
				model : insight_pub_model
			});
			insight_pubs_collection3.fetch();
			var insight_pubs_view3 = new Insight_Pubs_View({
				collection : insight_pubs_collection3
			});
			stackArr[2] = insight_pubs_view3.render().el;

			var stack_view = new Stack_View({
				stackArray : stackArr
			});
			$(this.el).append(stack_view.render().el);

			// insight_pubs_collection.fetch();
			//
			// var insight_pubs_view = new Insight_Pubs_View({
			// collection : insight_pubs_collection
			// });
			//
			// //console.log(insight_pubs_view);
			// $(this.el).append('<div class="insightBtn_L"></div><div class="insightBtn_R"></div>');
			// $(this.el).append(insight_pubs_view.render().el);

			return this;

		},

		// onArrowBtnClick : function() {
			// console.log(event.target.className + " clicked!");
		// }
	});

	return Insight_View;

});

