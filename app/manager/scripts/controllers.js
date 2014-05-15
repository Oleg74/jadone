'use strict';

/* Controllers */

angular.module('myApp.controllers', [])



    .controller('mainFrameCtrl',['$scope', '$location', function ($scope, $location) {
        //$scope.menuItem=Categories.list();
        $scope.toMainSite = function(){
            //console.log('dddd');
            window.location = '/';
            //$location.path('/');
        }




    }])
    .controller('homeCtrl', ['$scope','$http',function ($scope,$http) {

    }])


    .controller('filtersCtrl', ['$scope','$http','Filters','$rootScope','Tags',function ($scope,$http,Filters,$rootScope,Tags) {
        //$scope.lanArr=$rootScope.lanArr;
        $scope.editDisabledF=true;
        $scope.editDisabledT=true;

        $scope.focusInput=[];
        $scope.focusInputTag=[];
        $scope.activeFilter=$rootScope.activeM;
        $scope.filter={};
        $scope.filter.name={"ru":'',"ua":'',"en":''};
        $scope.filter.index=1;
        $scope.tag={};
        $scope.tag.name={"ru":'',"ua":'',"en":''};
        $scope.tag.index=1;

        function getFilters(){
            $scope.filters=Filters.list(function(){
                /*if ($scope.activeFilter== null && $scope.filters.length>0 ){
                    $scope.activeFilter=$scope.filters[0]._id;
                    $scope.activeFilterName=$scope.filters[0].name[$rootScope.config.DL];
                    Filters.get({id:$scope.activeFilter},function(filter){
                        $scope.tags=filter.tags;
                    });
                    //$scope.tags=Tags.list({'filter':$scope.activeFilter});
                }*/
            });
        }
        getFilters();
        $scope.editFilter = function(filter,edit){
            if (edit)
                $scope.editDisabledF=false;
            else
                $scope.editDisabledF=true;
            if (!filter){
                $scope.activeFilter=null;
                $scope.activeFilterName=null;
                $scope.filter={};
                $scope.filter.name={"ru":'',"ua":'',"en":''};
                $scope.filter.index=1;
                $scope.filter.type=1;
                $scope.filter.tags=[];
                $scope.tags=[];

            }
            else {
                $scope.activeFilter=filter._id;
                $scope.activeFilterName=filter.name[$rootScope.config.DL];
                $scope.filter=Filters.get({'id':filter._id},function(){
                    //console.log($scope.filter);
                    if ($scope.filter.type !=1 && $scope.filter.type!=2){
                        console.log('1');
                        $scope.filter.type=1;
                    }
                    $scope.tags= Tags.list({'filter':$scope.filter._id});
                });

            }
        }

        $scope.saveFilter = function(){
           //console.log($scope.filter);

            function afterSave(){
                $scope.filter.name={"ru":'',"ua":'',"en":''};
                $scope.filter.index=1;

                $scope.filters=Filters.list(function(){
                    /*if(!$scope.activeFilter)
                        $scope.activeFilter=  $scope.filters[0]._id;
                    $scope.filters.forEach(function(el){
                        if (el._id==$scope.activeFilter)
                            $scope.activeFilterName=el.name[$rootScope.config.DL];
                    });
                    $scope.filter= Filters.get({'id':$scope.activeFilter},function(){
                        $scope.tags=$scope.filter.tags;
                    });*/
                });
                $scope.editDisabledF=true;
                $scope.filter.type=0;

            }
            if (!$scope.filter._id){
                Filters.add($scope.filter,function(){
                    afterSave()
                })
            } else{
                $scope.filter.$update(function(err){
                    if (err) console.log(err);
                    afterSave()
                });
            }
        }
        $scope.deleteFilter = function(filter){
            if (confirm("Удалить?")){
              if (filter._id == $scope.activeFilter){
                   $scope.activeFilter= null;
              }
                filter.$delete(function(err,res){
                    getFilters()

                });
            }
        }

        $scope.editTag = function(tag){
            //console.log(tag);
            if (!$scope.activeFilter) return;
            //$rootScope.activeArticle = id;
            $scope.editDisabledT=false;
            if (!tag){
                $scope.tag={};
                $scope.tag.name={"ru":'',"ua":'',"en":''};
                $scope.tag.index=1;
            } else {
                console.log(tag);
                $scope.tag=tag;
            }
            $scope.tag.filter=$scope.activeFilter;
        }
        $scope.saveTag = function(){
            // console.log($scope.filter);
            function afterSave(){
                $scope.tag.name={"ru":'',"ua":'',"en":''}
                $scope.tag.index=1;
                $scope.tags=Tags.list({'filter':$scope.activeFilter},function(){
                    /*$scope.filters.forEach(function(el){
                        if (el._id==$scope.activeFilter)
                            el.tags=$scope.tags;
                    });*/
                });
                $scope.editDisabledT=true;
            }
            if (!$scope.tag._id){
                Tags.add($scope.tag,function(){
                    afterSave()
                })
            } else{
                Tags.update($scope.tag,function(err){
                    if (err) console.log(err);
                    afterSave();
                });
            }
        }
        $scope.deleteTag = function(tag){
            if (confirm("Удалить?")){
                /*if (issue._id == $scope.activeIssue)
                    $scope.activeIssue= null;*/
                /*tag.filter=$scope.activeFilter;
                console.log(tag);*/
                Tags.delete({'filter':$scope.activeFilter,'id':tag._id},function(err,res){
                    $scope.tags=Tags.list({'filter':$scope.activeFilter});

                });
            }
        }




    }])

    .controller('goodsCtrl', ['$scope','Goods','$stateParams','$rootScope','$fileUpload',"Categories","$timeout",'$location', '$anchorScroll','$sce',
        function ($scope,Goods,$stateParams,$rootScope,$fileUpload,Categories,$timeout,$location, $anchorScroll,$sce) {

            $scope.trustHtml = function(text){
                return $sce.trustAsHtml(text)
            };
            //$scope.saved=false;
            $scope.type=parseInt($stateParams.id);
            $scope.goods= Goods.list($stateParams);
            $scope.good={};
            $scope.good.category=1;
            /*Categories.list(function(res){
                //console.log(res);
                $scope.categories=res[$scope.type]
                //console.log($scope.categories)
            });*/
            //console.log($stateParams);
            $scope.categories=Categories.get($stateParams);

            $scope.section=0;

            $scope.editGood= function(good){
                $scope.focusInput=true;
                if (!good){
                    $scope.noChange=true;
                    $scope.good = {}//new Goods();
                    $scope.good.category=1;
                    $scope.activeGoodName='нова';
                    $scope.myFileSrc='/' + '?' + new Date().getTime();
                }
                else{
                    $scope.noChange=false;
                    $scope.good = good;
                    $scope.activeGoodName=good.name.ua;
                    //console.log($scope.good.img);
                    if ($scope.myFileSrc=$scope.good.img){}else
                        $scope.myFileSrc='/' + '?' + new Date().getTime();

                }

            }


            $scope.updateGood = function(){
                if($scope.categories.stuff.length<1){
                    $scope.good.category=0;
                }
                if (!$scope.good._id){
                    $scope.good.type=$scope.type;
                    Goods.add($scope.good,function(res){
                        $scope.afterSave(res);
                     })
                } else{
                    $scope.good.$update(function(res){
                        $scope.afterSave(res);
                    });
                }
            }

            $scope.afterSave = function(res){
                if (res.err){
                    $scope.mongoError = res.err;
                    $scope.mongoErrorShow = true;
                    $timeout(function(){$scope.mongoErrorShow=false;},3500);
                }
                $scope.goods= Goods.list($stateParams);
                $scope.saved=true;
                $timeout(function(){$scope.saved=false;},3500);
                $location.hash('top');
                $anchorScroll();
                $scope.activeGoodName='';
                $scope.myFileSrc='/' + '?' + new Date().getTime();
                $scope.good={};
                $scope.good.category=1;
            }


            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "api/goods/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.good._id).then(function(promise){
                    /*$scope.code = promise.code();
                    $scope.fileName = promise.fileName();*/
                    $scope.noChange=false;
                    $scope.goods= Goods.list($stateParams);
                    $scope.loaded=true;
                    $timeout(function(){$scope.loaded=false;},3500);
                });
            };

            $scope.deleteGood = function(good){
                if (confirm("Удалить?")){
                    good.$delete(function(err){
                        $scope.goods= Goods.list($stateParams);
                        $scope.noChange=true;
                        $scope.good = {}//new Goods();
                        $scope.myFileSrc='/' + '?' + new Date().getTime();
                    });
                }
            }



        }])

    .controller('commentsCtrl', ['$scope','Goods','$stateParams','$rootScope',"$timeout","Comments","Categories",
        function ($scope,Goods,$stateParams,$rootScope,$timeout,Comments,Categories) {
            //$scope.saved=false;
            $scope.goodId=parseInt($stateParams.id);
            $scope.comments = Comments.list($stateParams);
            $scope.comment={};
            $scope.good= Goods.get($stateParams,function(){
                $scope.category=Categories.get({id:$scope.good.type});
            });

            $scope.editComment= function(comment){
                $scope.focusInput=true;
                if (!comment){
                    $scope.comment = {}
                    $scope.comment.idGood=$stateParams.id;
                    $scope.activeCommentName='новый';
                }
                else{
                    $scope.comment = Comments.get({id:$stateParams.id,idC:comment._id},function(){
                        $scope.comment.idGood=$stateParams.id;
                    });
                    $scope.activeCommentName=comment.author;
                }
            }


            $scope.updateComment = function(){
                $scope.comment.id=$stateParams.id;
                if (!$scope.comment._id){

                    Comments.add($scope.comment,function(res){
                        $scope.afterSave(res);
                    })
                } else{
                    $scope.comment.$update(function(res){
                        $scope.afterSave(res);
                    });
                }
            }

            $scope.afterSave = function(res){
                if (res.err){
                    $scope.mongoError = res.err;
                    $scope.mongoErrorShow = true;
                    $timeout(function(){$scope.mongoErrorShow=false;},3500);
                }
                $scope.comments= Comments.list($stateParams);
                $scope.saved=true;
                $timeout(function(){$scope.saved=false;},3500);
                $scope.activeCommentName='';
                $scope.comment={};
            }
            $scope.deleteComment = function(comment){
                if (confirm("Удалить?")){
                    comment.idGood=$stateParams.id;
                    comment.$delete(function(err){
                        $scope.comments= Comments.list($stateParams);
                        $scope.comment = {};
                    });
                }
            }



        }])
    .controller('uploadFileCtrl', ['$scope','$fileUpload',function ($scope,$fileUpload) {
       $scope.uploadFile = function(){
            var file = $scope.myFile;
            $scope.noLoad=true;
            var uploadUrl = "api/fileUploadPdf";
            $fileUpload.uploadFileToUrl(file, uploadUrl).then(function(promise){
                $scope.noLoad=false;
            });
        };
    }])

    .controller('brandsCtrl', ['$scope','Brands','$stateParams','$rootScope','$fileUpload','Category','Country','Region','City','$timeout',
        function ($scope,Brands,$stateParams,$rootScope,$fileUpload,Category,Country,Region,City,$timeout) {
          $scope.brands= Brands.list();


            $scope.editBrand= function(brand){
                var id =(brand)?brand._id:'';
                $rootScope.$state.transitionTo('mainFrame.brands.edit',{'id':id});
            }


            $scope.deleteBrand = function(brand){
                if (confirm("Удалить?")){
                    brand.$delete(function(err){
                        if (err) console.log(err);
                        $scope.brands= Brands.list();
                    });
                }
            }
            $scope.$watch('changeBrand',function(){
                if ($rootScope.changeBrand){
                    $scope.brands= Brands.list();
                }
                $rootScope.changeBrand=false;
            })
       }])

    .controller('brandsEditCtrl', ['$scope','Brands','$stateParams','$rootScope','$fileUpload','Category','Country','Region','City','$timeout','BrandTags',
        function ($scope,Brands,$stateParams,$rootScope,$fileUpload,Category,Country,Region,City,$timeout,BrandTags) {
            //$scope.categories =Category.list();
            $scope.focusInput=[];
            $scope.focusInputBrandTag=[];
            $scope.countries= Country.list();
            $scope.regions= [];//Region.list();
            $scope.cities= [];//City.list();
            $scope.brandTag={};
            $scope.brandTag.name={"ru":'',"ua":'',"en":''};
            $scope.brandTag.index=1;
            $scope.editDisabledTag= true;
            $scope.editTagShow=false;
            $scope.showThumb=true;

            $scope.editBrandTag= function(tag){
                //console.log(tag);
                $scope.editTagShow=true;
                $scope.focusInputBrandTag[0]=true;
                $scope.editDisabledTag= false;
                if (!tag){
                    $scope.brandTag={};
                    $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                    $scope.brandTag.index=1;
                } else {
                    $scope.brandTag=tag;
                }
            }
            $scope.saveBrandTag= function(){
                $scope.editDisabledTag= true;
                $scope.editTagShow=false;
                console.log('sdss');

                if (!$scope.brandTag._id){
                    $scope.brandTag.brand=$scope.brand._id;
                    BrandTags.add($scope.brandTag,function(){
                        $scope.brandTags=BrandTags.list({brand:$scope.brand._id});
                        $scope.brandTag={};
                        $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                        $scope.brandTag.index=1;
                    })
                } else{
                    $scope.brandTag.$update(function(err){
                        //  if (err) console.log(err);
                        $scope.brandTags=BrandTags.list({brand:$scope.brand._id});
                        $scope.brandTag={};
                        $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                        $scope.brandTag.index=1;
                    });
                }

            }
            $scope.deleteBrandTag= function(brandTag){
                $scope.editDisabledTag= true;
                $scope.editTagShow=false;
                brandTag.$delete(function(err){
                    if (err) console.log(err);
                    $scope.brandTag={};
                    $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                    $scope.brandTag.index=1;
                    $scope.brandTags=BrandTags.list({brand:$scope.brand._id});
                });
            }




            /*$scope.changeCountry = function(country){
                console.log(country);
            }*/

            $scope.$watch('country',function(){
                if  ($scope.country){
                    $scope.regions=Region.list({country:$scope.country},function(){
                        $timeout(function(){$scope.region=$scope.brand.region;},100);
                    });
                }
            });
            $scope.$watch('region',function(){
                if  ($scope.region){
                    $scope.cities=City.list({region:$scope.region},function(){
                        $timeout(function(){$scope.city=$scope.brand.city;},100);
                    });
                }
            });

            $scope.editBrand= function(brand){
                $scope.focusInput[0]=true;
                $scope.categoryList=[];
                $scope.editDisabled=false;
                if (!brand._id){
                    $scope.brand={};
                    $scope.brand.name={"ru":'',"ua":'',"en":''};
                    $scope.brand.desc={"ru":'',"ua":'',"en":''};
                    $scope.brand.index=1;
                    //$scope.country=($scope.countries.length>0)?$scope.countries[0]._id:{};
                    $scope.country='';
                    $scope.city='';
                    $scope.region='';
                    $scope.noChange=true;
                    $scope.brandTags =[];
                    //$scope.myFileSrc='/' + '?' + new Date().getTime();
                }
                else{
                    $scope.noChange=false;
                    $scope.brand = Brands.get(brand,function(){
                        $scope.brandTags=BrandTags.list({brand:$scope.brand._id});
                        $scope.myFileSrc=$scope.brand.img;
                        if ($scope.brand.country){
                            $scope.country=$scope.brand.country;
                        } else {
                            $scope.country='';
                        }
                        /*if ($scope.brand.categories && $scope.brand.categories.length>0){
                            $scope.categories.forEach(function(el){
                                if($scope.brand.categories.indexOf(el._id)>-1){
                                    $scope.categoryList.push(el.name[$rootScope.config.DL]);
                                }
                            })
                        }*/
                    });
                    //$scope.myFileSrc='/' + '?' + new Date().getTime();
                }
            }


            $scope.afterSave=function(){
                $rootScope.$state.transitionTo('mainFrame.brands');
                $rootScope.changeBrand=true;


            }

            $scope.updateBrand = function(){
                //console.log($scope.country);
                $scope.brand.city = $scope.city;
                $scope.brand.country =$scope.country;
                $scope.brand.region =$scope.region;

                if (!$scope.brand._id){
                    Brands.add($scope.brand,function(){
                        $scope.afterSave();
                    })
                } else{
                    $scope.brand.$update(function(err){
                        //  if (err) console.log(err);
                        $scope.afterSave();
                    });
                }
            }



            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/brandfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.brand._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    $scope.brands= Brand.list();
                });
            };

            $scope.editBrand({_id:$rootScope.$stateParams.id});

        }])

    .controller('categoryCtrl', ['$scope','Category','$rootScope','Brands','Filters',
        function ($scope,Category,$rootScope,Brands,Filters) {
            $scope.categories= Category.list();
            //$scope.changeCategory=$rootScope.changeCategory;
           /* $scope.getTags=function(){
                $scope.categories= Category.list();
                *//*$scope.brandTags = [];
                $scope.brands = Brands.list(function(){
                    $scope.brands.forEach(function(el){
                        $scope.brandTags.push({'id':el._id,'label':el.name[$rootScope.config.DL],'index':el.index});
                    });
                });*//*
                *//*$scope.filterTags = [];
                $scope.filters = Filters.list(function(){
                    $scope.filters.forEach(function(el){
                        $scope.filterTags.push({'id':el._id,'label':el.name[$rootScope.config.DL],'index':el.index});
                    });
                });*//*
            }
*/


            $scope.editCategory = function(category){
                //console.log('dd');
                var id =(category)?category._id:'';
                $rootScope.$state.transitionTo('mainFrame.category.edit',{'id':id});

            }

            $scope.$watch('changeCategory',function(){
                //console.log('sdf111');
                if ($rootScope.changeCategory){
                    //console.log('ddddd');
                    //$scope.categories= Category.list(function(){});
                    //$scope.getTags();
                    $scope.categories= Category.list();
                }
                $rootScope.changeCategory=false;
            })

            $scope.deleteCategory = function(category){
                if (confirm("Удалить?")){
                    category.$delete(function(err){
                        if (err) console.log(err);
                        $scope.getTags();
                    });
                }
            }
           // $scope.getTags();
        }])

    .controller('categoryEditCtrl', ['$scope','Category','$rootScope','$fileUpload','Brands','Filters','$timeout',
        function ($scope,Category,$rootScope,$fileUpload,Brands,Filters,$timeout) {
            //console.log('ssss');
            $scope.editDisabled=false;
            $scope.focusInput=[];
            $scope.focusInput[0]=true;
            $scope.category={};
            $scope.category.name={"ru":'',"ua":'',"en":''};
            $scope.category.desc={"ru":'',"ua":'',"en":''};
            $scope.category.index=1;
            $scope.category.brands=[];
            $scope.category.filters=[];
            $scope.categoryTags=[];
            $scope.selectBrand='';


            // brands
            $scope.brandList=[];

            $scope.brandTags = [];
            Brands.list(function(brands){
                for(var i=0; i<brands.length;i++){
                    $scope.brandTags.push({'id':brands[i]._id,'label':brands[i].name[$rootScope.config.DL],'index':brands[i].index});
                };
            });

            $scope.$watch("selectBrand",function(){

                if (!$scope.selectBrand) return;
                var i = $scope.brandTags.indexOf($scope.selectBrand);

                $scope.brandList.push($scope.selectBrand);
                $scope.brandTags.splice(i, 1);
                $scope.selectBrand='';
            })

            $scope.removeBrand=function(brand){


                var i = $scope.brandList.indexOf(brand);
                $scope.brandTags.push(brand);
                $scope.brandList.splice(i,1);
                $scope.disabledButton=false;
                //$rootScope.changeCategory=true;
            }
            //filters
            $scope.filterTags = [];
            Filters.list(function(filters){
                for(var i =0; i<filters.length;i++){
                    $scope.filterTags.push({'id':filters[i]._id,'label':filters[i].name[$rootScope.config.DL],'index':filters[i].index});
                };
            });


            $scope.filterList=[];
            $scope.$watch("selectFilter",function(){
                if (!$scope.selectFilter) return;
                var i=$scope.filterTags.indexOf($scope.selectFilter);
                $scope.filterList.push($scope.selectFilter);
                $scope.filterTags.splice(i, 1);
                $scope.selectFilter='';
            })
            $scope.removeFilter=function(filter){
                if (filter.id==$scope.category.mainFilter) return;
                var i=$scope.filterList.indexOf(filter);
                $scope.filterTags.push(filter);
                $scope.filterList.splice(i,1);
                $scope.disabledButton=false;
            }

            // categories
            function getSections(){
                $scope.categoryTags=[];
                $scope.categoryTags.push({'id':'','label':'Корневой','index':0});
                $scope.categories.forEach(function(el){
                    if (!el.section)
                        $scope.categoryTags.push({'id':el._id,'label':el.name[$rootScope.config.DL],'index':el.index});
                });
            }




            $scope.editCategory= function(category){
                $scope.editDisabled=false;
                $scope.selectMainFilter;
                $scope.myFileSrc='/' + '?' + new Date().getTime();
                if (!category._id){
                    $scope.category={};
                    $scope.category.name={"ru":'',"ua":'',"en":''};
                    $scope.category.desc={"ru":'',"ua":'',"en":''};
                    $scope.category.index=1;
                    $scope.category.brands=[];
                    $scope.category.filters=[];
                    $scope.noChange=true;
               } else{
                    $scope.noChange=false;
                    $scope.category = Category.get(category,function(){
                        if ($scope.category.mainFilter){
                            $scope.selectMainFilter=$scope.category.mainFilter;
                        }
                        $scope.myFileSrc=$scope.category.img;
                        $timeout(function(){
                            for (var i=0;i<$scope.brandTags.length;i++){
                                if ($scope.category.brands.indexOf($scope.brandTags[i].id)>-1){
                                    $scope.brandList.push($scope.brandTags[i]);
                                    $scope.brandTags.splice(i, 1);
                                }
                            }
                        },500);
                        $timeout(function(){
                            for (var i=0;i<$scope.filterTags.length;i++){
                                if ($scope.category.filters.indexOf($scope.filterTags[i].id)>-1){
                                    $scope.filterList.push($scope.filterTags[i]);
                                    $scope.filterTags.splice(i, 1);
                                }
                            }
                        },500);
                    });
                }
            }


            $scope.afterSave=function(){
                $rootScope.$state.transitionTo('mainFrame.category');
                $rootScope.changeCategory=true;
            }

            $scope.updateCategory = function(){
                if ($scope.selectMainFilter && !$scope.category.mainFilter){
                    $scope.category.mainFilter=$scope.selectMainFilter;
                }
                var i;
                for(i=0; i<=$rootScope.config.langArr.length-1;i++){
                    $scope.category.name[$rootScope.config.langArr[i]]=$scope.category.name[$rootScope.config.langArr[i]].substring(0,25);
                }
                for(i=0;i<=$rootScope.config.langArr.length-1;i++){
                    $scope.category.desc[$rootScope.config.langArr[i]]=$scope.category.desc[$rootScope.config.langArr[i]].substring(0,1000);
                }


                $scope.category.brands=[];
                $scope.category.filters=[];
                //console.log($scope.category.section);
                if ($scope.category.section){
                    $scope.brandList.forEach(function(el){
                        $scope.category.brands.push(el.id);
                    })

                    $scope.filterList.forEach(function(el){
                        $scope.category.filters.push(el.id);
                    })
                } else{
                    $scope.category.section=null;
                }
                if (!$scope.category._id){
                    Category.add($scope.category,function(){
                        $scope.afterSave();
                    })
                } else{
                    $scope.category.$update(function(err){
                        // if (err) console.log(err);
                        $scope.afterSave();
                    });

                }
            }


            $scope.myFile={};
            $scope.noLoad=true;
            //$scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/categoryfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.category._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    $scope.categories= Category.list();
                });
            };


            $timeout(function(){getSections();},50)
            $scope.editCategory({_id:$rootScope.$stateParams.id});


        }])


