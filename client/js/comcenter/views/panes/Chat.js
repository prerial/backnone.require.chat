define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'comcenter/views/Contact',
    'text!comcenter/templates/contact/contact.html',
    'text!comcenter/templates/panes/chat.html'
], function ($, Backbone, _, App, Contact, ContactTpl, Tpl) {

    return Backbone.View.extend({
        initialize: function () {
            var arg = arguments[0];
            App.eventManager.on("updateUser", this.setModel, this);
            _.bindAll(this, 'render');
            this.render();
        },
        setModel: function () {
        	var _this = this;
        	var arg = arguments[0];
			$('#chat_toolbar')[0].style.opacity = '0';
//			$('#chat_toolbar')[0].style.webkitTransform = 'rotateX(180deg)';
//			$('#chat_toolbar')[0].style.msTransform = 'rotateX(180deg)';
//			$('#chat_toolbar')[0].style.transform = 'rotateX(180deg)';

            console.debug("rotate Display Chat Contact");
            setTimeout(function(){
//				$('#chat_toolbar')[0].style.webkitTransform = 'rotateX(360deg)';
//				$('#chat_toolbar')[0].style.msTransform = 'rotateX(360deg)';
//				$('#chat_toolbar')[0].style.transform = 'rotateX(360deg)';

				setTimeout(function(){
					$('#chat_toolbar')[0].style.opacity = '1';
					_this.model.set( arg );
				}, 200)
            }, 300)
        },
        render: function () {
            console.log("render Display Chat Contact");
            var template = _.template(Tpl);
            $(this.el).html(template);
            App.chat.models.ContactDisplay = this.contact = new Contact({ displayonly: true, model: this.model, tmpdata: this.options.tmpdata });
            $('#chat_toolbar').append(this.contact.$el);
            return this;
        }
    });
});

