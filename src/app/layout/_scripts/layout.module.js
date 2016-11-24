(function() {

  'use strict';

  function registerUrlRedirects(urlRouterProvider) {
    // Blank or Invalid URL redirect to /login
    //var loginUrl = '/login';
    //urlRouterProvider.when('', loginUrl);
    //urlRouterProvider.otherwise(loginUrl);

    urlRouterProvider.when('', '/login');
    urlRouterProvider.otherwise('/login');
  }

  function registerStates(stateProvider) {
    var layoutState = {
      name: 'layout',
      abstract: true,
      parent: 'root',
      resolve: /*@ngInject*/
      {
        mainMenuDefinitions: function(tipoDefinitionDataService) {
          return tipoDefinitionDataService.search('tipo_meta.main_menu=true');
        },
        settingsDefinitions: function(tipoDefinitionDataService) {
          return tipoDefinitionDataService.search('tipo_meta.tipo_ui_type=settings');
        }
      },
      controller: /*@ngInject*/ function(mainMenuDefinitions, settingsDefinitions, $scope, $rootScope){
        var perspectives = {};
        perspectives.home = {
          root: 'dashboard',
          definitions: mainMenuDefinitions
        };
        perspectives.settings = {
          root: 'settings',
          definitions: settingsDefinitions
        };
        $rootScope.perspectives = perspectives;
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