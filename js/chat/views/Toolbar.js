define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'text!chat/templates/toolbar.html'
], function ($, Backbone, _, App, Tpl) {

    return Backbone.View.extend({
        tagName: "ul",
        events: function () {
            return App.isiPad ?
		    {
		        "touchstart": "clickToolbarButton"
		    } :
		    {
		        "click": "clickToolbarButton"
		    }
        },
        initialize: function () {
            _.bindAll(this, 'render', 'clickToolbarButton');
            App.eventManager.on("resetToolbar", this.resetToolbar, this);
            this.render()
        },
        resetToolbar: function () {
            var arg =
		    $('.modeItem').removeClass('selected');
            if (!arguments[0]) App.eventManager.trigger("toolbarClick");
            App.eventManager.trigger("closeAllPopUps");
        },
        clickToolbarButton: function (evt) {
            this.resetToolbar();
            $(evt.target).prop("tagName") === 'LI' ? $(evt.target).find('div').addClass('selected') : $(evt.target).addClass('selected');
            var idx = $(evt.target).prop("tagName") === 'LI' ? parseInt($(evt.target).find('div').attr('idx')) : parseInt($(evt.target).attr('idx'));
//            if (idx === 0 || idx === 1 || idx === 3) {
                App.eventManager.trigger('showContactList', { 'type': idx });
//            }
            App.chat.displaySlider.slide(idx);
            $('.icon-settings').removeClass('selected');
        },
        render: function () {
            console.log("render toolbar");
            var template = _.template(Tpl);
            $(this.el).append(template);
            return this;
        }
    });
});

