(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldDisplay', function () {
      return {
        scope: {
          field: '=',
          definition: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_views/field-display.tpl.html',
        link: function(scope, element, attrs){
          //scope.message = attrs.message;
          console.log('Hello World');
        }
      };
    }
  );

})();
