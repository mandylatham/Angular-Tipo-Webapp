(function() {

  'use strict';
   
  function UserController(
      $scope, 
      $location, 
      $mdDialog, 
      cognitoService) {
        
    function signUp(user) {
        console.log(user);
        cognitoService.signUp(user.username, user.password, user.email, user.phone);
    }

    function initRegistration() {
        // Path will be /verification/1234, and array looks like: ["","verification","1234"]
        var verificationCode = $location.path().split("/")[2] || "Unknown";
        console.log('Verification code: ' + verificationCode);
        $scope.userDetails = {};
        $scope.userDetails.verificationCode = verificationCode;
    }

    function confirmRegistration(userDetails) {        
        console.log(userDetails);
        
        userDetails = userDetails || { username: '', verificationCode: '' };      

        cognitoService.confirmRegistration(userDetails.username, userDetails.verificationCode, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
            var alertDlg = $mdDialog.alert()
                .title('Confirmation Dialog')
                .content('User ' + userDetails.username + ' registration confirmed')
                .ok('Close');
            $mdDialog.show( alertDlg );
        });
    }

    return {
        signUp: signUp,
        initRegistration: initRegistration,
        confirmRegistration: confirmRegistration
    };
  }
  angular.module('tipo.user')
    .controller('UserController', UserController);

})();