(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpExpressions', function () {
      return {
        scope: {
          expression: '=',
          bindvalue: '=',
          readonly: '=',
          context: '=',
          tipo: '='
        },
        restrict: 'E',
        replace: false,
        template: '<span>{{(expression)}}</span>',
        link: function(scope, element, attrs){

          // scope.jsFunction = "function doeval(context,tipo){ return "+ scope.expression + ";}; doeval(" + JSON.stringify(scope.context) + "," + JSON.stringify(scope.tipo) + ");"
          // scope.bindvalue = eval(scope.jsFunction);
          scope.bindvalue = scope.expression;
          scope.$watch(function(){return scope.expression},function(){
            scope.bindvalue = scope.expression;
          }, true)
        }
      };
    }
  );

})();