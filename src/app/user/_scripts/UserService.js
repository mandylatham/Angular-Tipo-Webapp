(function() {

    'use strict';

   
    function UserService(cognitoService) {
        
        function signUp(username, password, email, phoneNumber) {
        }

        return {
            signUp: signUp
        };
  }

  angular.module('tipo.common')
    .service('cognitoService', CognitoService);

})();