define([
    'jquery',
    'backbone',
    'underscore',
    'slide',
    'application',
    'comcenter/views/Contact',
    'comcenter/collections/ContactList',
    'text!comcenter/templates/contact/contact_list.html'
], function ($, Backbone, _, Slide, App, Contact, ContactsCollection, Tpl) {

    return Backbone.View.extend({
        id: "chatContacts",
        className: "chatContacts",
        showedit: false,
        showinfo: false,
        initialize: function () {
            var _this = this;
            App.eventManager.on("showDeleteContacts", this.showDeleteContacts, this);
            App.eventManager.on("showInfoContacts", this.showInfoContacts, this);
            App.chat.ContactList = {};
            var model = Backbone.Model.extend();
            App.chat.ContactListCollection = this.collection = new ContactsCollection({ model: model });
            this.collection.fetch({
                success: function () {
                    _this.addAll(_this.collection);
                    _this.render();
                },
                error: function () {
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
            $('#chatContacts').append(el);
            App.chat.ContactList[model.attributes.chid] = model.attributes;
            App.chat.ContactList[model.attributes.chid].el = el;
            App.chat.ContactList[model.attributes.chid].model = model;
            if (!App.chat.conversations.display[model.attributes.chid]) {
                App.chat.conversations.display[model.attributes.chid] = {};
                App.chat.conversations.display[model.attributes.chid].popup = $('<div class="chat-display"></div>');
                var liItem = $('<li style="display:block;"></li>').append(App.chat.conversations.display[model.attributes.chid].popup);
                $('#chat_display_holder ul').append(liItem);
                //                App.eventManager.trigger("serverMessage", { data: evt });
                App.chat.conversations.webSocket.doSend(JSON.stringify({ type: 'getRemotePresence', 'chid': model.attributes.chid }));
            }
        },
        addAll: function () {
            var _this = this;
            var template = _.template(Tpl);
            $(this.el).append(template);
            this.collection.each(this.addOne);
            App.chat.slider = new Slide($('#chat_display_holder'));
        },
        render: function () {
            console.log("render chatContacts");
            return this;
        }
    });
});

