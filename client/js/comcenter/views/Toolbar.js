define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'text!comcenter/templates/toolbar.html'
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
        hideAll: function () {
			$('#chat-container').width(0);
			$('#group-container').width(0);
			$('#phone-container').width(0);
			$('#video-container').width(0);
			$('#chatSettings').width(0);
			$('#chat-settings').width(0);
        },
        clickToolbarButton: function (evt) {
            this.resetToolbar();
            $(evt.target).prop("tagName") === 'LI' ? $(evt.target).find('div').addClass('selected') : $(evt.target).addClass('selected');
            var idx = $(evt.target).prop("tagName") === 'LI' ? parseInt($(evt.target).find('div').attr('idx')) : parseInt($(evt.target).attr('idx'));
            App.eventManager.trigger('toolbarClicked', { 'type': idx });
			$("#btn-video-add").hide()
			$('#btn-audio-add').hide();
            this.hideAll();
            switch(idx){
            	case 0:
					$('#chat-container').width(400);
					break
            	case 1:
					$('#group-container').width(400);
					break
            	case 2:
					$('#btn-audio-add').show();
            	    $('#phone-container').width(400);
					break
            	case 3:
					$("#btn-video-add").show()
                	$('#video-container').width(400);
            		break
            }
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