.controller('stuffCtrl', ['$scope','Brands','$rootScope','Category','Filters','Stuff','$q','$timeout','BrandTags',
        function ($scope,Brands,$rootScope,Category,Filters,Stuff,$q,$timeout,BrandTags) {
            $scope.sections=[];
            $scope.activeCategory='';
            $scope.activeBrand='';
            $scope.categoryList=[];
            $scope.brandList=[];
            $scope.filtersList=[];
            $scope.collectionList=[];
            $scope.collectionTag={};

            $scope.stuffList=[];
            //paginator
            $scope.page=1;
            //$scope.numPages=2;
            $scope.totalItems=0;
            //$scope.maxSize = 5;
            //$scope.perPage =3;
            var defer = $q.defer();
            var promises = [];
            $scope.isopenCategory=true;
            $scope.isopenBrand=true;
            $scope.isopenFilter=false;
            $scope.isopenCollection=false;


            //console.log( $scope.filterList);
            $scope.filters=Filters.list();

            // инициализация********************************
            $scope.categories =Category.list(function(){
                $scope.categories.forEach(function(el){
                    if(!el.section){
                        $scope.sections.push({"id":el._id,"label":el.name[$rootScope.config.DL]});
                    }
                })
                /*if ($scope.sections.length>0)
                    $scope.section=$scope.sections[0];*/

                $scope.brands=Brands.list(function(){
                    if ($scope.sections.length>0)
                        $scope.section=$scope.sections[0];
                    //$scope.changeSection($scope.section);
                });
            });
            //*********************************************

            $scope.$watch('section',function(){
                //console.log('ddd');
                if ($scope.section){
                    $scope.changeSection($scope.section);
                }
            });
            $scope.changeSection = function(section){
                //console.log($scope.section.id);
                $scope.totalItems=0;
                $scope.activeCategory='';
                $scope.activeBrand='section';
                $scope.filtersList=[];
                $scope.brandList = $scope.getBrandList($scope.section.id);
                $scope.categoryList = $scope.getCategoryList($scope.section.id);
                $scope.stuffs=$scope.getStuffList($scope.section.id,$scope.activeBrand)
                $scope.activeBrand='';

            };

            $scope.getBrandList= function(sectionId){
                //console.log(sectionId);
                var tempArrForId=[];
                var arr=[];
                $scope.categories.forEach(function(el){
                    //console.log(el);
                    if (el.section==sectionId){
                        //console.log(el.brands);
                        if ( el.brands && el.brands.length>0){
                            el.brands.forEach(function(item){
                                if (tempArrForId.indexOf(item)<0){
                                    tempArrForId.push(item);
                                    for (var i=0 ; i<=$scope.brands.length - 1; i++) {
                                        if ($scope.brands[i]._id==item){
                                            arr.push($scope.brands[i]);
                                            break;
                                        }
                                    }
                                }
                            })
                        }
                    }

                })
                return arr;
            }

            $scope.getCategoryList= function(sectionId){
                var arr=[];
                $scope.categories.forEach(function(el){
                    if (el.section==sectionId){
                        arr.push(el);
                    }
                })
                return arr;
            }


            function getBr(brandIdArr,arr){
                brandIdArr.forEach(function(item){
                        for (var i=0 ; i<=$scope.brands.length - 1; i++) {
                            if ($scope.brands[i]._id==item){
                                arr.push($scope.brands[i]);
                                break;
                            }
                        }
                })
            };

            $scope.getFt=function (filterArr,arr){

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
                /*console.log($scope.activeBrand);
                console.log(category);*/
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
                /*console.log(brand);
                console.log($scope.activeCategory);*/
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


            $scope.getStuffList = function(categoryId,brandId,page){
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
                   /* if ($scope.stuffList.length<=0 && tempArr.length>0){
                        $scope.totalItems=tempArr[0].index;
                    }*/
                    if ($scope.page==1 && tempArr.length>0){
                        $scope.totalItems=tempArr[0].index;
                    }
                    //console.log($scope.totalItems);
                    for (var i=0 ; i<=tempArr.length - 1; i++) {
                       // tempArr[i].filters=JSON.parse(tempArr[i].filters);
                        $scope.stuffList.push(tempArr[i]);
                    }
                });
            }
            //Angularjs promise chain when working with a paginated collection
            //http://stackoverflow.com/questions/20171928/angularjs-promise-chain-when-working-with-a-paginated-collection
            $scope.loadData = function(numPage) {
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




            $scope.editStuff = function(stuff){
               //console.log('dd');
                var id =(stuff)?stuff._id:'';
                $rootScope.$state.transitionTo('mainFrame.stuff.edit',{'id':id});

            }

            $scope.deleteStuff = function(stuff){
                if (confirm("Удалить?")){
                    stuff.$delete(function(err){
                        if (err) console.log(err);
                        $rootScope.changeStuff=true;
                        //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                    });
                }
            }

            $scope.setPage = function () {
                $scope.page++;
                $scope.getStuffList($scope.activeCategory,$scope.activeBrand,$scope.page);
                //console.log($scope.page);

            };


            $scope.filterLists =  function() {
                return function(item) {


                    if ($scope.collectionTag.val && item.brandTag!=$scope.collectionTag.val){
                        return false;
                    }
                    if (!$scope.filtersList || $scope.filtersList.length<=0){
                        return true;
                    }
                     for (var i=0 ; i<=$scope.filtersList.length - 1; i++) {
                            if ($scope.filtersList[i].value && item.tags.indexOf($scope.filtersList[i].value)<=-1){
                                return false;
                            }
                     }
                    return true;
                }
            }
            /*$scope.filterLists1 =  function() {
                return function(item) {
                    //angular.isObject(item.filters)
                    //console.log(angular.isObject(item.filters));
                    if (!angular.isObject(item.filters ) && typeof(item.filters)=='string'){
                        item.filters=JSON.parse(item.filters);
                    }
                    //$timeout(function(){
                    if (!$scope.filtersList || $scope.filtersList.length<=0){
                        //console.log($scope.filtersList.length);
                        return true;
                    }
                    if (!item.filters || item.filters.length<=0){
                        return true;
                    }
                    for (var i=0 ; i<=$scope.filtersList.length - 1; i++) {
                        *//*console.log($scope.filtersList[i]);
                         console.log(item.filters[$scope.filtersList[i]._id]);*//*
                        if ($scope.filtersList[i].type=='1'){
                            if ($scope.filtersList[i].value && $scope.filtersList[i].value!=item.filters[$scope.filtersList[i]._id]){
                                return false;
                            }
                        } else {
                            *//*console.log($scope.filtersList[i].value);//item.filters[$scope.filtersList[i]._id]
                             console.log($scope.filtersList[i]._id);*//*
                            if ($scope.filtersList[i].value && item.filters[$scope.filtersList[i]._id][$scope.filtersList[i].value]=='NO'){
                                return false;
                            }
                        }
                    }
                    //console.log(item);
                    return true;
                    //},100)
                }
            }*/

            $scope.$watch('changeStuff',function(){
                if ($rootScope.changeStuff){
                    //console.log('dd');
                    //$scope.getStuffList($scope.activeCategory,$scope.activeBrand);
                    $scope.loadData($scope.page);
                   /*for (var i=1;i<=$scope.page;i++){
                       promises.push($scope.getStuffList($scope.activeCategory,$scope.activeBrand,i));
                   }*/
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
            }

        }])


    .controller('editStuffCtrl', ['$scope','Brands','$rootScope','Category','Filters','Stuff','$timeout','$fileUpload','BrandTags',
        function ($scope,Brands,$rootScope,Category,Filters,Stuff,$timeout,$fileUpload,BrandTags) {
            $scope.filterListEdit=[];
            $scope.stuff={};
            $scope.stuff.name={"ru":'',"ua":'',"en":''};
            $scope.stuff.desc={"ru":'',"ua":'',"en":''};
            $scope.stuff.category='';
            $scope.stuff.tags=[];
            $scope.filtersValue={};
            $scope.brandTags=[];
            $scope.brandTag='';
            $scope.stock={};
            $scope.sizeId,$scope.colorId;
            $scope.sizeName={};
            $scope.colorName={};

            if ($rootScope.$stateParams.id){
                $timeout(function(){
                    $scope.stuff=Stuff.get($rootScope.$stateParams,function(res){
                        $scope.noChange=false;
                        $scope.myFileSrc=$scope.stuff.img;
                        if (res.stock){
                            res.stock=JSON.parse(res.stock);
                        }
                        console.log(res.stock);
                    });
                },400);
            } else {
                $timeout(function(){
                    $scope.stuff.category=($scope.activeCategory)?$scope.activeCategory:$scope.categoryList[0]._id;
                    $scope.stuff.brand=($scope.activeBrand)?$scope.activeBrand:$scope.brandList[0]._id;
                },400);
            }

            $scope.$watch('stuff.category',function(){
                if (!$scope.stuff.category) return;
                $scope.getFilters($scope.stuff.category,$scope.setFilterValue);
            });

            $scope.getFilters = function(id,cb){
                Category.get({_id:$scope.stuff.category},function(category){
                    //console.log(category)
                    $scope.filterListEdit=Filters.list({'filters':JSON.stringify(category.filters)},function(res){
                        //console.log($scope.filterListEdit);
                        cb($scope.stuff.tags);

                        //console.log($scope.colorId+'   '+$scope.sizeId);
                    });
                });

            }

            $scope.$watch('stuff.brand',function(){
                if ($scope.stuff.brand){
                    $scope.brandTags=BrandTags.list({brand:$scope.stuff.brand},function(){
                        $scope.brandTag='';
                    });
                } else {
                    $scope.stuff.brandTag=null;
                }
            });
            function setStock(){
                $scope.stock={};
                if($scope.filtersValue[$scope.colorId] && $scope.filtersValue[$scope.colorId].length){
                    for (var i=0 ; i<$scope.filtersValue[$scope.colorId].length; i++) {
                        $scope.stock[$scope.filtersValue[$scope.colorId][i]]={};
                        if($scope.filtersValue[$scope.sizeId] && $scope.filtersValue[$scope.sizeId].length){
                            for (var j=0 ; j<$scope.filtersValue[$scope.sizeId].length; j++) {
                                if ($scope.stuff.stock
                                    &&$scope.stuff.stock[$scope.filtersValue[$scope.colorId][i]]/*
                                    &&$scope.stuff.stock[$scope.filtersValue[$scope.colorId][i]][$scope.filtersValue[$scope.sizeId][j]]*/){
                                    $scope.stock[$scope.filtersValue[$scope.colorId][i]]
                                        [$scope.filtersValue[$scope.sizeId][j]]=
                                        $scope.stuff.stock[$scope.filtersValue[$scope.colorId][i]][$scope.filtersValue[$scope.sizeId][j]];
                                } else {
                                    $scope.stock[$scope.filtersValue[$scope.colorId][i]]
                                        [$scope.filtersValue[$scope.sizeId][j]]=0;
                                }
                            }
                        }
                    }
                }
            }
            $scope.setFilterValue= function(tags){
                for (var i=0 ; i<=$scope.filterListEdit.length - 1; i++) {
                        if($scope.filterListEdit[i].name['en'].toLowerCase()=='color'){
                            $scope.colorId=$scope.filterListEdit[i]._id;
                            $scope.filterListEdit[i].tags.forEach(function(el){
                                $scope.colorName[el._id]=el.name[$rootScope.config.DL];
                            })
                        }
                        if($scope.filterListEdit[i].name['en'].toLowerCase()=='size'){
                            $scope.sizeId=$scope.filterListEdit[i]._id;
                            $scope.filterListEdit[i].tags.forEach(function(el){
                                $scope.sizeName[el._id] = el.name[$rootScope.config.DL];
                            })
                        }
                    if ($scope.filterListEdit[i].type=='1'){
                        var found = false;
                        $scope.filterListEdit[i].tags.forEach(function(el){
                            if (tags.indexOf(el._id) > -1){
                                $scope.filtersValue[$scope.filterListEdit[i]._id]=el._id;
                                found = true;
                            }
                        })
                        if (!found) $scope.filtersValue[$scope.filterListEdit[i]._id]='';
                        //alert('ddddd');
                    } else {
                        $scope.filtersValue[$scope.filterListEdit[i]._id]=[];
                        $scope.filterListEdit[i].tags.forEach(function(el){
                            if (tags.indexOf(el._id) > -1){
                                $scope.filtersValue[$scope.filterListEdit[i]._id].push(el._id);
                            }
                        })
                    }
                    //****************************наличие
                    $timeout(function(){setStock();},200);
                    //*********************************************
                   // console.log( $scope.stock);

                }
            }
            $scope.changeStock = function(key,key1){
                $scope.stock[key][key1]=($scope.stock[key][key1]>0)?0:1;
            }
            $scope.changeFitlerVal = function(){
                console.log('ss');
                $timeout(function(){setStock()},200);
            }


            $scope.afterSaveStuff = function(){
                $rootScope.$state.transitionTo('mainFrame.stuff');
                $rootScope.changeStuff=true;

            }


            function setFiltersTags(filtersValue){
                $scope.stuff.tags=[];
                for( var i in filtersValue){
                    if( angular.isArray(filtersValue[i]) && (filtersValue[i] !== null) ){
                        for (var j=0; j< filtersValue[i].length;j++) {
                                $scope.stuff.tags.push(filtersValue[i][j]);
                        }
                    } else{
                        if (filtersValue[i]){
                            $scope.stuff.tags.push(filtersValue[i]);
                        }
                    }
                }
                $scope.stuff.stock=JSON.stringify($scope.stock);
            }


            $scope.updateStuff= function(stuff){
                setFiltersTags($scope.filtersValue);
                var i;
                for(i=0; i<=$rootScope.config.langArr.length-1;i++){
                    $scope.stuff.name[$rootScope.config.langArr[i]]=$scope.stuff.name[$rootScope.config.langArr[i]].substring(0,25);
                }
                for(i=0;i<=$rootScope.config.langArr.length-1;i++){
                    $scope.stuff.desc[$rootScope.config.langArr[i]]=$scope.stuff.desc[$rootScope.config.langArr[i]].substring(0,1000);
                }
                if (!$scope.stuff._id){
                    Stuff.add($scope.stuff,function(){
                        $scope.afterSaveStuff();
                    })
                } else{
                    $scope.stuff.$update(function(err){
                        $scope.afterSaveStuff();
                    });
                }
            }

            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/stufffile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.stuff._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    //$scope.categories= Category.list();
                });
            };
       }])


    .controller('commentStuffCtrl', ['$scope','$rootScope','Stuff',"Comment",
        function ($scope,$rootScope,Stuff,Comment) {
            $scope.disallowEdit = true;
            $scope.stuff=Stuff.full($rootScope.$stateParams);
            $scope.comment={};

            $scope.backToList=function(){
                $rootScope.$state.transitionTo('mainFrame.stuff');
                $rootScope.changeStuff=true;
            }

            $scope.editComment = function(comment){
                //console.log($rootScope.user);
                $scope.disallowEdit = false;
                if (!comment){
                    $scope.comment={};
                    $scope.comment.text='';

                    $scope.comment.author=$rootScope.user._id;
                    $scope.comment.authorName=$rootScope.user.name;
                    $scope.comment.stuff=$rootScope.$stateParams.id;

                } else {
                    $scope.comment = Comment.get(comment,function(){
                        console.log($scope.comment);
                        $scope.comment.authorName=$scope.comment.author.name;
                    });
                }


            }

            $scope.afterSave = function(){
                $scope.comment.text='';
                $scope.comment.author='';
                $scope.comment.date='';
                $scope.stuff=Stuff.full($rootScope.$stateParams);
            }

            $scope.updateComment =  function(){
                $scope.disallowEdit = true;

                if (!$scope.comment._id){
                    Comment.add($scope.comment,function(){
                        $scope.afterSave();
                    })
                } else{
                    $scope.comment.$update(function(err){
                        $scope.afterSave();
                    });

                }
            }

            $scope.deleteComment = function(comment){
                if (confirm("Удалить?")){
                    $scope.comment = Comment.get(comment,function(){
                        $scope.comment.$delete(function(err){
                            if (err) console.log(err);
                            $scope.afterSave();
                            //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                        });
                    });

                }
            }

            $scope.dateConvert = function(date){
                return moment(date).format('lll');
            }


        }])


    .controller('editStuffGalleryCtrl', ['$scope','$rootScope','$fileUpload','$http','Stuff',"$timeout",
        function ($scope,$rootScope,$fileUpload,$http,Stuff,$timeout) {

            $scope.photoIndexArray=[1,2,3,4,5,6,7,8,9,10,11,12];
            $scope.photoIndex=1;
            $scope.mainFilterTag='';
            $scope.gallery = [];//= $scope.stuffForGallery.gallery;
            $scope.stuff= Stuff.full({id:$rootScope.$stateParams.id},function(){
                //console.log($scope.stuff);
                $scope.gallery=$scope.stuff.gallery;

            });

            $scope.refreshStuff= function(){

                $scope.stuff= Stuff.full({id:$rootScope.$stateParams.id},function(){
                    $scope.gallery=$scope.stuff.gallery;
                    $scope.myFileSrc='/' + '?' + new Date().getTime();
                    $scope.noChange=false;
                    $scope.photoIndex=1;
                    $scope.mainFilterTag='';
                    $scope.saveDisabled=false;
                });
            }
            //console.log($scope.stuffForGallery);
            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=false;
            $scope.myFileSrc='/' + '?' + new Date().getTime();;
            $scope.uploadFile = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "api/stufffile/fileUploadGallery";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.stuff._id,{index:$scope.photoIndex,tag:$scope.mainFilterTag}).then(function(promise){
                    $scope.refreshStuff();
                });
            };

            $scope.deletePhoto = function(index){
                //var par = {'id':params.id,'photo':index};
                //console.log(index);
                if (confirm("Удалить?")){
                    $http.get("/api/stufffile/fileGalleryDelete/"+$scope.stuffForGallery._id+'/'+index).then(function (response) {
                        $scope.refreshStuff();
                    });
                }
            }

            $scope.updateStuffGallery = function(){
                $scope.saveDisabled=true;
                $scope.gallery=[];
                $timeout(function(){
                    $scope.stuff.$updateGallery(function(stuff){
                        // stuff;
                        $scope.refreshStuff();
                    });
                },200);

            }


            $scope.backToList=function(){
                $rootScope.$state.transitionTo('mainFrame.stuff');
                $rootScope.changeStuff=true;
            }



        }])


    .controller('collectionCtrl', ['$scope','Brands','$rootScope','BrandTags',
        function ($scope,Brands,$rootScope,BrandTags) {
            $rootScope.activeBrand=null;
            $scope.brands= Brands.list();


            $scope.editCollection= function(collection){
                var id =(collection)?collection._id:'';
                $rootScope.$state.transitionTo('mainFrame.collection.edit',{'brand':$scope.activeBrand._id,'id':id});
            }


            $scope.deleteCollection = function(brand){
                if (confirm("Удалить?")){
                    brand.$delete(function(err){
                        if (err) console.log(err);
                        $scope.brands= Brands.list();
                    });
                }
            }

            $scope.$watch('activeBrand',function(){
                if ($scope.activeBrand){
                    $scope.collections= BrandTags.list({brand:$scope.activeBrand._id});
                }
            })

            $scope.selectBrand= function(Brand){
                $scope.activeBrand=Brand;
            }


            $scope.$watch('changeCollection',function(){
                //console.log($rootScope.changeCollection);
                if ($rootScope.changeCollection){
                    //console.log($scope.activeBrand);
                    if ($scope.activeBrand){
                        $scope.collections= BrandTags.list({brand:$scope.activeBrand._id});
                    }
                }
                $rootScope.changeCollection=false;
            })
        }])

    .controller('editCollectionCtrl', ['$scope','$rootScope','$fileUpload','$timeout','BrandTags',
        function ($scope,$rootScope,$fileUpload,$timeout,BrandTags) {
            //$scope.categories =Category.list();
            $scope.focusInput=[];
            $scope.showThumb=true;

            $scope.editBrandTag= function(){
                $scope.focusInput[0]=true;
                if (!$rootScope.$stateParams.id){
                    $scope.brandTag={};
                    $scope.brandTag.name={"ru":'',"ua":'',"en":''};
                    $scope.brandTag.desc={"ru":'',"ua":'',"en":''};
                    $scope.brandTag.index=1;
                } else {
                    $scope.brandTag=BrandTags.get({id:$rootScope.$stateParams.id},function(){
                        $scope.noChange=false;
                        if ($scope.brandTag.img)
                            $scope.myFileSrc=$scope.brandTag.img;
                    });
                }
            }

            $scope.afterSave=function(){
                $rootScope.$state.transitionTo('mainFrame.collection');
                $rootScope.changeCollection=true;
            }

            $scope.updateCollection= function(){
               if (!$scope.brandTag._id){
                    $scope.brandTag.brand=$rootScope.$stateParams.brand;
                    BrandTags.add($scope.brandTag,function(){
                        $scope.afterSave();
                    })
                } else{
                    $scope.brandTag.$update(function(err){
                        $scope.afterSave();
                    });
                }

            }
            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "/api/collectionfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.brandTag._id).then(function(promise){
                    console.log(promise);
                    $scope.noChange=false;
                    //$scope.brands= Brand.list();
                });
            };

            $scope.editBrandTag();

    }])

    .controller('placesCtrl', ['$scope','$rootScope','Country','Region','City',
        function ($scope,$rootScope,Country,Region,City) {
            $scope.editDisabledC=true;
            $scope.editDisabledR=true;
            $scope.editDisabledCity=true;
            //$scope.conf=$rootScope.config;
            $scope.focusInput=[];
            $scope.focusInputR=[];
            $scope.focusInputC=[];
            $scope.activeCounty={};
            $scope.activeRegion={};
            $scope.activeCity={};
            $scope.country={};
            $scope.region={};
            $scope.city={};

            function getCountries(){
                $scope.countries=Country.list(function(){
                    if (!$scope.activeCountryl && $scope.countries.length>0 ){
                        $scope.activeCountry=$scope.countries[0];
                    } else {
                        if ($scope.activeCountry){
                            for(var i=0;i<=$scope.countries.length-1;i++){
                                if ($scope.countries[i]._id==$scope.activeCountry._id){
                                    $scope.activeCountry = JSON.parse(JSON.stringify($scope.countries[i]));
                                    break;
                                }
                            }
                        }
                    }
                });
            }
            getCountries();

            $scope.editCountry = function(country,edit){
                if (edit)
                    $scope.editDisabledC=false;
                else
                    $scope.editDisabledC=true;
                if (!country){
                    $scope.activeCountry={};
                    $scope.country={};
                    $scope.country.name={"ru":'',"ua":'',"en":''};
                    $scope.country.index=1;
                }
                else {
                    $scope.country=country;
                    $scope.activeCountry=JSON.parse(JSON.stringify($scope.country));
                }
            }

            $scope.saveCountry = function(){
                function afterSave(){
                    $scope.country.name={"ru":'',"ua":'',"en":''};
                    $scope.country.index=1;
                    getCountries();
                    $scope.editDisabledC=true;
                }
                if (!$scope.country._id){
                    Country.add($scope.country,function(){
                        afterSave()
                    })
                } else{
                    $scope.country.$update(function(err){
                        if (err) console.log(err);
                        afterSave()
                    });
                }
            }
            $scope.deleteCountry = function(country){
                if (confirm("Удалить?")){
                    if (country._id == $scope.activeCountry._id){
                        $scope.activeCountry= {};
                    }
                    country.$delete(function(err,res){
                        console.log(err);
                        console.log(res);
                        getCountries()
                    });
                }
            }

            $scope.$watch('activeCountry',function(){
                var country =($scope.activeCountry)?$scope.activeCountry._id:'';
                getRegions(country,true);
            })

            /// region  ***************************
            function getRegions(country,newActiveRegion){
                $scope.regions=[];
                //alert($scope.activeRegion._id);
                //$scope.activeRegion={};
                $scope.region={};
                if (!country) return;
                $scope.regions=Region.list({country:country},function(){
                    if (newActiveRegion){
                        if($scope.regions.length>0 )
                            $scope.activeRegion=JSON.parse(JSON.stringify($scope.regions[0]));
                        else
                            $scope.activeRegion={};
                    } else {
                        //alert('ss');
                            for(var i=0;i<=$scope.regions.length-1;i++){
                                if ($scope.regions[i]._id==$scope.activeRegion._id){
                                    $scope.activeRegion = JSON.parse(JSON.stringify($scope.regions[i]));
                                    break;
                                }
                            }
                  }
                });
            }


            $scope.editRegion = function(region,edit){

                if (edit)
                    $scope.editDisabledR=false;
                else
                    $scope.editDisabledR=true;
                if (!region){
                    $scope.activeRegion={};
                    $scope.region={};
                    $scope.region.country=$scope.activeCountry._id;
                    $scope.region.name={"ru":'',"ua":'',"en":''};
                    $scope.region.index=1;
                }
                else {
                    $scope.region=region;
                    $scope.activeRegion = JSON.parse(JSON.stringify($scope.region));
                }
            }

            $scope.saveRegion = function(){
                function afterSave(){
                    $scope.region.name={"ru":'',"ua":'',"en":''};
                    $scope.region.index=1;
                    getRegions($scope.activeCountry._id);
                    $scope.editDisabledR=true;
                }
                if (!$scope.region._id){
                    Region.add($scope.region,function(){
                        afterSave()
                    })
                } else{
                    $scope.region.$update(function(err){
                        if (err) console.log(err);
                        afterSave()
                    });
                }
            }
            $scope.deleteRegion = function(region){
                if (confirm("Удалить?")){
                    if (region._id == $scope.activeRegion._id){
                        $scope.activeRegion= {};
                    }
                    region.$delete(function(err,res){
                        console.log(err);
                        console.log(res);
                        getRegions($scope.activeCountry._id);
                    });
                }s
            }


            $scope.$watch('activeRegion',function(){
                var region =($scope.activeRegion)?$scope.activeRegion._id:'';
                getCities(region,true);
            })

            // города *********************************
            function getCities(region,newActiveCity){
                $scope.cities=[];
                //alert($scope.activeRegion._id);
                //$scope.activeRegion={};
                $scope.city={};
                if (!region) return;
                $scope.cities=City.list({region:region},function(){
                    if (newActiveCity){
                        if($scope.cities.length>0)
                            $scope.activeCity=JSON.parse(JSON.stringify($scope.cities[0]));
                        else
                            $scope.activeCity={};
                    } else {
                        //alert('ss');
                        for(var i=0;i<=$scope.cities.length-1;i++){
                            if ($scope.cities[i]._id==$scope.activeCity._id){
                                $scope.activeCity = JSON.parse(JSON.stringify($scope.cities[i]));
                                break;
                            }
                        }
                    }
                });
            }


            $scope.editCity = function(city,edit){

                if (edit)
                    $scope.editDisabledCity=false;
                else
                    $scope.editDisabledCity=true;
                if (!city){
                    $scope.activeCity={};
                    $scope.city={};
                    $scope.city.country=$scope.activeCountry._id;
                    $scope.city.region=$scope.activeRegion._id;
                    $scope.city.name={"ru":'',"ua":'',"en":''};
                    $scope.city.index=1;
                }
                else {
                    $scope.city=city;
                    $scope.activeCity = JSON.parse(JSON.stringify($scope.city));
                }
            }

            $scope.saveCity = function(){
                function afterSave(){
                    $scope.city.name={"ru":'',"ua":'',"en":''};
                    $scope.city.index=1;
                    getCities($scope.activeRegion._id);
                    $scope.editDisabledCity=true;
                }
                if (!$scope.city._id){
                    City.add($scope.city,function(){
                        afterSave()
                    })
                } else{
                    $scope.city.$update(function(err){
                        if (err) console.log(err);
                        afterSave()
                    });
                }
            }
            $scope.deleteCity = function(city){
                if (confirm("Удалить?")){
                    if (city._id == $scope.activeCity._id){
                        $scope.activeCity= {};
                    }
                    city.$delete(function(err,res){
                        console.log(err);
                        console.log(res);
                        getCities($scope.activeRegion._id);
                    });
                }s
            }

        }])
    .controller('currencyCtrl', ['$scope','Config','$timeout',
        function ($scope,Config,$timeout) {
            //Currency
            //.success(function(data) {console.log(data)})
            $scope.disabledButton=true;
            $scope.showMessage=false;
            $scope.config =  Config.get(function(){console.log($scope.config);$scope.disabledButton=false;});
            $scope.updateCurrency= function(){
                $scope.config.currency['RUB'][0]=parseFloat($scope.config.currency['RUB'][0]);
                $scope.config.currency['USD'][0]=parseFloat($scope.config.currency['USD'][0]);
                $scope.disabledButton=true;

                Config.save($scope.config,function() {
                   $scope.showMessage=true;
                    $timeout(function(){$scope.showMessage=false;$scope.disabledButton=false;},3000);
                });
            }
            //console.log($scope.currency);

        }])


