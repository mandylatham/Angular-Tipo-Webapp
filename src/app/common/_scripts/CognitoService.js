(function() {

    'use strict';

    AWS.config.region = cognito.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: cognito.IdentityPoolId
    });

    AWSCognito.config.region = cognito.region;
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: cognito.IdentityPoolId
    });
     
    var poolData = {
        UserPoolId : cognito.UserPoolId,
        ClientId : cognito.ClientId
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

        function authenticate(username, password, callback) {
            var authenticationData = {
                Username : username,
                Password : password,
            };
            var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
                        
            var userData = {
                Username : username,
                Pool : userPool
            };
            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    console.log('access token + ' + result.getAccessToken().getJwtToken());

                    var loginsKey = 'cognito-idp.us-east-1.amazonaws.com/' + cognito.UserPoolId;
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId : cognito.IdentityPoolId,
                        Logins : {
                            loginsKey: result.getIdToken().getJwtToken()
                        }
                    });
                    if (callback) {
                        callback.onSuccess(result);
                    }
                },

                onFailure: function(err) {
                    if (callback) {
                        callback.onFailure(err);
                    }                    
                },

            });     
        }

        return {
            signUp: signUp,
            confirmRegistration: confirmRegistration,
            authenticate: authenticate
        };
  }

  angular.module('tipo.common')
    .service('cognitoService', CognitoService);

})();