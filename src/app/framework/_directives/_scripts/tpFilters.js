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
          tipoName: '=',
          tipoFilters: '=',
          multiSelect: '=',
          filterLabel: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-filters.tpl.html',
        link: function(scope, element, attrs){

          var tipo_name = scope.tipoName;

          scope.search = function(){
            if(!_.isEmpty(scope.currentFilters)){
              tipoRouter.toTipoList(tipo_name, {filter: scope.currentFilters});
            }else{
              tipoRouter.toTipoList(tipo_name,{},undefined,true);
            }
          };
          scope.filters = _.filter(scope.tipoFilters,function(filter){ return !filter.hidden_ });

          if($stateParams.filter){
            scope.currentFilters = $stateParams.filter;
            var selectedFilters = scope.currentFilters.split("&&");
            _.each(scope.filters,function(filter){
              _.each(selectedFilters,function(selectedfilter){
                if (filter.display_name == selectedfilter) {
                  filter.selected = true;
                };
              })
            });
            scope.selectedArray = _.filter(scope.filters, 'selected')
          }else{
            scope.selectedArray = [];
          }

          scope.removeFromCurrentExpression = function(){
            scope.currentFilters = _.map(scope.selectedArray,'display_name').join("&&");
            scope.search();
          } 

          scope.applyFilter = function(filter){
            if (filter.selected) {
              scope.selectedArray.splice(scope.selectedArray.indexOf(filter),1);
              scope.removeFromCurrentExpression();
            }else{
              if ($stateParams.filter && scope.multiSelect) {
              scope.currentFilters = scope.currentFilters + "&&" + filter.display_name;
              }else{
                scope.currentFilters = filter.display_name;
              }
              scope.search();
            }
          }
        }
      };
    }
  );

})();
