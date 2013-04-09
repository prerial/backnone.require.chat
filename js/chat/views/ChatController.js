define([
    'require', 
    'jquery', 
    'backbone', 
    'underscore', 
    'slide', 
    'application', 
    'websocket', 
    'chat/views/Contact', 
    'chat/views/Toolbar', 
    'chat/views/ContactList', 
    'chat/views/ContactGroupList', 
    'chat/views/ContactDisplay',
    'chat/views/ChatGroup',
    'chat/views/ChatPhone',
    'chat/views/ChatVideo',
    'chat/views/ContactInfo',
    'chat/views/ContactAdd',
    'chat/views/settings/Settings',
    'text!chat/templates/chatpopup.html'
], function(require, $, Backbone, _, Slide, App, Websocket, Contact, Toolbar, ContactList, ContacGrouptList, ContactDisplay, ChatGroup, ChatPhone, ChatVideo, ContactInfo, ContactAdd, ChatSettings, PopUpTemplate) {

	return Backbone.View.extend({

		events : function() {
			return App.isiPad ? {
		        "touchstart .contListButton": "showContactsEdit",
				"touchstart .chatCover" : "hideChat",
				"touchstart .icon-settings" : "showSettings"
			} : {
		        "click .contListButton": "showContactsEdit",
				"click .chatCover" : "hideChat",
				"click .icon-settings" : "showSettings"
			}
		},

		initialize : function() {
            var _this = this;
			_.bindAll(this, 'render', 'showChat','hideChat');
			this.id = "chat";
			this.hidden = false;
			this.chatsettings = null;
			this.chatsettings_visible = false;
			this.websocket = null;
			App.eventManager.on("showChat", this.showChat);
			App.eventManager.on("hideChat", this.hideChat);
			App.eventManager.on("startConversation", this.startConversation, this);
			App.eventManager.on("serverMessage", this.onServerMessage, this);

//			App.isiPad ? $('.icon-settings').live("touchstart", this.showSettings) : $('.icon-settings').live("click", this.showSettings);
	//		App.isiPad ? $('.contListButton').live("touchstart", this.showContactsEdit) : $('.contListButton').live("click", this.showContactsEdit);
			$('#sendMessage').live("keypress", function(evt){
                if (evt.keyCode === 13){
                    _this.doSendOnClick();
                }
			});
            App.eventManager.on('toolbarClick', this.onToolbarClick, this);
            App.eventManager.on('closeAllPopUps', this.closeAllPopUps, this);
			App.eventManager.on("showContactList", this.showContactList);
			require(['text!chat/templates/chatpopup_content.html'], function(loadedTmp) {
				_this.template = _.template(loadedTmp);
				_this.render();
                App.chat.displaySlider = new Slide($('#chatDisplaySlider'));
			});
		},

		showContactList: function (evt) {
            if(arguments[0].type === 1){
           		App.dialog.$el.find('ul').html(InviewApp.Config.Dialogs.EditGroupContacts);
				$('.contact-list-title').html('Group&nbsp;/&nbsp;Contact&nbsp;List');
                this.contactGroupList = new ContacGrouptList;
			    $('.contactGroupList').html(this.contactGroupList.$el);
				$('.contact').addClass('flip');
            }else{
             	App.dialog.$el.find('ul').html(InviewApp.Config.Dialogs.EditContacts);
				$('.contact-list-title').html('Contact List');
				$('.contact').removeClass('flip');
            }
            if(arguments[0].type === 3){
                $('#video_left')[0].src = "data/gizmo.mp4";
                    $('#video_left')[0].play();
                $('#video_right')[0].src = "data/movie.mp4";
//                window.setTimeout(function(){
                    $('#video_right')[0].play();
//                },2000);
            }else{
                $('#video_left')[0].pause();
                $('#video_right')[0].pause();
//                $('#video_left')[0].src = "";
  //              $('#video_right')[0].src = "";
            }
		},


		render : function() {
			$(this.el).append(this.template(this.id));
//			$('body').append(this.template(this.id));
            var ucontact = new Contact({ displayonly: true, user: true, model: App.chat.models.UserContact });
			$('.userContact ul').append(ucontact.$el);
            var toolbar = new Toolbar;
			$('.chatToolbar').append(toolbar.$el);
            this.contactList = new ContactList;
			$('.contactList').append(this.contactList.$el);
            var chmodel = InviewApp.Utils.setContactModel(InviewApp.Config.InitContactData);
            App.chat.ContactDisplay = new ContactDisplay({model: chmodel});
			$('#chatTalk').append(App.chat.ContactDisplay.$el);
            var chatGroup = new ChatGroup();
			$('#chatGroup').append(chatGroup.$el);
            var chatPhone = new ChatPhone();
			$('#chatPhone').append(chatPhone.$el);
            var chatVideo = new ChatVideo();
			$('#chatVideo').append(chatVideo.$el);
            var contactInfo = new ContactInfo();
			$('#contactInfo').append(contactInfo.$el);
            var contactAdd = new ContactAdd();
			$('#contactAdd').append(contactAdd.$el);
            var chatSettings = new ChatSettings();
			$('#chatSettings').append(chatSettings.$el);
			$(this.el).append("<div class='chatCover'></div>");
//			$('body').append("<div class='chatCover'></div>");
//            App.chat.scrolls.Settings = new iScroll('chatSettingsWrapper');
			return this;
		},

		onToolbarClick: function (evt) {
            $('.infoContact').hide();
            $('.deleteContact').hide();
            this.contactList.showedit = false;
            this.contactList.showinfo = false;
		},

		closeAllPopUps: function (evt) {
            if( App.dialog &&  App.dialog.$el) {
                App.dialog.$el.hide();
            }
		},

		showContactsEdit: function (evt) {
            App.dialog.$el.css('position', 'absolute').css('top', $(evt.target).offset().top + 32).css('left', $(evt.target).offset().left - 2);
            App.dialog.$el.show();
		},

        doSendOnClick: function () {
            if($('#sendMessage').val() !== '' && App.chat.conversations.active){
                var message = $('#sendMessage').val();
                var pre = $('<p>');
                pre.css('word-wrap', 'break-word');
                pre.css('color', '#666');
                pre.html("Me: " + message);
                App.chat.conversations.display[App.chat.conversations.active].popup.append(pre);
                App.chat.conversations.webSocket.doSend(JSON.stringify({type:'conversation', 'chidTo': App.chat.conversations.active, 'chidFrom': InviewApp.Config.User.chid, 'message': message}))
           }
            window.setTimeout(function () {
                $('#sendMessage').val('');
                $('#sendMessage').blur();
            }, 100);
        },

		hideSettings : function() {
			if(this.chatsettings !== null){
                $('.chat-settings').hide();
                this.chatsettings_visible = false;
            }
		},

		showSettings : function() {
            App.eventManager.trigger("resetToolbar");
            if($('.icon-settings').hasClass('selected') && App.chat.displaySlider.getPos() === 4){
                $('.chatToolbar ul').find('div[idx=0]').addClass('selected');
                $('.icon-settings').removeClass('selected');
                App.chat.displaySlider.slide(0);
            }else{
                App.chat.displaySlider.slide(4);
                $('.icon-settings').addClass('selected');
            }
		},

		onServerMessage : function() {
            var arg = arguments[0];
            var result = jQuery.parseJSON(arg.data);
            if (result.type) {
                switch (result.type) {
                    case 'updateContact':
//debugger
                        if (App.chat.ContactList[result.chid]) {
                            App.chat.ContactList[result.chid].model.set(result.data);
                        }
                        if (App.chat.ContactDisplay.model.get('chid') === result.chid) {
                            App.chat.ContactDisplay.model.set(result.data);
                        }
                        break;
                    case 'update':
                        App.eventManager.trigger(result.action, { chid: result.chid, presence: result.presence});
                        break;
                    case 'start':
//                        if (InviewApp.Config.User.chid === result.chid) $('#chatNotification').html(result.message);
                        break;
                    case 'conversation':
                        if (InviewApp.Config.User.chid === result.chidTo) {
                            var pre = $('<p>');
                            pre.css('word-wrap', 'break-word');
                            pre.css('color', '#109E9C');
                            pre.html(App.chat.ContactList[result.chidFrom].title + ': ' + result.message);
//alert(result.message+"");
console.log(result.message);
                            App.chat.conversations.display[result.chidFrom].popup.append(pre)
                        }
                        break;
                }
            }
        },

		startConversation : function(evt) {
            var arg = arguments[0];
            App.chat.slider.slide(arg.collection.indexOf(arg));
            App.chat.conversations.active = arg.attributes.chid;
            App.chat.conversations.webSocket.doSend(JSON.stringify({type:'start', 'chid': arg.attributes.chid, message:'Message from ' + InviewApp.Config.User.title}))
            App.eventManager.trigger("updateUser", arg.attributes);
		},

		showChat : function() {
            this.hidden = true;
            App.chat.visible = true;
			$('div#chat').removeClass('paused');
			$('div#chat').removeClass('reversed');
			$('div#chat').addClass('forwards');
			$(this.el).append("<div class='chatCover'></div>");
		},

		hideChat : function() {
            this.closeAllPopUps();
            this.hideSettings();
            App.chat.visible = false;
			$('.chatCover').remove();
            this.hidden = false;
			var targetPopUpB = $('div#chat');
			targetPopUpB.removeClass('forwards');
			targetPopUpB.addClass('reversed');
            targetPopUpB.bind("webkitAnimationEnd", function(e) {
				targetPopUpB.addClass('popup chat paused forwards');
				targetPopUpB.unbind("webkitAnimationEnd");
			})
		},
	});
});
