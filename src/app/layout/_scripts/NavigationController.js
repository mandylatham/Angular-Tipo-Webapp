(function() {

  'use strict';

  function NavigationController(
    tipoRouter,
    tipoHandle,
    tipoInstanceDataService,
    tipoManipulationService,
    metadataService,
    tipoCache,
    $mdSidenav,
    $templateCache,
    $window,
    $mdMedia,
    $state,
    $stateParams,
    $location,
    $scope,
    $rootScope) {

    var _instance = this;

    var perspectives = $scope.perspectives;

    var currentPerspective;

    _instance.template = metadataService.resolveAppCustomUrls("custom_menu_template","g/public/common/views/tipoapp/custom_menu.tpl.html");

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
        else{
          activeItem = _.find(menu, function(menuItems){return (menuItems.tipo_name === $stateParams.tipo_name && !menuItems.quickFilters)}); 
        }
        if(!activeItem){
          activeItem = _.find(menu, {tipo_name: $stateParams.tipo_name});
        }  
      }else{
        activeItem = _.find(menu, {state: $state.current.name});
      }

      if(!_.isUndefined(activeItem)){
        _instance.activeItem = activeItem;
        tipoHandle.setMenuItem(activeItem);
      }else{
        delete _instance.activeItem;
        tipoHandle.setMenuItem(activeItem);
      }
    }

    function prepareMenuItems(tipo,definition,perspectiveMenuItems){
      var tipoId = tipo.tipo_id;
      var clonedDefinition = _.cloneDeep(definition);
      // clonedDefinition.tipo_fields = clonedDefinition.list_display_fields;
      tipoManipulationService.mergeDefinitionAndData(clonedDefinition, tipo);
      // clonedDefinition.tipo_fields = tipoManipulationService.extractShortDisplayFields(clonedDefinition);
      var label = tipoManipulationService.getLabel(clonedDefinition);
      var menuItem = {};
      menuItem.tipoId = tipoId;
      menuItem.label = label;
      menuItem.action = 'switch';
      menuItem.tipoName = definition.tipo_id;
      _instance.perspectiveMenuItems = _.union(_instance.perspectiveMenuItems,[menuItem]);
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
        _instance.perspectiveMenuItems = [];
        tipoHandle.getTipoDefinition(tipoName).then(function(definition){

          _instance.menu = tipoManipulationService.prepareMenu(perspective, definition);
          _instance.switchPerspective = definition.tipo_meta.switch_perspectives;

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
            // If the perspective menu items are more than 500
            var queryparams = {};
            queryparams.page = 1;
            queryparams.per_page = 100;
            queryparams.must_include_key = "tipo_id";
            queryparams.must_include_values = selectedTipoId;
            // if (_instance.switchPerspective) {
              tipoInstanceDataService.search(tipoName,queryparams).then(function(tipos){
                tipos = _.uniqWith(tipos, _.isEqual);
                _.each(tipos, function(tipo){
                  prepareMenuItems(tipo,definition,_instance.perspectiveMenuItems);
                });
                if ($stateParams.perspectiveTipo) {
                  prepareMenuItems($stateParams.perspectiveTipo,definition,_instance.perspectiveMenuItems);
                };
                perspectiveMenu.menuItems = _instance.perspectiveMenuItems;
                _instance.perspectiveMenu = perspectiveMenu;
                markActiveItem(_instance.menu, selectedTipoId);
              });
            // };
          }
        });
      }
      if ($state.params.openSidenav) {
        $mdSidenav('left').toggle();
      };
    }

    function navigateToItem(menuItem,data){
        _.each(data.tipo_meta.tipo_type,function(type){
          if (type === "abstract") {
            menuItem.abstract = true;
          };
          if (!menuItem.ignore_singleton && _.startsWith(type, 'singleton')) {
            menuItem.isSingleton = true;
          }else{
            menuItem.isSingleton = false;
          }
        });
        tipoRouter.toMenuItem(menuItem);
    }

    _instance.navigate = function(menuItem){
      if(menuItem.type === 'Client'){
        if(clientActions[menuItem.id]){
          clientActions[menuItem.id](menuItem);
        }else{
          // do nothing
        }
        return;
      }
      var perspective = $rootScope.perspective;
      if (!$state.params.openSidenav) {
        $mdSidenav('left').close();
      }
      _instance.activeItem = menuItem;
      tipoRouter.toMenuItem(menuItem);   
    };

    _instance.switchTipoPerspective = function(menuItem){
      var tipoName = _instance.perspectiveMenu.tipoName;
      $rootScope.perspective = tipoName + '.' + menuItem.tipoId;
      tipoRouter.toTipoView(tipoName, menuItem.tipoId).then(function(){
        delete _instance.activeItem;
        tipoHandle.setMenuItem(menuItem);
      });
    };

    _instance.openPerspectiveMenu = function(menuOpenFunction, event) {
      delete _instance.perspectiveMenu.searchText;
      menuOpenFunction(event);
    };

    $scope.$watch(function(){return $rootScope.perspective;}, function(newValue, oldValue){
      if (!$rootScope.readonly) {
        prepareMenu(newValue);
      };
    });
    $scope.$watch(function(){return _instance.menu;}, function(newValue, oldValue){
      if (!_.isUndefined(newValue) && $state.current.name === "dashboard") {
        _instance.navigate(newValue[0]);
      };
    });

    $scope.$on('$stateChangeSuccess', function() {
      if (!$rootScope.readonly) {
        markActiveItem(_instance.menu);
      }
    });

    // TODO: Hard-coded list of client actions. This needs to be extracted out and made configurable in future
    var clientActions = {
      'ClearCache': function(){
        tipoRouter.startStateChange();
        metadataService.clearServerCache().then(function(){
          tipoCache.clearAll();
          $templateCache.removeAll();
          $location.url("/login");
          $window.location.reload();
          tipoRouter.endStateChange();
        });
      },
      'Logout': function(){
        $scope.main.signOut();
      }
    };

  }

  angular.module('tipo.layout')
  .controller('NavigationController', NavigationController);

})();