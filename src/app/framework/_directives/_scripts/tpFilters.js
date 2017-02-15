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
            if(!_.isEmpty(scope.currentExpression)){
              tipoRouter.toTipoList(tipo_name, {filter: scope.currentExpression});
            }else{
              tipoRouter.toTipoList(tipo_name);
            }
          };
          console.log(scope.filterslist);
          console.log("scope.tipoFilters");
          scope.filters = scope.filterslist.filters;

          if($stateParams.filter){
            scope.currentExpression = $stateParams.filter;
            scope.selectedArray = scope.currentExpression.split("&&");
          }else{
            scope.selectedArray = [];
          }

          function removeFromCurrentExpression(filter){
            scope.selectedArray.splice(scope.selectedArray.indexOf(filter.display_name),1);
            scope.currentExpression = scope.selectedArray.join("&&");
          }

          scope.applyFilter = function(filter){
            if (filter.selected) {
              removeFromCurrentExpression(filter);
            }else{
              if ($stateParams.filter) {
              scope.currentExpression = scope.currentExpression + "&&" + filter.display_name;
              }else{
                scope.currentExpression = filter.display_name;
              }
            }        
            scope.search();
          }
        }
      };
    }
  );

})();
