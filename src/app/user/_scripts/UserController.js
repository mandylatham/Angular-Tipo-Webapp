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
    
    $scope.lastError = null;
    
    function signUp(user) {
      console.log('recaptcha: ' + user.recaptcha);
      if (!registrationInProgress) {
        registrationInProgress = true;
        var params = {
          type: 'application',
          url: $window.location.origin
        };
        tipoResource.one('subscription').customGET('', params).then(function(appResult) {

          var params = {
            type: 'account',
            application: appResult.application, 
            account: user.account
          };
          tipoResource.one('subscription').customGET('', params).then(function(account) {
            if (account) {
              $scope.lastError = 'Account ' + user.account + ' already exists';
              registrationInProgress = false;
            } else {
              var username = appResult.owner + '.' + appResult.application + '.' + user.email;
              var promise = cognitoService.signUp(username, user.password, user.email, user.account, user.recaptcha);
              promise.then(function (result) {
                var params = {
                  type: 'account',
                  application: appResult.application, 
                  account: user.account,
                  owner: appResult.owner,
                  email: user.email
                };
                tipoResource.one('subscription').customPUT('', '', params).then(function(created) {
                  // Subscribe Trial plan
                  var body = {
                    customerEmail: user.email,
                    tipouser: appResult.owner + '.' + appResult.application + '.' + user.email
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
                  registrationInProgress = false;
                  printErrorMessage(err);
                });
              }, function(err) {
                registrationInProgress = false;
                printErrorMessage(err);
              });
            }
          }, function(err) {
            registrationInProgress = false;
            printErrorMessage(err);
          });
        }, function(err) {
          registrationInProgress = false;
          printErrorMessage(err);
        });
      }
    }

    function initLogin() {
      tipoResource.one('subscription').customGET('', { type: 'application', url: $window.location.origin }).then(function(appResult) {
        $scope.displayName = appResult.displayName;
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
      tipoResource.one('subscription').customGET('', { type: 'application', url: $window.location.origin }).then(function(appResult) {
        $scope.displayName = appResult.displayName;
      });
    }

    function confirmRegistration(email, confirmationCode) {
      if (!confirmationInProgress) {
        confirmationInProgress = true;

        var params = {
          type: 'application',
          url: $window.location.origin
        };
        tipoResource.one('subscription').customGET('', params).then(function(appResult) {
          var username = appResult.owner + '.' + appResult.application + '.' + email;

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

    function login(email, password) {
      if (!loginInProgress) {
        loginInProgress = true;

        var params = {
          type: 'application',
          url: $window.location.origin
        };
        tipoResource.one('subscription').customGET('', params).then(function(appResult) {
          var username = appResult.owner + '.' + appResult.application + '.' + email;
          var promise = cognitoService.authenticate(username, password);
          promise.then(function(result) {
            
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

    return {
      signUp: signUp,
      initLogin: initLogin,
      initConfirmation: initConfirmation,
      confirmRegistration: confirmRegistration,
      login: login,
      loginInProgress: isLoginInProgress,
      registrationInProgress: isRegistrationInProgress,
      confirmationInProgress: isConfirmationInProgress
    };
  }
  angular.module('tipo.user')
  .controller('UserController', UserController);

})();