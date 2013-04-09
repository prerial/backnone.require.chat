define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'chat/views/Contact',
    'text!chat/templates/contact.html',
    'text!chat/templates/chat_display.html'
], function ($, Backbone, _, App, Contact, ContactTpl, Tpl) {

    return Backbone.View.extend({
        initialize: function () {
            var arg = arguments[0];
            App.eventManager.on("updateUser", this.setModel, this);
            _.bindAll(this, 'render');
            this.render();
        },
        setModel: function () {
            this.model.set( arguments[0]);
        },
        render: function () {
            console.log("render Display Chat Contact");
            var template = _.template(Tpl);
            $(this.el).html(template);
            this.contact = new Contact({ displayonly: true, model: this.model, tmpdata: this.options.tmpdata });
            $(this.el).find('li').append(this.contact.$el);
            return this;
        }
    });
});