.controller('ordersCtrl', ['$scope','$rootScope','Orders',
    function ($scope,$rootScope,Orders) {
        var start = Date.now();
        console.log(start)
        $scope.filterStatus='';
        $scope.orders=Orders.list();



        $scope.afterSave = function(){
            $scope.orders=Orders.list();
        };

        $scope.updateOrder =  function(order){

            order.$update(function(err){
                if (err) console.log(err);
                $scope.afterSave();
                /*$location.hash(id);
                $anchorScroll();*/
            });
        }
        /*$scope.cartCount =  function(cartItems){
            var i=0;
            cartItems.forEach(function(item){
                //console.log(item.quantity);
                if(item.quantity)
                    i +=Number(item.quantity);
            })
            return i;

        }
        $scope.getTotalSum =  function(order){

        }*/



        $scope.deleteOrder = function(order){
            if (confirm("Удалить?")){
                order.$delete(function(err){
                    if (err) console.log(err);
                    $scope.afterSave();
                    //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                });
                /*Orders.get({'id':order._id},function(order){
                    order.$delete(function(err){
                        if (err) console.log(err);
                        $scope.afterSave();
                        //$scope.getStuffList($scope.ActiveCategory,$scope.activeBrand);
                    });
                });
*/
            }
        }

        $scope.dateConvert = function(date){
            if (date) {
                return moment(date).format('lll');
            } else {
                return '';
            }

        }


    }])



/*
    .controller('cakesCtrl', ['$scope','Groups','Cakes','$rootScope',function ($scope,Groups,Cakes,$rootScope) {
        // write Ctrl here
        $scope.activeGroup=$rootScope.activeG;
        $scope.groups=Groups.list(function(){
            if ($scope.activeGroup== null && $scope.groups.length>0 ){
                $scope.activeGroup=$scope.groups[0]._id;
                $scope.activeGroupName=$scope.groups[0].name;
            } else {
                $scope.groups.forEach(function(e){
                    if(e._id==$scope.activeGroup){
                        $scope.activeGroupName= e.name;
                    }
                })
            }
        });
        $scope.$watch('activeGroup',function(){
            if ($scope.activeGroup!=null){
                $scope.cakes=Cakes.list({section:$scope.activeGroup});
            }
        })
        $scope.changeGroup = function(group){
            $rootScope.activeG=$scope.activeGroup=group._id;
            $scope.activeGroupName=group.name;
        }

        $scope.allCakes=function(){
            $scope.changeGroup({'_id':'allcakes','name':'все'});
        }

        $scope.editCake = function(id){
            $rootScope.$state.transitionTo('mainFrame.editCake',{id:id});
        }
        $scope.editCakeGallery = function(id){
            $rootScope.$state.transitionTo('mainFrame.editCakeGallery',{id:id});
        }
        $scope.deleteCake = function(cake){
            if (confirm("Удалить?")){
                cake.$delete(function(err){
                    if (err) console.log(err);
                    $scope.cakes=Cakes.list({section:$scope.activeGroup});
                });
            }
        }
        $scope.editGroup = function(id){
            $rootScope.$state.transitionTo('mainFrame.editGroup',{id:id});
        }

        $scope.deleteGroup = function(group){
            //console.log(group);
            if (confirm("Удалить?")){
                //$scope.changeGroup(groupe._id);

                if (group._id == $scope.activeGroup)
                    $scope.activeGroup= null;
                group.$delete(function(err,res){
                    //if (err)
                    //console.log(err);
                    //console.log(res);

                    $scope.groups=Groups.list(function(){
                        if ($scope.activeGroup== null && $scope.groups.length>0 ){
                            $scope.activeGroup=$scope.groups[0]._id;
                            $scope.activeGroupName=$scope.groups[0].name;
                        } else {
                            $scope.groups.forEach(function(e){
                                if(e._id==$scope.activeGroup){
                                    $scope.activeGroupName= e.name;
                                }
                            })
                        }
                    });
                });
            }
        }


    }])
    .controller('editCakeCtrl', ['$scope','Groups','$stateParams','Cakes','$rootScope','$fileUpload',
        function ($scope,Groups,$stateParams,Cakes,$rootScope,$fileUpload) {
            // write Ctrl here
            $scope.groups=null;
            $scope.groups=Groups.list(function(){
                */
/*$scope.groups.forEach(function(item){
                 item.selected=false;
                 })*//*

            });

            if (!$stateParams.id){
                $scope.cake={group:[]};
            } else {
                $scope.cake=Cakes.get({id:$stateParams.id},function(){
                    $scope.noChange=false;
                    $scope.myFileSrc = $scope.cake.img;
                    $scope.$watch('groups',function(){
                        if ($scope.groups!=null){
                            $scope.groups.forEach(function(item){
                                if($scope.cake.group.in_array(item._id))
                                    item.selected=true;
                            })
                        }
                    })
                });
            }

            $scope.backToList=function(){
                $rootScope.$state.transitionTo('mainFrame.cakes');
            }

            $scope.updateCake = function(){
                //console.log('dddd');
                $scope.cake.group=[];
                $scope.groups.forEach(function(item){
                    if (item.selected)
                        $scope.cake.group.push(item._id);
                })

                if (!$stateParams.id){
                    Cakes.add($scope.cake);
                    $rootScope.$state.transitionTo('mainFrame.cakes');
                } else{
                    $scope.cake.$update(function(err){
                        if (err) console.log(err);
                        $rootScope.$state.transitionTo('mainFrame.cakes');
                    });

                }
            }


            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "api/cakesfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.cake._id).then(function(promise){
                    $scope.code = promise.code();
                    $scope.fileName = promise.fileName();
                    $scope.noChange=false;
                });
            };

        }])



    .controller('editGroupCtrl', ['$scope','Groups','$stateParams','$rootScope','$fileUpload',
        function ($scope,Groups,$stateParams,$rootScope,$fileUpload) {
            // write Ctrl here
            $scope.backToList=function(){
                $rootScope.$state.transitionTo('mainFrame.cakes');
            }

            if (!$stateParams.id){
                $scope.group={};
            } else {
                $scope.group=Groups.get({id:$stateParams.id},function(){
                    $scope.noChange=false;
                    $scope.myFileSrc = $scope.group.img;
                });
            }

            $scope.updateGroup = function(){
                //console.log('dddd');
                if (!$stateParams.id){
                    Groups.add($scope.group);
                    $rootScope.$state.transitionTo('mainFrame.cakes');
                } else{
                    $scope.group.$update(function(err){
                        if (err) console.log(err);
                        $rootScope.$state.transitionTo('mainFrame.cakes');
                    });

                }
            }

            $scope.myFile={};
            $scope.noLoad=true;
            $scope.noChange=true;
            $scope.myFileSrc=null;
            $scope.uploadImg = function(){
                var file = $scope.myFile;
                $scope.noLoad=true;
                $scope.noChange=true;
                var uploadUrl = "api/groupsfile/fileUpload";
                $fileUpload.uploadFileToUrl(file, uploadUrl,$scope.group._id).then(function(promise){
                    $scope.code = promise.code();
                    $scope.fileName = promise.fileName();
                    $scope.noChange=false;
                });
            };


        }])
*/
