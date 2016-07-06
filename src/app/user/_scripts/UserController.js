(function() {

  'use strict';
   
  function UserController(
      $scope, 
      $location, 
      $mdDialog, 
      cognitoService) {
        
    function signUp(user) {
        console.log(user);
        cognitoService.signUp(user.username, user.password, user.email, user.phone, function(err, result){
            if (err) {
                alert(err);
                return;
            }
            var cognitoUser = result.user;
            console.log('user ' + cognitoUser.getUsername() + ' has requested for registration');
            var alertDlg = $mdDialog.alert()
                .title('Registration')
                .content('User ' + cognitoUser.getUsername() + ' successfully submitted request')
                .ok('Close');
            $mdDialog.show(alertDlg);
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

        cognitoService.confirmRegistration(userDetails.username, userDetails.confirmationCode, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
            var alertDlg = $mdDialog.alert()
                .title('Confirmation')
                .content('User ' + userDetails.username + ' registration confirmed')
                .ok('Close');
            $mdDialog.show( alertDlg );
        });
    }

    return {
        signUp: signUp,
        initConfirmation: initConfirmation,
        confirmRegistration: confirmRegistration
    };
  }
  angular.module('tipo.user')
    .controller('UserController', UserController);

})();