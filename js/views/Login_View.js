define(['jquery', 'backbone', 'underscore', 'text!templates/login.html', 'application'],
	function ($, Backbone, _, Login_Tpl, Application) {

	var Login_View = Backbone.View.extend({
		events: function(){
		    return Application.isiPad ?
		    {
		      
		      "touchstart .button": "clickButton",
		      "touchstart input":"clearInput",
		      "blur input":"checkInput"
		    } :
		    {
		      "click .button": "clickButton",
		      "click input":"clearInput",
		      "blur input":"checkInput"
		    }
		},

initialize: function () {
//		    console.log("init loginView");
			_.bindAll(this, 'render', 'clickButton','clearInput','checkInput');
		},

		render : function() {
//		    console.log("render loginView");
            var template = _.template( Login_Tpl );
            $(this.el).append(template);
            return this;
		},
        clickButton : function() {
            $(".login-block").addClass("slide-out-left");
//            console.log("in click");
            setTimeout(function() {
                Application.eventManager.trigger("authenticated", { 'type': 'authenticated', 'user': $('#username').val(), 'password': $('#password').val() });
                $(this.el).remove();
            },300);
        },
        clearInput : function() {
//        	if (event.target.value == "Username" || event.target.value == "Password") {
//        		event.target.value = "";
//        	}
        },
        checkInput: function() {
//        	if (event.target.value == "") {
//        		event.target.value = (event.target.id == "username") ? "Username" : "Password";
//        	}
        }
	});

	return Login_View;

});

