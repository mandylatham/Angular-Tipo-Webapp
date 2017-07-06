(function() {

  'use strict';

  function registerUrlRedirects(urlRouterProvider) {

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
      url: '?perspective&mobile_auth&openSidenav',
      parent: 'root',
      resolve: /*@ngInject*/
      {
        userMetadata: function(metadataService, $stateParams, securityContextService){
          if ($stateParams.mobile_auth) {
            var auth = decodeURIComponent($stateParams.mobile_auth);
            var authArray = auth.split(';');
            securityContextService.saveContext({
              'tokenDetails.id_token': authArray[2],
              'tokenDetails.access_token': authArray[1],
              'loggedInUser': authArray[0]
            });
          };
          return metadataService.loadUserMetadata();
        },
        parentPromise: function(tipoDefinitionDataService, tipoManipulationService, userMetadata, $stateParams, $rootScope){
          var perspective = $stateParams.perspective || 'Home';
          var tipo = perspective.split('.')[0];
          return tipoDefinitionDataService.getOne(tipo).then(function(){
            $rootScope.perspective = perspective;
            return tipoManipulationService.resolvePerspectiveMetadata(perspective);
          });
        }
      },
      controller: /*@ngInject*/ function($scope, $rootScope){
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