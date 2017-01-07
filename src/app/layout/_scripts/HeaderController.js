(function() {

  'use strict';

  function HeaderController(
    tipoRouter,
    tipoDefinitionDataService,
    tipoInstanceDataService,
    tipoManipulationService,
    $mdMedia,
    $state,
    $stateParams,
    $scope,
    $rootScope) {

    var _instance = this;

    var currentPerspective;

    function markActiveItem(tipoId){
      var items = _instance.tipoMenu.menuItems;
      var selectedItem = _.find(items, {tipoId: tipoId});
      _instance.selectedItem = selectedItem;
    }

    function prepareMenu(newPerspective){
      var perspective = newPerspective;
      newPerspective = S(newPerspective);
      var tipoMenuItems = [];
      var skipMenuLoad = false;
      if(newPerspective.startsWith('tipo.')){
        var parts = perspective.split('.');
        var tipoName = parts[1];
        var selectedtTipoId = parts[2];
        if(currentPerspective && S(currentPerspective).startsWith('tipo.')){
          var oldTipoName = currentPerspective.split('.')[1];
          if(tipoName === oldTipoName){
            skipMenuLoad = true;
          }
        }

        currentPerspective = newPerspective;

        if(skipMenuLoad){
          markActiveItem(selectedtTipoId);
        }else{
          var tipoMenu = {};
          tipoDefinitionDataService.getOne(tipoName).then(function(definition){
            tipoMenu.tipoName = definition.tipo_meta.tipo_name;
            tipoInstanceDataService.search(tipoName).then(function(tipos){
              _.each(tipos, function(tipo){
                var tipoId = tipo.tipo_id;
                var clonedDefinition = _.cloneDeep(definition);
                tipoManipulationService.mergeDefinitionAndData(clonedDefinition, tipo);
                clonedDefinition.tipo_fields = tipoManipulationService.extractShortDisplayFields(clonedDefinition);
                var label = tipoManipulationService.getLabel(clonedDefinition);
                var menuItem = {};
                menuItem.tipoId = tipoId;
                menuItem.label = label;
                menuItem.action = 'switch';
                tipoMenuItems.push(menuItem);
              });
              tipoMenu.menuItems = tipoMenuItems;
              _instance.tipoMenu = tipoMenu;
              markActiveItem(selectedtTipoId);
            });
          });
        }
      }
      else{
        currentPerspective = undefined;
        delete _instance.tipoMenu;
      }
    }

    _instance.switch = function(menuItem){
      var tipoName = _instance.tipoMenu.tipoName;
      $rootScope.perspective = 'tipo.' + tipoName + '.' + menuItem.tipoId;
      tipoRouter.toTipoView(tipoName, menuItem.tipoId);
    };

    _instance.openMenu = function(menuOpenFunction, event) {
      menuOpenFunction(event);
    };

    $scope.$watch(function(){return $rootScope.perspective;}, function(newValue, oldValue){
      prepareMenu(newValue);
    });

  }

  angular.module('tipo.layout')
  .controller('HeaderController', HeaderController);

})();