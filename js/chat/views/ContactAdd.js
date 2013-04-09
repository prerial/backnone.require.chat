define([
    'jquery',
    'backbone',
    'underscore',
    'application',
    'chat/collections/SearchContacts',
    'text!chat/templates/contact_search.html',
    'text!chat/templates/contact_add.html'
], function ($, Backbone, _, App, SearchContacts, SearchTpl, Tpl) {

    return Backbone.View.extend({
        //        id: "",
        //        className: "",
        events: function () {
            return App.isiPad ? {
                'keyup #sendMessage22': 'displayResults'
            } : {
                'keyup #sendMessage22': 'displayResults'
            }
        },
        displayResults: function (event) {
            var word = event.currentTarget.value;
            this.collection.search = function (letters) {
                if (letters == "") return this;
                var pattern = new RegExp(letters.toLowerCase()),
						attr;
                var list = this.filter(function (data) {
                    attr = data.attributes.profile.firstname + ' ' +data.attributes.profile.lastname;
                    attr = attr.toLowerCase()
                    return pattern.test(attr);
                });
                return new Backbone.Collection(list)
            };
            if (word !== "") {
                var dt = this.collection.search(word);
                var template = _.template(SearchTpl, { "data": dt.models });
                $("#chat_display_holder1").html(template);
            } else {
                $("#chat_display_holder1").html('');
            }
        },
        initialize: function () {
            _.bindAll(this, 'render');
            var model = Backbone.Model.extend();
            this.collection = new SearchContacts({ model: model });
            this.collection.fetch({
                success: function () {
                    var arg = arguments;
                },
                error: function () {
                    debugger
                }
            });
            this.render();
        },
        render: function () {
            console.log("render Add Contact");
            var template = _.template(Tpl);
            $(this.el).html(template);
            return this;
        }
    });
});

