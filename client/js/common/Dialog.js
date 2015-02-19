define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'text!templates/dialog.html'
], function ($, Backbone, _, App, Tpl) {

    return Backbone.View.extend({
        id: "chatDialog",
        className: "chatDialog",
        events: function () {
            return App.isiPad ?
            {
                "touchstart .menu-select li": "doAction"

            } :
            {
                "click .menu-select li": "doAction"
            }
        },
        doAction: function (evt) {
            switch ($(evt.target).attr('action')) {
                case 'delete':
                    App.eventManager.trigger("deleteContact");
                    App.dialog.$el.hide();
                    break;
                case 'edit':
                    App.eventManager.trigger("showDeleteContacts");
                    App.dialog.$el.hide();
                    break;
                case 'info':
                    App.eventManager.trigger("showInfoContacts");
                    App.dialog.$el.hide();
                    break;
                case 'add':
                    App.eventManager.trigger("resetToolbar");
                    App.chat.displaySlider.slide(9);
                    App.dialog.$el.hide();
                    break;
                case 'cancel':
                    App.dialog.$el.hide();
                    break;
            }
        },
        initialize: function () {
            _.bindAll(this, 'render');
            this.render();
        },
        render: function () {
            console.log("render chat Dialog");
            var template = _.template(Tpl, { content: InviewApp.Config.Dialogs.EditContacts });
            $(this.el).html(template);
            return this;
        }
    });
});

