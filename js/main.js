require.config({
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'jqmobile': {
            deps: ['jquery'],
            exports: 'jQuery.fn.jqmobile'
        },
	},
	paths: {
//		jquery: '../libs/jquery/jquery.min',
		jquery: '../libs/jquery/jquery',
		underscore: '../libs/underscore/underscore',
		backbone: '../libs/backbone/backbone',
		text: '../libs/require/text',
		slide: 'common/Slide',
		application: 'common/Application',
		websocket: 'common/Websocket',
		animateEnhanced: '../libs/jquery/jquery.animate-enhanced',
		jqmobile: '../libs/jquery/jquery.mobile.custom.min'
	}
});

require(["app"], function (App) {
        App.initialize();
}); 
