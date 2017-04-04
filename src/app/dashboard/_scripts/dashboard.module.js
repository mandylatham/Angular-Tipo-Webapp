(function() {

  'use strict';

  function registerStates(stateProvider) {
    var homeState = {
      name: 'dashboard',
      url: '/dashboard?code',
      parent: 'layout',
      resolve: /*@ngInject*/
      {
        menu: function(parentPromise, tipoDefinitionDataService, tipoManipulationService, $rootScope) {
          var perspective = $rootScope.perspective;
          var tipo = perspective.split('.')[0];
          console.log(tipo);
          return tipoDefinitionDataService.getOne(tipo).then(function(definition){
            console.log(definition);
            return tipoManipulationService.prepareMenu(perspective, definition);
          });
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'dashboard/_views/dashboard.tpl.html',
          controller: 'DashboardController',
          controllerAs: 'dashboardController'
        }
      }
    };

    stateProvider
      .state(homeState);
  }

  function configureModule(stateProvider) {
    registerStates(stateProvider);
  }

  var module = angular.module('tipo.dashboard', [
  ]);

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();