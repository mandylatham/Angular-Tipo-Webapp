(function() {

  'use strict';

  function NavigationController(
    tipoRouter,
    tipoDefinitionDataService,
    tipoInstanceDataService,
    tipoManipulationService,
    metadataService,
    tipoCache,
    $mdSidenav,
    $mdMedia,
    $state,
    $stateParams,
    $scope,
    $rootScope) {

    var _instance = this;

    var perspectives = $scope.perspectives;

    var currentPerspective;

    // TODO: Hacky way to mark the active menu item. Need to improve this
    function markActiveItem(menu, perspectiveTipoId){
      if(!_.isUndefined(perspectiveTipoId)){
        var items = _instance.perspectiveMenu.menuItems;
        var selectedItem = _.find(items, {tipoId: perspectiveTipoId});
        _instance.selectedPerspectiveItem = selectedItem;
      }
      var activeItem;
      if($stateParams.tipo_name){
        if($stateParams.filter){
          activeItem = _.find(menu, {tipo_name: $stateParams.tipo_name, quickFilters: $stateParams.filter});
        }
        if(!activeItem){
          activeItem = _.find(menu, {tipo_name: $stateParams.tipo_name});
        }  
      }else{
        activeItem = _.find(menu, {state: $state.current.name});
      }

      if(!_.isUndefined(activeItem)){
        _instance.activeItem = activeItem;
      }else{
        delete _instance.activeItem;
      }

    }

    function prepareMenu(perspective){
      delete _instance.activeItem;
      var tipoMenuItems;
      var skipMenuLoad = false;
      var parts = perspective.split('.');
      var tipoName = parts[0];
      var selectedTipoId;
      if(parts.length > 1){
       selectedTipoId = parts[1];
      }
      if(currentPerspective){
        var oldTipoName = currentPerspective.split('.')[0];
        if(tipoName === oldTipoName){
          skipMenuLoad = true;
        }
      }

      currentPerspective = perspective;

      if(skipMenuLoad){
        markActiveItem(_instance.menu, selectedTipoId);
      }else{
        var perspectiveMenu = {};
        var perspectiveMenuItems = [];
        tipoDefinitionDataService.getOne(tipoName).then(function(definition){

          _instance.menu = tipoManipulationService.prepareMenu(perspective, definition);

          var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
          perspectiveMenu.tipoName = perspectiveMetadata.tipoName;
          perspectiveMenu.displayName = perspectiveMetadata.displayName;

          if(perspectiveMetadata.abstract){
            perspectiveMenu.abstract = true;
            _instance.perspectiveMenu = perspectiveMenu;
            markActiveItem(_instance.menu, selectedTipoId);
          }else if(perspectiveMetadata.singleton){
            perspectiveMenu.singleton = true;
            _instance.perspectiveMenu = perspectiveMenu;
            markActiveItem(_instance.menu, selectedTipoId);
          }else{
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
                perspectiveMenuItems.push(menuItem);
              });
              perspectiveMenu.menuItems = perspectiveMenuItems;
              _instance.perspectiveMenu = perspectiveMenu;
              markActiveItem(_instance.menu, selectedTipoId);
            });
          }
        });
      }
    }

    _instance.navigate = function(menuItem){
      if(menuItem.id === 'clear_cache'){
        tipoRouter.startStateChange();
        metadataService.clearServerCache().then(function(){
          tipoCache.clearAll();
          tipoRouter.endStateChange();
        })
        return;
      }
      var perspective = $rootScope.perspective;
      $mdSidenav('left').close();
      _instance.activeItem = menuItem;
      tipoRouter.toMenuItem(menuItem);
    };

    _instance.switchTipoPerspective = function(menuItem){
      var tipoName = _instance.perspectiveMenu.tipoName;
      $rootScope.perspective = tipoName + '.' + menuItem.tipoId;
      tipoRouter.toTipoView(tipoName, menuItem.tipoId).then(function(){
        delete _instance.activeItem;
      });
    };

    _instance.openPerspectiveMenu = function(menuOpenFunction, event) {
      delete _instance.perspectiveMenu.searchText;
      menuOpenFunction(event);
    };

    $scope.$watch(function(){return $rootScope.perspective;}, function(newValue, oldValue){
      prepareMenu(newValue);
    });

    $scope.$on('$stateChangeSuccess', function() {
     markActiveItem(_instance.menu);
    });

  }

  angular.module('tipo.layout')
  .controller('NavigationController', NavigationController);

})();