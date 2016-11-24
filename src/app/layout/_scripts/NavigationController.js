(function() {

  'use strict';

  var menu = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      state: 'dashboard',
      icon: 'dashboard',
      divider: true,
      perspectives: ['home']
    },
    {
      id: 'dynamic'
    },
    {
      id: 'support',
      label: 'Support',
      state: 'support',
      icon: 'help_outline'
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

    function prepareTipoMenu(perspective){
      var tipoDefinitions = perspectives[perspective].definitions;
      var tipoMenuItems = _.map(tipoDefinitions, function(definition){
        var menuItem = {};
        var meta = definition.tipo_meta;
        menuItem.id = 'tipo.' + meta.tipo_name;
        menuItem.tipo_name = meta.tipo_name;
        menuItem.label = meta.display_name;
        menuItem.icon = meta.icon;
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
      return fullMenu;
    }

    _instance.navigate = function(menuItem){
      var perspective = $rootScope.perspective;
      $mdSidenav('left').close();
      _instance.activeItem = menuItem;
      if(menuItem.state){
        tipoRouter.to(menuItem.state, menuItem.state);
      }else if(menuItem.tipo_name){
        if(perspective === 'settings'){
          tipoRouter.toSettingsView(menuItem.tipo_name);
        }else{
          tipoRouter.toTipoList(menuItem.tipo_name);
        }
      }
    };

    $rootScope.$watch('perspective', function(newValue, oldValue){
      _instance.menu = prepareTipoMenu(newValue);
    });

  }

  angular.module('tipo.layout')
  .controller('NavigationController', NavigationController);

})();