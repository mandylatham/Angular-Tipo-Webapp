(function() {

  'use strict';

  function registerUrlRedirects(urlRouterProvider) {
    // Blank or Invalid URL redirect to /login
    var loginUrl = '/login';
    urlRouterProvider.when('', loginUrl);
    urlRouterProvider.otherwise(loginUrl);
  }

  function registerStates(stateProvider) {
    var layoutState = {
      name: 'layout',
      abstract: true,
      parent: 'root',
      resolve: /*@ngInject*/
      {
        tipoDictionary: function() {
          return {};
        }
      },
      controller: /*@ngInject*/ function(tipoDictionary, $scope){
        $scope.$emit('userLoggedInEvent');
      },
      templateUrl: 'layout/_views/layout.tpl.html'
    };

    stateProvider
      .state(layoutState);
  }

  function configureModule(stateProvider, urlRouterProvider) {
    registerUrlRedirects(urlRouterProvider);
    registerStates(stateProvider);
  }

  // Declaration for the Layout Module
  var module = angular.module('tipo.layout', []);

  module.config(function ($stateProvider, $urlRouterProvider) {
    configureModule($stateProvider, $urlRouterProvider);
  });

})();