define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'text!templates/display_modal.html'
], function ($, Backbone, _, App, Tpl) {

    return Backbone.View.extend({
        id: "displayModal",
        className: "display-modal",
        top: null,
        events: function () {
            return App.isiPad ?
            {
                "touchstart .display-modal-cover": "closeModal"

            } :
            {
                "click .display-modal-cover": "closeModal"
            }
        },
        closeModal: function (evt) {
            console.log("close Modal");
            $('.display-modal-cover').hide();
            App.modal.$el.removeClass('display-modal-transform');
            if(this.top !== null) App.modal.$el.css('top', this.top);
            App.modal.$el.css('width', '0px').css('height', '0px');
        },
        initialize: function () {
            _.bindAll(this, 'render', 'closeModal');
            $('.display-modal-cover').live("touchstart", this.closeModal);
            $('.display-modal-cover').live("click", this.closeModal);
            this.render();
        },
        render: function () {
            console.log("render chat Dialog");
            $('body').append("<div class='display-modal-cover'></div>");
            $('.display-modal-cover').hide();
            var template = _.template(Tpl, { content: InviewApp.Config.Dialogs.EditContacts });
            $(this.el).html(template);
            return this;
        }
    });
});

