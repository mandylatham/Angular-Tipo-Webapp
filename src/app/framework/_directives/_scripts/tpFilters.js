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
          definition: '=',
          filterslist: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-filters.tpl.html',
        link: function(scope, element, attrs){

          var tipo_name = scope.definition.tipo_meta.tipo_name;

          scope.search = function(){
            if(!_.isEmpty(scope.currentFilters)){
              tipoRouter.toTipoList(tipo_name, {filter: scope.currentFilters});
            }else{
              tipoRouter.toTipoList(tipo_name);
            }
          };
          scope.filters = scope.filterslist.filters;

          if($stateParams.filter){
            scope.currentFilters = $stateParams.filter;
            scope.selectedArray = scope.currentFilters.split("&&");
          }else{
            scope.selectedArray = [];
          }

          function removeFromCurrentExpression(filter){
            scope.selectedArray.splice(scope.selectedArray.indexOf(filter.name),1);
            scope.currentFilters = scope.selectedArray.join("&&");
          }

          scope.applyFilter = function(filter){
            if (filter.selected) {
              removeFromCurrentExpression(filter);
            }else{
              if ($stateParams.filter) {
              scope.currentFilters = scope.currentFilters + "&&" + filter.name;
              }else{
                scope.currentFilters = filter.name;
              }
            }
            scope.search();
          }
        }
      };
    }
  );

})();
