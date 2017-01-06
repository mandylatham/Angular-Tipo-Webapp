(function() {

  'use strict';
   
  function UserController(
    metadataService,
    tipoRouter,
    tipoResource,
    cognitoService,
    $stateParams,
    $mdToast,
    $scope,
    $rootScope) {

    var _instance = this;

    _instance.inProgress = false;

    var appMetadata = metadataService.applicationMetadata;

    var user = {};
    user.fullName = function(){
      return appMetadata.owner + '.' + appMetadata.application + '.' + _instance.user.email;
    };
    _instance.user = user;

    _instance.toRegistration = function(){
      tipoRouter.to('registration');
    };

    _instance.toLogin = function(){
      tipoRouter.to('login');
    };

    _instance.toForgotPassword = function(){
      tipoRouter.to('forgotPassword');
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
      _instance.inProgress = false;
      delete _instance.lastError;
    });

    function markProgress(){
      _instance.inProgress = true;
      delete _instance.lastError;
    }

    /**
     * Generate account id with range from 1000000000 to 9999999999
     */
    function generateAccountId() {
      var start = 1000000000;
      var end = 9999999999;
      return Math.floor(Math.random() * (end - start + 1)) + start;
    }

    function raiseError(err) {
      console.error(err);
      if ($stateParams.retry) {
        $stateParams.retry.reject();
      }
      if (err && err.errorMessage) {
        _instance.lastError = err.errorMessage;
      } else if (err && err.data && err.data.errorMessage) {
        _instance.lastError = err.data.errorMessage;
      } else if (err && err.message) {
        _instance.lastError = err.message;
      }
      _instance.inProgress = false;
    }

    _instance.signUp = function(attemptCnt) {
      markProgress();
      attemptCnt = attemptCnt || 0;
      var account = '' + generateAccountId();
      cognitoService.signUp(user.fullName(), user.password, user.email, account, user.recaptcha).then(function (result) {
        // Subscribe Trial plan
        var trial = {
          customerEmail: user.email,
          tipouser: user.fullName()
        };
        tipoResource.one('trial-signup').customPOST(trial).then(function(result) {
          // Authenticate
          cognitoService.authenticate(user.fullName(), user.password).then(function() {
            cognitoService.resendCode().then(function() {
              tipoRouter.to('dashboard');
            }, function(err) {
              console.error(err);
              tipoRouter.to('dashboard');
            });
          }, raiseError);
        }, raiseError);
      }, function (err) {
        if (attemptCnt < 3 && err.message && err.message.indexOf('Account already exists') !== -1) {
          _instance.signUp(attemptCnt + 1);
          return;
        }
        raiseError(err);
      });
    };

    _instance.login = function(){
      markProgress();
      cognitoService.authenticate(user.fullName(), user.password).then(function(result){
        if ($stateParams.retry) {
          $stateParams.retry.resolve();
        }
        if (result && result.type === 'PasswordChallenge') {
          // Go to New Password Required page when facing PasswordChallenge
          tipoRouter.to('newPasswordRequired', undefined, { deferredPassword: result.value });
        } else {
          tipoRouter.to('dashboard');
        }
      }, raiseError);
    };

    _instance.onForgotPassword = function(){
      markProgress();
      cognitoService.forgotPassword(user.fullName()).then(function(result){
        _instance.toast = {
          header: 'Check email',
          body: 'An email has been sent containing a link to reset your password'
        };
        _instance.toLogin();
      }, raiseError);
    };

    _instance.resetPassword = function(){
      markProgress();
      user.email = $stateParams.email;
      var code = $stateParams.code;
      cognitoService.resetPassword(user.fullName(), user.newPassword, code).then(function(result){
        _instance.toast = {
          header: 'Password changed',
          body: 'Your password has been changed successfully. Please login using the new password'
        };
        _instance.toLogin();
      }, raiseError);
    };

    _instance.completePasswordChallenge = function(){
      markProgress();
      if ($stateParams.deferredPassword){
        $stateParams.deferredPassword.resolve(user.newPassword);
        _instance.toast = {
          header: 'Password changed',
          body: 'Your password has been changed successfully. Please login using the new password'
        };
        _instance.toLogin();
        return;
      }
      raiseError({ errorMessage: 'You must login first with your temporary credentials before attempting to change your password'});
    };

    $scope.$watch(function(){
      return _instance.toast;
    }, function(newValue, oldValue){
      if(newValue){
        var toast = $mdToast.tpToast();
        toast._options.locals = newValue;
        $mdToast.show(toast);
      }
    });

  }
  angular.module('tipo.user')
  .controller('UserController', UserController);

})();