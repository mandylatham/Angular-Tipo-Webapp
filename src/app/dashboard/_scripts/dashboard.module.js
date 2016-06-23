(function() {

  'use strict';

  function registerStates(stateProvider) {
    var homeState = {
      name: 'dashboard',
      url: '/home',
      parent: 'layout',
      views: {
        'content@layout': {
          templateUrl: 'dashboard/_views/dashboard.tpl.html'
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