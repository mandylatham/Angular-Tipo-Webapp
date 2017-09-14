(function () {

  'use strict';

  function falseDelay($q, $timeout) {
    var defer = $q.defer();
    $timeout(function () {
      defer.resolve('resolved');
    }, 300);
    return defer.promise;
  }

  function registerStates(stateProvider) {
    var listState = {
      name: 'tipoList',
      url: '/tipo/{tipo_name}?filter&message&tab_url',
      parent: 'layout',
      data: {
        pageTitle: "{{$stateParams.tipo_name}} - List",
      },
      resolve: /*@ngInject*/ {
        delay: function ($q, $timeout) {
          return falseDelay($q, $timeout);
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
      url: '/tipo/{tipo_name}/new?copyFrom&data&message&filter',
      parent: 'layout',
      data: {
        pageTitle: "{{$stateParams.tipo_name}} - Create",
      },
      resolve: /*@ngInject*/ {
        tipo: function (tipoHandle, tipoManipulationService, $stateParams) {
          if ($stateParams.copyFrom) {
            var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
            var filter = {};
            // TODO: Hack - Sushil as this is supposed to work only for applications
            if (perspectiveMetadata.fieldName === 'application') {
              filter.tipo_filter = perspectiveMetadata.tipoFilter;
            }
            filter.transient_fields = 'N';
            return tipoHandle.getTipo($stateParams.tipo_name, $stateParams.copyFrom, filter)
              .then(function (tipo) {
                delete tipo.tipo_id;
                return tipo;
              });
          } else if ($stateParams.data) {
            var tipo = angular.fromJson(decodeURIComponent($stateParams.data));
            return tipo;
          } else {
            return undefined;
          }
        },
        delay: function ($q, $timeout) {
          return falseDelay($q, $timeout);
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-new-root.tpl.html',
          controller: 'TipoEditRootController',
          controllerAs: 'tipoRootController'
        }
      }
    };

    var viewState = {
      name: 'tipoView',
      url: '/tipo/{tipo_name}/{tipo_id}?message&filter',
      parent: 'layout',
      data: {
        pageTitle: "{{$stateParams.tipo_name}} - View",
      },
      resolve: /*@ngInject*/ {
        tipo: function (tipoHandle, tipoManipulationService, parentPromise, $stateParams) {

          var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
          var filter = {};
          // TODO: Hack - Sushil as this is supposed to work only for applications
          if (perspectiveMetadata.fieldName === 'application') {
            filter.tipo_filter = perspectiveMetadata.tipoFilter;
          }

          //Clientside Javascript for OnView 
          var tipo = tipoHandle.getTipo($stateParams.tipo_name, $stateParams.tipo_id, filter).then(function (data) {
            data.tipo_id = data.tipo_id || $stateParams.tipo_id;
            return data;
          });
          $stateParams.perspectiveTipo = tipo;
          return tipo;
        },
      tipoDefinition: function (tipoHandle, tipoManipulationService, tipo, $stateParams) {
          $stateParams.perspectiveTipo = tipo;
          var tipoDefinition = tipoHandle.getTipoDefinition($stateParams.tipo_name).then(function (definition) {
            if (!_.isUndefined(definition)) {
              tipoManipulationService.mergeDefinitionAndData(definition, tipo);
            }
            return definition;
          });
          return tipoDefinition;
        },
        delay: function ($q, $timeout) {
          return falseDelay($q, $timeout);
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-view-root.tpl.html',
          controller: 'TipoEditRootController',
          controllerAs: 'tipoRootController'
        }
      },
      onEnter: /*@ngInject*/ function (tipoDefinition, tipo, $stateParams, $rootScope) {
        var type = tipoDefinition.tipo_meta.tipo_ui_type;
        if (type === 'perspective') {
          $rootScope.perspective = tipoDefinition.tipo_meta.tipo_name + '.' + tipo.tipo_id;
          $stateParams.perspective = tipoDefinition.tipo_meta.tipo_name + '.' + tipo.tipo_id;
        }
      }
    };

    var editState = {
      name: 'tipoEdit',
      url: '/edit?message&filter',
      parent: viewState,
      data: {
        pageTitle: "{{$stateParams.tipo_name}} - Edit",
      },
      resolve: /*@ngInject*/ {
        delay: function ($q, $timeout) {
          return falseDelay($q, $timeout);
        }
      },
      views: {
        'content@layout': {
          templateUrl: 'framework/_views/tipo-edit-root.tpl.html',
          controller: 'TipoEditRootController',
          controllerAs: 'tipoRootController'
        }
      },
      onEnter: /*@ngInject*/ function ($rootScope) {}
    };

    var subTipoListState = {
      name: 'subTipoListState',
      url: '/{related_tipo}?tipo_filter',
      parent: viewState,
      resolve: /*@ngInject*/ {
        subTipos: function (tipoDefinition, tipoInstanceDataService, tipoManipulationService, $stateParams) {

          var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();

          var filter = {};

          if (perspectiveMetadata.tipoFilter) {
            filter.tipo_filter = perspectiveMetadata.tipoFilter;
          }
          if (!_.isUndefined($stateParams.tipo_filter) && !_.isEmpty($stateParams.tipo_filter)){
            var sub_filter = atob($stateParams.tipo_filter);
            if (filter.tipo_filter) {
              filter.tipo_filter += " AND " + tipoManipulationService.expandFilterExpression(sub_filter, tipoDefinition);
            } else {
              filter.tipo_filter = tipoManipulationService.expandFilterExpression(sub_filter, tipoDefinition);
            }
          }
          return tipoInstanceDataService.search($stateParams.related_tipo, filter);
        },
        subTipoDefinition: function (tipoDefinition, tipoDefinitionDataService, tipoManipulationService, $stateParams) {
          return tipoDefinitionDataService.getOne($stateParams.related_tipo);
        },
        delay: function ($q, $timeout) {
          return falseDelay($q, $timeout);
        }
      },
      views: {
        'child': {
          templateUrl: 'framework/_views/sub-tipo-list-root.tpl.html',
          controller: 'SubTipoListRootController',
          controllerAs: 'tipoRootController'
        }
      },
      onEnter: /*@ngInject*/ function ($rootScope) {}
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

  module.run(function ($rootScope,$interval) {
    $rootScope.Date = Date;
    $rootScope._ = window._;
    $interval(function(){
        // nothing is required here, interval triggers digest automaticaly
    },1000)
  })

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();