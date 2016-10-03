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
          return tipoRegistry.get($stateParams.tipo_name);
        },
        tipos: function(tipoDefinition, tipoInstanceDataService, $stateParams){
          return tipoInstanceDataService.search($stateParams.tipo_name);
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-list-root.tpl.html',
          controller: 'TipoListRootController',
          controllerAs: 'tipoRootController'
        }
      }
    };

    var createState = {
      name: 'tipoCreate',
      url: '/tipo/{tipo_name}/new?copyFrom',
      parent: 'layout',
      resolve: /*@ngInject*/
      {
        tipo: function(tipoInstanceDataService, $stateParams){
          if($stateParams.copyFrom){
            return tipoInstanceDataService.getOne($stateParams.tipo_name, $stateParams.copyFrom)
            .then(function(tipo){
              delete tipo.tipo_id;
              return tipo;
            });
          }else{
            return undefined;
          }
        },
        tipoDefinition: function(tipoDefinitions, tipoRegistry, tipoManipulationService, tipo, $stateParams) {
          var tipoDefinition = tipoRegistry.get($stateParams.tipo_name);
          if(!_.isUndefined(tipo)){
            tipoManipulationService.mergeDefinitionAndData(tipoDefinition, tipo);
          }
          return tipoDefinition;
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-new-root.tpl.html',
          controller: 'TipoCreateRootController',
          controllerAs: 'tipoRootController'
        }
      }
    };

    var viewState = {
      name: 'tipoView',
      url: '/tipo/{tipo_name}/{tipo_id}',
      parent: 'layout',
      resolve: /*@ngInject*/
      {
        tipo: function(tipoInstanceDataService, $stateParams){
          var tipo = tipoInstanceDataService.getOne($stateParams.tipo_name, $stateParams.tipo_id);
          return tipo;
        },
        tipoDefinition: function(tipoDefinitions, tipoRegistry, tipoManipulationService, tipo, $stateParams) {
          var tipoDefinition = tipoRegistry.get($stateParams.tipo_name);
          tipoManipulationService.mergeDefinitionAndData(tipoDefinition, tipo);
          return tipoDefinition;
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-view-root.tpl.html',
          controller: 'TipoViewRootController',
          controllerAs: 'tipoRootController'
        }
      }
    };

    var editState = {
      name: 'tipoEdit',
      url: '/edit',
      parent: viewState,
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-edit-root.tpl.html',
          controller: 'TipoEditRootController',
          controllerAs: 'tipoRootController'
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