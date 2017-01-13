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
    $mdSidenav,
    $mdMedia,
    $state,
    $stateParams,
    $scope,
    $rootScope) {

    var _instance = this;

    var perspectives = $scope.perspectives;

    // TODO: Hacky way to mark the active menu item. Need to improve this
    function markActiveItem(menu){
      var activeItem;
      if($stateParams.tipo_name){
        activeItem = _.find(menu, {tipo_name: $stateParams.tipo_name});
      }else{
        activeItem = _.find(menu, {state: $state.current.name});
      }

      if(!_.isUndefined(activeItem)){
        _instance.activeItem = activeItem;
      }
    }

    function prepareMenu(perspective){
      var tipoMenuItems;
      if(S(perspective).startsWith('tipo.')){
        var parts = perspective.split('.');
        var tipoName = parts[1];
        var tipoId = parts[2];
        tipoDefinitionDataService.getOne(tipoName).then(function(tipoDefinition){
          var subTipos = tipoDefinition._ui.subTipos;
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
          markActiveItem(tipoMenuItems);
          _instance.menu = tipoMenuItems;
        });
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

    $scope.$watch(function(){return $rootScope.perspective;}, function(newValue, oldValue){
      prepareMenu(newValue);
    });

  }

  angular.module('tipo.layout')
  .controller('NavigationController', NavigationController);

})();