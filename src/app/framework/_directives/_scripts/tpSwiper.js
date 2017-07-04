(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpSwiper', function () {
      return {
        scope: {
          isarray: '=',
          isrequired: '=',
          model: '='
        },
        restrict: 'E',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-swiper.tpl.html',
        link: function(scope, element, attrs){
          var mySwipe = new Swiper(element[0],{
              speed: 400,
              spaceBetween: 100
          });
        }
      };
    }
  );

})();