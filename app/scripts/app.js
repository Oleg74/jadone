'use strict';
String.prototype.insert = function (index, string) {
    //console.log(string);
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};
if (!Array.prototype.indexOf)
{
    /**
     * Add array.indexOf() functionality (exists in >FF 1.5 but not in IE)
     *
     * @param {Object} elem Element to find.
     * @param {Number} [from] Position in array to look from.
     */
    Array.prototype.indexOf = function(elem /*, from*/) {
        var len = this.length;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this && this[from] === elem) {
                return from;
            }
        }

        return -1;
    };
}
if (!Array.prototype.remove)
{
    /**
     * Add array.remove() convenience method to remove element from array.
     *
     * @param {Object} elem Element to remove.
     */
    Array.prototype.remove = function(elem) {
        var index = this.indexOf(elem);
        alert(index);
        if (index !== -1) {
            this.splice(index, 1);
        }
    };
}
function getCookie(name) {
    var parts = document.cookie.split(name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

var myApp= angular.module('myApp', [
        'ngRoute','ui.router','ngResource','ngCookies','ui.bootstrap','caco.ClientPaginate','ngAnimate','btford.socket-io',
        //'ui.bootstrap.collapse', 'ui.bootstrap.dropdownToggle',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
])



.run(['$rootScope', '$state', '$stateParams','Config','$cookieStore','$resource','User','$window',"socket",'Category',
        function ($rootScope,   $state,   $stateParams,Config,$cookieStore,$resource,User,$window,socket,Category){
            socket.on('send:time', function (data) {
                $rootScope.time = data.time;
            });

       /* var myip;
        function ip_callback(o) {
             return myip = o.host;
        }
        var Something = $resource("https://smart-ip.net/geoip-json");
        $rootScope.something = Something.get({'callback':'ip_callback'});
        console.log($rootScope.something);
*/
            $rootScope.lang=getCookie('lan');
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.socket = socket;
            $rootScope.user=User.get(function(user){

                /*$rootScope.socket = socket;
                console.log(user);
                socket.emit('new user',user._id,function(data){
                    console.log(data+'new user is here');
                   *//* if(data){
                        $('#nickWrap').hide();
                        $('#contentWrap').show();
                    } else {
                        $nickError.html('that username is already taken! Try again.');
                    }*//*
                });*/
                //console.log($rootScope.user);
            });



            $rootScope.titles={};
            $rootScope.titles.pageTitle='';
            $rootScope.titles.pageKeyWords='';
            $rootScope.titles.pageDescription='';
            $rootScope.commonFilter={"tags":['xx','xx','xx']};
            $rootScope.config=Config.get(function(res){
                    $rootScope.commonFilter.tags=res.tags;
                $rootScope.currencyIndex=0;
                    //console.log($rootScope.commonFilter);

            });
            $rootScope.categories =Category.list(function(){
                if($rootScope.categories[0]){
                    $rootScope.mainSection=$rootScope.categories[0]._id;
                }
            });


        //console.log( $rootScope.config);

    /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if(toParams.lang!=$rootScope.lang){
            $rootScope.lang=toParams.lang;
        }

    })
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            event.preventDefault();
    })*/
            $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                if ($window.ga)
                    $window.ga('send', 'pageview', { page: $location.path() });
                $('.zoomContainer').remove();

                if(from.name=='language.cart' && to.name=='language.login'){
                    $rootScope.fromCart=true;
                }

            });
}])

