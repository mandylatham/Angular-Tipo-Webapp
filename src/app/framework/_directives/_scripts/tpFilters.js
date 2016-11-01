(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFilters', function (
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $stateParams) {
      return {
        scope: {
          definition: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-filters.tpl.html',
        link: function(scope, element, attrs){

          var tipo_name = scope.definition.tipo_meta.tipo_name;

          scope.search = function(){
            if(!_.isEmpty(scope.currentExpression)){
              tipoRouter.toTipoList(tipo_name, {filter: scope.currentExpression});
            }else{
              tipoRouter.toTipoList(tipo_name);
            }
          };

          function prepareFilters(){
            var tipoFilters = _.get(scope.definition, 'tipo_list.filters');

            var filters = _.map(tipoFilters, function(each){
              var filter = {
                name: each.display_name,
                expression: each.filter_expression
              };
              return filter;
            });

            return filters;
          }

          scope.filters = prepareFilters();

          if(!_.isEmpty(scope.filters)){
            scope.filter = {};
            scope.$watch('filter.selected', function(newValue, oldValue){
              if(!_.isUndefined(newValue)){
                scope.currentExpression = newValue.expression;
              }
            });
          }

          if($stateParams.filter){
            scope.currentExpression = $stateParams.filter;
          }

        }
      };
    }
  );

})();
