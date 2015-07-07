var app = app || {};

app.homepage = (function(){
    'use strict';
    
    var drawerViewModel = (function(){
        
        var drawerDataSource = new kendo.data.DataSource({
            transport:{
                read:{
                    url:'script/category.json',
                    dataType:'json'
                }
            }
        });
        return{
            drawerData:drawerDataSource
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
        };
       
        return {
            drawerData:drawerViewModel.drawerData,
            drawerChildClick:drawerChildClick,
            show:show
        };
    }());
    return homePageViewModel;
}());