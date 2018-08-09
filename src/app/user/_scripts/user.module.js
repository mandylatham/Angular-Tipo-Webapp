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
      views: /*@ngInject*/ {
        'content@userBase': {
          templateProvider: function($q,metadataService){
            return metadataService.resolveAppCustomTemplates('registation_template','user/_views/registration.tpl.html');
          }
          // templateUrl: 'user/_views/registration.tpl.html'
        }
      }
    };

    var captureCreditCardState = {
      name: 'captureCreditCard',
      url: '/capture-credit-card',
      parent: baseState,
      views: /*@ngInject*/ {
        'content@userBase': {
          templateProvider: function(metadataService){
            return metadataService.resolveAppCustomTemplates('creditcard_template','user/_views/capture-creditcard.tpl.html');
          }
          // templateUrl: 'user/_views/capture-creditcard.tpl.html'
        }
      }
    };

    var surveyResponseState = {
      name: 'surveyResponse',
      url: '/survey-response',
      parent: baseState,
      views: /*@ngInject*/ {
        'content@userBase': {
          templateProvider: function(metadataService){
            return metadataService.resolveAppCustomTemplates('surveyresponse_template','user/_views/survey-response.tpl.html');
          }
          // templateUrl: 'user/_views/survey-response.tpl.html'
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
      views: /*@ngInject*/ {
        'content@userBase': {
          templateProvider: function(metadataService){
            return metadataService.resolveAppCustomTemplates('login_template','user/_views/login.tpl.html');
          }
          // templateUrl: 'user/_views/login.tpl.html'
        }
      }
    };

    var forgotPasswordState = {
      name: 'forgotPassword',
      url: '/forgot-password',
      parent: baseState,
      views: /*@ngInject*/ {
        'content@userBase': {
          templateProvider: function(metadataService){
            return metadataService.resolveAppCustomTemplates('forgot_password_template','user/_views/forgot-password.tpl.html');
          }
          // templateUrl: 'user/_views/forgot-password.tpl.html'
        }
      }
    };

    var verifyEmailState = {
      name: 'verifyEmail',
      url: '/verify-email',
      parent: baseState,
      views: /*@ngInject*/ {
        'content@userBase': {
          templateProvider: function(metadataService){
            return metadataService.resolveAppCustomTemplates('verify_email_template','user/_views/verify-email.tpl.html');
          }
          // templateUrl: 'user/_views/forgot-password.tpl.html'
        }
      }
    };

    var resetPasswordState = {
      name: 'resetPassword',
      url: '/resetpass?code&email',
      //url: '/reset-password?code&email',
      parent: baseState,
      views: /*@ngInject*/ {
        'content@userBase': {
          templateProvider: function(metadataService){
            return metadataService.resolveAppCustomTemplates('reset_password_template','user/_views/reset-password.tpl.html');
          }
          // templateUrl: 'user/_views/reset-password.tpl.html'
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
      views: /*@ngInject*/ {
        'content@userBase': {
          templateProvider: function(metadataService){
            return metadataService.resolveAppCustomTemplates('new_password_template','user/_views/new-password-required.tpl.html');
          }
          // templateUrl: 'user/_views/new-password-required.tpl.html'
        }
      }
    };

    var userInvitation = {
      name: 'userInvitation',
      url: '/user-invitation',
      parent: baseState,
      views: /*@ngInject*/ {
        'content@userBase': {
          templateProvider: function(metadataService){
            return metadataService.resolveAppCustomTemplates('user_invitation_template','user/_views/user-invitation.tpl.html');
          }
          // templateUrl: 'user/_views/forgot-password.tpl.html'
        }
      }
    };

    $stateProvider
      .state(baseState)
      .state(loginState)
      .state(registrationState)
      .state(surveyResponseState)
      .state(verifyEmailState)
      .state(forgotPasswordState)
      .state(resetPasswordState)
      .state(userInvitation)
      .state(newPasswordRequiredState);
  }

  function configureModule($stateProvider) {
    registerStates($stateProvider);
  }

  var module = angular.module('tipo.user', []);
  module.run(function ($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams) {
      if (['registration', 'login', 'forgotPassword', 'resetPassword', 'newPasswordRequired', 'surveyResponse', 'userInvitation'].indexOf(to.name) != -1) {
        return; // no need to save auxiliary states
      }

      $rootScope.$previousState = to;
      $rootScope.$previousParams = toParams;
    });
  });

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();