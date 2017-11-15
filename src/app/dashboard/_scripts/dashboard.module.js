(function() {

  'use strict';

  function registerStates(stateProvider) {
    var homeState = {
      name: 'dashboard',
      url: '/dashboard?code',
      parent: 'layout',
      resolve: /*@ngInject*/
      {
        menu: function(parentPromise, tipoHandle, tipoManipulationService, $rootScope, $q, tipoRouter) {
          if (!$rootScope.readonly) {
            var perspective = $rootScope.perspective;
            var tipo = perspective.split('.')[0];
            return tipoHandle.getTipoDefinition(tipo).then(function(definition){
              return tipoManipulationService.prepareMenu(perspective, definition);
            });
          }else{
            // tipoRouter[$rootScope.readonlyrf]($rootScope.readonlytiponame,$rootScope.readonlyid);
            $q.when({});
          }
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