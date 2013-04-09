define(['jquery', 'backbone', 'underscore', 'application',
    'views/OpportunitiesChart_View', 
    'views/OpportunitiesPanel_View'
    
    ], 
	function($, Backbone, _, Mediator,
	    OpportunitiesChart_View,
	    OpportunitiesPanel_View
    ){

	var Opportunities_View = Backbone.View.extend({
		id: "placeMain-opportunities",
        events: function(){
            return Inview.isiPad ?
            {
            	"touchstart .myFolderCover": "closeMyFolder"
              
            } :
            {
            	"click .myFolderCover": "closeMyFolder"
              
            }
        },

		initialize : function() {
		    console.log("init oppView");
			_.bindAll(this, 'render', 'openMyFolder', 'closeMyFolder'); 
			 Mediator.subscribe("e_openMyFolder", this.openMyFolder);
			 Mediator.subscribe("e_closeMyFolder", this.closeMyFolder);
			
			
		},
		
		openMyFolder : function(){
			$(this.el).removeClass("closeFolder");
			$(this.el).prepend("<div class='myFolderCover'></div>")
			
			$(this.el).addClass("openFolder")
		},
		
		
		closeMyFolder : function(ev){
			
			$($(ev.target).get(0)).remove();
			$(this.el).removeClass("openFolder");
			$(this.el).addClass("closeFolder");
		},
				
		render : function() {
            

            
		    
            var opportunitiesChart_view = new OpportunitiesChart_View().render().el;
		    $(this.el).append(opportunitiesChart_view);
		    
		    var opportunitiesPanel_view = new OpportunitiesPanel_View().render().el;
            $(this.el).append(opportunitiesPanel_view);
		    
		    var myFolderExists = $("#myFolder").length;
		    console.log("AAAAA: "+ myFolderExists);

		    return this;
		}
		
		
	});

	return Opportunities_View;

});

