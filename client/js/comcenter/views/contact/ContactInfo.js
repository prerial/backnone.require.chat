define([
    'jquery',
    'backbone',
    'underscore',
    'text!comcenter/templates/contact/contact_info.html',
], function ($, Backbone, _, Tpl) {

    return Backbone.View.extend({
        //        id: "",
        //        className: "",
        initialize: function () {
            _.bindAll(this, 'render');
            this.render();
        },
        render: function () {
            console.log("render contact info");
            var template = _.template(Tpl, { 'user': InviewApp.Config.User });
            $(this.el).html(template);
            return this;
        }
    });
});

