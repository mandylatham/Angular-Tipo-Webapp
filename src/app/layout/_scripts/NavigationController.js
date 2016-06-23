(function() {

  'use strict';

  var menu = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      state: 'dashboard',
      icon: 'dashboard',
      divider: true
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

  function prepareMenu(tipoDefinitions){
    tipoDefinitions = _.filter(_.values(tipoDefinitions), function(each){
      return Boolean(each.tipo_meta.main_menu);
    });
    var tipoMenuItems = _.map(tipoDefinitions, function(definition){
      var menuItem = {};
      var meta = definition.tipo_meta;
      menuItem.id = 'tipo.' + meta.tipo_name;
      menuItem.tipo_name = meta.tipo_name;
      menuItem.tipo_version = meta.default_version;
      menuItem.label = meta.display_name;
      menuItem.icon = meta.icon;
      return menuItem;
    });

    var fullMenu = _.cloneDeep(menu);
    var tipoMenuIndex = _.findIndex(fullMenu, {id: 'dynamic'});
    fullMenu.splice(tipoMenuIndex, 1, tipoMenuItems);
    fullMenu = _.flatten(fullMenu);
    return fullMenu;
  }

  function NavigationController(tipoDefinitionDataService) {
    
    var _instance = this;

    tipoDefinitionDataService.getAll().then(function(definitions){
      _instance.menu = prepareMenu(definitions);
    });

  }

  angular.module('tipo.layout')
  .controller('NavigationController', NavigationController);

})();