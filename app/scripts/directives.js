'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })

 .directive('mongooseError', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            element.on('keydown', function() {
                return ngModel.$setValidity('mongoose', true);
            });
        }
    };
})


    .directive('pswdCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pswdCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pswdmatch', v);
                    });
                });
            }
        }
    }])

.directive("uiSrefParams", function($state) {
    return {
        link: function(scope, elm, attrs) {
            var params;
            params = scope.$eval(attrs.uiSrefParams);
            //console.log(params);
            return elm.bind("click", function(e) {
                var button;
                console.log(params);
                if (!angular.equals($state.params, params)) {
                    button = e.which || e.button;
                    if ((button === 0 || button === 1) && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        scope.$evalAsync(function() {
                            return $state.go(".", params);
                        });
                        return e.preventDefault();
                    }
                }
            });
        }
    };
})
    //http://www.befundoo.com/university/tutorials/angularjs-directives-tutorial/
    // http://tympanus.net/codrops/2011/09/12/elastislide-responsive-carousel/
    .directive('galleryForZoom', function($compile,$timeout) {
        return {
            restrict: 'A',
            scope:{
                galleryForZoom:'=',
                onPhotoSelected: '&'},
            link: function(scope, element, attrs) {
                scope.$watch('galleryForZoom',function(oldVal,newVal){
                    if (oldVal==newVal) return;
                    linkElastislide(oldVal);
                })

                function linkElastislide(galArr){
                    if (galArr.length>2){
                        var galul =angular.element('<ul id="carousel2"  class="elastislide-list"></ul>');
                        for(var i=0;i<galArr.length;i++){
                            galul.append("<li><a  ng-click='toggle("+i+")' data-image='"+galArr[i].thumb+"'  data-zoom-image='"
                                +galArr[i].img+"'><img id='img_"+i+"'  src='"+galArr[i].thumb+"' /></a></li>");
                        }
                        var el= $compile(galul)(scope);
                        element.parent().append(el);
                        $timeout(function(){
                            $('#carousel2').elastislide();
                        },50);


                    /*$.Elastislide.defaults = {
                        // orientation 'horizontal' || 'vertical'
                        orientation : 'horizontal',

                        // sliding speed
                        speed : 1000,

                        // sliding easing
                        //easing : 'ease-in-out',

                        // the minimum number of items to show.
                        // when we resize the window, this will make sure minItems are always shown
                        // (unless of course minItems is higher than the total number of elements)
                        //minItems : 3,
                        imageW  : 200,  // the images width
                        minItems : 5,
                        margin  : 0,
                        easing  : 'jswing',
                        border  : 0,

                        // index of the current item (left most item of the carousel)
                        start : 0,

                        // click item callback
                        onClick : function( el, position, evt ) {
                           *//* $('#carousel2 a').removeClass('active').eq(index).addClass('active');
                            scope.onPhotoSelected({newIndex: position});*//*
                            return false; },
                        onReady : function() { return false; },
                        onBeforeSlide : function() { return false; },
                        onAfterSlide : function() { return false; }
                    };*/
                    //console.log($.Elastislide.defaults);

                }
                }
                scope.toggle = function(index) {
                    $('#carousel2 a').removeClass('active').eq(index).addClass('active');
                    scope.onPhotoSelected({newIndex: index});
                };
            }
        }
    })


