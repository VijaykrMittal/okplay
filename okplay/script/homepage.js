var app = app || {};

app.homepage = (function(){
    'use strict';
    
    var categoryViewModel = (function(){
        
        var categoryDataSource = new kendo.data.DataSource({
            transport:{
                read:{
                    url:'script/category.json',
                    dataType:'json'
                }
            }
        });
        return{
            categorydrawerData:categoryDataSource
        };
    }());
    
    var homePageViewModel = (function(){
        
        var show = function(e)
        {
            $('[data-role="drawer"]').children().css("background-color","#373F4A");
            e.view.scroller.scrollTo(0, 0)
        };
        
        var drawerChildClick = function(e)
        {
           console.log(e);
            alert(e['target']['attributes']['data-id'].value);
            alert(e['target']['attributes']['data-value'].value);
            
            if(e['target']['attributes']['data-value'].value === "category")
            {
                alert("category");
                app.mobileApp.navigate("#healthView");
            }
            
            if(e['target']['attributes']['data-value'].value === "age")
            {
                alert("age");
            }
        };
       
        return {
            categorydrawerData:categoryViewModel.categorydrawerData,
            drawerChildClick:drawerChildClick,
            show:show
        };
    }());
    return homePageViewModel;
}());