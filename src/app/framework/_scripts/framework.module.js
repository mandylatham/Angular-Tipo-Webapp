(function() {

  'use strict';

  function registerStates(stateProvider) {
    var listState = {
      name: 'tipoList',
      url: '/tipo/{tipo_name}?filter',
      parent: 'layout',
      resolve: /*@ngInject*/
      {
        tipoDefinition: function(tipoDefinitions, tipoRegistry, tipoManipulationService, $stateParams) {
          return tipoRegistry.get($stateParams.tipo_name);
        },
        tipos: function(tipoDefinition, tipoInstanceDataService, tipoManipulationService, $stateParams){
          var filter = {};
          if($stateParams.filter){
            filter.tipo_filter = tipoManipulationService.expandFilterExpression($stateParams.filter);
          }
          return tipoInstanceDataService.search($stateParams.tipo_name, filter);
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
      url: '/tipo/{tipo_name}/new?copyFrom&data',
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
          }else if($stateParams.data){
            var tipo = angular.fromJson(decodeURIComponent($stateParams.data));
            return tipo;
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

    var subTipoListState = {
      name: 'subTipoListState',
      url: '/{sub_tipo_field_name}',
      parent: viewState,
      resolve: /*@ngInject*/
      {
        subTipos: function(tipoDefinition, tipoInstanceDataService, tipoManipulationService, $stateParams){
          var subTipoFieldName = $stateParams.sub_tipo_field_name;
          var subTipoField = _.find(tipoDefinition.tipo_fields, {field_name: subTipoFieldName});
          var searchCriteria = {};
          if(subTipoField.relationship_filter){
            var filter = tipoManipulationService.expandFilterExpression(subTipoField.relationship_filter, tipoDefinition);
            searchCriteria.tipo_filter = filter;
          }
          return tipoInstanceDataService.search(subTipoField._ui.relatedTipo, searchCriteria);
        },
        subTipoDefinition: function(tipoDefinition, tipoRegistry, tipoManipulationService, $stateParams) {
          var subTipoFieldName = $stateParams.sub_tipo_field_name;
          var subTipoField = _.find(tipoDefinition.tipo_fields, {field_name: subTipoFieldName});
          return tipoRegistry.get(subTipoField._ui.relatedTipo);
        },
      },
      views: {
        'child': {
          templateUrl: 'framework/_views/sub-tipo-list-root.tpl.html',
          controller: 'SubTipoListRootController',
          controllerAs: 'tipoRootController'
        }
      }
    };

    stateProvider
      .state(listState)
      .state(createState)
      .state(viewState)
      .state(editState)
      .state(subTipoListState);
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