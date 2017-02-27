(function () {

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

    _instance.perspectives = [{
      name: 'Home',
      icon: 'home'
    }, {
      name: 'Settings',
      icon: 'settings'
    }];

    _instance.openProfileMenu = function(menuOpenFunction, event) {
      menuOpenFunction(event);
    };

    _instance.toProfile = function(){
      tipoRouter.toTipoView('TipoUser', 'default');
    };
    _instance.toAccount = function(){
      tipoRouter.toTipoView('TipoAccount', 'default');
    };

  }

  angular.module('tipo.layout')
    .controller('HeaderController', HeaderController);

})();