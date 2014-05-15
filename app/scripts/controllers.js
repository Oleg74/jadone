'use strict';

/* Controllers */

angular.module('myApp.controllers', [])



.controller('mainFrameCtrl',['$scope', '$location','Auth',"$stateParams" ,"$rootScope","$window","$http",'$sce','$filter','Category',"Filters",
        function ($scope, $location, Auth,$stateParams,$rootScope,$window,$http,$sce,$filter,Category,Filters) {
            $scope.trustHtml = function(text,i){
                if(i){
                    text= $filter('cut')(text,true,i,"...");
                }
                return $sce.trustAsHtml(text)
            };

            /*$scope.commonFilter=$rootScope.commonFilter;
            console.log($scope.commonFilter);*/
            /*Filters.get({id:$scope.activeFilter},function(filter){
                $scope.tags=filter.tags;
            });*/
           // $scope.slideImages=[];

        if ($rootScope.lang!=$rootScope.$stateParams.lang) {
            $rootScope.lang=$rootScope.$stateParams.lang;
            document.cookie = "lan="+$rootScope.lang+";path=/";
        }
        $scope.lang=$rootScope.lang;
        $scope.logout = function() {
            Auth.logout()
                .then(function() {
                    $location.path('/');
                });
        };
        $scope.isActive = function(route) {
            return route === $location.path();
        };

        $scope.lanImg="img/icon/"+$rootScope.lang+".png";
        if ($rootScope.lang=='ru')
            $scope.langName='рус';
        else
            $scope.langName='eng';

        $rootScope.currency='UAH';
           $scope.changeCurrency= function(lan){
               $rootScope.currency=lan;
               //$scope.$apply();
           }
        $scope.changeLanguage= function(lan){
            if(lan==$rootScope.lang) return;

             var arr_path = $location.path().split('/')
             if (arr_path.length>=2){
                 arr_path[1]=lan;
                 var path_name = arr_path.join("/");
                 arr_path = arr_path.join("/");
             }
            document.cookie = "lan=" +lan+";path=/";
              window.location.href=arr_path;

        }


        $scope.goToSearch=function(searchStr){
            console.log(searchStr);
            $rootScope.$state.transitionTo('language.search',{'searchStr':searchStr,'lang':$rootScope.lang});
        }

            /*$http.get('/api/mainmenuitems/'+$rootScope.$stateParams.lang).success(function(res){
                $scope.mainMenu=res;
            });
*/
            $scope.categories =Category.list();


        //$scope.currency=$roo


}])

    .controller('homeCtrl', ['$scope',function ($scope) {
        $scope.slides = [{img:'img/slide/1.jpg'},{img:'img/slide/2.jpg'},{img:'img/slide/3.jpg'},{img:'img/slide/4.jpg'},
            {img:'img/slide/5.jpg'},{img:'img/slide/6.jpg'},{img:'img/slide/7.jpg'},{img:'img/slide/8.jpg'},
            {img:'img/slide/9.jpg'}];
        $scope.images = [{img:'img/slide/1.jpg'},{img:'img/slide/2.jpg'},{img:'img/slide/3.jpg'},{img:'img/slide/4.jpg'},
            {img:'img/slide/5.jpg'},{img:'img/slide/6.jpg'},{img:'img/slide/7.jpg'},{img:'img/slide/8.jpg'},
            {img:'img/slide/9.jpg'}];

    }])

    .controller('stuffCtrl', ['$scope','Brands','$rootScope','Category','Filters','Stuff','$q','$timeout','BrandTags','$location','$anchorScroll',
        function ($scope,Brands,$rootScope,Category,Filters,Stuff,$q,$timeout,BrandTags,$location,$anchorScroll) {

            $scope.commonFilter=$rootScope.commonFilter;

            /*$scope.sections=[];
            $scope.activeCategory='';
            $scope.activeBrand='';c
            $scope.categoryList=[];
            $scope.brandList=[];
            $scope.filtersList=[];
            $scope.collectionList=[];
            $scope.collectionTag={};
            var defer = $q.defer();
            var promises = [];
            $scope.isopenCategory=true;
            $scope.isopenBrand=true;
            $scope.isopenFilter=false;
            $scope.isopenCollection=false;*/


            $scope.stuffList=[];
            //paginator
            $scope.page=1;
            $scope.totalItems=0;
            $scope.textList=''
            $scope.headerList='';
            $scope.displayFilter=[];
            //console.log( $scope.filterList);
            //$scope.filters=Filters.list();

            // инициализация********************************
            $scope.rowsPerPage=($rootScope.config.perPage)?$rootScope.config.perPage:53;
            $scope.lang=$rootScope.$stateParams.lang;
            $scope.section=$rootScope.$stateParams.section;
            $scope.categories=[];
            $scope.filterDisplay=[];
            $scope.checkfilterList=[];
            Category.list(function(res){
                for (var i =0;i<res.length;i++){
                    if (res[i].section==$rootScope.$stateParams.section){
                        $scope.categories.push(res[i]);
                    }
                }
                $scope.selectedCategory=$rootScope.$stateParams.category;
            });


            //*********************************************
            $scope.$watch('selectedCategory',function(newValue, oldValue){
                if (typeof newValue == 'undefined' || newValue == oldValue) return;
                $scope.filters=[];
                $scope.getStuffList($scope.selectedCategory);
                var query;
                if ($scope.selectedCategory){
                    for(var i=0;i<$scope.categories.length;i++){
                        if ($scope.categories[i]._id==$scope.selectedCategory){
                            query={'filters':JSON.stringify($scope.categories[i].filters)};
                            $scope.textList=$scope.categories[i].desc[$scope.lang];
                            $scope.headerList=$scope.categories[i].name[$scope.lang];
                            /*console.log($scope.textList);
                            console.log($scope.headerList);*/
                            break;
                        }
                    }

                } else {
                    $scope.textList='';
                    $scope.headerList='';
                    var tagArr=[];
                    for(var i=0;i<$scope.categories.length;i++){
                        var arr=[];
                        for(var j=0;j<$scope.categories[i].filters.length;j++){
                            if (i==0){
                                //tagArr.push($scope.categories[i].filters[j]);
                                arr.push($scope.categories[i].filters[j]);
                            } else{
                                if(tagArr.indexOf($scope.categories[i].filters[j])>-1){
                                    arr.push($scope.categories[i].filters[j]);
                                }
                            }
                        }
                        tagArr=JSON.parse(JSON.stringify(arr));
                    }
                    if (tagArr.length>0){
                        query={'filters':JSON.stringify(tagArr)};
                    }
                }
                Filters.list(query,function(res){
                    for(var i=0;i<res.length;i++){
                        res[i].value='';
                        $scope.filters.push(res[i]);
                    }
                });
            });

            $scope.getStuffList = function(categoryId,page){
                if (!page){
                    $scope.page=1;
                    $scope.stuffList=[];
                }
                var  brandId;
                if (categoryId){
                    brandId=0;
                } else {
                    categoryId=$scope.section;
                    brandId='section';
                }

                Stuff.list({category:categoryId,brand:brandId,page:$scope.page},function(tempArr){
                    //var time1 = new Date().getTime();
                   /* for (var ii=1; ii<10000000;ii++){
                        var jj= ii/13*0.546;
                    }*/
                    if ($scope.page==1 && tempArr.length>0){
                        $scope.totalItems=tempArr[0].index;
                    }
                    $scope.checkfilterList=[];
                    for (var i=0 ; i<=tempArr.length - 1; i++) {
                        var filtersForStatus=JSON.parse(JSON.stringify(tempArr[i].tags));
                        var tempGallery=[];
                        for (var j=0;j<tempArr[i].gallery.length;j++){
                            //console.log(tempArr[i].gallery[j]);
                            if (tempGallery.length<1){
                                tempGallery.push(tempArr[i].gallery[j]);
                                var l = tempArr[i].tags.indexOf(tempArr[i].gallery[j].tag._id);
                                //console.log(l);
                                if (l>-1){
                                    tempArr[i].tags.splice(l,1);
                                }
                            } else{
                                var is=false;
                                for (var k=0;k<tempGallery.length;k++){
                                    //if (is) break;
                                    if (tempGallery[k].tag._id==tempArr[i].gallery[j].tag._id){
                                        is=true;
                                        if(tempArr[i].gallery[j].index<tempGallery[k].index){
                                            tempGallery.splice(k,1);
                                            tempGallery.push(tempArr[i].gallery[j]);
                                           // is=true;
                                        }
                                    }/* else {
                                        is=true;
                                        tempGallery.push(tempArr[i].gallery[j]);
                                    }*/
                                }
                                if (!is) {
                                    tempGallery.push(tempArr[i].gallery[j]);
                                    var l = tempArr[i].tags.indexOf(tempArr[i].gallery[j].tag._id);
                                    //console.log(l);
                                    if (l>-1){
                                        tempArr[i].tags.splice(l,1);
                                    }
                                }
                            }
                       }
                        var price = (tempArr[i].priceSale)? tempArr[i].priceSale:tempArr[i].price;
                        var retail = (tempArr[i].retailSale)? tempArr[i].retailSale:tempArr[i].retail;

                        for (var j=0;j<tempArr[i].tags.length;j++){
                            if ($scope.checkfilterList.indexOf(tempArr[i].tags[j])<0){
                                $scope.checkfilterList.push(tempArr[i].tags[j]);
                            }
                        }


                        for (var j=0;j<tempGallery.length;j++){
                            var status=0;
                            // 1 - распродажа
                            // 2- новинка
                            // 3- нет в наличии
                            if (filtersForStatus.indexOf(tempGallery[j].tag._id)<0 || filtersForStatus.indexOf($scope.commonFilter.tags[2])>-1){
                                status=3;
                            } else if(filtersForStatus.indexOf($scope.commonFilter.tags[1])>-1){
                                status=2;
                            } else if( filtersForStatus.indexOf($scope.commonFilter.tags[0])>-1){
                                status=1;
                            }
                            //console.log(status);

                            var tags=JSON.parse(JSON.stringify(tempArr[i].tags));
                            tags.push(tempGallery[j].tag._id)



                            if ($scope.checkfilterList.indexOf(tempGallery[j].tag._id)<0){
                                $scope.checkfilterList.push(tempGallery[j].tag._id);
                            }
                            //console.log(tempGallery[j]);
                            $scope.stuffList.push({img:tempGallery[j].thumb,'name':tempArr[i].name[$scope.lang],
                                'color':tempGallery[j].tag.name[$scope.lang],'price':price,'retail':retail,'tags':tags,
                            'id':tempArr[i]._id,'colorId':tempGallery[j].tag._id,'status':status});
                        }
                    }
                    /*var time2 = new Date().getTime();
                    //var time2 = Date.now()
                    console.log(time1);
                    console.log(time2);
                    console.log(time2-time1);*/
                });

            }

            $scope.showItemFilter=function(id,index){
                //console.log(index);
                var i=$scope.checkfilterList.indexOf(id);
                if (i>-1){
                    $scope.displayFilter[index]=true;
                    return true;
                }
                return false;
            }

            $scope.filterLists =  function() {
                return function(item) {
                   if ($scope.collectionTag &&  $scope.collectionTag.val && item.brandTag!=$scope.collectionTag.val){
                        return false;
                    }
                    if (!$scope.filters || $scope.filters.length<=0){
                        return true;
                    }
                    for (var i=0 ; i<=$scope.filters.length - 1; i++) {
                        if ($scope.filters[i].value && item.tags.indexOf($scope.filters[i].value)<=-1){
                            return false;
                        }
                    }
                    return true;
                }
            }

            $scope.goToStuffDetail = function(item){
                $rootScope.$state.transitionTo('language.stuff.detail',{id:item.id,color:item.colorId});
            }


            $scope.setPage = function () {
                $scope.page++;
                $scope.getStuffList($scope.activeCategory,$scope.activeBrand,$scope.page);
                //console.log($scope.page);

            };

            //прокрутка вверх екрана
            $scope.scrollTo = function(id) {
                //console.log(id);
                $location.hash(id);
                $anchorScroll();
            }


            /*$scope.getFt=function (filterArr,arr){

                filterArr.forEach(function(item){
                    for (var i=0 ; i<=$scope.filters.length - 1; i++) {
                        if ($scope.filters[i]._id==item){
                            var temp={};temp=$scope.filters[i];
                            temp.value='';
                            $scope.filters[i].value='';
                            //arr.push(temp);
                            arr.push($scope.filters[i]);
                            break;
                        }
                    }
                })
                $scope.isopenFilter=(arr.length>0)?true:false;
            }
            $scope.clearFilter = function(){
                if ($scope.filtersList.length>0){
                    for (var i=0 ; i<=$scope.filtersList.length - 1; i++) {
                        $scope.filtersList[i].value='';
                    }
                }
                //console.log($scope.filtersList);
            }

            $scope.choiceCategory = function(category){
                *//*console.log($scope.activeBrand);
                 console.log(category);*//*
                $scope.totalItems=0;
                if (!category) {
                    // console.log('sss');
                    if (!$scope.activeBrand){
                        $scope.changeSection();
                    } else {
                        //console.log('dddddd');
                        $scope.activeCategory='0';
                        //$scope.filtersList=[];
                        $scope.stuffs=$scope.getStuffList($scope.activeCategory,$scope.activeBrand)
                        $scope.activeCategory='';
                    }
                    return;
                }
                $scope.activeCategory=category._id;
                $scope.brandList=[];
                if (category.brands && category.brands.length>0){
                    getBr(category.brands,$scope.brandList);
                }
                $scope.filtersList=[];
                //console.log(category);
                if (category.filters && category.filters.length>0){
                    $scope.getFt(category.filters,$scope.filtersList);
                }
                $scope.getStuffList($scope.activeCategory,$scope.activeBrand)

            }


            function getCr(categoryIdArr,arr){
                categoryIdArr.forEach(function(item){
                    for (var i=0 ; i<=$scope.categories.length - 1; i++) {
                        if ($scope.categories[i]._id==item && $scope.categories[i].section==$scope.section.id){
                            arr.push($scope.categories[i]);
                            break;
                        }
                    }
                })
            };


            $scope.$watch('activeBrand',function(){
                //console.log($scope.activeBrand);
                $scope.collectionList=[];

                if ($scope.activeBrand && $scope.activeBrand!='section'){
                    //console.log($scope.activeBrand);
                    $scope.collectionList= BrandTags.list({brand:$scope.activeBrand});
                    $scope.collectionTag.val=''

                }
            })
            $scope.clearBrandTag = function(tag){
                console.log(tag);
                tag.val='';
            }

            $scope.choiceBrand = function(brand){
                *//*console.log(brand);
                 console.log($scope.activeCategory);*//*
                $scope.totalItems=0;
                if (!brand) {
                    if (!$scope.activeCategory){
                        $scope.changeSection();
                    } else {
                        $scope.activeBrand='0';
                        $scope.stuffs=$scope.getStuffList($scope.activeCategory,$scope.activeBrand)
                        $scope.activeBrand='';
                    }
                    return;
                }
                $scope.activeBrand=brand._id;
                $scope.categoryList=[];
                if (brand.categories && brand.categories.length>0){
                    getCr(brand.categories,$scope.categoryList);
                }
                $scope.getStuffList($scope.activeCategory,$scope.activeBrand);
            }
*/

            /*$scope.getStuffList = function(categoryId,brandId,page){
                if (!page){
                    $scope.page=1;
                    $scope.stuffList=[];
                }
                if (!categoryId) categoryId=0;
                if (!brandId) brandId=0;
                if (categoryId==0 && brandId==0){
                    categoryId=$scope.section.id;
                    brandId='section';
                }

                Stuff.list({category:categoryId,brand:brandId,page:$scope.page},function(tempArr){
                    *//* if ($scope.stuffList.length<=0 && tempArr.length>0){
                     $scope.totalItems=tempArr[0].index;
                     }*//*
                    if ($scope.page==1 && tempArr.length>0){
                        $scope.totalItems=tempArr[0].index;
                    }
                    //console.log($scope.totalItems);
                    for (var i=0 ; i<=tempArr.length - 1; i++) {
                        // tempArr[i].filters=JSON.parse(tempArr[i].filters);
                        var tempGallery=[];
                        for (var j=0;j<tempArr[i].gallery.length;j++){
                            //console.log();
                            tempGallery.push({img:tempArr[i].gallery[j].thumb})
                        }
                        for (var j=0;j<tempGallery.length;j++){
                            console.log(tempGallery[j]);
                            $scope.stuffList.push(tempGallery[j]);
                        }

                    }
                });
            }*/
            //Angularjs promise chain when working with a paginated collection
            //http://stackoverflow.com/questions/20171928/angularjs-promise-chain-when-working-with-a-paginated-collection
            /*$scope.loadData = function(numPage) {
                //console.log(numPage);
                if (!numPage) numPage=1;
                var deferred = $q.defer();
                var i=1;

                if (!$scope.activeBrand && !$scope.activeCategory){
                    var brandId='section';
                } else {
                    //console.log();
                    var brandId=($scope.activeBrand)?$scope.activeBrand:0;
                }
                $scope.totalItems=0;
                var categoryId=($scope.activeCategory)?$scope.activeCategory:$scope.section.id;
                if ($scope.activeBrand && !$scope.activeCategory){
                    categoryId=0;
                }

                //console.log($scope.activeCategory);
                $scope.stuffList=[];
                function loadAll() {
                    Stuff.list({category:categoryId,brand:brandId,page:i},function(stuffs){
                        //console.log(stuffs);
                        if ($scope.stuffList.length<=0 && stuffs.length>0){
                            $scope.totalItems=stuffs[0].index;
                        }
                        for(var ii=0; ii<=stuffs.length-1;ii++){
                            $scope.stuffList.push(stuffs[ii]);
                        }
                        if(i<numPage) {
                            i++;
                            loadAll();
                        }
                        else {
                            deferred.resolve();
                        }
                    })
                }
                loadAll();
                return deferred.promise;
            };
*/







            /*$scope.$watch('changeStuff',function(){
                if ($rootScope.changeStuff){
                    //console.log('dd');
                    //$scope.getStuffList($scope.activeCategory,$scope.activeBrand);
                    $scope.loadData($scope.page);
                    *//*for (var i=1;i<=$scope.page;i++){
                     promises.push($scope.getStuffList($scope.activeCategory,$scope.activeBrand,i));
                     }*//*
                    //$q.all(promises);

                }
                $rootScope.changeStuff=false;
            })

            $scope.editStuffGallery = function(stuff){
                //$scope.stuffForGallery=stuff;
                $rootScope.$state.transitionTo('mainFrame.stuff.editStuffGallery',{id:stuff._id})
            }
            $scope.commentStuff = function(stuff){
                //$scope.stuffForGallery=stuff;
                $rootScope.$state.transitionTo('mainFrame.stuff.commentStuff',{id:stuff._id})
            }*/

        }])
    .controller('stuffDetailCtrl',['$scope','Stuff','$rootScope','$timeout','CartLocal',function($scope,Stuff,$rootScope,$timeout,CartLocal){
        $scope.lang=$rootScope.$stateParams.lang;
        $scope.cart=CartLocal.list();
        $scope.itemToCart={'stuff':'','status':1,'color':'','size':'','name':'','colorName':'','sizeName':'','quantity':1,'price':1,'retail':1,
            'category':$rootScope.$stateParams.category,'categoryName':'','section':$rootScope.$stateParams.section,'img':''};

        if($rootScope.$stateParams.size){
            $scope.itemToCart.size=$rootScope.$stateParams.size
        }


        $scope.ez;
        $scope.currentQuantity=1;
        $scope.quantityArr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,
            25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];

        $scope.stuff=Stuff.full({id:$rootScope.$stateParams.id},function(res,err){
            $scope.itemToCart.stuff=res._id;
            $scope.itemToCart.name=res.name[$scope.lang];
            $scope.itemToCart.categoryName=res.category.name[$scope.lang];
            $scope.itemToCart.price=(res.priceSale)?res.priceSale:res.price;
            $scope.itemToCart.retail=(res.retailSale)?res.retailSale:res.retail;
            for (var i=0;i<res.gallery.length;i++){
                if ($rootScope.$stateParams.color==res.gallery[i].tag){
                    if (!$scope.activePhoto){
                        $scope.activePhoto=res.gallery[i];
                    } else if ($scope.activePhoto.index>res.gallery[i].index){
                        $scope.activePhoto=res.gallery[i];
                    }
                }
            }
            if (res.stock){
                res.stock=JSON.parse(res.stock);
                console.log(res.stock);
            }
            getCurrentSize(res.category.filters,res.tags);

        });

//*****************************************photo**************************************************
        $scope.$watch('activePhoto',function(){
            if (!$scope.activePhoto) return;
            $scope.itemToCart.color=$scope.activePhoto.tag;
            if (!$scope.activePhoto.name) {
                var tags=$scope.stuff.category.mainFilter.tags;
                for (var i=0;i<tags.length;i++){
                    if (tags[i]._id==$scope.activePhoto.tag){
                        $scope.activePhoto.name=tags[i].name[$scope.lang];
                    }
                }
            }
            if ($scope.color){
                $scope.color=$scope.activePhoto.tag
            } else {
                $timeout(function(){$scope.color=$scope.activePhoto.tag;},300)
            }
            $scope.itemToCart.img=$scope.activePhoto.thumb;
            $scope.itemToCart.color=$scope.activePhoto.tag;
            $scope.itemToCart.colorName=$scope.activePhoto.name;
            if ($scope.itemToCart.size) {
                $scope.currentQuantity=CartLocal.getCount($scope.itemToCart);
            }

        })

        $scope.changeColor = function(tag){
            var j=0;
            for (var i=0;i<$scope.stuff.gallery.length;i++){
                if (tag==$scope.stuff.gallery[i].tag){
                    if ($scope.activePhoto.tag!=$scope.stuff.gallery[i].tag){
                        j=i;
                        //$scope.activePhoto=$scope.stuff.gallery[i];
                    } else if ($scope.activePhoto.index>$scope.stuff.gallery[i].index){
                        j=i;
                        //$scope.activePhoto=$scope.stuff.gallery[i];
                    }
                }
            }
            $scope.changePhoto(j);
        }

        $scope.changePhoto= function(index){
            if (!$scope.ez){
                $scope.ez =$('#img_001').data('elevateZoom');
            }
            $scope.ez.swaptheimage($scope.stuff.gallery[index].thumb, $scope.stuff.gallery[index].img);
            $scope.activePhoto=$scope.stuff.gallery[index];
            /*$scope.itemToCart.color=$scope.activePhoto.tag;
            $scope.currentQuantity=CartLocal.getCount($scope.itemToCart);*/
        };
        var jj=0;
        $scope.showOptionColor= function(id){
            //console.log('jj - '+jj++);
            if (!$scope.stuff || !$scope.stuff.gallery) return;
            for (var i=0;i<$scope.stuff.gallery.length;i++){
                if ($scope.stuff.gallery[i].tag==id) {
                    return true;
                }
            }
            return false;
        }

//*********************************************size***********************************************
        function getSizeName(tags){
            for (var i=0;i<tags.length;i++){
                if (tags[i]._id==$scope.itemToCart.size) {
                    $scope.itemToCart.sizeName=tags[i].name[$scope.lang];
                }
            }
        };
        $scope.filterSize=[];
        function getCurrentSize(filters,tags){
            var tempArr=[];
            for (var i=0;i<filters.length;i++){
                //if (is) break;
                if (filters[i].name['en'].toLowerCase()=='size'){
                    for (var j=0;j<filters[i].tags.length;j++){
                        //console.log(filters[i].tags[j]);
                        for (var l=0;l<tags.length;l++){
                            if (filters[i].tags[j]==tags[l]._id) {
                                tempArr.push(tags[l]);
                                if (!$scope.itemToCart.size){
                                    $scope.itemToCart.size=tags[l]._id;
                                    $scope.itemToCart.sizeName=tags[l].name[$scope.lang];
                                } else {
                                    if($scope.itemToCart.size==tags[l]._id) {
                                        $scope.itemToCart.sizeName=tags[l].name[$scope.lang];
                                    }
                                }
                          }
                        }
                    }
                }
            }
            $scope.filterSize=tempArr;
        }
        $scope.changeSize = function(){
            getSizeName($scope.stuff.tags);
            $scope.currentQuantity=CartLocal.getCount($scope.itemToCart);
        }
//***************************************** end size ******************************************
        $scope.disabledToCart=function(){
            console.log(new Date().getTime());

            if ($scope.stuff.stock){
                console.log($scope.stuff.stock[$scope.itemToCart.color][$scope.itemToCart.size]);
                console.log($scope.stuff.stock[$scope.itemToCart.color]);
                console.log($scope.stuff.stock[$scope.itemToCart.color][$scope.itemToCart.size]);
                if ($scope.stuff.stock[$scope.itemToCart.color] && $scope.stuff.stock[$scope.itemToCart.color][$scope.itemToCart.size]
                    && $scope.stuff.stock[$scope.itemToCart.color][$scope.itemToCart.size]==1){
                    return true;
                }


            }
            var disabled = false;
            var noColor=true;
            if (!$scope.stuff || !$scope.stuff.tags) return;
            for (var i=0;i<$scope.stuff.tags.length;i++){
               /* console.log($scope.activePhoto._id);
                console.log($scope.stuff.tags[i]._id);*/
                if ($scope.stuff.tags[i]._id==$scope.activePhoto.tag){
                   noColor=false;
                }
               if  ($scope.stuff.tags[i]._id==$scope.commonFilter.tags[2]){
                   disabled=true;
                   break;
               }
            }

            return disabled || noColor;
        }

        $scope.addToCart= function(){
            //console.log($scope.itemToCart);
            $scope.itemToCart.quantity=parseInt($scope.currentQuantity);
            CartLocal.addToCart($scope.itemToCart);
        }
   }])

    .controller('cartCtrl',['$scope','$rootScope','$timeout','CartLocal',function($scope,$rootScope,$timeout,CartLocal){
        //$scope.currency=$rootScope.currency;
        $scope.comment='';
        $scope.sendDisabled=false;
        $timeout(function(){
            if($rootScope.config && $rootScope.config.currency){
                $scope.kurs = $rootScope.config.currency[$rootScope.currency][0];
            }
        },300);

        $rootScope.$watch('currency',function(o,n){
            //console.log($rootScope.currency);
           //if(o==n) return;
            if($rootScope.config && $rootScope.config.currency){
                $scope.kurs = $rootScope.config.currency[$rootScope.currency][0];
            }
        })
        //console.log($scope.kurs);
        $scope.quantityArr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,
            25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];
        $scope.cart=CartLocal;
        //$scope.cart.sum=0;

        $scope.goToStuff=function(i){
           var stuff=  $scope.cart.getItem(i);
            $rootScope.$state.transitionTo('language.stuff.detail',
                {'lang':$rootScope.$stateParams.lang,'section':stuff.section,'category':stuff.category,
                'id':stuff.stuff,'color':stuff.color,'size':stuff.size});
        }

        $scope.sendOrder=function(){
            $scope.sendDisabled=true;
            $scope.comment.substring(0,200);
            $scope.cart.send($rootScope.$stateParams.lang,$scope.comment,function(err){
                $scope.sendDisabled=false;
            });
        }
    }])

