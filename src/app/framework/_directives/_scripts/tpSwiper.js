(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpSwiper', function(
        $mdColors,
        $mdColorUtil,
        $window,
        $timeout) {
        return {
            scope: {
                direction: '=',
                effect: '=',
                paginationType: '=',
                paginationHide: '=',
                mouseWheelControl: '=',
                loop: '=',
                imageArray: '=',
                fromType: '@'
            },
            restrict: 'E',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-swiper.tpl.html',
            link: function(scope, element, attrs) {
                var direction = scope.direction || "horizontal";
                var effect = scope.effect || "slide";
                var paginationType = scope.paginationType || "bullets";
                if (scope.paginationHide === "true") {
                    scope.hidePagination = true;
                } else {
                    scope.hidePagination = false;
                }
                if (scope.mouseWheelControl === "true") {
                    var mousewheelControl = true;
                } else {
                    var mousewheelControl = false;
                }
                if (scope.loop === "true") {
                    var loop = true;
                } else {
                    var loop = false;
                }
                scope.swiperColor = _.lowerCase($mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500'))).replace(/[\s]/g, '');
                if (scope.paginationType === "progress") {
                    scope.mystyles = ".swiper-pagination-progress .swiper-pagination-progressbar { background: #" + scope.swiperColor + "; }";
                } else if (scope.paginationType === "fraction") {
                    scope.mystyles = ".swiper-pagination-fraction { color: #" + scope.swiperColor + "; }";
                } else {
                    scope.mystyles = ".swiper-pagination-bullet-active { background: #" + scope.swiperColor + "; }";
                }
                scope.prevButton = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23" + scope.swiperColor + "'%2F%3E%3C%2Fsvg%3E";
                scope.nextButton = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23" + scope.swiperColor + "'%2F%3E%3C%2Fsvg%3E";

                function init() {
                    if (scope.fromType === 'file') {
                        scope.images = [];
                        if (_.isArray(scope.imageArray)) {
                            _.each(scope.imageArray, function(each) {
                                if (_.startsWith(each.key, "public/")) {
                                    scope.images.push("g/" + each.key);
                                } else {
                                    scope.images.push("g/" + each.rootFolder + "/" + each.key);
                                }
                            })
                        } else {
                            if (scope.imageArray && _.startsWith(scope.imageArray.key, "public/")) {
                                scope.images.push("g/" + scope.imageArray.key);
                            } else if (scope.imageArray){
                                scope.images.push("g/" + scope.imageArray.rootFolder + "/" + scope.imageArray.key);
                            }
                        }
                    } else {
                        scope.images = scope.imageArray;
                    }

                    var mySwipe = new Swiper(element[0], {
                        direction: direction,
                        effect: effect,
                        paginationType: paginationType,
                        paginationHide: scope.hidePagination,
                        mousewheelControl: mousewheelControl,
                        loop: loop,
                        // loopedSlides: scope.images.length,
                        slidesPerView: 1,
                        spaceBetween: 30,
                        // If we need pagination
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        // Navigation arrows
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev'
                    });
                }

                element[0].addEventListener("click",function(e){
                  e.stopPropagation();
                })

                scope.resize = function() {
                    return $timeout(function() {
                        $window.dispatchEvent(new Event("resize"));
                    }, 1000);
                }
                init();
                scope.resize();

                scope.$watch(function() { return scope.imageArray }, function() {
                    init();
                })
            }
        };
    });

})();