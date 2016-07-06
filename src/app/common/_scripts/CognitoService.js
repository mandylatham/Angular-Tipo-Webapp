(function() {

    'use strict';

    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:d7d7c388-ea87-4ed4-90c1-e5170acf76be'
    });

    AWSCognito.config.region = 'us-east-1';
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:d7d7c388-ea87-4ed4-90c1-e5170acf76be'
    });
     
    var poolData = {
        UserPoolId : 'us-east-1_LtLxvXI3z',
        ClientId : '1nu8rqghmj2ov1rsbt3e776do'
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  
    function CognitoService() {
        
        function signUp(username, password, email, phoneNumber, callback) {
            var attributeList = [];
    
            var dataEmail = {
                Name : 'email',
                Value : email
            };
            var dataPhoneNumber = {
                Name : 'phone_number',
                Value : phoneNumber
            };
            var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
            var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);
            
            attributeList.push(attributeEmail);
            // attributeList.push(attributePhoneNumber);
            
            userPool.signUp(username, password, attributeList, null, callback);
        }

        function confirmRegistration(username, verificationCode, callback) {
            var userData = {
                Username : username,
                Pool : userPool
            };
            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            cognitoUser.confirmRegistration(verificationCode, true, callback);            
        }

        return {
            signUp: signUp,
            confirmRegistration: confirmRegistration
        };
  }

  angular.module('tipo.common')
    .service('cognitoService', CognitoService);

})();