.directive('ngElevateZoom', function($compile) {
    return {
        restrict: 'A',
        scope: {
            galleryZoom: '='
        },
        link: function(scope, element, attrs) {

            scope.$watch('galleryZoom',function(oldVal,newVal){
                if (oldVal==newVal) return;
                linkElevateZoom(oldVal);
            })
            /*attrs.$observe('src',function(srcAttribute){
                console.log("$observe : " +srcAttribute);
            })*/
            function linkElevateZoom(galArr){
                if (!attrs.zoomImage || !attrs.galleryZoom ) return;
                element.attr('data-zoom-image',attrs.zoomImage);
                var galDiv = angular.element("<div id='gallery_022'></div>");
                for(var i=0;i<galArr.length;i++){
                    galDiv.append("<a  data-image='"+galArr[i].thumb+"' data-zoom-image='"
                        +galArr[i].img+"'></li>");
                }
                element.parent().append(galDiv);
                $(element).elevateZoom({
                    gallery:'gallery_022',
                    zoomType : "inner",
                    //cursor: "crosshair",
                    //easing : true,
                    cursor: 'pointer',
                    //galleryActiveClass: 'active',
                    imageCrossfade: true,
                    //loadingIcon: 'http://www.elevateweb.co.uk/spinner.gif',
                    zoomWindowWidth:500,
                    zoomWindowHeight:652,
                    responsive:true
                });

            }
       }
    };
})

    //http://www.sitepoint.com/creating-slide-show-plugin-angularjs/
.directive('myslider', function($timeout) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            images: '=images'
        },
        link: function(scope, elem, attrs) {
            //console.log(scope.images);
            scope.$watch('currentIndex', function() {
                scope.images.forEach(function(image) {
                    image.visible = false; // make every image invisible
                });

                scope.images[scope.currentIndex].visible = true; // make the current image visible
            });

            scope.currentIndex = 0; // Initially the index is at the first image

            scope.next = function() {
                scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
            };

            scope.prev = function() {
                scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
            };
            scope.pick = function(i) {
                scope.currentIndex =i;
                console.log(scope.currentIndex);
            };

            var timer;
            var sliderFunc = function() {
                timer = $timeout(function() {
                    scope.next();
                    timer = $timeout(sliderFunc, 3000);
                }, 3000);
            };

            sliderFunc();

            scope.$on('$destroy', function() {
                $timeout.cancel(timer); // when the scope is getting destroyed, cancel the timer
            });
        },
        templateUrl: 'views/templates/slides.html'
    };
})

    //Angular directive to scroll to a given item
    //http://stackoverflow.com/questions/12790854/angular-directive-to-scroll-to-a-given-item

    .directive('scrollIf', function () {
        return function (scope, element, attributes) {

            setTimeout(function () {
                if (scope.$eval(attributes.scrollIf)) {
                    //console.log(attributes.scrollIf);
                    //console.log(element[0].offsetTop);
                    /*console.log(element.parent().parent())
                    var div = document.getElementById('divElem');
                    console.log(document.getElementById('divElem'))*/
                    var div=element.parent().parent();
                    div.scrollTop(div.scrollTop()+element.position().top);
                    //div.scrollTop(div.scrollTop()+element[0].position().top);




                }
            });
        }
    })


//Angularjs directive to Insert text at textarea caret
    //http://plnkr.co/edit/Xx1SHwQI2t6ji31COneO?p=preview

    //Why is ngModel.$setViewValue(…) not working from
