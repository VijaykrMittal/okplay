(function(global){
    var homeViewModel
        app = global.app = global.app || {};
    
    homeViewModel = kendo.data.ObservableObject.extend({
        
        categorydrawerData:'',
        categoryName:'',
        dataListStatus:'',
        categoryText:'',
        listData:'',
        blok:'',
        
        categoryShow:function(e)
        { 
            e.view.scroller.scrollTo(0, 0);
            if(sessionStorage.getItem('mainArticleStatus') === null || sessionStorage.getItem('mainArticleStatus') === "null")
            {
                var category = new kendo.data.DataSource({
                    transport:{
                        read:{
                            url:'script/category.json',
                            dataType:'json'
                        }
                    }
                });
                category.fetch(function(){
                    var data = this.data();
                    app.homeService.viewModel.getCategoryData(data);
                    app.homeService.viewModel.fetchCategoryData(data[0]['value']);
                });
            }
        },
        
        getCategoryData : function(data)
        {
            var dataItem = {};
            var columns = [];
            
            if(typeof $("#grid").data("kendoGrid") !=='undefined')
            {
                var grid = $("#grid").data("kendoGrid");
                grid.removeRow("tr:eq(1)");
                $( "#grid .k-grid-content").remove();
            }
            
            for (var i = 0; i < data.length; i++) {
                dataItem['col' + i] = data[i]['value'];
                columns.push({
                    field: 'col' + i,
                    width: 192,
                    filterable: true,
                    attributes: {
                        "data-id": data[i]['value'],
                        "align":'center',
                        "class":data[i]['class']
                    }
                });
            }
           
           $("#grid").kendoGrid({
                scrollable: true,
                change:app.homeService.viewModel.passCategoryId,
                columns: columns,
                filterable: true,
                type:'number',
                dataSource: [dataItem],
                selectable:'cell'
            });
        },
        
        passCategoryId:function()
        {
            alert("select Id : "+$('.k-state-selected').attr('data-id'));
            app.homeService.viewModel.fetchCategoryData($('.k-state-selected').attr('data-id'));
        },
        
        show : function(e)
        {
            $('[data-role="drawer"]').children().css("background-color","#373F4A");
            e.view.scroller.scrollTo(0, 0);
        },
        
        setcategoryData :function(data)
        {
            if(data.length === 0)
            {
                this.set("dataListStatus","There is no article.");
                //this.set("categoryText","");
                this.set("listData","");
            }
            if(data.length>0)
            {
                this.set("dataListStatus","");
                this.set("categoryName",data[0]['value']);
                this.set("categoryText",data[0]['text']);
                this.set("listData",data);
            }
        },
        
        drawerAgeFilter : function(e)
        {
            var data = e['target']['attributes']['data-id'].value;
            var categoryDataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:'script/categoryData.json',
                        dataType:'json'
                    }
                },
                filter:{
                    logic:"and",
                    filters:[
                        { field: "year", operator: "eq", value: data },
                        { field: "value", operator: "eq", value: sessionStorage.getItem('categorySelectItem') }
                    ]
                }
                });
            categoryDataSource.fetch(function(){
                var data = this.view();
                console.log(data);
                app.homeService.viewModel.setcategoryData(data);
            });
            
            $("#age-drawer").data("kendoMobileDrawer").hide();
        },
        
        fetchCategoryData : function(data)
        {
            sessionStorage.setItem("categorySelectItem",data);
            var categoryDataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:'script/categoryData.json',
                        dataType:'json'
                    }
                },
                filter: { field: "value", operator: "eq", value: data }
            });
            categoryDataSource.fetch(function(){
                var data = this.view();
                app.homeService.viewModel.setcategoryData(data);
            });
        },
        
        storyBlokshow:function(e)
        {
            var blokDataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:'script/categoryData.json',
                        dataType:'json'
                    }
                },
                filter: { field: "task", operator: "eq", value: e['sender']['params']['task'] }
            });
            blokDataSource.fetch(function(){
                var data = this.view();
                app.homeService.viewModel.setblokDataSource(data);
            });
            
        },
        
        setblokDataSource:function(data)
        {
            this.set("blok",data);
        },
        
        readyToBlock:function(e)
        {
            //alert("click");
           // console.log(e);
            sessionStorage.setItem("mainArticleStatus","true");
            app.mobileApp.navigate("views/blokview.html?task="+(e['currentTarget']['attributes']['data-task'].value));
        }
        
        
    });
    app.homeService = {
        viewModel : new homeViewModel()
    };
}(window));