(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpD3', function (tipoInstanceDataService) {
      return {
        scope: {
          chart_type: "=",
          height: "=",
          margin: "=",
          x_label: "=",
          y_label: "=",
          agrregation: "=",
          data: "=",
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-d3.tpl.html',
        link: function(scope, element, attrs, ctrl){
          scope.options = {};
          scope.options.chart = {type: scope.chart_type};
          // if (scope.agrregation === "count") {
            // tipoInstanceDataService.aggegrationData(scope.data).then(function(results){
            //   console.log(results);
            // });
          // };          
        }
      };
    }
  );

})();