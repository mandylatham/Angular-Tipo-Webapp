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
      cognitoService) {
        
    function signUp(user) {
        console.log(user);
        var promise = cognitoService.signUp(user.username, user.password, user.email, user.phone);
        promise.then(function (result) {
            gotoPreviousView();
            
            var cognitoUser = result.user;
            console.log('user ' + cognitoUser.getUsername() + ' has requested for registration');
            var alertDlg = $mdDialog.alert()
                .title('Registration')
                .content('User ' + cognitoUser.getUsername() + ' successfully submitted request')
                .ok('Close');
            $mdDialog.show(alertDlg);    
        }, function (err) {
            $window.alert(err);    
        });           
    }

    function initConfirmation() {
        // Path will be /verification/1234, and array looks like: ["","verification","1234"]
        var confirmationCode = $location.path().split("/")[2] || "Unknown";
        console.log('Confirmation code: ' + confirmationCode);
        $scope.userDetails = {};
        
        $scope.userDetails.confirmationCode = confirmationCode;                
    }

    function confirmRegistration(userDetails) {        
        console.log(userDetails);   
        
        userDetails = userDetails || { username: '', confirmationCode: '' };      

        var promise = cognitoService.confirmRegistration(userDetails.username, userDetails.confirmationCode);
        promise.then(function (result) {
            console.log('call result: ' + result);
            var alertDlg = $mdDialog.alert()
                .title('Confirmation')
                .content('User ' + userDetails.username + ' registration confirmed')
                .ok('Close');
            $mdDialog.show( alertDlg );
        }, function (err) {
            $window.alert(err);    
        });         
    }  

    function submit(username, password) {
        
        var promise = cognitoService.authenticate(username, password); 
        promise.then(function(result) {
            gotoPreviousView();

            if ($stateParams.retry) {
              $stateParams.retry.resolve();
            }

            var alertDlg = $mdDialog.alert()
                .title('Login')
                .content('User ' + username + ' login successfully')
                .ok('Close');
            $mdDialog.show(alertDlg);                   
        }, function (err) {
            if ($stateParams.retry) {
              $stateParams.retry.reject();
            }

            $window.alert(err);
        });
    }  

    function gotoPreviousView() {
        if ($rootScope.$previousState.abstract === true) {
            $state.go('dashboard');                
        } else {
            $state.go($rootScope.$previousState, $rootScope.$previousParams);
        }    
    }

    return {
        signUp: signUp,
        initConfirmation: initConfirmation,
        confirmRegistration: confirmRegistration,
        submit: submit
    };
  }
  angular.module('tipo.user')
    .controller('UserController', UserController);

})();