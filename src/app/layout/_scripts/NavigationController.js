(function() {

  'use strict';

  var menu = [
    {
      id: 'home',
      label: 'Home',
      state: 'home',
      icon: 'home',
      divider: true
    },
    {
      id: 'dynamic'
    },
    {
      id: 'home',
      label: 'Home Again',
      state: 'home',
      icon: 'home'
    }
  ];

  function prepareMenu(){
    
  }

  function NavigationController() {
    
    var _instance = this;

    _instance.menu = prepareMenu();

  }

  angular.module('tipo.layout')
  .controller('NavigationController', NavigationController);

})();