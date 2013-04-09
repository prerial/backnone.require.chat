define([
    'jquery'
], function () {
    var Slide = function (element, options) {
        if (!element.length === 0) return null;
        this.options = options || {};
        this.index = this.options.startSlide || 0;
        this.speed = this.options.speed || 300;
        this.delay = this.options.auto || 0;
        this.callback = this.options.callback || function () { };
        this.container = element;
        this.slidepane = this.container.children(); 
        this.container.css('overflow', 'hidden');
        this.slidepane.css('list-style', 'none').css('margin', '0');
        this.initialize();
    };
    Slide.prototype = {
        initialize: function () {
            this.slides = this.slidepane.children();
            this.length = this.slides.length;
            if (this.length < 2) return null;
            this.width = Math.ceil(("getBoundingClientRect" in this.container[0]) ? this.container[0].getBoundingClientRect().width : this.container.offset().width);
            // Fix width for Android WebView (i.e. PhoneGap) 
            if (this.width === 0 && typeof window.getComputedStyle === 'function') {
                this.width = window.getComputedStyle(this.container[0], null).width.replace('px', '');
            }
            // return immediately if measurement fails
            if (!this.width) return null;
            // hide slider element but keep positioning during setup
            var origVisibility = this.container.css('visibility');
            this.container.css('visibility', 'hidden');
            // dynamic css
            this.slidepane.css('width', Math.ceil(this.slides.length * this.width) + 'px');
            var index = this.slides.length;
            while (index--) {
                var el = $(this.slides[index]);
                el.css('width', this.width + 'px').css('display', 'table-cell').css('vertical-align', 'top');
            }
            // set start position and force translate to remove initial flickering
            this.slide(this.index, 0);
            // restore the visibility of the slider element
            this.container.css('visibility', origVisibility);
            this.begin();
        },
        slide: function (index, duration) {
            var style = this.slidepane[0].style;
            // fallback to default speed
            if (duration == undefined) {
                duration = this.speed;
            }
            // set duration speed (0 represents 1-to-1 scrolling)
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = duration + 'ms';
            // translate to given index position
            style.MozTransform = style.webkitTransform = 'translate3d(' + -(index * this.width) + 'px,0,0)';
            style.msTransform = style.OTransform = 'translateX(' + -(index * this.width) + 'px)';
            // set new index to allow for expression arguments
            this.index = index;
            this.callback(this.index, this.slides[this.index]);
        },
        getPos: function () {
            return this.index;
        },
        prev: function (delay) {
            // cancel next scheduled automatic transition, if any
            this.delay = delay || 0;
            clearTimeout(this.interval);
            if (this.index) this.slide(this.index - 1, this.speed); // if not at first slide
            else this.slide(this.length - 1, this.speed); //if first slide return to end
        },
        next: function (delay) {
            this.delay = delay || 0;
            clearTimeout(this.interval);
            if (this.index < this.length - 1) this.slide(this.index + 1, this.speed); // if not last slide
            else this.slide(0, this.speed); //if last slide return to start
        },
        begin: function () {
            var _this = this;
            this.interval = (this.delay) ? 
                setTimeout(function () {
                  _this.next(_this.delay);
                }, this.delay) : 0;
        }
    }
    return Slide;
});
