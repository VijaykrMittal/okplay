(function(global){
    var homeViewModel
        app = global.app = global.app || {};
    
    homeViewModel = kendo.data.ObservableObject.extend({
        
        categorydrawerData:'',
        categoryName:'',
        dataListStatus:'',
        categoryText:'',
        listData:'',
        articleDetail:'',
        
        categoryShow:function(e)
        { 
            e.view.scroller.scrollTo(0, 0);
            if(sessionStorage.getItem('mainArticleStatus') === null || sessionStorage.getItem('mainArticleStatus') === "null")
            {
                var category = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: 'http://okplay.club/mobileapi/allcategories',
                            type:"GET",
                            dataType: "json",
                        }
                    },
                    schema: {
                        data: function(data)
                        {
                            return [data];
                        }
                    },
                    error: function (e) {
                        navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                        function () { }, "Notification", 'OK');
                    },

                });
                category.fetch(function(){
                    var data = this.data();
                    //app.mobileApp.showLoading();
                    app.homeService.viewModel.getCategoryData(data[0]);
                    app.homeService.viewModel.fetchCategoryData(data[0][0]['id']);
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
            
            for (x in data) 
            {
                if($.isNumeric(x))
                {
                    dataItem['col' + x] = data[x]['name'];
                    columns.push({
                        field: 'col' + x,
                        width: 192,
                        filterable: true,
                        attributes: {
                            "data-id": data[x]['id'],
                            "align":'center'
                        }
                    });
                }
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
            //app.mobileApp.hideLoading();
        },
        
        passCategoryId:function()
        {
            app.homeService.viewModel.fetchCategoryData($('.k-state-selected').attr('data-id'));
        },
        
        ageshow : function(e)
        {
            $('[data-role="drawer"]').children().css("background-color","#373F4A");
            e.view.scroller.scrollTo(0, 0);
            
            var ageData = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'http://okplay.club/mobileapi/all-ages-list',
                        type:"GET",
                        dataType: "json",
                    }
                },
                schema: {
                    data: function(data)
                    {
                        return [data];
                    }
                },
                error: function (e) {
                    navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
                },

                });
                ageData.fetch(function(){
                    var data = this.data();
                    app.homeService.viewModel.setAgeDataSource(data[0]);
                });
        },
        
        setAgeDataSource :function(data)
        {
            this.set("agedrawerData",data);
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
               /* this.set("categoryName",data[0]['value']);
                this.set("categoryText",data[0]['text']);*/
                this.set("listData",data);
            }
        },
        
        drawerAgeFilter : function(e)
        {
            var data = e['target']['attributes']['data-id'].value;
            var categoryDataSource  = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url:'http://okplay.club/mobileapi/article-list',
                            type:"GET",
                            dataType: "json",
                            data: { apiaction:"articlelist",catId:sessionStorage.getItem("categorySelectItem"),ageId:data} 
                        }
                        
                    },
                    filter: { field: "value", operator: "eq", value: data },
                    schema: {
                        data: function(data)
                        {
                        	return [data];
                        }
                    },
                    error: function (e) {
                    	navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    	function () { }, "Notification", 'OK');
                    },
                });
                categoryDataSource .fetch(function(){
                    var that = this;
                    var data = that.data();
                    app.homeService.viewModel.setcategoryData(data[0]['data']);
                });
            
            $("#age-drawer").data("kendoMobileDrawer").hide();
        },
        
        fetchCategoryData : function(data)
        {
            sessionStorage.setItem("categorySelectItem",data);
            var categoryDataSource  = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url:'http://okplay.club/mobileapi/article-list',
                            type:"GET",
                            dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                            data: { apiaction:"articlelist",catId:data} 
                        }
                        
                    },
                    filter: { field: "value", operator: "eq", value: data },
                    schema: {
                        data: function(data)
                        {
                        	return [data];
                        }
                    },
                    error: function (e) {
                    	navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    	function () { }, "Notification", 'OK');
                    },
                });
                categoryDataSource .fetch(function(){
                    var that = this;
                    var data = that.data();
                    app.homeService.viewModel.setcategoryData(data[0]['data']);
                });
        },
        
        storyBlokshow:function(e)
        {
            var category = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: 'http://okplay.club/mobileapi/article-detail',
                        type:"GET",
                        dataType: "json", 
                        data: { apiaction:"articledetail",nodeId:e['sender']['params']['id']} 
                    }
                },
                schema: {
                    data: function(data)
                    {
                        return [data];
                    }
                },
                error: function (e) {
                    navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
                },

            });
            category.fetch(function(){
                var data = this.data();
                console.log(data);
               // app.mobileApp.showLoading();
                app.homeService.viewModel.setblokDataSource(data[0]['data']);
            });
            
        },
        
        setblokDataSource:function(data)
        {
            this.set("articleDetail",data);
        },
        
        readyToBlock:function(e)
        {
            console.log(e);
            sessionStorage.setItem("mainArticleStatus","true");
            app.mobileApp.navigate("views/blokview.html?id="+(e['currentTarget']['attributes']['data-id'].value));
        }
        
        
    });
    app.homeService = {
        viewModel : new homeViewModel()
    };
}(window));