(function() {

  'use strict';
   
  function UserController(
    metadataService,
    tipoRouter,
    tipoResource,
    cognitoService,
    tipoCache,
    tipoInstanceDataService,
    tipoManipulationService,
    $state,
    $stateParams,
    $mdToast,
    tipoHandle,
    $scope,
    $rootScope) {

    var _instance = this;

    _instance.inProgress = false;
    $scope.creditCard;
    $scope.cardToken;
    $scope.accountResponse;
    var appMetadata = metadataService.applicationMetadata;
    var appMetadata = _.merge(_.get(appMetadata,"TipoApp"),_.get(appMetadata,"TipoConfiguration"));
    _instance.header_template = metadataService.resolveAppCustomUrls("login_header_template","user/_views/header.tpl.html")
    var user = {};
    var templates = [{template_name: "registation_template", default_template: "user/_views/registration.tpl.html"},
      {template_name: "login_template", default_template: "user/_views/registration.tpl.html"},
      {template_name: "forgot_password_template", default_template: "user/_views/forgot-password.tpl.html"},
      {template_name: "reset_password_template", default_template: "user/_views/reset-password.tpl.html"},
      {template_name: "new_password_template", default_template: "user/_views/new-password-required.tpl.html"}];
    function fetchAllTemplatesAsync(){
      _.each(templates,function(each){
        metadataService.resolveAppCustomTemplates(each.template_name, each.default_template);
      })
    }
    fetchAllTemplatesAsync();
    user.fullName = function(){
      return appMetadata.application_owner_account + '.' + appMetadata.application + '.' + _instance.user.email;
    };
    _instance.user = user;
    _instance.captureAccountNameDuringSignup = appMetadata.capture_account_name_during_signup;

    _instance.toRegistration = function(){
      tipoRouter.to('registration');
    };

    _instance.toLogin = function(){
      tipoRouter.to('login');
    };

    _instance.toForgotPassword = function(){
      tipoRouter.to('forgotPassword');
    };

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
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

    /**
     * Verify account name
     * Account name should be unique, no integers, no spaces allowed.
     */
    function verifyAccountName(accountName) {
      return accountName? /^[a-zA-Z0-9-_]+$/.test(accountName): false;
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

      _instance.initCard = function(){
        $scope.creditCard = tipoManipulationService.initialiseCreditCard(appMetadata.app_subscription.publishable_key);
      }

      _instance.createToken = function(){
        $scope.creditCard.stripe.createToken($scope.creditCard.cardElement).then(function(result) {
          if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
          } else {
            // Send the token to your server
            markProgress();
            createToken(result);
          }
        });
      }

      function createToken(result){
        $scope.cardToken = result.token;
        if($scope.accountResponse) {
          tipoHandle.callAction('TipoSubscriptions','attach_card',['2000000001'],'TipoSubscriptions',{token_source: $scope.cardToken.id, credit_card: $scope.cardToken.card.last4}).then(function(response){
            tipoRouter.to('dashboard');
          });
        } else {
          $scope.$watch(function(scope){
            return scope.accountResponse;
          }, function(newValue, oldValue){
            if(newValue){
              tipoHandle.callAction('TipoSubscriptions','attach_card',['2000000001'],'TipoSubscriptions',{token_source: $scope.cardToken.id, credit_card: $scope.cardToken.card.last4}).then(function(response){
                tipoRouter.to('dashboard');
              });
            }
          });
        }
        
      }

    _instance.signUp = function(attemptCnt) {
      markProgress();
      if (appMetadata.capture_account_name_during_signup && !verifyAccountName(user.accountName)) {
        raiseError({ message: 'Account name has invalid format' });
        return;
      }

      attemptCnt = attemptCnt || 0;
      var account = '' + generateAccountId();
      cognitoService.signUp(user.fullName(), user.password, user.email, account, user.accountName, user.recaptcha).then(function (result) {
        // Subscribe Trial plan
        var trial = {
          customerEmail: user.email,
          tipouser: user.fullName()
        };
        // Authenticate
        var criteria = {bare_event: 'Y',post_event: 'Y'};
        var user_attributes = {first_name: user.first_name, phone_number: user.phone_number};
        var org_attributes = {company_name: user.companyName};
        cognitoService.authenticate(user.fullName(), user.password).then(function() {
          cognitoService.resendCode().then(function() {
            tipoCache.clearMemoryCache();
            tipoInstanceDataService.upsertAll('TipoAccount',[{account:account ,application:appMetadata.application ,tipo_id:account ,account_name:user.accountName ,application_owner_account:appMetadata.application_owner_account ,company_name:user.companyName, org_attributes:org_attributes, user_attributes: user_attributes}],criteria).then(function(res){
              $scope.accountResponse = res;
            },
            function(err){
              raiseError(err);
            });
            // tipoInstanceDataService.upsertAll('TipoUser',[{account:account ,application:appMetadata.application ,tipo_id:user.email ,application_owner_account:appMetadata.application_owner_account,role: "Admin" }],criteria).then(function(res){
            // },
            // function(err){
            //   raiseError(err);
            // });
            if(appMetadata.app_subscription.capture_credit_card) {
              tipoRouter.to('captureCreditCard');
            } else {
              tipoRouter.to('dashboard');
            }
          }, function(err) {
            console.error(err);
            tipoRouter.to('dashboard');
          });
        }, raiseError);
      }, function (err) {
        if (err.message && err.message.indexOf('PreSignUp failed with error') === 0) {
          return raiseError({ message: err.message.substring('PreSignUp failed with error'.length) });
        }
        raiseError(err);
      });
    };

    _instance.login = function(username, password){
      markProgress();
      username = username || user.fullName();
      password = password || user.password;
      cognitoService.authenticate(username, password).then(function(result){
        if ($stateParams.retry) {
          $stateParams.retry.resolve();
        }
        if (result && result.type === 'PasswordChallenge') {
          // Go to New Password Required page when facing PasswordChallenge
          tipoRouter.to('newPasswordRequired', undefined, { deferredPassword: result.value });
        } else {
          tipoCache.clearMemoryCache();
          _instance.gotoPreviousView();
        }
      }, function(err) {
        if (appMetadata.application !== '1000000001' && err.message && err.message.indexOf('User does not exist') !== -1) {
          username = '2000000001.1000000001.' + _instance.user.email;
          return _instance.developerlogin(username, password);
        }
        raiseError(err);
      });
    };

    _instance.developerlogin = function(username, password){
      markProgress();
      cognitoService.authenticate(username, password).then(function(result){
        if ($stateParams.retry) {
          $stateParams.retry.resolve();
        }
        if (result && result.type === 'PasswordChallenge') {
          // Go to New Password Required page when facing PasswordChallenge
          tipoRouter.to('newPasswordRequired', undefined, { deferredPassword: result.value });
        } else {
          tipoCache.clearMemoryCache();
          _instance.gotoPreviousView();
        }
      }, function(err) {
        raiseError(err);
      });
    };

    _instance.onForgotPassword = function(){
      markProgress();
      cognitoService.forgotPassword(user.fullName()).then(function(result){
        _instance.toast = {
          header: 'Check email',
          body: 'We sent an email to ' + _instance.user.email + ', which contains a link to reset your password.'
        };
        _instance.toLogin();
      }, function(err) {
        if (err && err.message && err.message.indexOf('no registered/verified email') != -1) {
          _instance.toast = {
            header: 'Email is not verified',
            body: 'Please confirm your email ' + _instance.user.email
          };
          return raiseError({message: 'Please confirm your email ' + _instance.user.email});
        }
        raiseError(err);
      });
    };

    _instance.resetPassword = function(){
      markProgress();
      user.email = $stateParams.email;
      var code = $stateParams.code;
      cognitoService.resetPassword(user.fullName(), user.newPassword, code).then(function(result){
        _instance.toast = {
          header: 'Password changed',
          body: 'Your Password has been successfully reset. Sign in to your account.'
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

    _instance.gotoPreviousView = function() {
      if ($rootScope.$previousState && (typeof $rootScope.$previousState.abstract === 'undefined' || $rootScope.$previousState.abstract === false)) {
        $state.go($rootScope.$previousState, $rootScope.$previousParams);
      } else {
        $state.go('dashboard');
      }
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