.controller('loginCtrl',['$scope', '$location','Auth', function ($scope, $location, Auth) {
        $scope.user = {};
        $scope.errors = {};

        $scope.login = function(form) {
            $scope.submitted = true;

            if(form.$valid) {
                Auth.login({
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .then( function(data) {
                        //console.log(data);userid.
                        document.cookie = "userid="+data.userid+";path=/";
                        // Logged in, redirect to home
                        $location.path('/');
                    })
                    .catch( function(err) {
                        err = err.data;
                        $scope.errors.other = err.message;
                    });
            }
        };
    }])
.controller('signupCtrl',['$scope', 'Auth', '$rootScope', function ($scope, Auth, $rootScope) {
        $scope.user = {};
        $scope.errors = {};

        $scope.register = function(form) {
            $scope.submitted = true;

            if(form.$valid) {
                Auth.createUser({
                    name: $scope.user.name,
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .then( function() {
                        // Account created, redirect to home
                        $rootScope.$state.transitionTo('language.home');
                        //$location.path('/');
                    })
                    .catch( function(err) {
                        err = err.data;
                        $scope.errors = {};
                        console.log(err);
                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.type;
                        });
                    });
            }
        };
    }])
.controller('settingsCtrl',  ['$scope', 'User', 'Auth',function ($scope, User, Auth) {
        $scope.errors = {};

        $scope.changePassword = function(form) {
            $scope.submitted = true;

            if(form.$valid) {
                Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
                    .then( function() {
                        $scope.message = 'Password successfully changed.';
                    })
                    .catch( function() {
                        form.password.$setValidity('mongoose', false);
                        $scope.errors.other = 'Incorrect password';
                    });
            }
        };
}])

    .controller('contactsCtrl',['$scope','$rootScope','$location','$http','$timeout',	function($scope,$rootScope,$location,$http,$timeout){

        $scope.feedbackError=false;
        $scope.feedbackSent = false;

        $scope.errorText=false;
        $scope.SuccessFeedBack=false;
        $scope.feedbackDisabled=false;

        $scope.feedback={};

        $scope.feedback.email ='';
        $scope.feedback.name = '';
        $scope.feedback.text = '';

        if ($rootScope.currentUser){
            if ($rootScope.currentUser.email)
                $scope.feedback.email=$rootScope.currentUser.email;
            if ($rootScope.currentUser.name)
                $scope.feedback.name=$rootScope.currentUser.name;
        }


        $scope.feedbackMassage = function(){
            return 	$scope.feedbackError|| $scope.feedbackSent;
        }


        $scope.feedback.send = function(){
            if ($scope.feedback.text.length<10){
                $scope.errorText = true;
                $timeout(function(){$scope.errorText = false}, 3000);
            }
            else{
                $scope.feedback.text=$scope.feedback.text.substring(0,700);
                $scope.feedbackDisabled=true;
                $http.post('/api/feedback',$scope.feedback).
                    success(function(data, status) {
                        $scope.data = data;
                        if ($scope.data.done){
                            $scope.SuccessFeedBack = true;
                            $scope.feedback.text='';
                            $timeout(function(){
                                $scope.SuccessFeedBack = false;
                                $scope.feedbackDisabled=false;
                            }, 10000);
                        }else{
                            $scope.feedbackError = true;
                            $timeout(function()
                            {$scope.feedbackError=false;
                                $scope.feedbackDisabled=false;
                            }, 10000);
                        }
                    }).
                    error(function(data, status) {
                        console.log(status);
                        console.log(data);
                        $scope.feedbackError = true;
                        $timeout(function(){$scope.feedbackError=false}, 3000);
                    });
            }

        };

    }])

    .controller('goodDetailCtrl', ['$scope','$stateParams','$http','$rootScope','$sce',function ($scope,$stateParams,$http,$rootScope,$sce) {
        //console.log('ssss');
        $scope.trustHtml = function(text){
            return $sce.trustAsHtml(text)
        };
        $http.get('/api/goods/type/page/'+$stateParams.id).success(function (data, status, headers, config) {
            $scope.good=data;
            $scope.category=data.category;
        }).error(function (data, status, headers, config) { })

    }])


    .controller('listCtrl', ['$scope','$stateParams','$http','$sce','$filter','$rootScope',function ($scope,$stateParams,$http,$sce,$filter,$rootScope) {
        $scope.trustHtml = function(text){
            text= $filter('cut')(text,false,200,"...");
            return $sce.trustAsHtml(text)
        };
        $scope.type = $stateParams.type;
        $scope.category = ($stateParams.id)?$stateParams.id:0;


        if ($rootScope.config.perPage){
            $scope.perPage = $rootScope.config.perPage;
        } else {
            $scope.perPage=5;
        }

        $scope.page =1;



        $scope.activeCategory=function(id){
            //console.log(id);
            return $scope.category==id
        }

        $http.get('/api/goods/'+$scope.type+'/'+$scope.page).success(function (data, status, headers, config) {
            $scope.goods=data;
        }).error(function (data, status, headers, config) { })





    }])

    .controller('searchCtrl', ['$scope','$http','$stateParams','$filter','$sce',function ($scope,$http,$stateParams,$filter,$sce) {
        // write Ctrl here
        $scope.quantity=0;
        $scope.searchStr = $stateParams.searchStr;
        $scope.getResults = function (){
            $scope.searchStr= $scope.searchStr.substring(0,30).split(' ',2).join(' ').toLowerCase();
            $http.get('/api/goods/search/'+$stateParams.lang+'/'+$scope.searchStr).success(function (data, status, headers, config) {
                $scope.results=data;
                $scope.quantity=$scope.results.quantity;
                //$scope.quantity=$scope.results.
                /*$scope.results.desc=data.desc.map(function(doc){
                    var text = doc.desc[$stateParams.lang];
                    var lb='<span style="color: #ff2a27">';
                    var le ='</span>';
                    var pos = text.toLowerCase().indexOf($scope.searchStr);
                    var begin=0;end=100;
                    if (pos>50){
                        var begin =pos-50;
                        var end =pos+50
                    }
                    doc.text=text.insert(pos,lb)
                                .insert(pos+lb.length+$scope.searchStr.length,le)
                                .slice(begin,end+lb.length+$scope.searchStr.length+le.length);
                    return doc;
                })*/
            }).error(function (data, status, headers, config) { })
        }

        $scope.getText= function(text){
            return $sce.trustAsHtml(text);
        }
        $scope.getResults();
        //$scope.categories=$rootScope.categories;


    }])