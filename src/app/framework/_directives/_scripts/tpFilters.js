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

          if($stateParams.filter){
            scope.currentExpression = $stateParams.filter;
            scope.selectedArray = scope.currentExpression.split(" and ");
            scope.selectedObj = _.zipObject(scope.selectedArray,scope.selectedArray);
          }else{
            scope.selectedObj = {};
            scope.selectedArray = [];
          }


          function prepareFilters(){
            var tipoFilters = _.get(scope.definition, 'tipo_list.filters');
            var filters = _.map(tipoFilters, function(each){
              var selected = false;
              if(scope.selectedObj[each.filter_expression]){
                selected = true;
              }
              var filter = {
                name: each.display_name,
                expression: each.filter_expression,
                selected: selected
              };
              return filter;
            });

            return filters;
          }

          scope.filters = prepareFilters();

          function removeFromCurrentExpression(filter){
            scope.selectedArray.splice(scope.selectedArray.indexOf(filter.expression),1);
            scope.currentExpression = scope.selectedArray.join(" and ");
          }

          scope.applyFilter = function(filter){
            if (filter.selected) {
              removeFromCurrentExpression(filter);
            }else{
              if ($stateParams.filter) {
              scope.currentExpression = scope.currentExpression + " and " + filter.expression;
              }else{
                scope.currentExpression = filter.expression;
              }
            }        
            scope.search();
          }
        }
      };
    }
  );

})();
