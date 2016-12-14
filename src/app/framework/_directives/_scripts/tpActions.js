(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function TipoActionDialogController(
    tipoDefinition,
    tipoManipulationService,
    $scope,
    $mdDialog) {

    $scope.definition = tipoDefinition;

    $scope.maximize = function(){
      $scope.fullscreen = true;
    };

    $scope.restore = function(){
      $scope.fullscreen = false;
    };

    $scope.finish = function() {
      var tipoData = {};
      tipoManipulationService.extractDataFromMergedDefinition(tipoDefinition, tipoData);
      $mdDialog.hide(tipoData);
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

  return module.directive('tpActions', function (
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $mdDialog) {
      return {
        scope: {
          definition: '=',
          tipos: '=',
          mode: '@?'
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-actions.tpl.html',
        link: function(scope, element, attrs){

          var mode = scope.mode;
          if(!mode){
            mode = 'view';
          }

          scope.mode = mode;

          var tipo_name = scope.definition.tipo_meta.tipo_name;
          var tipo_id;
          if(mode === 'view'){
            // only a single tipo
            tipo_id = scope.tipos.tipo_id;
          }

          function prepareActions(){
            var tipoActions;
            if(mode === 'view'){
              tipoActions = _.get(scope.definition, 'tipo_detail.actions');
            }else{
              tipoActions = _.get(scope.definition, 'tipo_list.actions');
            }

            var actions = _.map(tipoActions, function(each){
              var action = {
                name: each.tipo_action,
                label: each.display_name,
                additionalTipo: _.get(each, 'client_dependency.tipo_name')
              };
              return action;
            });

            return actions;
          }

          scope.actions = prepareActions();

          scope.openMenu = function(menuOpenFunction, event) {
            menuOpenFunction(event);
          };

          scope.performAction = function(action){
            if(mode === 'view'){
              performSingleAction(action);
            }else{
              performBulkAction(action);
            }
          };

          function performSingleAction(action){
            if(action.additionalTipo){
              var additionalTipo = action.additionalTipo;
              var promise = openAdditionalTipoDialog(additionalTipo, action);
              promise.then(function(tipoData){
                tipoRouter.startStateChange();
                tipoInstanceDataService.performSingleAction(tipo_name, tipo_id, action.name, additionalTipo, tipoData)
                  .then(tipoRouter.endStateChange);
              });
            }else{
              tipoRouter.startStateChange();
              tipoInstanceDataService.performSingleAction(tipo_name, tipo_id, action.name)
                .then(tipoRouter.endStateChange);
            }
          }

          function performBulkAction(action){
            var selected_tipo_ids = _.filter(scope.tipos, 'selected');
            selected_tipo_ids = _.map(selected_tipo_ids, function(each){
              return each.key;
            });
            if(!_.isEmpty(selected_tipo_ids)){
              if(action.additionalTipo){
                var additionalTipo = action.additionalTipo;
                var promise = openAdditionalTipoDialog(additionalTipo, action);
                promise.then(function(tipoData){
                  tipoRouter.startStateChange();
                  tipoInstanceDataService.performBulkAction(tipo_name, action.name, selected_tipo_ids, additionalTipo, tipoData)
                    .then(tipoRouter.endStateChange);
                });
              }else{
                console.log('Will just perform the action without opening any dialogs');
                tipoRouter.startStateChange();
                tipoInstanceDataService.performBulkAction(tipo_name, action.name, selected_tipo_ids)
                  .then(tipoRouter.endStateChange);
              }
            }
          }

          function openAdditionalTipoDialog(tipo_name, action){
            var newScope = scope.$new();
            newScope.tipoAction = action;
            var promise = $mdDialog.show({
              templateUrl: 'framework/_directives/_views/tp-action-dialog.tpl.html',
              controller: TipoActionDialogController,
              scope: newScope,
              resolve: /*@ngInject*/
              {
                tipoDefinition: function(tipoDefinitionDataService, tipoManipulationService) {
                  return tipoDefinitionDataService.getOne(tipo_name);
                }
              },
              skipHide: true,
              clickOutsideToClose: true,
              fullscreen: true
            });
            return promise;
          }

        }
      };
    }
  );

})();
