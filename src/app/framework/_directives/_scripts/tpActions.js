(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function TipoActionDialogController(
    tipoDefinition,
    tipoAction,
    tipoManipulationService,
    $mdDialog) {

    var _instance = this;

    _instance.tipoDefinition = tipoDefinition;

    _instance.tipoAction = tipoAction;

    _instance.tipo = {};

    _instance.hooks = {};

    _instance.maximize = function(){
      _instance.fullscreen = true;
    };

    _instance.restore = function(){
      _instance.fullscreen = false;
    };

    _instance.finish = function() {
      var tipoData = _instance.tipo;
      if(_instance.hooks.preFinish){
        var result = _instance.hooks.preFinish();
        if(!result){
          return;
        }
        tipoData = _instance.data;
      }
      if(_.isEmpty(tipoData)) {
        tipoManipulationService.extractDataFromMergedDefinition(tipoDefinition, tipoData);
      }
      $mdDialog.hide(tipoData);
    };

    _instance.cancel = function() {
      $mdDialog.cancel();
    };
  }

  return module.directive('tpActions', function (
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $mdDialog,
    $mdMedia,
    $window,
    $mdToast,
    $location) {
      return {
        scope: {
          definition: '=',
          tipos: '=',
          mode: '@?',
          bulkedit: '='
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
          var widthContainer = angular.element(document.getElementById('content')).prop('offsetWidth') - 16;

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
            var actions = [];
            _.forEach(tipoActions, function(each){
              if (!each.hidden_) {
                actions.push({
                  name: each.tipo_action,
                  label: each.display_name,
                  highlight: each.highlight,
                  bulk_select: each.bulk_select,
                  icon: each.icon,
                  additionalTipo: _.get(each, 'client_dependency.tipo_name')
                });
              };
            });

            return actions;
          }

          scope.actions = prepareActions();

          scope.openMenu = function(menuOpenFunction, event) {
            menuOpenFunction(event);
          };

          scope.updateBulkEdit = function(){
            scope.bulkedit = !scope.bulkedit;
          }

          scope.performAction = function(action){
            if(mode === 'view' || !action.bulk_select){
              if (mode === 'view') {
                performSingleAction(action);
              }else{
                performBulkAction(action);
              }
            }else{
              if (scope.bulkedit) {
                performBulkAction(action);  
              }else{
                scope.selectedAction = action;
                scope.bulkedit = !scope.bulkedit;
              }
              
            }
          };

          function performResponseActions(message,return_url){
            if (!_.isEmpty(return_url) || !_.isUndefined(return_url)) {
              if (!_.isEmpty(message) || !_.isUndefined(message)) {
                return_url = return_url + '?message=' + message;
              };
              $location.url(return_url);            
            }else{
                var toast = $mdToast.tpToast();
                toast._options.locals = {
                  header: 'Action successfully completed',
                  body: message
                };
                $mdToast.show(toast);
              }
          }

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
                  .then(function(response){
                    performResponseActions(response[0].message,response[0].data.return_url);
                    tipoRouter.endStateChange();});
              }
            }
          }

          function openAdditionalTipoDialog(tipo_name, action){
            var newScope = scope.$new();
            var promise = $mdDialog.show({
              templateUrl: 'framework/_directives/_views/tp-action-dialog.tpl.html',
              controller: TipoActionDialogController,
              controllerAs: 'tipoRootController',
              scope: newScope,
              resolve: /*@ngInject*/
              {
                tipoDefinition: function(tipoDefinitionDataService, tipoManipulationService) {
                  return tipoDefinitionDataService.getOne(tipo_name);
                },
                tipoAction: function(){
                  return action;
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
