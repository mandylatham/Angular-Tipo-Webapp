(function() {

  'use strict';

  function registerStates(stateProvider) {
    // Root State
    var rootState = {
      name: 'root',
      abstract: true,
      controller: 'MainController',
      controllerAs: 'main',
      template: '<div data-ui-view></div>'
    };

    stateProvider
      .state(rootState);
  }

  function configureModule(stateProvider) {
    registerStates(stateProvider);
  }

  // Declaration for the Tipo UI main module. This will be used as the 'ng-app' for the entire application
  var module = angular.module('tipo.main', [
    'tipo.partials',
    'tipo.common',
    'tipo.layout',
    'tipo.framework',
    'tipo.dashboard'
  ]);

  module.config(function($stateProvider) {
    configureModule($stateProvider);
  });

})();

