(function() {

  'use strict';

  function registerStates($stateProvider) {
    var registerUserState = {
      name: 'registerUser',
      url: '/register',
      parent: 'layout',
      views: {
        'content@layout': {
          templateUrl: 'user/_views/registration.tpl.html',
          controller: 'UserController',
          controllerAs: 'userController'
        }
      }
    };

    var confirmRegistrationState = {
      name: 'confirmRegistration',
      url: '/confirmation/{confirmationCode}',
      parent: 'layout',
      views: {
        'content@layout': {
          templateUrl: 'user/_views/confirmation.tpl.html',
          controller: 'UserController',
          controllerAs: 'userController'
        }
      }
    };

    var loginState = {
      name: 'login',
      url: '/login',
      parent: 'layout',
      params: {
        'retry': null
      },
      views: {
        'content@layout': {
          templateUrl: 'user/_views/login2.tpl.html',
          controller: 'UserController',
          controllerAs: 'userController'
        }
      }
    };

    $stateProvider
      .state(registerUserState)
      .state(loginState)
      .state(confirmRegistrationState);  
  }

  function configureModule($stateProvider) {
    registerStates($stateProvider);
  }

  var module = angular.module('tipo.user', []);
  module.run(function ($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.$previousState = from;
        $rootScope.$previousParams = fromParams;
    });
  });

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();