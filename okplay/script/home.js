(function(global){
    var homeViewModel
        app = global.app = global.app || {};
    
    homeViewModel = kendo.data.ObservableObject.extend({
        
        categorydrawerData:'',
        categoryName:'',
        dataListStatus:'',
        categoryText:'',
        
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
                app.homeService.viewModel.setcategoryDataSource(data);
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
            console.log(data);
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
        }
        
    });
    app.homeService = {
        viewModel : new homeViewModel()
    };
}(window));