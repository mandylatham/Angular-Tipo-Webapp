(function() {

  'use strict';

  function registerStates(stateProvider) {
    // Root State
    var rootState = {
      name: 'root',
      abstract: true,
      controller: 'MainController',
      controllerAs: 'main',
      template: '<div data-ui-view></div>',
      resolve: /*@ngInject*/
      {
        applicationMetadata: function(metadataService) {
          if(metadataService.applicationMetadata){
            console.warn('The root state is getting initialized again. This normally indicates an unintentional reloading of the entire state hierarchy in the application');
          }
          return metadataService.loadAppMetadata().then(function(metadata){
            return metadata;
          });
        }
      }
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
    'tipo.user',
    'tipo.layout',
    'tipo.framework',
    'tipo.dashboard',
    'tipo.tipoapp',
    'tipo.custom',
    'tipo.custom.gen'
  ]);

  module.config(function($stateProvider) {
    configureModule($stateProvider);
  });

})();

