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
          scope.filters = _.filter(scope.filterslist.filters,function(filter){ return !filter.hidden });

          if($stateParams.filter){
            scope.currentFilters = $stateParams.filter;
            scope.selectedArray = _.filter(scope.filters, 'selected')
          }else{
            scope.selectedArray = [];
          }

          scope.removeFromCurrentExpression = function(){
            scope.currentFilters = _.map(scope.selectedArray,'name').join("&&");
            scope.search();
          } 

          scope.applyFilter = function(filter){
            if (filter.selected) {
              scope.selectedArray.splice(scope.selectedArray.indexOf(filter),1);
              scope.removeFromCurrentExpression();
            }else{
              if ($stateParams.filter) {
              scope.currentFilters = scope.currentFilters + "&&" + filter.name;
              }else{
                scope.currentFilters = filter.name;
              }
              scope.search();
            }
          }
        }
      };
    }
  );

})();
