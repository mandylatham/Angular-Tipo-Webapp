(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function TipoGroupDialogController($scope, $mdDialog) {

    this.mode = $scope.mode;

    $scope.maximize = function(){
      $scope.fullscreen = true;
    };

    $scope.restore = function(){
      $scope.fullscreen = false;
    };

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

  function TipoLookupDialogController(
    tipoRegistry,
    tipoInstanceDataService,
    tipoManipulationService,
    $scope,
    $mdDialog) {

    var target = $scope.target;

    var relatedTipoName = $scope.group._ui.relatedTipo;

    var relatedTipo = tipoRegistry.get(relatedTipoName);

    $scope.tipoDisplayName = relatedTipo.tipo_meta.display_name;

    var definition = angular.copy($scope.definition);
    delete definition._value;
    $scope.definition = definition;

    $scope.populateData = function() {
      var tipoId = _.get(definition, '_value.key');
      if(!_.isUndefined(tipoId)){
        tipoInstanceDataService.getOne(relatedTipoName, tipoId).then(function(tipo){
          tipoManipulationService.mergeDefinitionAndData(target, tipo, true);
          $mdDialog.hide();
        });
      }
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

  return module.directive('tpGroupContainer', function (
    tipoManipulationService,
    $mdDialog) {
      return {
        scope: {
          group: '=',
          mode: '@?'
        },
        require: '?^tpView',
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-group-container.tpl.html',
        link: function(scope, element, attrs, tpViewController){

          var mode = scope.mode;
          if(!mode && tpViewController){
            mode = tpViewController.getMode();
          }
          if(!mode){
            mode = 'view';
          }

          scope.mode = mode;

          function showDetail(definition){
            if(_.isUndefined(definition)){
              definition = scope.group;
            }
            var newScope = scope.$new();
            newScope.definition = definition;
            newScope.mode = mode;
            $mdDialog.show({
              templateUrl: 'framework/_directives/_views/tp-view-dialog.tpl.html',
              controller: TipoGroupDialogController,
              scope: newScope,
              skipHide: true,
              clickOutsideToClose: true,
              fullscreen: true
            });
          }

          function lookupTipo(target){
            if(_.isUndefined(target)){
              target = scope.group;
            }
            var newScope = scope.$new();
            newScope.definition = scope.group;
            newScope.target = target;
            $mdDialog.show({
              templateUrl: 'framework/_directives/_views/tp-lookup-dialog.tpl.html',
              controller: TipoLookupDialogController,
              scope: newScope,
              skipHide: true,
              clickOutsideToClose: true,
              fullscreen: true
            });
          }

          function generateItem(group){
            tipoManipulationService.generateGroupItem(group);
          }

          function deleteItem(groupItem, group){
            if(_.isUndefined(groupItem._ui.hash)){
              // indicates that this item was never saved on the backend, hence just delete it
              _.remove(group._items, function(each){
                return each === groupItem;
              });
            }else{
              // indicates that this item already exists in the backend, hence flagging it for deletion
              groupItem._ui.deleted = true;
            }
          }

          function cloneItem(groupItem, group){
            var clonedItem = angular.copy(groupItem);
            delete clonedItem._ARRAY_META;
            delete clonedItem._ui.hash;
            group._items.push(clonedItem);
          }

          scope.generateItem = generateItem;
          scope.showDetail = showDetail;
          scope.deleteItem = deleteItem;
          scope.cloneItem = cloneItem;
          scope.lookupTipo = lookupTipo;
        }
      };
    }
  );

})();
