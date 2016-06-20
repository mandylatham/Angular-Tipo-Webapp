(function () {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('tipoInclude', function () {
      return {
        replace: true,
        restrict: 'A',
        templateUrl: function (element, attr) {
          return attr.tipoInclude;
        },
        compile: function(element){
          element[0].className = element[0].className.replace(/placeholder[^\s]+/g, '');
        }
      };
    }
  );

})();
