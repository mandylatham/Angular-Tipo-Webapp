(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpExpressions', function ($filter) {
      return {
        scope: {
          expression: '=',
          bindvalue: '=',
          readonly: '=',
          fieldtype: '=',
          context: '=',
          tipo: '='
        },
        restrict: 'E',
        replace: false,
        template: '<span ng-if="fieldtype">{{(expression || "-N/A-" | date:"MM/dd/yyyy")}}</span><span ng-if="!fieldtype">{{(expression || "-N/A-")}}</span>',
        link: function(scope, element, attrs){

          // scope.jsFunction = "function doeval(context,tipo){ return "+ scope.expression + ";}; doeval(" + JSON.stringify(scope.context) + "," + JSON.stringify(scope.tipo) + ");"
          // scope.bindvalue = eval(scope.jsFunction);
          function initValue(){
            if (scope.fieldtype === "date") {
              scope.bindvalue = $filter('date')(scope.expression,'yyyy-MM-ddTHH:mm:ss') + 'Z';
            }else{
              scope.bindvalue = scope.expression;
            }
          }
          initValue();
          scope.$watch(function(){return scope.expression},function(){
            initValue();
          }, true)
        }
      };
    }
  );

})();