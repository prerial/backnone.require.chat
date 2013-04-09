define(['jquery', 'backbone', 'underscore', 'application',
        
        'views/content/type/Portfolio_View',
        'views/content/type/Book_View',
        'views/content/type/Opportunities_View',
        'views/content/type/Preview_View',
        'views/content/type/MyFolder_View',
        'views/content/type/Insight_View'
    ], 
	function($, Backbone, _, Application,
	    Portfolio_View,
	    Book_View,
	    Opportunities_View,
	    Preview_View,
	    MyFolder_View,
	    Insight_View
    ){

	var PlaceMain_View = Backbone.View.extend({
		id: "placeMain",
		initialize : function() {
			_.bindAll(this, 'render', 'changePlace', 'openMyFolder');
            Application.on("e_changePlace", this.changePlace);
            Application.on("e_openMyFolder", this.openMyFolder);
		},
		render : function() {
            this.changePlace();
            return this;
		},
		openMyFolder : function(){
		    if (typeof Inview.myFolder_view != "undefined") {
		    }else{
		        Inview.myFolder_view = new MyFolder_View();
                $(this.el).prepend(Inview.myFolder_view.render().el);
		    }
		},
		changePlace : function(placeID){
		    placeID = Inview.app.model.get("currentPlaceID");
		    console.log("changing to "+placeID);
            // FIX THIS LATER       
            $("#iv_main").removeClass("Preview");
            $("#iv_main").removeClass("Portfolio");
            $("#iv_main").removeClass("Insight");
            $("#iv_main").removeClass("Connect");
            $("#iv_main").removeClass("Opportunities");
            $("#iv_main").removeClass("Vault");
            $("#iv_main").removeClass("Book");
            $("#iv_main").addClass(placeID);		    
            switch(placeID)
            {
            case 'Preview':
                var preview_view = new Preview_View();
                $(this.el).html(preview_view.render().el);
                break;
            case 'Portfolio':
                var portfolio_view = new Portfolio_View();
                $(this.el).html(portfolio_view.render().el);
                break;
            case 'Insight':
                var insight_view = new Insight_View();
                $(this.el).html(insight_view.render().el);
                break;
            case 'Connect':
                $(this.el).html("");
                break;
            case 'Opportunities':
                var opportunities_view = new Opportunities_View();
                $(this.el).html(opportunities_view.render().el);
                break;
            case 'Vault':
                $(this.el).html("");
                break;
            case 'Dashboard':
                $(this.el).html("");
                break;
            case 'Book':
                var book_view = new Book_View();
                $(this.el).html(book_view.render().el);
                break;
            default:
                $("#iv_main").addClass("Opportunities");
                var opportunities_view = new Opportunities_View();
                $(this.el).html(opportunities_view.render().el);
                break;
            }		    
		    if ($("#iv_main").hasClass("nav-open")){
		        Inview.app.model.set('isNavOpen', '0');
		        $("#iv_main").removeClass("nav-open");
		        $("#iv_main").addClass("nav-closed");
		    }
		}
	});

	return PlaceMain_View;
});

