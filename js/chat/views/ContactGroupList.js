define([
    'jquery',
    'backbone',
    'underscore',
    'slide',
    'application',
    'chat/views/ContactGroup',
    'chat/collections/ContactGroupList',
    'text!chat/templates/contact_list.html'
], function ($, Backbone, _, Slide, App, Contact, ContactsGroupCollection, Tpl) {

    return Backbone.View.extend({
        id: "chatGroupContacts",
        className: "chatGroupContacts",
        showedit: false,
        showinfo: false,
        initialize: function () {
            var _this = this;
//            App.eventManager.on("showDeleteContacts", this.showDeleteContacts, this);
//            App.eventManager.on("showInfoContacts", this.showInfoContacts, this);
            App.chat.ContactGroupList = {};
            var model = Backbone.Model.extend();
            this.collection = new ContactsGroupCollection({ model: model });
            this.collection.fetch({
                success: function () {
//debugger
                    _this.addAll(_this.collection);
                    _this.render();
                },
                error: function (a,b,c,d) {
                    debugger
                }
            });
        },
        showDeleteContacts: function (evt) {
            console.log('display Edit');
            $(this.el).find('.infoContact').hide();
            this.showinfo = false;
            if (this.showedit) {
                $(this.el).find('.deleteContact').hide();
                App.dialog.$el.hide();
                this.showedit = false;
            } else {
                $(this.el).find('.deleteContact').show();
                this.showedit = true;
            }
        },
        showInfoContacts: function (evt) {
            console.log('display Info');
            $(this.el).find('.deleteContact').hide();
            this.showedit = false;
            if (this.showinfo) {
                $(this.el).find('.infoContact').hide();
                App.dialog.$el.hide();
                this.showinfo = false;
            } else {
                $(this.el).find('.infoContact').show();
                this.showinfo = true;
            }
        },
        addOne: function (model) {
            var contact = new Contact({ model: model }).render();
            var el = contact.$el;
            el.addClass('hovered');
            $('#chatGroupContacts ul').append(el);
            App.chat.ContactGroupList[model.attributes.chid] = model.attributes;
            App.chat.ContactGroupList[model.attributes.chid].el = el;
            App.chat.ContactGroupList[model.attributes.chid].model = model;
/*
            if (!App.chat.conversations.display[model.attributes.chid]) {
                App.chat.conversations.display[model.attributes.chid] = {};
                App.chat.conversations.display[model.attributes.chid].popup = $('<div class="chat-display"><span style="color:#ddd">' + model.attributes.title + ' messages</span></div>');
                var liItem = $('<li style="display:block;"></li>').append(App.chat.conversations.display[model.attributes.chid].popup);
                $('#chat_display_holder ul').append(liItem);
            }
*/
        },
        addAll: function () {
            var _this = this;
            var template = _.template(Tpl);
            $(this.el).append(template);
            this.collection.each(this.addOne);
//            App.chat.slider = new Slide($('#chat_display_holder'));
        },
        render: function () {
            console.log("render chatGroupContacts");
///            App.chat.scrolls.ControlList = new iScroll('chatContacts');
            return this;
        }
    });
});

