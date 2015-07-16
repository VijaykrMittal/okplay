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
        
        freshshow:function()
        {
            
            var dataItem = {};
            var columns = [];
            
            var data = [{ name: "Jane Doe", age: 30},{ name: "Jane Doe", age: 30},{ name: "Jane Doe", age: 30}];
            console.log(data[0])
            
            for (var i = 0; i < data.length; i++) {
                dataItem['col' + i] = data[i]['name'];
                columns.push({
                    field: 'col' + i,
                    width: 192,
                    filterable: true,
                    attributes: {
      "class": data[i]['name']
    }

                });
            }
            
            
            
            $("#grid").kendoGrid({
                scrollable: true,
                columns: columns,
                filterable: true,
                type:'number',
  dataSource: [dataItem],
  altRowTemplate: kendo.template($("#alt-template").html())
});
            
            
            /*var category = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:'script/category.json',
                        dataType:'json'
                    }
                }
            });
            category.fetch(function(){
                var data = this.data();
                console.log(data.length);
                for(var i=0;i<data.length;i++)
                {
                    console.log(data[i]['value']);
                }
                app.homeService.viewModel.checkIT(data);
            });*/
        },
        
        checkIT : function(data)
        {
            var dataItem = {};
            var columns = [];

            for (var i = 0; i < data.length; i++) {
                dataItem['col' + i] = data[i]['value'];
                columns.push({
                    field: 'cat' + i,
                    width: 192,
                    filterable: true
                });
            }
            
            $("#grid").kendoGrid({
                scrollable: true,
                columns: columns,
                filterable: true,
                dataSource: [dataItem]
            });
        },
        show : function(e)
        {
            $('#category-dropdown select').val(0);
            $('#age-dropdown select').val(0);
            $('[data-role="drawer"]').children().css("background-color","#373F4A");
            e.view.scroller.scrollTo(0, 0)
            
            var categoryDataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:'script/category.json',
                        dataType:'json'
                    }
                }
            });
            categoryDataSource.fetch(function(){
                var data = this.data();
                console.log(data.length);
                for(var i=0;i<data.length;i++)
                {
                    console.log(data[i]['value']);
                }
                app.homeService.viewModel.setcategoryDataSource(data);
                //app.homeService.viewModel.freshshow(data);
            });
            
        },
        
        setcategoryDataSource :function(data)
        {
            this.set("categorydrawerData",data);
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
                this.set("categoryText",data[0]['text']);
                this.set("listData",data);
            }
            
        },
        
        drpdownFilter : function(data)
        {
            if(data === 0 || data === "0")
            {
                app.homeService.viewModel.fetchCategoryData(sessionStorage.getItem('categorySelectItem'));
            }
            else
            {
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
                    app.homeService.viewModel.setcategoryData(data);
                });
            }
            
        },
        
        ageDrpDownFilter : function(data)
        {
            if(data === "0" || data === 0)
            {
                app.homeService.viewModel.fetchAgeData(sessionStorage.getItem('ageSelectItem'));
            }
            else
            {
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
                        { field: "value", operator: "eq", value: data },
                        { field: "year", operator: "eq", value: sessionStorage.getItem('ageSelectItem') }
                    ]
                }
                });
                categoryDataSource.fetch(function(){
                    var data = this.view();
                    app.homeService.viewModel.setcategoryData(data);
                });
            }
        },
        
        drawerChildClick : function(e)
        {
            var that = this;
           // alert(e['target']['attributes']['data-id'].value);
           // alert(e['target']['attributes']['data-value'].value);
            
            if(e['target']['attributes']['data-value'].value === "category")
            {
                $('#age-dropdown').css("display","block");
                $('#category-dropdown').css("display","none");
                that.set("categoryName",e['target']['attributes']['data-id'].value);
                app.homeService.viewModel.fetchCategoryData(e['target']['attributes']['data-id'].value);
                app.mobileApp.navigate("#healthView");
            }
            
            if(e['target']['attributes']['data-value'].value === "age")
            {
                $('#category-dropdown').css("display","block");
                $('#age-dropdown').css("display","none");
                that.set("categoryName",e['target']['attributes']['data-id'].value);
                app.homeService.viewModel.fetchAgeData(e['target']['attributes']['data-id'].value);
                app.mobileApp.navigate("#healthView");
            }
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
        
        fetchAgeData : function(data)
        {
            sessionStorage.setItem("ageSelectItem",data);
            var categoryDataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:'script/categoryData.json',
                        dataType:'json'
                    }
                },
                filter: { field: "year", operator: "eq", value: data }
            });
            categoryDataSource.fetch(function(){
                var data = this.view();
                app.homeService.viewModel.setcategoryData(data);
            });
        },
        
        blokshow:function(e)
        {
            console.log(e['sender']['params']['task']);
            
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
            console.log(data);
        },
        
        readyToBlock:function(e)
        {
            //alert("click");
           // console.log(e);
            app.mobileApp.navigate("views/blokview.html?task="+(e['currentTarget']['attributes']['data-task'].value));
        }
        
        
    });
    app.homeService = {
        viewModel : new homeViewModel()
    };
}(window));