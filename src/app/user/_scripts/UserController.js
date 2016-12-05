(function() {

  'use strict';
   
  function UserController(
    $rootScope,
    $scope,
    $location,
    $mdDialog,
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
      if (!registrationInProgress) {
        var params = {
          type: 'application',
          url: $window.location.origin
        };
        registrationInProgress = true;
        tipoResource.one('subscription').customGET('', params).then(function(application) {

          var params = {
            type: 'account',
            application: application.value, 
            account: user.account
          };
          tipoResource.one('subscription').customGET('', params).then(function(account) {
            if (account) {
              $scope.lastError = 'Account ' + user.account + ' already exists';
              registrationInProgress = false;
            } else {
              tipoResource.one('subscription').customPUT('', '', params).then(function(existsAccount) {
                var promise = cognitoService.signUp(user.email, user.password, user.account);
                promise.then(function (result) {
                  $state.go('confirmRegistration');
                  registrationInProgress = false;
                }, function (err) {
                  registrationInProgress = false;
                  printErrorMessage(err);
                  console.error(err);
                });
              });
            }
          }, function(err) {
            registrationInProgress = false;
            printErrorMessage(err);
            console.error(err);
          });
        }, function(err) {
          registrationInProgress = false;
          printErrorMessage(err);
          console.error(err);
        });
      }
    }

    function printErrorMessage(err) {
      if (err && err.errorMessage) {
        $scope.lastError = err.errorMessage;
      } else if (err && err.message) {
        $scope.lastError = err.message;
      }
    }

    function initConfirmation() {
      // Path will be /verification/1234, and array looks like: ["","verification","1234"]
      var confirmationCode = $location.path().split("/")[2] || "Unknown";
      console.log('Confirmation code: ' + confirmationCode);
      $scope.userDetails = {};
      
      $scope.userDetails.confirmationCode = confirmationCode;
    }

    function confirmRegistration(userDetails) {
      if (!confirmationInProgress) {
        userDetails = userDetails || { username: '', confirmationCode: '' };

        var promise = cognitoService.confirmRegistration(userDetails.username, userDetails.confirmationCode);
        confirmationInProgress = true;
        promise.then(function (result) {

          // Go to login after successful registration
          // https://github.com/aws/amazon-cognito-identity-js/issues/186
          $state.go('login');
          confirmationInProgress = false;
        }, function (err) {
          
          confirmationInProgress = false;
          $window.alert(err);
        });
      }
    }

    function submit(username, password) {
      if (!loginInProgress) {
        var promise = cognitoService.authenticate(username, password);
        loginInProgress = true;
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
          $window.alert(err);
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
      initConfirmation: initConfirmation,
      confirmRegistration: confirmRegistration,
      submit: submit,
      loginInProgress: isLoginInProgress,
      registrationInProgress: isRegistrationInProgress,
      confirmationInProgress: isConfirmationInProgress
    };
  }
  angular.module('tipo.user')
  .controller('UserController', UserController);

})();