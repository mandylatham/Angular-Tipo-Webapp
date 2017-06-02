(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpExpressions', function () {
      return {
        scope: {
          expression: '=',
          bindvalue: '=',
          readonly: '='
        },
        restrict: 'E',
        replace: false,
        template: '<span>{{(+expression)}}</span>',
        link: function(scope, element, attrs){         
          scope.bindvalue = scope.expression;
          scope.$watch(function(){return scope.expression},function(){
            scope.bindvalue = scope.expression;
          }, true)
        }
      };
    }
  );

})();