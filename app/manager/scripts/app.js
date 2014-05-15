'use strict';
function getCookie(name) {
    var parts = document.cookie.split(name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}


// Declare app level module which depends on filters, and services

var myApp= angular.module('myApp', [
        'ngRoute','ui.router','ngResource','ngCookies','ui.select2','ui.bootstrap','ngAnimate', 'fx.animations',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
])
.run(['$rootScope', '$state', '$stateParams','Config','User',function ($rootScope,   $state,   $stateParams,Config,User) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.titles={};
    $rootScope.titles.pageTitle='';
    $rootScope.titles.pageKeyWords='';
    $rootScope.titles.pageDescription='';

        $rootScope.user=User.get();


    $rootScope.activeG = null;
        $rootScope.activeM=null;
        $rootScope.config=Config.get();
        $rootScope.changeStuff=false;
        $rootScope.changeCategory=false;
        $rootScope.changeBrand=false;
        $rootScope.changeCollection=false;


        //http://pastebin.com/czJk3pmk
        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

        if(from.name=='mainFrame.stuff.editStuffGallery' || from.name=='mainFrame.stuff.edit'){
            $rootScope.changeStuff=true;
        }
        /*if(from.name=='mainFrame.category.edit'){
            console.log('gfd');
            $rootScope.changeCtegory=true;
            console.log($rootScope.changeCtegory);
        }*/
    })
        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

            if(from.name=='mainFrame.stuff.editStuffGallery' || from.name=='mainFrame.stuff.edit'){
                $rootScope.changeStuff=true;
            }
            if(to.name=='mainFrame.category'){
                $rootScope.changeCategory=true;
            }
            if(to.name=='mainFrame.brands'){
                $rootScope.changeBrand=true;
            }
            if(to.name=='mainFrame.collection'){
                $rootScope.changeCollection=true;
            }
        })
    }])

.config(['$stateProvider', '$urlRouterProvider','$locationProvider',function ($stateProvider,$urlRouterProvider,$locationProvider){

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $urlRouterProvider
        .when('/', '/admin123')
        .otherwise('/');

    $stateProvider
        .state("mainFrame", {
            url: "/admin123",
            abstract:true,
            templateUrl: function(){ return 'manager/views/partials/mainFrame.html' },
            controller: 'mainFrameCtrl'
        })
        .state("mainFrame.home", {
            url: "",
            templateUrl: function(){ return 'manager/views/partials//home.html' },
            controller: 'homeCtrl'
        })
        .state("mainFrame.goods", {
            url: "/goods/:id",
            templateUrl: function(){ return 'manager/views/partials/goods.html' },
            controller: 'goodsCtrl'
        })
        .state("mainFrame.comments", {
            url: "/comments/:id",
            templateUrl: function(){ return 'manager/views/partials/comments.html' },
            controller: 'commentsCtrl'
        })
        .state("mainFrame.uploadFile", {
            url: "/uploadFile",
            templateUrl: function(){ return 'manager/views/partials/uploadfile.html' },
            controller: 'uploadFileCtrl'
        })


        .state("mainFrame.filters", {
            url: "/filters",
            templateUrl: function(){ return 'manager/views/partials/filters.html' },
            controller: 'filtersCtrl'
        })
        .state("mainFrame.brands", {
            url: "/brands",
            templateUrl: function(){ return 'manager/views/partials/brands.html' },
            controller: 'brandsCtrl'
        })
        .state("mainFrame.brands.edit", {
            url: "/edit/:id",
            templateUrl: function(){ return 'manager/views/partials/brands.edit.html' },
            controller: 'brandsEditCtrl'
        })

        .state("mainFrame.category", {
            url: "/categories",
            templateUrl: function(){ return 'manager/views/partials/category.html' },
            controller: 'categoryCtrl'
        })
        .state("mainFrame.category.edit", {
            url: "/edit/:id",
            templateUrl: function(){ return 'manager/views/partials/category.edit.html' },
            controller: 'categoryEditCtrl'
        })

        .state("mainFrame.stuff", {
            url: "/stuff",
            templateUrl: function(){ return 'manager/views/partials/stuff.html' },
            controller: 'stuffCtrl'
        })
        .state("mainFrame.stuff.edit", {
            url: "/edit/:id",
            templateUrl: function(){ return 'manager/views/partials/editstuff.html' },
            controller: 'editStuffCtrl'
        })
        .state("mainFrame.stuff.commentStuff", {
            url: "/comment/:id",
            templateUrl: function(){ return 'manager/views/partials/commentstuff.html' },
            controller: 'commentStuffCtrl'
        })

        .state("mainFrame.stuff.editStuffGallery", {
            url: "/gallery/:id",
            templateUrl: function(){ return 'manager/views/partials/stuff.gallery.html' },
            controller: 'editStuffGalleryCtrl'
        })
        .state("mainFrame.places", {
            url: "/places",
            templateUrl: function(){ return 'manager/views/partials/place.html' },
            controller: 'placesCtrl'
        })

        .state("mainFrame.collection", {
            url: "/collection",
            templateUrl: function(){ return 'manager/views/partials/collection.html' },
            controller: 'collectionCtrl'
        })
        .state("mainFrame.collection.edit", {
            url: "/:brand/:id",
            templateUrl: function(){ return 'manager/views/partials/collection.edit.html' },
            controller: 'editCollectionCtrl'
        })

        .state("mainFrame.currency", {
            url: "/currency",
            templateUrl: function(){ return 'manager/views/partials/currency.html'},
            controller: 'currencyCtrl'
        })

        .state("mainFrame.orders", {
            url: "/orders",
            templateUrl: function(){ return 'manager/views/partials/orders.html' },
            controller: 'ordersCtrl'
        })


        .state("mainFrame.editCake", {
            url: "/editcake/:id",
            templateUrl: function(){ return 'manager/views/partials/editcake.html' },
            controller: 'editCakeCtrl'
        })
        .state("mainFrame.editGroup", {
            url: "/editgroup/:id",
            templateUrl: function(){ return 'manager/views/partials/editgroup.html' },
            controller: 'editGroupCtrl'
        })
        .state("mainFrame.editCakeGallery", {
            url: "/editcakegallery/:id",
            templateUrl: function(){ return 'manager/views/partials/cake.gallery.html' },
            controller: 'editCakeGalleryCtrl'
        })


    }])