//http://stackoverflow.com/questions/15269737/why-is-ngmodel-setviewvalue-not-working-from
.directive('myText', ['$rootScope', function($rootScope) {
    return {
        restrict : 'A', // only activate on element attribute
        require : '?ngModel', // get a hold of NgModelController
        scope: {
            model: '=ngModel'
        },
        link: function(scope, element, attrs) {
            scope.$watch('model', function() {
                scope.$eval(attrs.ngModel + ' = model');
            });

            scope.$watch(attrs.ngModel, function(val) {
                scope.model = val;
            });

            $rootScope.$on('add', function(e, val) {
                var domElement = element[0];

                if (document.selection) {

                    domElement.focus();
                    var sel = document.selection.createRange();
                    sel.text = val;
                    scope.model=domElement.value;
                    domElement.focus();
                } else if (domElement.selectionStart || domElement.selectionStart === 0) {

                    var startPos = domElement.selectionStart;
                    var endPos = domElement.selectionEnd;
                    var scrollTop = domElement.scrollTop;
                    domElement.value = domElement.value.substring(0, startPos) + val + domElement.value.substring(endPos, domElement.value.length);
                    scope.model=domElement.value;
                    //scope.$apply();
                    domElement.focus();
                    domElement.selectionStart = startPos + val.length;
                    domElement.selectionEnd = startPos + val.length;
                    domElement.scrollTop = scrollTop;
                } else {

                    domElement.value += val;
                    scope.model=domElement.value;
                    domElement.focus();
                }
               // scope.$apply();

            });
        }
    }
}])

    .directive('focusMe', function($timeout) {
        return {
            scope: { trigger: '=focusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    //console.log('dd');
                    if(value === true) {
                        //console.log('trigger',value);
                        //$timeout(function() {
                        //console.log(element[0]);
                        $timeout(function(){element[0].focus()},50);
                        //element[0].focus();
                        //scope.trigger = false;
                        //});
                    }
                });
            }
        };
    })


    .directive('setModel', function($timeout) {
        return {
            restrict : 'A', // only activate on element attribute
            require : '?ngModel', // get a hold of NgModelController
            scope: {
                model: '=ngModel'
            },

            link: function(scope, element,attrs) {
                console.log('element[0].value='+element[0].value);
                    $timeout(function(){
                        scope.model=element[0].value;
                    },1000);
             }
        };
    })


//http://plnkr.co/edit/v02xk1o3ORKaptzo40pj?p=preview
//ng-click not working after compile ng-bind-html

    /*.directive('dir', function($compile, $parse, $sce) {
        return {
            restrict: 'E',
            scope: {
                message: '=message'
            }
            link: function(scope, element, attr) {
                scope.$watch('message', function() {
                    if (scope.message){
                        scope.message.msg = $sce.trustAsHtml(scope.message.msg);
                        //console.log(html);
                    }
                    //var html = $sce.trustAsHtml(attr.content);
                    //element.html($parse(attr.message)(scope));

                    //$compile(element.contents())(scope);
                }, true);
            }
        }
    })*/

    .directive('dir', function($compile, $parse) {
        return {
            restrict: 'E',
            link: function(scope, element, attr) {
                scope.$watch(attr.content, function() {
                    element.html($parse(attr.content)(scope));
                    $compile(element.contents())(scope);
                }, true);
            }
        }
    })

    /*.directive('setModel', function($timeout) {
        return {
            restrict : 'A', // only activate on element attribute

            scope: {
                go: '=go',

            },

            link: function(scope, element,attrs) {
                console.log('element[0].value='+element[0].value);
                $timeout(function(){
                    scope.model=element[0].value;
                },1000);
            }
        };
    })*/


.directive("spinner", function($compile){
    return {
        restrict: 'E',
            scope: {enable:"="},
        link: function(scope, element, attr) {

            var spinner =angular.element('<div class="spinner" id="spinner" ng-show="enable" style="position: absolute; opacity: 0.6; top:0; z-index:2000;background: url(../img/spinner.gif) no-repeat center center #d2e3c3"></div>');

            var el= $compile(spinner)(scope);
            $('body').append(spinner);

            scope.$on('$destroy', function() {
                $('#spinner').remove();
            });

            function abso() {
                $('#spinner').css({
                    position: 'absolute',
                    width: $(window).width(),
                    height: $(window).height()
                });

            }
            $(window).resize(function() {
                abso();
            });

            abso();

            /*scope.$watch('enable', function() {
//                element.html($parse(attr.content)(scope));
//                $compile(element.contents())(scope);
                console.log(scope.enable);
            }, true);*/
            }
        }
})


    .directive('loadingWidget', function (requestNotification) {
        return {
            restrict: "AC",
            link: function (scope, element) {
                // hide the element initially
                element.hide();

                //subscribe to listen when a request starts
                requestNotification.subscribeOnRequestStarted(function () {
                    // show the spinner!
                    element.show();
                });

                requestNotification.subscribeOnRequestEnded(function () {
                    // hide the spinner if there are no more pending requests
                    if (requestNotification.getRequestCount() === 0) element.hide();
                });
            }
        };
    });