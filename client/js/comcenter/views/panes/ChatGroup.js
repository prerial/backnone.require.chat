define([
    'jquery',
    'backbone',
    'underscore',
    'text!comcenter/templates/panes/chat_group.html'
], function ($, Backbone, _, Tpl) {

    return Backbone.View.extend({
//        id: "",
//        className: "",
        initialize: function () {
            _.bindAll(this, 'render');
            this.render();
        },
        render: function () {
            console.log("render chatGroup");
            var template = _.template(Tpl);
            $(this.el).html(template);
            return this;
        }
    });
});

