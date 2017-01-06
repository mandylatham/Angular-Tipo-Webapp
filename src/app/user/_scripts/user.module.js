(function() {

  'use strict';

  function registerStates($stateProvider) {

    var baseState = {
      name: 'userBase',
      abstract: true,
      parent: 'root',
      templateUrl: 'user/_views/user-base.tpl.html'
    };

    var registrationState = {
      name: 'registration',
      url: '/register',
      parent: baseState,
      views: {
        'content@userBase': {
          templateUrl: 'user/_views/registration.tpl.html'
        }
      }
    };

    var loginState = {
      name: 'login',
      url: '/login?plan',
      parent: baseState,
      params: {
        'retry': null
      },
      views: {
        'content@userBase': {
          templateUrl: 'user/_views/login.tpl.html'
        }
      }
    };

    var forgotPasswordState = {
      name: 'forgotPassword',
      url: '/forgot-password',
      parent: baseState,
      views: {
        'content@userBase': {
          templateUrl: 'user/_views/forgot-password.tpl.html'
        }
      }
    };

    var resetPasswordState = {
      name: 'resetPassword',
      url: '/resetpass?code&email',
      //url: '/reset-password?code&email',
      parent: baseState,
      views: {
        'content@userBase': {
          templateUrl: 'user/_views/reset-password.tpl.html'
        }
      }
    };

    var newPasswordRequiredState = {
      name: 'newPasswordRequired',
      url: '/new-password-required',
      params: {
        'deferredPassword': null
      },
      parent: baseState,
      views: {
        'content@userBase': {
          templateUrl: 'user/_views/new-password-required.tpl.html'
        }
      }
    };

    $stateProvider
      .state(baseState)
      .state(loginState)
      .state(registrationState)
      .state(forgotPasswordState)
      .state(resetPasswordState)
      .state(newPasswordRequiredState);
  }

  function configureModule($stateProvider) {
    registerStates($stateProvider);
  }

  var module = angular.module('tipo.user', []);

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();