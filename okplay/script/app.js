var app = (function(global){
    
    var mobileApp = new kendo.mobile.Application(document.body,
                                                                {
                                                                    skin:'flat',
                                                                    initial:'views/homepage.html'
                                                                }
    );
    
    return{
      mobileApp : mobileApp  
    };
}(window));