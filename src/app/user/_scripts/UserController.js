(function() {

  'use strict';
   
  function UserController($scope, $location, cognitoService) {
        
    function signUp(user) {
        console.log(user);
        cognitoService.signUp(user.username, user.password, user.email, user.phone);
    }

    function confirmRegistration() {
        // Path will be /verification/1234, and array looks like: ["","verification","1234"]
        var verificationCode = $location.path().split("/")[2] || "Unknown";
        console.log('Verification code: ' + verificationCode);

        cognitoService.confirmRegistration(verificationCode);
    }

    return {
        signUp: signUp,
        confirmRegistration: confirmRegistration
    };
  }
  angular.module('tipo.user')
    .controller('UserController', UserController);

})();