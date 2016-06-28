(function() {

  'use strict';

  function registerStates(stateProvider) {
    var listState = {
      name: 'tipoList',
      url: '/tipo/{tipo_name}',
      parent: 'layout',
      resolve: /*@ngInject*/
      {
        tipoDefinition: function(tipoDefinitions, tipoRegistry, tipoManipulationService, $stateParams) {
          var tipoDefinition = tipoRegistry.get($stateParams.tipo_name);
          // expand the field hierarchy for the tipo
          var expandedDefinition = tipoManipulationService.expandFieldHierarchy(tipoDefinition);
          return expandedDefinition;
        },
        tipos: function(tipoDefinition, tipoInstanceDataService, $stateParams){
          return tipoInstanceDataService.getAll($stateParams.tipo_name);
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-list.tpl.html',
          controller: 'TipoListRootController',
          controllerAs: 'tipoRootController'
        }
      }
    };

    var createState = {
      name: 'tipoCreate',
      url: '/tipo/{tipo_name}/new',
      parent: 'layout',
      resolve: /*@ngInject*/
      {
        tipoDefinition: function(tipoDefinitions, tipoRegistry, tipoManipulationService, $stateParams) {
          var tipoDefinition = tipoRegistry.get($stateParams.tipo_name);
          // expand the field hierarchy for the tipo
          var expandedDefinition = tipoManipulationService.expandFieldHierarchy(tipoDefinition);
          return expandedDefinition;
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-new.tpl.html',
          controller: 'TipoCreateRootController',
          controllerAs: 'tipoRootController'
        }
      }
    };

    var viewState = {
      name: 'tipoView',
      url: '/tipo/{tipo_name}/{tipo_id}',
      parent: 'layout',
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-view.tpl.html'
        }
      }
    };

    var editState = {
      name: 'tipoEdit',
      url: '/edit',
      parent: viewState,
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-edit.tpl.html'
        }
      }
    };

    stateProvider
      .state(listState)
      .state(createState)
      .state(viewState)
      .state(editState);
  }

  function configureModule(stateProvider) {
    registerStates(stateProvider);
  }

  var module = angular.module('tipo.framework', [
    'tipo.common'
  ]);

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();