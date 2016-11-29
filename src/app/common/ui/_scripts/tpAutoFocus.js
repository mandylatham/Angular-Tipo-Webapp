(function () {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('tpAutoFocus', function ($timeout) {
      return {
        replace: true,
        restrict: 'AC',
        link: function(scope, element){
          $timeout(function(){
            element[0].focus();
          }, 100);
        }
      };
    }
  );

})();
