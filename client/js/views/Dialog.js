define(['jquery',
'backbone',
'underscore',
'application',
'text!templates/dialog.html'
],
function ($, Backbone, _, App, Tmp) {

	return Backbone.View.extend({
	    events: function () {
	        return App.TOUCHABLE ?
            {
                "singletap button.cancel": "cancelDelete",
                "singletap button.confirm": "confirmDelete",
                "singletap .icon-close": "cancelDelete"
            } :
            {
                "click .alert": "cancelDelete",
                "click .cancel": "cancelDelete",
                "click .confirm": "confirmDelete",
                "click .icon-close": "cancelDelete",
                "click .signin": "loginButton"
            }
	    },

	    cancelDelete: function (e) {
	        if (this.options.callback) this.options.callback(false);
	        this.parentView.close();
	        e.stopPropagation();
	        return false;
	    },
        loginButton : function() {
            $(".dialog-box").addClass("log-in-success");
            setTimeout(function() {
                console.log("Login: " + $('#username').val());
                App.eventManager.trigger("authenticated", { 'type': 'authenticated', 'user': $('#username').val(), 'password': $('#password').val() });
                $(this.el).remove();
            },300);
        },

	    confirmDelete: function (e) {
            setTimeout(function() {
                console.log("Confirm Delete");
                $(this.el).remove();
            },300);
	        if (this.options.callback) this.options.callback(true);
	        return false;
	    },

	    render: function () {
	        var template = _.template(Tmp, { mode: this.options.mode, text: this.options.text });
	        $(this.el).html(template);
	        return this;
	    }
	});
});
