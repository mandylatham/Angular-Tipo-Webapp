(function() {

  'use strict';

  function registerStates(stateProvider) {
    var listState = {
      name: 'settings',
      url: '/settings',
      parent: 'layout',
      views: {
        'content@layout': {
          templateUrl: 'settings/_views/home.tpl.html'
        }
      },
      onEnter: /*@ngInject*/
      function($rootScope){
        $rootScope.perspective  = 'settings';
      }
    };

    var viewState = {
      name: 'settingsView',
      url: '/settings/{tipo_name}',
      parent: 'layout',
      resolve: /*@ngInject*/
      {
        tipo: function(tipoInstanceDataService, $stateParams){
          var tipo = tipoInstanceDataService.getOne($stateParams.tipo_name, 'default');
          return tipo;
        },
        tipoDefinition: function(tipoDefinitionDataService, tipoManipulationService, tipo, $stateParams) {
          var tipoDefinition = tipoDefinitionDataService.getOne($stateParams.tipo_name).then(function(definition){
            if(!_.isUndefined(tipo)){
              tipoManipulationService.mergeDefinitionAndData(definition, tipo);
            }
            return definition;
          });
          return tipoDefinition;
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'settings/_views/view-root.tpl.html',
          controller: 'TipoViewRootController',
          controllerAs: 'tipoRootController'
        }
      },
      onEnter: /*@ngInject*/
      function($rootScope){
        $rootScope.perspective  = 'settings';
      }
    };

    var editState = {
      name: 'settingsEdit',
      url: '/edit',
      parent: viewState,
      views: {
        'content@layout': {
          templateUrl: 'settings/_views/edit-root.tpl.html',
          controller: 'TipoEditRootController',
          controllerAs: 'tipoRootController'
        }
      },
      onEnter: /*@ngInject*/
      function($rootScope){
        $rootScope.perspective  = 'settings';
      }
    };

    stateProvider
      .state(listState)
      .state(viewState)
      .state(editState);
  }

  function configureModule(stateProvider) {
    registerStates(stateProvider);
  }

  var module = angular.module('tipo.settings', [
    'tipo.common'
  ]);

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();