.config(['$stateProvider', '$urlRouterProvider','$locationProvider',function ($stateProvider,$urlRouterProvider,$locationProvider){

        var lang=getCookie('lan');
        if (!lang || (lang!='en'&& lang!='ru')) {
            lang='ru';
            document.cookie = "lan=ru;path=/";
        }



        $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $urlRouterProvider
        .when('/', '/'+lang+'/home')
        .otherwise('/');


    $stateProvider
        /*.state("qqq", {
            url: "/asd",

            template:"<h1 style='color: #000000'>{{time}}</h1>",
            *//*controller:function($scope,socket){
                socket.on('send:time', function (data) {
                    $scope.time = data.time;
                });
            }*//*

        })*/
        .state("language", {
            url: "/:lang",
            abstract:true,
            /*template:"<h1 style='color: #000000'>{{time}}</h1>",
            controller:function($scope,socket){
                socket.on('send:time', function (data) {
                    $scope.time = data.time;
                });
            }*/
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/mainFrame.html' },
            controller: 'mainFrameCtrl'
        })
        .state("language.home", {
            url: "/home",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/home.html' },
            controller: 'homeCtrl'
        })
        .state("language.login", {
            url: "/login",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/login.html' },
            controller: 'loginCtrl'
        })
        .state("language.signup", {
            url: "/signup",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/signup.html' },
            controller: 'signupCtrl'
        })

        .state("language.customOrder", {
            url: "/customorder",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/customorder.html' },
            controller:'customOrderCtrl'
        })
        .state("language.profile", {
            url: "/profile",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/profile.html' },
            controller:'profileCtrl'
        })

        .state("language.settings", {
            url: "/settings",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/settings.html' },
            controller: 'settingsCtrl'
        })
        .state("language.contacts", {
            url: "/contacts",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/contacts.html' },
            controller: 'contactsCtrl'
        })
        /*.state("language.goods", {
            url: "/goods?id",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/goods.html' },
            controller: 'goodsCtrl'
        })*/
        /*.state("language.goodDetail", {
            url: "/gooddetail/:id",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/gooddetail.html' },
            controller: 'goodDetailCtrl'
        })*/
        /*.state("language.news", {
            url: "/news?id",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/goods.html' },
            controller: 'goodsCtrl'
        })*/
        /*.state("language.newsDetail", {
            url: "/newsdetail/:id",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/newsdetail.html' },
            controller: 'goodDetailCtrl'
        })
        .state("language.recipeDetail", {
            url: "/recipedetail/:id",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/recipedetail.html' },
            controller: 'goodDetailCtrl'
        })*/
        .state("language.stuff.detail", {
            url: "/stuffdetail/:id/:color?size",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/stuff.detail.html' },
            controller: 'stuffDetailCtrl'
        })

        .state("language.stuff", {
            url: "/stuff/:section/:category",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/stuff.html' },
            controller: 'stuffCtrl'
        })
        .state("language.cart", {
            url: "/cart",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/cart.html' },
            controller: 'cartCtrl'
        })

        .state("language.news.detail", {
            url: "/newsdetail/:id",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/news.detail.html' },
            controller: 'newsDetailCtrl'
        })

        .state("language.news", {
            url: "/news",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/news.html' },
            controller: 'newsCtrl'
        })
        .state("language.chat", {
            url: "/chat",
            templateUrl: function(stateParams){ return 'views/partials/'+stateParams.lang+'/chat.html' },
            controller: 'chatCtrl'
        })

}])


angular.module('caco.ClientPaginate', [])

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

    .service('Paginator', function ($rootScope) {
        this.page = 0;
        this.rowsPerPage = 54;
        this.itemCount = 0;

        this.setPage = function (page) {
            if (page > this.pageCount()) {
                return;
            }

            this.page = page;
        };

        this.nextPage = function () {
            if (this.isLastPage()) {
                return;
            }

            this.page++;
        };

        this.perviousPage = function () {
            if (this.isFirstPage()) {
                return;
            }

            this.page--;
        };

        this.firstPage = function () {
            this.page = 0;
        };

        this.lastPage = function () {
            this.page = this.pageCount() - 1;
        };

        this.isFirstPage = function () {
            return this.page == 0;
        };

        this.isLastPage = function () {
            return this.page == this.pageCount() - 1;
        };

        this.pageCount = function () { var count = Math.ceil(parseInt(this.itemCount, 10) / parseInt(this.rowsPerPage, 10)); if (count === 1) { this.page = 0; } return count;
        };
        /*this.pageCount = function () {
         return Math.ceil(parseInt(this.itemCount) / parseInt(this.rowsPerPage));
         };*/
    })

    .directive('paginator', function factory() {
        return {
            restrict:'E',
            controller: function ($scope, Paginator) {
                $scope.paginator = Paginator;
            },
            templateUrl: 'paginationControl.html'
        };
    });


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
    });