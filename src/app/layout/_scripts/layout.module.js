(function() {

  'use strict';

  function registerUrlRedirects(urlRouterProvider) {
    // urlRouterProvider.when('', '/dashboard');
    // urlRouterProvider.when('/', '/dashboard');
    // urlRouterProvider.otherwise('/dashboard');
    urlRouterProvider.when('', '/login');
    urlRouterProvider.otherwise('/login');
  }

  function parsePerspective(perspective){
    if(_.isUndefined(perspective)){
      return {
        name: 'home'
      };
    }
    if(perspective && S(perspective).startsWith('tipo.')){
      var parts = perspective.split('.');
      var tipoName = parts[1];
      var tipoId = parts[2];
      return {
        tipoName: tipoName,
        tipoId: tipoId
      };
    }
    return {
      name: perspective
    };
  }

  function registerStates(stateProvider) {
    var layoutState = {
      name: 'layout',
      abstract: true,
      url: '?perspective&mobile_auth&hideheader',
      parent: 'root',
      resolve: /*@ngInject*/
      {
        userMetadata: function(metadataService, $stateParams, securityContextService, $rootScope,$q){
          if ($stateParams.mobile_auth) {
            var auth = decodeURIComponent($stateParams.mobile_auth);
            var authArray = auth.split(';');
            securityContextService.saveContext({
              'tokenDetails.id_token': authArray[2],
              'tokenDetails.access_token': authArray[1],
              'loggedInUser': authArray[0]
            });
          };
          if (!$rootScope.readonly) {
            return metadataService.loadUserMetadata();
          }else{
            return $q.when({});
          }
        },
        parentPromise: function(tipoDefinitionDataService, tipoManipulationService, userMetadata, $stateParams, $rootScope,$q){
          var perspective = $stateParams.perspective || 'Home';
          var tipo = perspective.split('.')[0];
          if (!$rootScope.readonly) {
            return tipoDefinitionDataService.getOne(tipo).then(function(){
              $rootScope.perspective = perspective;
              return tipoManipulationService.resolvePerspectiveMetadata(perspective);
            });
          }else{
            var promise = tipoManipulationService.resolvePerspectiveMetadata(perspective);
            return $q.when(promise);
          }
        }
      },
      controller: /*@ngInject*/ function($scope, $rootScope,tipoHandle,$templateCache,$http){
        function loadAsyncData(){
          var filter = {};
          filter.tipo_filter = "(tipo_meta.pre_load: true)";
          var templates = ["updateUrl","createUrl","detailUrl","listUrl"];
          // var config = {headers:  {
          //                   'Pragma': 'no-cache',
          //                 }
          //             };
          tipoHandle.getTipos("TipoDefinition",filter).then(function(tipos){
            _.each(tipos,function(tipo){
              _.each(templates,function(template){
                var url = tipoHandle[template](tipo.tipo_id);
                $templateCache.put(url,$http.get(url));
              })
            })
          });
          $rootScope.asyncSuccess = true;
        }
        if (!$rootScope.asyncSuccess) {
          loadAsyncData();
        };
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