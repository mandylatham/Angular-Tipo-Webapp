(function() {

  'use strict';
   
  function UserController(
    $rootScope,
    $scope,
    $location,
    $window,
    $state,
    $stateParams,
    tipoResource,
    cognitoService) {

    var loginInProgress = false;
    var registrationInProgress = false;
    var confirmationInProgress = false;
    var forgotPassInProgress = false;
    var resetPassInProgress = false;
    
    $scope.lastError = null;
    
    function signUp(user) {
      if (!registrationInProgress) {
        registrationInProgress = true;
        $scope.lastError = null;
        var params = {
          type: 'application',
          url: $window.location.origin
        };
        tipoResource.one('subscription').customGET('', params).then(function(appData) {
          cognitoSignUp(user, appData, 0); 
        }, function(err) {
          registrationInProgress = false;
          printErrorMessage(err);
        });
      }
    }

    function cognitoSignUp(user, appData, attemptCnt) {
      var username = appData.owner + '.' + appData.application + '.' + user.email;
      var account = '' + generateAccountId();
      cognitoService.signUp(username, user.password, user.email, account, user.recaptcha).then(function (result) {
        // Subscribe Trial plan
        var body = {
          customerEmail: user.email,
          tipouser: appData.owner + '.' + appData.application + '.' + user.email
        };
        tipoResource.one('trial-signup').customPOST(body).then(function(result) {
          // Authenticate
          cognitoService.authenticate(username, user.password).then(function() {
            cognitoService.resendCode().then(function() {
              $state.go('dashboard');
              registrationInProgress = false;
            }, function(err) {
              console.error(err);
              $state.go('dashboard');
              registrationInProgress = false;
            });
          }, function(err) {
            registrationInProgress = false;
            printErrorMessage(err);  
          });
        }, function(err) {
          registrationInProgress = false;
          printErrorMessage(err);
        });
      }, function (err) {
        if (attemptCnt < 3 && err.message && err.message.indexOf('Account already exists') !== -1) {
          cognitoSignUp(user, appData, attemptCnt + 1);
          return;
        }
        registrationInProgress = false;
        printErrorMessage(err);
      });
    }

    function initLogin() {
      tipoResource.one('subscription').customGET('', { type: 'application', url: $window.location.origin }).then(function(appData) {
        $scope.displayName = appData.displayName;
      });
    }
    
    function initConfirmation() {
      var params = $location.search();
      params = _.mapKeys(params, function(value, key) {
        if(key.startsWith('amp;')){
          return key.substring(4);
        } else {
          return key;
        }
      });
      console.log('Query params: ', params);
      $scope.customerName = params.customer_name;
      $scope.subscriptionId = params.subscription_id;
      $scope.username = params.email;
      tipoResource.one('subscription').customGET('', { type: 'application', url: $window.location.origin }).then(function(appData) {
        $scope.displayName = appData.displayName;
      });
    }

    /**
     * Confirm user registration
     */
    function confirmRegistration(email, confirmationCode) {
      if (!confirmationInProgress) {
        confirmationInProgress = true;

        var params = {
          type: 'application',
          url: $window.location.origin
        };
        tipoResource.one('subscription').customGET('', params).then(function(appData) {
          var username = appData.owner + '.' + appData.application + '.' + email;

          var promise = cognitoService.confirmRegistration(username, confirmationCode);
          promise.then(function (result) {

            // Go to login after successful registration
            // https://github.com/aws/amazon-cognito-identity-js/issues/186
            $state.go('login');
            confirmationInProgress = false;
          }, function (err) {
            
            confirmationInProgress = false;
            printErrorMessage(err);
          });
        }, function(err) {
          confirmationInProgress = false;
          printErrorMessage(err);
        });
      }
    }

    /**
     * Login user
     */
    function login(email, password) {
      if (!loginInProgress) {
        loginInProgress = true;
        $scope.lastError = null;

        var params = {
          type: 'application',
          url: $window.location.origin
        };
        tipoResource.one('subscription').customGET('', params).then(function(appData) {
          var username = appData.owner + '.' + appData.application + '.' + email;
          cognitoService.authenticate(username, password).then(function(result) {
            
            gotoPreviousView();
            if ($stateParams.retry) {
              $stateParams.retry.resolve();
            }
            $state.go('dashboard');
            loginInProgress = false;
          }, function (err) {
            
            if ($stateParams.retry) {
              $stateParams.retry.reject();
            }
            loginInProgress = false;
            printErrorMessage(err);
          });
        }, function(err) {
          loginInProgress = false;
          printErrorMessage(err);
        });
      }
    }

    /**
     * Forgot Password
     */
    function forgotPassword(email) {
      if (!forgotPassInProgress) {
        forgotPassInProgress = true;
        $scope.lastError = null;

        var params = {
          type: 'application',
          url: $window.location.origin
        };
        tipoResource.one('subscription').customGET('', params).then(function(appData) {
          var username = appData.owner + '.' + appData.application + '.' + email;
          cognitoService.forgotPassword(username).then(function(result) {
            $state.go('forgotPassInfo');
            forgotPassInProgress = false;
          }, function (err) {
            forgotPassInProgress = false;
            printErrorMessage(err);
          });
        }, function(err) {
          forgotPassInProgress = false;
          printErrorMessage(err);
        });
      }
    }

    /**
     * Reset Password
     */
    function resetPassword(newPassword) {
      if (!resetPassInProgress) {
        resetPassInProgress = true;
        $scope.lastError = null;

        var params = $location.search();
        if (params.code && params.email) {
          tipoResource.one('subscription').customGET('', { type: 'application', url: $window.location.origin }).then(function(appData) {
            var username = appData.owner + '.' + appData.application + '.' + params.email;
            cognitoService.resetPassword(username, newPassword, params.code).then(function(result) {
              $state.go('login');
              resetPassInProgress = false;
            }, function (err) {
              resetPassInProgress = false;
              printErrorMessage(err);
            });
          }, function(err) {
            resetPassInProgress = false;
            printErrorMessage(err);
          });
        } else {
          $scope.lastError = 'Missing verification code or email';
          resetPassInProgress = false;
        }
      }
    }

    function gotoPreviousView() {
      if ($rootScope.$previousState.abstract === true) {
        $state.go('dashboard');
      } else {
        $state.go($rootScope.$previousState, $rootScope.$previousParams);
      }
    }

    function printErrorMessage(err) {
      console.error(err); 
      if (err && err.errorMessage) {
        $scope.lastError = err.errorMessage;
      } else if (err && err.data && err.data.errorMessage) {
        $scope.lastError = err.data.errorMessage;
      } else if (err && err.message) {
        $scope.lastError = err.message;
      }
    }

    function isLoginInProgress() {
      return loginInProgress;
    }

    function isRegistrationInProgress() {
      return registrationInProgress;
    }

    function isConfirmationInProgress() {
      return confirmationInProgress;
    }

    function isForgotPassInProgress() {
      return forgotPassInProgress;
    }

    function isResetPassInProgress() {
      return resetPassInProgress;
    }

    /**
     * Generate account id with range from 1000000000 to 9999999999
     */
    function generateAccountId() {
        var start = 1000000000;
        var end = 9999999999;
        return Math.floor(Math.random() * (end - start + 1)) + start;
    }

    return {
      signUp: signUp,
      initLogin: initLogin,
      initConfirmation: initConfirmation,
      confirmRegistration: confirmRegistration,
      login: login,
      forgotPassword: forgotPassword,
      resetPassword: resetPassword,
      loginInProgress: isLoginInProgress,
      registrationInProgress: isRegistrationInProgress,
      confirmationInProgress: isConfirmationInProgress,
      forgotPassInProgress: isForgotPassInProgress,
      resetPassInProgress: isResetPassInProgress
    };
  }
  angular.module('tipo.user')
  .controller('UserController', UserController);

})();