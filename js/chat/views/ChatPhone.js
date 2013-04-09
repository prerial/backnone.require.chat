define([
    'jquery',
    'backbone',
    'underscore',
    'text!chat/templates/chat_phone.html'
], function ($, Backbone, _, Tpl) {

    return Backbone.View.extend({
//        id: "",
//        className: "",
        initialize: function () {
            _.bindAll(this, 'render');
            this.render();
        },
        render: function () {
            console.log("render chatPhone");
            var template = _.template(Tpl);
            $(this.el).html(template);
            return this;
        }
    });
});

