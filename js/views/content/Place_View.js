define(['jquery', 'backbone', 'underscore', 'application',
        'views/content/PlaceHead_View'
/*        
,
'views/content/PlaceMain_View'
,
'views/content/MyFolder_View'
*/
    ],
	function ($, Backbone, _, Application,
	    PlaceHead_View,
	    PlaceMain_View,
	    MyFolder_View
    ) {

	    var Place_View = Backbone.View.extend({
	        initialize: function () {
	            _.bindAll(this, 'render', 'slideMain');
	            Application.eventManager.on("e_clickedButtonMainNav", this.slideMain);
	            Application.eventManager.on("e_changePlace", this.slideMain);
	            this.render();
	            this.SlidingView();
	        },
	        render: function () {
	            var placehead_view = new PlaceHead_View();
	            $(this.el).html(placehead_view.render().el);
	        },
	        SlidingView: function () {
	            window.slidingView = this;
	            this.gestureStarted = false;
	            this.bodyOffset = 0;
	            this.sidebarWidth = 240;
	            this.sidebar = $("#iv_nav");
	            $(this.el).addClass("slidingview_body");
	            var self = this;
	            this.setupEventHandlers();
	        },
	        setupEventHandlers: function () {
	            this.touchSupported = ('ontouchstart' in window);
	            this.START_EVENT = this.touchSupported ? 'touchstart' : 'mousedown';
	            this.MOVE_EVENT = this.touchSupported ? 'touchmove' : 'mousemove';
	            this.END_EVENT = this.touchSupported ? 'touchend' : 'mouseup';
	            var self = this;
	            var func = function (event) { self.onTouchStart(event), true };
	            var mainArea = $(this.el).get()[0];
	            mainArea.addEventListener(this.START_EVENT, func, false);
	        },
	        onTouchStart: function (event) {
	            console.log('onTouchStart');
	            $(this.el).css('-webkit-transition-duration', '0');
	            this.gestureStartPosition = this.getTouchCoordinates(event);
	            var self = this;
	            this.touchMoveHandler = function (event) { self.onTouchMove(event) };
	            this.touchUpHandler = function (event) { self.onTouchEnd(event) };
	            $(this.el).get()[0].addEventListener(this.MOVE_EVENT, this.touchMoveHandler, false);
	            $(this.el).get()[0].addEventListener(this.END_EVENT, this.touchUpHandler, false);
	            $(this.el).stop();
	        },
	        onTouchMove: function (event) {
	            var currentPosition = this.getTouchCoordinates(event);
	            if (this.gestureStarted) {
	                event.preventDefault();
	                event.stopPropagation();
	                this.updateBasedOnTouchPoints(currentPosition);
	                return;
	            } else {
	                if (Math.abs(currentPosition.y - this.gestureStartPosition.y) > 50) {
	                    this.unbindEvents();
	                    return;
	                } else if (Math.abs(currentPosition.x - this.gestureStartPosition.x) > 50) {
	                    this.gestureStarted = true;
	                    event.preventDefault();
	                    event.stopPropagation();
	                    this.updateBasedOnTouchPoints(currentPosition);
	                    return;
	                }
	            }
	        },
	        onTouchEnd: function (event) {
	            if (this.gestureStarted) {
	                this.snapToPosition();
	            }
	            this.gestureStarted = false;
	            this.unbindEvents();
	        },
	        updateBasedOnTouchPoints: function (currentPosition) {
	            var deltaX = (currentPosition.x - this.gestureStartPosition.x);
	            var targetX = this.bodyOffset + deltaX;
	            targetX = Math.max(targetX, 0);
	            targetX = Math.min(targetX, this.sidebarWidth);
	            this.bodyOffset = targetX;
	            if ($(this.el).css("left") != "0px") {
	                $(this.el).css("left", "0px");
	            }
	            $(this.el).css("-webkit-transform", "translate3d(" + targetX + "px,0,0)");
	            $(this.el).css("-moz-transform", "translate3d(" + targetX + "px,0,0)");
	            $(this.el).css("transform", "translate3d(" + targetX + "px,0,0)");
	            this.sidebar.trigger("slidingViewProgress", { current: targetX, max: this.sidebarWidth });
	            this.gestureStartPosition = currentPosition;
	        },
	        snapToPosition: function () {
	            $(this.el).css("left", "0px");
	            var currentPosition = this.bodyOffset;
	            var halfWidth = this.sidebarWidth / 2;
	            var targetX;
	            if (currentPosition < halfWidth) {
	                $(this.el).css("-webkit-transform", "translate3d(0,0,0)");
	                Application.model.set('isNavOpen', '0');
	                targetX = 0;
	            } else {
	                Application.model.set('isNavOpen', '1');
	                targetX = this.sidebarWidth;
	            }
	            if (currentPosition != targetX) {
	                if (targetX) {
	                    $(this.el).css("-webkit-transform", "translate3d(240px,0,0)");
	                }
	                this.sidebar.trigger("slidingViewProgress", { current: targetX, max: this.sidebarWidth });
	            }
	        },
	        unbindEvents: function () {
	            $(this.el).get()[0].removeEventListener(this.MOVE_EVENT, this.touchMoveHandler, false);
	            $(this.el).get()[0].removeEventListener(this.END_EVENT, this.touchUpHandler, false);
	        },
	        getTouchCoordinates: function (event) {
	            if (this.touchSupported) {
	                var touchEvent = event.touches[0];
	                return { x: touchEvent.pageX, y: touchEvent.pageY }
	            } else {
	                return { x: event.screenX, y: event.screenY };
	            }
	        },
	        resizeContent: function () {
	            var $window = $(window)
	            var w = $window.width();
	            var h = $window.height();
	            $(this.el).width(w);
	        },
	        toggleIsNavOpen: function () {
	            var isNavOpen = Inview.app.model.get('isNavOpen');
	            var newIsNavOpenVal = 0;
	            if (isNavOpen == 1) {
	                newIsNavOpenVal = 0;
	            } else {
	                newIsNavOpenVal = 1;
	            }
	            Application.model.set('isNavOpen', newIsNavOpenVal);
	        },
	        slideMain: function () {
	            var isNavOpen = Application.model.get('isNavOpen');
	            if (isNavOpen == 1) {
	                Application.model.set('isNavOpen', '0');
	                $(this.el).css('transition-duration', '200ms');
	                $(this.el).css('transform', 'translate3d(0,0,0)');
	                $(this.el).css('-webkit-transition-duration', '200ms');
	                $(this.el).css('-webkit-transform', 'translate3d(0,0,0)');
	            } else {
	                Application.model.set('isNavOpen', '1');
	                $(this.el).css('transition-duration', '200ms');
	                $(this.el).css('transform', 'translate3d(240px,0,0)');
	                $(this.el).css('-webkit-transition-duration', '200ms');
	                $(this.el).css('-webkit-transform', 'translate3d(240px,0,0)');
	            }
	        }
	    });

	    return Place_View;
	});

