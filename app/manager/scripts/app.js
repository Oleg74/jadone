'use strict';
function getCookie(name) {
    var parts = document.cookie.split(name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}


// Declare app level module which depends on filters, and services

var myApp= angular.module('myApp', [
        'ngRoute','ui.router','ngResource','ngCookies','ui.select2','ui.bootstrap','ngAnimate', 'fx.animations','btford.socket-io','i.mongoPaginate',
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
        $rootScope.changeCollection=false;
        $rootScope.changeNews=false;
        $rootScope.changeStat=false;

        $rootScope.quantityUser=0;

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

            if(to.name=='mainFrame.stuff' && (from.name=='mainFrame.stuff.editStuffGallery' || from.name=='mainFrame.stuff.edit')){
                $rootScope.changeStuff=true;
            }
            if(to.name=='mainFrame.category' && from.name=='mainFrame.category.edit'){
                $rootScope.changeCategory=true;
            }
            if(to.name=='mainFrame.brands'&& from.name=='mainFrame.brands.edit'){
                $rootScope.changeBrand=true;
            }
            if(to.name=='mainFrame.collection' && from.name=='mainFrame.collection.edit'){
                $rootScope.changeCollection=true;
            }
            if(to.name=='mainFrame.news' &&( from.name=='mainFrame.news.editNewsGallery' || from.name=='mainFrame.news.edit')){
                $rootScope.changeNews=true;
            }
            /*if(to.name=='mainFrame.stat'){
                $rootScope.changeStat=true;
            }*/
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
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/filters.html' },
            controller: 'filtersCtrl'
        })
        .state("mainFrame.brands", {
            url: "/brands",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/brands.html' },
            controller: 'brandsCtrl'
        })
        .state("mainFrame.brands.edit", {
            url: "/edit/:id",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/brands.edit.html' },
            controller: 'brandsEditCtrl'
        })

        .state("mainFrame.category", {
            url: "/categories",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/category.html' },
            controller: 'categoryCtrl'
        })
        .state("mainFrame.category.edit", {
            url: "/edit/:id",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/category.edit.html' },
            controller: 'categoryEditCtrl'
        })

        .state("mainFrame.stuff", {
            url: "/stuff",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin' && $rootScope.user.role!='admin_catalog')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/stuff.html' },
            controller: 'stuffCtrl'
        })
        .state("mainFrame.stuff.edit", {
            url: "/edit/:id",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin' && $rootScope.user.role!='admin_catalog')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/editstuff.html' },
            controller: 'editStuffCtrl'
        })
        .state("mainFrame.stuff.commentStuff", {
            url: "/comment/:id",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin' && $rootScope.user.role!='admin_catalog')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/commentstuff.html' },
            controller: 'commentStuffCtrl'
        })

        .state("mainFrame.stuff.editStuffGallery", {
            url: "/gallery/:id",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin' && $rootScope.user.role!='admin_catalog')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/stuff.gallery.html' },
            controller: 'editStuffGalleryCtrl'
        })

        .state("mainFrame.news", {
            url: "/news",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin' && $rootScope.user.role!='admin_news')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/news.html' },
            controller: 'newsCtrl'
        })
        .state("mainFrame.news.edit", {
            url: "/edit/:id",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin' && $rootScope.user.role!='admin_news')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/news.edit.html' },
            controller: 'editNewsCtrl'
        })
        .state("mainFrame.news.editNewsGallery", {
            url: "/gallery/:id",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin' && $rootScope.user.role!='admin_news')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/news.gallery.html' },
            controller: 'editNewsGalleryCtrl'
        })

        .state("mainFrame.places", {
            url: "/places",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/place.html' },
            controller: 'placesCtrl'
        })

        .state("mainFrame.collection", {
            url: "/collection",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
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
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin'&& $rootScope.user.role!='admin_catalog')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/currency.html'},
            controller: 'currencyCtrl'
        })

        .state("mainFrame.orders", {
            url: "/orders?num",
            onEnter: function($rootScope){
                /*console.log($rootScope.user);
                for(var i=0;i<1000000;i++){
                    var r=(i*i+2345)/i;
                }*/
                if (!$rootScope.user || ($rootScope.user.role!='admin'&& $rootScope.user.role!='admin_order')){
                    //console.log('2-'+$rootScope.user.role);
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            data:{retail:false},
            templateUrl: function(){ return 'manager/views/partials/orders.html' },
            controller: 'ordersCtrl'
        })

        .state("mainFrame.ordersRetail", {
            url: "/ordersRetail?num",
            onEnter: function($rootScope){
                //console.log($rootScope.user.role);
                if (!$rootScope.user || ($rootScope.user.role!='admin'&& $rootScope.user.role!='admin_order_retail')){
                    //console.log('2-'+$rootScope.user.role);
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            data:{retail:true},
            templateUrl: function(){ return 'manager/views/partials/orders.html' },
            controller: 'ordersCtrl'
        })


        .state("mainFrame.ordersArch", {
            url: "/ordersArch",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin'&& $rootScope.user.role!='admin_order')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/orders.arch.html' },
            controller: 'ordersArchCtrl'
        })

        .state("mainFrame.stat", {
            url: "/stat",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/stat.html' },
            controller: 'statCtrl'
        })

        .state("mainFrame.stat.edit", {
            url: "/edit/:id",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/stat.edit.html' },
            controller: 'editStatCtrl'
        })
        .state("mainFrame.stat.editStatGallery", {
            url: "/gallery/:id",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/stat.gallery.html' },
            controller: 'editStatGalleryCtrl'
        })

        .state("mainFrame.users", {
            url: "/users",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/users.html' },
            controller: 'usersCtrl'
        })
        .state("mainFrame.siteMAP", {
            url: "/sitemap",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            template: "<h1>siteMAP</h1><div ng-show='done'>Готово!</div>",
            controller: 'siteMapCtrl'
        })

        .state("mainFrame.chats", {
            url: "/chats",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/chats.html' },
            controller: 'chatsCtrl'
        })

        .state("mainFrame.editForcePswd", {
            url: "/editForcePswd",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin'&& $rootScope.user.role!='admin_order')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/editForcePswd.html' },
            controller: 'editForcePswdCtrl'
        })
        .state("mainFrame.editComments", {
            url: "/editComments",
            onEnter: function($rootScope){
                if (!$rootScope.user || ($rootScope.user.role!='admin'&& $rootScope.user.role!='admin_order')){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/editComments.html' },
            controller: 'editCommentsCtrl'
        })


        .state("mainFrame.usersOld", {
            url: "/usersOld",
            onEnter: function($rootScope){
                if (!$rootScope.user || $rootScope.user.role!='admin'){
                    $rootScope.$state.transitionTo('mainFrame.home');
                }
            },
            templateUrl: function(){ return 'manager/views/partials/users.old.html' },
            controller: 'usersOldCtrl'
        })



    }])

angular.module('btford.socket-io', []).
    provider('socketFactory', function () {

        // when forwarding events, prefix the event name
        var defaultPrefix = 'socket:',
            ioSocket;

        // expose to provider
        this.$get = function ($rootScope, $timeout) {

            var asyncAngularify = function (socket, callback) {
                return callback ? function () {
                    var args = arguments;
                    $timeout(function () {
                        callback.apply(socket, args);
                    }, 0);
                } : angular.noop;
            };

            return function socketFactory (options) {
                options = options || {};
                var socket = options.ioSocket || io.connect();

                var prefix = options.prefix || defaultPrefix;
                var defaultScope = options.scope || $rootScope;

                var addListener = function (eventName, callback) {
                    socket.on(eventName, asyncAngularify(socket, callback));
                };

                var wrappedSocket = {
                    on: addListener,
                    addListener: addListener,
                    socket : socket,
                    emit: function (eventName, data, callback) {
                        return socket.emit(eventName, data, asyncAngularify(socket, callback));
                    },

                    removeListener: function () {
                        return socket.removeListener.apply(socket, arguments);
                    },

                    // when socket.on('someEvent', fn (data) { ... }),
                    // call scope.$broadcast('someEvent', data)
                    forward: function (events, scope) {
                        if (events instanceof Array === false) {
                            events = [events];
                        }
                        if (!scope) {
                            scope = defaultScope;
                        }
                        events.forEach(function (eventName) {
                            var prefixedEvent = prefix + eventName;
                            var forwardBroadcast = asyncAngularify(socket, function (data) {
                                scope.$broadcast(prefixedEvent, data);
                            });
                            scope.$on('$destroy', function () {
                                socket.removeListener(eventName, forwardBroadcast);
                            });
                            socket.on(eventName, forwardBroadcast);
                        });
                    }
                };

                return wrappedSocket;
            };
        };
    })


angular.module('i.mongoPaginate', [])

    .filter('paginate', function(Paginator) {
        return function(input, rowsPerPage) {
            /*console.log(input);
             console.log(input.length);*/
            if (!input)
                return;
            if (!input.length) {
                return input;
            }

            if (rowsPerPage) {
                Paginator.rowsPerPage = rowsPerPage;
            }

            Paginator.itemCount = input.length;

            return input.slice(parseInt(Paginator.page * Paginator.rowsPerPage), parseInt((Paginator.page + 1) * Paginator.rowsPerPage + 1) - 1);
        }
    })

    .filter('forLoop', function() {
        return function(input, start, end) {
            input = new Array(end - start);
            for (var i = 0; start < end; start++, i++) {
                input[i] = start;
            }

            return input;
        }
    })

    .service('mongoPaginator', function ($rootScope) {
        this.page = 0;
        this.rowsPerPage = ($rootScope.config.perPage)?$rootScope.config.perPage:20
        this.itemCount = 0;
        //this.pageCount =13

        this.setPage = function (page) {
            if (page > this.pageCount()) {
                return;
            }

            this.page = page;
            notifyObservers();
        };

        this.nextPage = function () {
            if (this.isLastPage()) {
                return;
            }

            this.page++;
            notifyObservers();

        };

        this.perviousPage = function () {
            if (this.isFirstPage()) {
                return;
            }

            this.page--;
            notifyObservers();
        };

        this.firstPage = function () {
            this.page = 0;
            notifyObservers();
        };

        this.lastPage = function () {
            this.page = this.pageCount() - 1;
            notifyObservers();
        };

        this.isFirstPage = function () {
            return this.page == 0;
            notifyObservers();
        };

        this.isLastPage = function () {
            return this.page == this.pageCount() - 1;
            notifyObservers();
        };

        this.pageCount = function () {
            //console.log(this.itemCount);
            var count = Math.ceil(parseInt(this.itemCount, 10) / parseInt(this.rowsPerPage, 10)); if (count === 1) { this.page = 0; }
            //console.log( count);
            return count;
        };

//http://stackoverflow.com/questions/12576798/angularjs-how-to-watch-service-variables

        var observerCallbacks = [];

        //register an observer
        this.registerObserverCallback = function(callback){
            observerCallbacks.push(callback);
        };

        //call this when you know 'foo' has been changed
        var notifyObservers = function(){
            angular.forEach(observerCallbacks, function(callback){
                callback();
            });
        };

    })

    .directive('mongoPaginator', function factory() {
        return {
            restrict:'E',
            controller: function ($scope, mongoPaginator) {
                $scope.paginator = mongoPaginator;
            },
            templateUrl: 'manager/views/templates/mongoPaginationControl.html'
        };
    });

