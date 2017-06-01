(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function TipoActionDialogController(
    tipoDefinition,
    tipoAction,
    tipoManipulationService,
    $scope,
    tipoRouter,
    tipoInstanceDataService,
    $mdDialog) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipoAction = tipoAction;

    _instance.tipo = {};

    _instance.hooks = {};
    _instance.fullscreen = true;
    _instance.maximize = function(){
      _instance.fullscreen = true;
    };

    _instance.restore = function(){
      _instance.fullscreen = false;
    };

    _instance.lookupTipo = function(relatedTipo,labelfield,prefix){
      var newScope = $scope.$new();
      newScope.root = _instance.tipoDefinition;
      newScope.relatedTipo = relatedTipo;
      newScope.labelfield = labelfield;
      newScope.tipo = _instance.tipo[prefix];
      var promise = $mdDialog.show({
        templateUrl: 'framework/_directives/_views/tp-lookup-dialog.tpl.html',
        controller: 'TipoLookupDialogController',
        scope: newScope,
        skipHide: true,
        clickOutsideToClose: true,
        fullscreen: true
      });
      promise.then(function(tipo){
        _instance.tipo[prefix] = tipo;
      });
    }

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
      tipoRouter.startStateChange();
      if(_.isArray($scope.tipoids)){
        tipoInstanceDataService.performBulkAction($scope.parentTipo, tipoAction.name, $scope.tipoids, tipoDefinition.tipo_meta.tipo_name, tipoData)
          .then(function(response){
            $mdDialog.hide(response);
          },function(error){
            tipoRouter.endStateChange();
          });
      }else{
        tipoInstanceDataService.performSingleAction($scope.parentTipo, $scope.tipoids, tipoAction.name, tipoDefinition.tipo_meta.tipo_name, tipoData)
          .then(function(response){
            $mdDialog.hide(response);
          },function(error){
            tipoRouter.endStateChange();
          });
      }
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
    $timeout,
    $location) {
      return {
        scope: {
          definition: '=',
          tipos: '=',
          mode: '@?',
          bulkedit: '=',
          singleedit: '=',
          restrictedActions: '=',
          refresh: '&'
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-actions.tpl.html',
        link: function(scope, element, attrs){

          var mode = scope.mode;
          scope.mobaction= {isOpen: false};
          scope.deskaction= {isOpen: false};

          if(!mode){
            mode = 'view';
          }

          scope.mode = mode;

          var tipo_name = scope.definition.tipo_meta.tipo_name;
          var tipo_id;
          if(mode === 'view'){
            // only a single tipo
            tipo_id = scope.tipos.tipo_id;
            if (!_.isUndefined(scope.tipos.restrictedActions)) {
              var restrictedActions = scope.tipos.restrictedActions.split(',');
            };
          }else{
            if (!_.isUndefined(scope.restrictedActions)) {
              var restrictedActions = scope.restrictedActions.split(',');
            }
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
              if (restrictedActions) {
                var restriced = _.find(restrictedActions, function(o) { return o === each.tipo_action; });
              }else{
                var restriced = false;
              }
              if (!each.hidden_ && !restriced) {
                actions.push({
                  name: each.tipo_action,
                  label: each.display_name,
                  highlight: each.highlight,
                  bulk_select: each.bulk_select,
                  single_select: each.single_select,
                  restriced: restriced,
                  icon: each.icon,
                  additionalTipo: _.get(each, 'client_dependency.tipo_name')
                });
              };
            });

            return actions;
          }

          scope.actions = prepareActions();
          scope.tooltip = false;

          scope.openMenu = function(menuOpenFunction, event) {
            menuOpenFunction(event);
          };

          scope.updateBulkEdit = function(action){
            if (action.bulk_select) {
              scope.bulkedit = !scope.bulkedit;
            };
            if (action.single_select) {
              scope.singleedit = !scope.singleedit;
            };
          }

          scope.triggeractions = function(){
            angular.element('#actionmob').trigger('click');
          }

          scope.triggerdeskActions = function(){
            angular.element('#actiondesk').trigger('click');
          }

          scope.performAction = function(action){
            scope.deskaction.isOpen = false;
            scope.mobaction.isOpen = false;
            if(mode === 'view'){
                performSingleAction(action);
            }else{
              if (action.bulk_select) {
                if (scope.bulkedit) {
                  performBulkAction(action);
                }else{
                  scope.selectedAction = action;
                  scope.bulkedit = !scope.bulkedit;
                }
              }else if(action.single_select){
                if (scope.singleedit) {
                  performBulkAction(action);
                }else{
                  scope.selectedAction = action;
                  scope.singleedit = !scope.singleedit;
                }
              }else{
                performBulkAction(action);
              }
              
            }
          };
          scope.selectedall = false;
          scope.icon = "check_box";
          scope.tooltip = "Select All";
          scope.selectall = function(){
            scope.selectedall = !scope.selectedall;
            if (!scope.selectedall) {
              scope.icon = "check_box_outline_blank";
              scope.tooltip = "Select All";
            }else{
              scope.icon = "check_box";
              scope.tooltip = "Deselect All";
            }
            _.map(scope.tipos,function(tipo){
              tipo.selected = scope.selectedall;
            });
          }

          function performResponseActions(message,return_url,name){
            if (!_.isEmpty(return_url) || !_.isUndefined(return_url)) {
              if (!_.isEmpty(message) || !_.isUndefined(message)) {
                return_url = return_url + '?message=' + message;
              };
              if(S(return_url).contains('http')){
                // $window.open(return_url, "_blank")
               var confirm = $mdDialog.confirm()
                  .clickOutsideToClose(true)
                  .title(name + ' Completed')
                  .textContent(message)
                  .ariaLabel('Action completed')
                  .ok('OK')
      
              $mdDialog.show(confirm).then(function() {
                $window.open(return_url, "_blank")
              });
              }else{
                $location.url(return_url);  
              }            
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
              var promise = openAdditionalTipoDialog(additionalTipo, action, tipo_name, tipo_id);
              promise.then(function(response){
                  response.message = response.user_message;
                  tipoRouter.toTipoResponse(response);
                  tipoInstanceDataService.getOne(tipo_name, tipo_id, "" , true).then(function(tipoData){
                    scope.tipos = tipoData;
                    tipoRouter.toTipoView(tipo_name, tipo_id);
                    tipoRouter.toTipoResponse(response);
                    tipoRouter.endStateChange();
                    });
                  });
            }else{
              tipoRouter.startStateChange();
              tipoInstanceDataService.performSingleAction(tipo_name, tipo_id, action.name)
                .then(function(response){
                  response.message = response.user_message;
                  tipoInstanceDataService.getOne(tipo_name, tipo_id, "" , true).then(function(tipoData){
                    scope.tipos = tipoData;
                    tipoRouter.toTipoView(tipo_name, tipo_id);
                    tipoRouter.toTipoResponse(response);
                    tipoRouter.endStateChange();                  
                  });
                });
            }
          }

          function performBulkAction(action){
            var selected_tipo_ids = _.filter(scope.tipos, 'selected');
            selected_tipo_ids = _.map(selected_tipo_ids, function(each){
              return each.tipo_id;
            });
            // if(!_.isEmpty(selected_tipo_ids)){
              if(action.additionalTipo){
                var additionalTipo = action.additionalTipo;
                var promise = openAdditionalTipoDialog(additionalTipo, action,tipo_name,selected_tipo_ids);
                promise.then(function(response){
                    response[0].message = response[0].user_message;
                    tipoRouter.toTipoResponse(response[0]);
                    // performResponseActions(response[0].message,response[0].return_url,response[0].return_url,action.label);
                    tipoRouter.endStateChange();});
              }else{
                console.log('Will just perform the action without opening any dialogs');
                tipoRouter.startStateChange();
                tipoInstanceDataService.performBulkAction(tipo_name, action.name, selected_tipo_ids)
                  .then(function(response){
                    response[0].message = response[0].user_message;
                    tipoRouter.toTipoResponse(response[0]);
                    // performResponseActions(response[0].message,response[0].return_url,response[0].return_url,action.label);
                    tipoRouter.endStateChange();});
              }
            // }
          }

          function openAdditionalTipoDialog(tipo_name, action, parentTipo, tipoids){
            var newScope = scope.$new();
            newScope.parentTipo = parentTipo;
            newScope.tipoids = tipoids;
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

          scope.$watch('mobaction.isOpen', function(newVal, oldVal) {
            if (newVal) {
              $timeout(function() {
                scope.tooltip = scope.mobaction.isOpen;
              }, 600);
            } else {
              scope.tooltip = scope.mobaction.isOpen;
            }
          }, true);

          scope.$watch('deskaction.isOpen', function(newVal, oldVal) {
            if (newVal) {
              $timeout(function() {
                scope.tooltipDesk = scope.deskaction.isOpen;
              }, 600);
            } else {
              scope.tooltipDesk = scope.deskaction.isOpen;
            }
          }, true);

        }
      };
    }
  );

})();
