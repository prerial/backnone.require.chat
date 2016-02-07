require.config({
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'utils': {
            deps: ['underscore', 'jquery', 'backbone'],
            exports: 'utils'
        },
        'jqmobile': {
            deps: ['jquery'],
            exports: 'jQuery.fn.jqmobile'
        },
    },
    paths: {
        socketio: '../libs/socket.io/socket.io-1.0.6',
        jquery: '../libs/jquery/jquery',
        underscore: '../libs/underscore/underscore',
        backbone: '../libs/backbone/backbone',
        text: '../libs/require/text',
        utils: 'common/Utils',
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
