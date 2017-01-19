(function() {

  'use strict';

  var menu = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      state: 'dashboard',
      icon: 'dashboard',
      divider: true,
      perspectives: ['home', 'settings']
    },
    {
      id: 'dynamic'
    }
  ];

  function NavigationController(
    tipoRouter,
    tipoDefinitionDataService,
    tipoInstanceDataService,
    tipoManipulationService,
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
        activeItem = _.find(menu, {tipo_name: $stateParams.tipo_name});
      }else{
        activeItem = _.find(menu, {state: $state.current.name});
      }

      if(!_.isUndefined(activeItem)){
        _instance.activeItem = activeItem;
      }else{
        delete _instance.activeItem;
      }
    }

    function prepareMenu(newPerspective){
      delete _instance.activeItem;
      var tipoMenuItems;
      var perspective = newPerspective;
      newPerspective = S(newPerspective);
      if(newPerspective.startsWith('tipo.')){
        var skipMenuLoad = false;
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
          markActiveItem(_instance.menu, selectedtTipoId);
        }else{
          var perspectiveMenu = {};
          var perspectiveMenuItems = [];
          tipoDefinitionDataService.getOne(tipoName).then(function(definition){
            perspectiveMenu.tipoName = definition.tipo_meta.tipo_name;
            tipoInstanceDataService.search(tipoName).then(function(tipos){
              var subTipos = definition._ui.subTipos;
              subTipos = _.sortBy(subTipos, function(each){
                if(each._ui.sequence){
                  return parseFloat(each._ui.sequence, 10);
                }else{
                  return 999;
                }
              });
              tipoMenuItems = _.map(subTipos, function(fieldDefinition){
                var menuItem = {};
                menuItem.id = 'tipo.' + fieldDefinition._ui.relatedTipo;
                menuItem.tipo_name = fieldDefinition._ui.relatedTipo;
                menuItem.label = fieldDefinition.display_name;
                menuItem.icon = fieldDefinition._ui.icon;
                menuItem.isSingleton = fieldDefinition._ui.isSingleton;
                menuItem.perspective = perspective;
                return menuItem;
              });
              _instance.menu = tipoMenuItems;
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
              markActiveItem(_instance.menu, selectedtTipoId);
            });
          });
        }
      }
      else{
        var tipoDefinitions = perspectives[perspective].definitions;
        tipoMenuItems = _.map(tipoDefinitions, function(definition){
          var menuItem = {};
          var meta = definition.tipo_meta;
          menuItem.id = 'tipo.' + meta.tipo_name;
          menuItem.tipo_name = meta.tipo_name;
          menuItem.label = meta.display_name;
          menuItem.icon = meta.icon;
          menuItem.isSingleton = definition._ui.isSingleton;
          return menuItem;
        });

        var fullMenu = _.cloneDeep(menu);
        fullMenu = _.filter(fullMenu, function(each){
          return _.isUndefined(each.perspectives) || _.includes(each.perspectives, perspective);
        });
        var tipoMenuIndex = _.findIndex(fullMenu, {id: 'dynamic'});
        fullMenu.splice(tipoMenuIndex, 1, tipoMenuItems);
        fullMenu = _.flatten(fullMenu);
        markActiveItem(fullMenu);
        _instance.menu = fullMenu;
        currentPerspective = undefined;
        delete _instance.perspectiveMenu;
      }
    }

    _instance.navigate = function(menuItem){
      var perspective = $rootScope.perspective;
      $mdSidenav('left').close();
      _instance.activeItem = menuItem;
      if(menuItem.state){
        tipoRouter.to(menuItem.state, menuItem.state);
      }else if(menuItem.tipo_name){
        var parameters;
        if(menuItem.perspective){
          parameters = {
            perspective: menuItem.perspective
          };
        }
        if(menuItem.isSingleton){
          tipoRouter.toTipoView(menuItem.tipo_name, 'default', parameters);
        }else{
          tipoRouter.toTipoList(menuItem.tipo_name, parameters);
        }
      }
    };

    _instance.switchTipoPerspective = function(menuItem){
      var tipoName = _instance.perspectiveMenu.tipoName;
      $rootScope.perspective = 'tipo.' + tipoName + '.' + menuItem.tipoId;
      tipoRouter.toTipoView(tipoName, menuItem.tipoId).then(function(){
        delete _instance.activeItem;
      });
    };

    _instance.openPerspectiveMenu = function(menuOpenFunction, event) {
      menuOpenFunction(event);
    };

    $scope.$watch(function(){return $rootScope.perspective;}, function(newValue, oldValue){
      prepareMenu(newValue);
    });

  }

  angular.module('tipo.layout')
  .controller('NavigationController', NavigationController);

})();