define([
    'require',
    'jquery',
    'backbone',
    'underscore',
    'application'
],
function (require, $, Backbone, _, App) {

	function onMediaError(e) {
		console.error('Error:', e.name, e.message);
	}

    var utils = {
        mediaRoom: function () {
            var _this = this;
			var args = arguments[0];
			this.type = args.type;
			this.localContainer = $('#' + args.localcontainer);
			this.remoteContainer = $('#' + args.remotecontainer);
			this.miniContainer = $('#' + args.minicontainer);

            this.initialize = function () {
				_this.localStream = null;
				_this.remoteStream = null;
				_this.isVideoMuted = false;
				_this.isAudioMuted = false;
				_this.activeUser = null;
				_this.peers = {};
            };

            this.gotLocalStream = function (stream) {};

            this.start = function (param) {
             	_this.initialized = false;
				_this.sessionid = param.sessionid;
                _this.user = param.user;
                _this.targetUser = param.targetUser;
                console.log("Requesting local stream");
                navigator.getUserMedia(InviewApp.Config.Constrains.UserMedia[_this.type], _this.gotLocalStream, onMediaError );
            };

            this.call = function () {
                console.debug("================== Starting ==========================");
                console.log('Creating PeerConnection.');
                createPeerConnection();
                console.log('Adding local stream.');
                _this.peers[_this.user].addStream(_this.localStream);
                _this.activeUser = _this.user;
                if (App[_this.type].moderator) {
                    _this.peers[_this.user].createOffer(setLocalAndSendMessage, onMediaError, InviewApp.Config.Constrains.MediaConstraints[_this.type]);
                    console.debug('Sending offer to peer, with constraints:', InviewApp.Config.Constrains.MediaConstraints[_this.type]) ;
                }
            };

            function createPeerConnection() {
                try {
                    _this.peers[_this.user] = new RTCPeerConnection(iceServers, InviewApp.Config.Constrains.MediaConstraints[_this.type]);
                    _this.peers[_this.user].onicecandidate = onIceCandidate;
					_this.peers[_this.user].onaddstream = onRemoteStreamAdded;
					_this.peers[_this.user].onremovestream = onRemoteStreamRemoved;
                    console.log('Created RTCPeerConnnection with: ', iceServers, InviewApp.Config.Constrains.MediaConstraints[_this.type]);
                } catch (e) {
                    console.log('Failed to create PeerConnection, exception: ' + e.message);
                    alert('Cannot create RTCPeerConnection object; \
            		WebRTC is not supported by this browser.');
                }
            }

            this.doAnswer = function () {
                console.debug('Sending answer to peer.');
                _this.peers[_this.user].createAnswer(setLocalAndSendMessage, onMediaError, InviewApp.Config.Constrains.MediaConstraints[_this.type]);
				console.debug('Sending answer to peer, with constraints:', InviewApp.Config.Constrains.MediaConstraints[_this.type]) ;
            };

            function setLocalAndSendMessage(sessionDescription) {
                _this.peers[_this.user].setLocalDescription(sessionDescription);
				var data = {};
				data.type = _this.type + sessionDescription.type;
				data.sdp = sessionDescription.sdp;
                sendMessage(data);
            }

            function sendMessage(message) {
                var msgString = JSON.stringify(message);
                console.log('C->S: ', message.sdp? message.sdp: message);
                console.log('=======================================');
                App[_this.type][_this.type + 'Socket'].send(message);
            }

            function onIceCandidate(event) {
                if (event.candidate) {
                    sendMessage({
                        type: _this.type + 'candidate',
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    });
                } else {
                    console.log('End of candidates.');
                }
            }

            this.reattachMediaStream = function (to, from) {
                to.src = from.src;
            };

            function onRemoteStreamAdded(event) {
                console.log('Remote stream added.');
                if(_this.type === 'video'){
					_this.reattachMediaStream(miniVideo, localVideo);
					miniVideo.src = localVideo.src;
					var mediaElement = $('<video autoplay="autoplay" style="top:0;position:absolute;border:4px solid #fff;"></video>');
					mediaElement[0].src = URL.createObjectURL(event.stream);
					mediaElement[0].id = 'video_' + _this.targetUser;
					try{
						_this.remoteContainer.append(mediaElement);
					} catch (ex) {
					}
					_this.remoteStream = event.stream;
                }else{
					$('#remotePhone')[0].src = URL.createObjectURL(event.stream);
					_this.remoteStream = event.stream;
                }
                waitForRemoteVideo();
            }

            function onRemoteStreamRemoved(event) {
                console.log('Remote stream removed.');
            }

            this.hangup = function () {
                if (_this.remoteStream !== null) {
                console.log('Hanging up.');
                transitionToWaiting();
//                if (App.video.moderator) {
                    sendMessage({ type: _this.type + 'hangup', mode: 'remote' });
//                } else {
//                    sendMessage({ type: 'hangup', mode: 'local' });
//                }
                _this.localContainer.css('opacity', 0);
				_this.remoteContainer.css('opacity', 0);
                setTimeout(function () {
                    stop();
                    console.debug('Clicked hangup.');
                }, 1000);
                }
			};

            this.onRemoteHangup = function () {
                transitionToWaiting();
                setTimeout(function () {
                   _this.initialized = false;
                    stop();
                }, 1000);
            };

            function stop() {
                if (_this.remoteStream !== null) {
                    App.video.moderator = false;
                    _this.isAudioMuted = false;
                    _this.isVideoMuted = false;
                    try{
                        console.debug("Remote Stream: ", _this.remoteStream);
                        console.debug("Connection: ", _this.peers[_this.user]);
                        if(_this.remoteStream.stop) _this.remoteStream.stop();
                        var loctracks = _this.localStream.getTracks();
                        loctracks.forEach(function(track){
                            track.stop();
                        });
                        _this.remoteStream = null;
                        delete _this.remoteStream;
                        _this.localStream.stop();
                        _this.localStream = null;
                        delete _this.localStream;
                        _this.peers[_this.user].close();
                        _this.peers[_this.user] = null;
                        console.debug('Remove peer');
                    }catch(ex){
                    }
                    $('#localVideo')[0].src = "";
                    $('#miniVideo')[0].src = "";
                    _this.remoteContainer.find('video').remove();
                    _this.localContainer.css('opacity', 1);
                    if(_this.miniContainer !== null) _this.miniContainer.css('opacity', 1);
                    App.eventManager.trigger('setPresence', 'online');
                    console.debug('Session terminated.');
                    console.debug("================== End ==========================");
                    _this.initialized = true;
                    _this.initialize();
                }
            }

            function waitForRemoteVideo() {
                videoTracks = _this.remoteStream.getVideoTracks();
				try{
					if (videoTracks.length === 0 || $('#video_'+_this.targetUser)[0].currentTime > 0) {
						_this.localContainer.css('opacity', 0.1);
						_this.remoteContainer.css('opacity', 0.1);
						setTimeout(transitionToActive, 1000);
					} else {
						setTimeout(waitForRemoteVideo, 1000);
					}
				}catch(ex){
				}
            }

            function transitionToActive() {
				_this.remoteContainer.css('display', 'block').css('opacity', 1);
                if(_this.miniContainer !== null) {
                	_this.miniContainer.css('opacity', 1).css('width', '110px')
				}
            }

            function transitionToWaiting() {
				if(_this.miniContainer !== null) _this.miniContainer.css('width', '0px');
				_this.remoteContainer.css('display', 'none').css('opacity', 0);
                if (App.video.moderator) {
                    console.debug('transitionToWaiting' + App.video.moderator);
                    _this.localContainer.css('opacity', 1);
                } else {
                    console.debug('transitionToWaiting' + App.video.moderator);
                    _this.localContainer.css('opacity', 0);
                }
                setTimeout(function () {
                    if(localVideo && localVideo.src) localVideo.src = '';
                    if(miniVideo && miniVideo.src) miniVideo.src = '';
                    if(remoteVideo && remoteVideo.src) remoteVideo.src = '';
                }, 1000);
            }
/*
            $(window).on('beforeunload', function () {
            	console.debug('beforeunload', _this.type + 'hangup')
                sendMessage({ type: _this.type + 'hangup', mode: 'window' });
            });
*/
            function enterFullScreen() {
                container.webkitRequestFullScreen();
            }

            this.toggleVideoMute = function() {
                var videoTracks = this.localStream.getVideoTracks();
                if (videoTracks.length === 0) {
                    console.log('No local video available.');
                    return;
                }
                if (this.isVideoMuted) {
                    for (i = 0; i < videoTracks.length; i++) {
                        videoTracks[i].enabled = true;
                    }
                    console.log('Video unmuted.');
                } else {
                    for (i = 0; i < videoTracks.length; i++) {
                        videoTracks[i].enabled = false;
                    }
                    console.log('Video muted.');
                }
                this.isVideoMuted = !this.isVideoMuted;
            };

            this.toggleAudioMute = function() {
                var audioTracks = this.localStream.getAudioTracks();
                if (audioTracks.length === 0) {
                    console.log('No local audio available.');
                    return;
                }
                if (this.isAudioMuted) {
                    for (i = 0; i < audioTracks.length; i++) {
                        audioTracks[i].enabled = true;
                    }
                    console.log('Audio unmuted.');
                } else {
                    for (i = 0; i < audioTracks.length; i++) {
                        audioTracks[i].enabled = false;
                    }
                    console.log('Audio muted.');
                }
                this.isAudioMuted = !this.isAudioMuted;
            };

        },

        /**
        * moduleResources - make sure all resources are loaded and assigned into sandbox
        * @param sandbox - sandbox where all the loaded resources should be in
        * @param moduleFiles - array of sandbox enabled CommonJS Module
        * @param templateFiles - array of template files eg. 'text!/js/xxxx'
        */
        load: function (sandbox, moduleFiles, templateFiles, callback, context) {
            //ensure sandbox structure
            sandbox = _.defaults(sandbox, { views: {}, models: {}, collections: {}, templates: {} });

            // prepare files to load
            var templatesLen = templateFiles.length,
                filesToLoad = moduleFiles.concat(templateFiles || []);


            require(filesToLoad, function () {
                var args = Array.prototype.slice.call(arguments),
                    common_modules_end = filesToLoad.length - templatesLen;

                domReady(function () {
                    // load modules into sandbox
                    var i = 0, mod;
                    for (i = 0; i < common_modules_end; i++) {
                        mod = args[i];
                        if (mod) {
                            mod(sandbox);
                        }
                    }

                    // load templates into sandbox
                    for (i = common_modules_end, len = filesToLoad.length; i < len; i++) {
                        var templates = args[i];
                        $(templates).each(function () {
                            var template_id = $(this).attr('id');
                            var element_type = $(this).attr('type');
                            if (template_id && element_type) {
                                sandbox.templates[template_id] = _.template($(this).html());
                            }
                        });
                    }

                    if (callback) {
                        context = context || window;
                        callback.call(context); //default context is window
                    }
                });
            });
        },

        parseXml: function (xml) {
            var dom = null;
            if (window.DOMParser) {
                try {
                    dom = (new DOMParser()).parseFromString(xml, "text/xml");
                }
                catch (e) { dom = null; }
            }
            else if (window.ActiveXObject) {
                try {
                    dom = new ActiveXObject('Microsoft.XMLDOM');
                    dom.async = false;
                    if (!dom.loadXML(xml)) // parse error ..

                        window.alert(dom.parseError.reason + dom.parseError.srcText);
                }
                catch (e) { dom = null; }
            }
            else
                alert("cannot parse xml string!");
            return dom;
        },

        xmlParser: function () {
            return null;
        },

        generateProjectNamespace: function (project, settings) {
            settings = settings || {};
            var app = { utils: utils, context: {}, common: {}, eventBus: _.extend({}, Backbone.Events) },
                module = {
                    TOUCHABLE: /iPad/i.test(navigator.userAgent) || /iPhone OS 3_1_2/i.test(navigator.userAgent) || /iPhone OS 3_2_2/i.test(navigator.userAgent),
                    models: {},
                    collections: {},
                    views: {},
                    templates: {},
                    router: undefined,
                    data: {},
                    root: app,
                    settings: settings
                };
            app[project] = module;
            return app;
        },



        randomBetween: function (from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        },

        createUUID: (function (uuidRegEx, uuidReplacer) {
            return function () {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
            };
        })(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == "x" ? r : (r & 3 | 8);
            return v.toString(16);
        }),

        createDialog: function (options) {

            return new DialogView(options);

        },

        busy: function (show, zIndex) {
            if (show) {
                BusyOverLay.open(zIndex);
            } else {
                BusyOverLay.close();
            }
        },
        string: {
            contains: function (str, needle) {
                if (needle === '') return true;
                if (str == null) return false;

                str = str.toLowerCase();
                needle = needle.toLowerCase();
                return String(str).indexOf(needle) !== -1;
            },
            trim: function (str) {

                if (str == null) return '';
                return str.replace(/^\s+|\s+$/g, '');
            },
            isNumber: function (input) {
                return (input - 0) == input && (input + '').replace(/^\s+|\s+$/g, "").length > 0;
                //return !isNaN(parseFloat(n)) && isFinite(n);
            }
        }


    };



    /****************************************/
    /*                    Dialog            */
    /****************************************/
    // Dialog view
    //require("Backbone");
    var DialogView = Backbone.View.extend({
        tagName: 'div',
        id: utils.createUUID(),
        attributes: {
            'class': "dialog-box"
        },
        view: null, //new Backbone.View({initialize:function(){},  render:function(){ $(this.el).html('hello');return this;}}),
        initialize: function (params) {
            var self = this;
            if (params && params.view) {
                self.view = params.view;
                self.view.parentView = self;
                self.onClose = params.onClose;
            }
        },

        render: function () {
            var self = this;
//            this.bodyoverflow = $('body').css('overflow-y');
            $('body').css({ 'overflow-y': 'hidden' });
            this.$el.hide();
            $('body').append(this.el);
            var inside_view = self.view.render();
            this.$el.html(inside_view.$el);
            setTimeout($.proxy(function () {
                // position dialog
                //$(self.el).outerWidth()
/*
                var top = ($(window).height() - $(self.$el).outerHeight()) * 0.5;
                var left = ($(window).width() - $(self.$el).outerWidth()) * 0.5;

                $(self.el).css({
                    position: 'absolute',
                    top: top + 'px',
                    left: left + 'px',
                    position: 'absolute',
                    'z-index': 10005
                });

                inside_view.$el.css({
                    position: 'relative'
                });

                $('body').css({ 'overflow-y': this.bodyoverflow });
*/
            }, this), 10);
            return this;
        },
        open: function () {
            //$('BODY').addClass('blackout');
            $('body').append('<div id="' + this.id + '_overlay" class="blackout fullwindow"></div>');
            this.render();
            this.$el.fadeIn(250);
            window.dialog = this;
        },
        close: function () {
            //$('BODY').removeClass('blackout');
            $('#' + this.id + '_overlay').remove();
            var self = this;
            self.view.remove();
            self.remove();

            if (self.onClose) {
                self.onClose();
            }
        }
    });

    var BusyOverLay = (function () {
        var overlay_id = utils.createUUID();
        return {
            open: function (zIndex) {
                var zstr = 'z-index:20000';
                if (zIndex) {
                    zstr = 'z-index:' + zIndex;
                }
                $('body').append('<div style="' + zstr + '" id="' + overlay_id + '_overlay" class="blackout fullwindow"><div style="" class="vault-busy"><div class="vault-busy-loading"></div></div></div>');
            },
            close: function () {
                $('#' + overlay_id + '_overlay').remove();
            }

        };

    })();

    return utils;
});
