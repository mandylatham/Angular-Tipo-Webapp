(function() {

  'use strict';

  // Declaration for the Tipo UI main module. This will be used as the 'ng-app' for the entire application
  var app = angular.module('tipo.main', [
    'tipo.partials'
  ]);

  function registerStates(stateProvider) {
    // Root State
    var rootState = {
      name: 'root',
      abstract: true,
      controller: 'MainController',
      controllerAs: 'mainController',
      template: '<div data-ui-view data-autoscroll="false"></div>',
      resolve: /*@ngInject*/
      {
        tipoDictionary: function() {
          return {};
        }
      }
    };

    stateProvider
      .state(rootState);
  }

  function configureModule(stateProvider) {
    registerStates(stateProvider);
  }

  app.config(function($stateProvider) {
    configureModule($stateProvider);
  });

})();

