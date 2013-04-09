define([
        'jquery', 
        'backbone', 
        'underscore',
        'text!templates/placeBar.html'
    ], 
	function(
	    $, 
	    Backbone, 
	    _, 
	    PlaceBar_Tpl
	){

	var PlaceBar_View = Backbone.View.extend({
	    id: 'placeBar',
        events: function(){
            return Inview.isiPad ?
            {
              "touchstart .subnav_vid": "startVideo",
              "touchstart .subnav_camera": "startCamera"
            } :
            {
              "click .subnav_vid": "startVideo",
              "click .subnav_camera": "startCamera"
            }
        },  
		initialize : function() {
		    console.log("init PlaceBar_View");
			_.bindAll(this, 'render', 'startCamera', 'startVideo', 'captureSuccess', 'captureError');
		},

		render : function() {
		    console.log("render PlaceBar_View");



            var template = _.template( PlaceBar_Tpl);
            $(this.el).html(template);            
            


            return this;
		},
		startCamera: function(){
		    console.log("camera");
		    navigator.device.capture.captureImage(this.captureSuccess, this.captureError, {limit: 2});
		},
        startVideo: function(){
            console.log("video");
            navigator.device.capture.captureVideo(this.captureSuccess, this.captureError, {limit: 2});
        },		
		
		captureSuccess: function(){
		    //alert("capture success");
		},
		captureError: function(){
            //alert("capture error");
        }
		
		
		
	});

	return PlaceBar_View;

});

