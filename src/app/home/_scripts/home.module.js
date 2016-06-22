(function() {

  'use strict';

  function registerStates(stateProvider) {
    var homeState = {
      name: 'home',
      url: '/home',
      parent: 'layout',
      views: {
        'content@layout': {
          templateUrl: 'home/_views/home.tpl.html'
        }
      }
    };

    stateProvider
      .state(homeState);
  }

  function configureModule(stateProvider) {
    registerStates(stateProvider);
  }

  var module = angular.module('tipo.home', [
  ]);

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();