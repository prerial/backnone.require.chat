define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'text!comcenter/templates/contact/contact_info.html',
    'text!comcenter/templates/contact/contact.html'
], function ($, Backbone, _, App, InfoTpl, Tpl) {

    return Backbone.View.extend({
        tagName: "div",
        events: function () {
            return App.isiPad ?
            {
                "touchstart": "clickedContact",
                "touchstart .deleteContact": "showDeleteDialog",
                "touchstart .infoContact": "showContactInfo"
            } :
            {
                "click": "clickedContact",
                "click .deleteContact": "showDeleteDialog",
                "click .infoContact": "showContactInfo"
            }
        },
        initialize: function () {
            $.extend(this, this.options);
            this.model.on('change', this.render, this);
//            this.render();
        },
        render: function () {
            var dispinfo = $(this.el).find('.infoContact').css('display');
            var dispdel = $(this.el).find('.deleteContact').css('display');
            console.log("render Contact " + this.model.attributes.chid);
            var template = _.template(Tpl, { contact: this.model.attributes });
            $(this.el).html(template);
            $(this.el).find('.infoContact').css('display', dispinfo);
            $(this.el).find('.deleteContact').css('display', dispdel);
            return this;
        },
        showContactInfo: function (evt) {
            App.eventManager.trigger("hideAll");
            $('.click').removeClass('flip');
            var template = _.template(InfoTpl, { user: this.model.attributes });
            $('#contactInfo').html(template);
            $('.contact-info-container').css('opacity', '1');
            $('.contact-info-container').addClass('flip');
            App.chat.displaySlider.slide(8);
            App.eventManager.trigger("resetToolbar", {source:'info'});
            InviewApp.Utils.stopPropagation(evt);
            return false;
        },
        showDeleteDialog: function (evt) {
            InviewApp.Utils.stopPropagation(evt);
            App.dialog.$el.find('ul').html(InviewApp.Config.Dialogs.DeleteContact);
            App.dialog.$el.css('position', 'absolute').css('top', $(evt.target).offset().top + 32).css('left', $(evt.target).offset().left - 2);
            App.dialog.$el.show();
            App.eventManager.unbind("deleteContact");
            App.eventManager.on("deleteContact", this.deleteContact, this);
            return false;
        },
        deleteContact: function () {
            if (App.chat.conversations.active === this.model.attributes.chid) {
                App.eventManager.trigger("updateUser", InviewApp.Config.InitContactData);
            }
            if (App.chat.conversations.display[this.model.attributes.chid].popup) {
                App.chat.conversations.display[this.model.attributes.chid].popup.parent().remove();
                delete App.chat.conversations.display[this.model.attributes.chid];
            }
            App.eventManager.unbind("deleteContact", this.deleteContact, this);
            App.dialog.$el.hide();
            this.model.destroy();
            $(this.el).remove();
            App.eventManager.trigger("showDeleteContacts");
        },
        clickedContact: function (evt) {
            if (this.model && !this.displayonly) {
                App.eventManager.trigger("startConversation", this.model);
                if (this.model && App.chat.alerts[this.model.attributes.chid]) {
                    App.eventManager.trigger("serverMessage", { data: JSON.stringify(App.chat.alerts[this.model.attributes.chid]) });
                    delete App.chat.alerts[this.model.attributes.chid];
                    if (Object.keys(App.chat.alerts).length === 0) App.eventManager.trigger('showAlert', false);
                }
                $('.hovered').removeClass('selected');
                $(this.el).addClass('selected');
            }
        }
    });
});

