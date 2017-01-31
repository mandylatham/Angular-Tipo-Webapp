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
      url: '?perspective',
      parent: 'root',
      resolve: /*@ngInject*/
      {
        userMetadata: function(metadataService){
          return metadataService.loadUserMetadata();
        },
        mainMenuDefinitions: function(tipoDefinitionDataService, userMetadata) {
          return tipoDefinitionDataService.search('tipo_meta.main_menu=true');
        },
        settingsDefinitions: function(tipoDefinitionDataService, userMetadata) {
          return tipoDefinitionDataService.search('tipo_meta.tipo_ui_type=settings');
        },
        parentPromise: function(tipoDefinitionDataService, tipoManipulationService, userMetadata, $stateParams, $rootScope){
          var perspective = parsePerspective($stateParams.perspective);
          if(perspective.tipoName){
            $rootScope.perspective = $stateParams.perspective;
            return tipoDefinitionDataService.getOne(perspective.tipoName).then(function(){
              return tipoManipulationService.resolvePerspectiveMetadata();
            });
          }else if(perspective.name){
            $rootScope.perspective = perspective.name;
          }
          return undefined;
        }
      },
      controller: /*@ngInject*/ function(mainMenuDefinitions, settingsDefinitions, $scope, $rootScope){
        var perspectives = {};
        perspectives.home = {
          definitions: mainMenuDefinitions
        };
        perspectives.settings = {
          definitions: settingsDefinitions
        };
        $rootScope.perspectives = perspectives;
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