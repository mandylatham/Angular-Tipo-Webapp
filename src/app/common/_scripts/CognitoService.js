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
  
    function CognitoService($q) {
              
        function signUp(username, password, email, phoneNumber) {
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
            
            var deferred = $q.defer();
            userPool.signUp(username, password, attributeList, null, function(err, result){
                if (err) {
                    deferred.reject(err); 
                    return;
                }
                deferred.resolve(result);
            });
            return deferred.promise; 
        }

        function confirmRegistration(username, verificationCode) {
            var userData = {
                Username : username,
                Pool : userPool
            };
            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            var deferred = $q.defer();
            cognitoUser.confirmRegistration(verificationCode, true, function(err, result) {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(result);
            });  
            return deferred.promise;           
        }

        function authenticate(username, password) {
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
            var deferred = $q.defer();
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
                    deferred.resolve(result);
                },

                onFailure: function(err) {
                    deferred.reject(err);                  
                },

            });  
            return deferred.promise;   
        }

        function signOut() {
            var cognitoUser = userPool.getCurrentUser();
            if(cognitoUser !== null) {
                cognitoUser.signOut();
            }                
        }

        function isCurrentUserSigned() {
            var cognitoUser = userPool.getCurrentUser();
            return cognitoUser !== null;                
        }

        return {
            signUp: signUp,
            confirmRegistration: confirmRegistration,
            authenticate: authenticate,
            signOut: signOut,
            isCurrentUserSigned: isCurrentUserSigned
        };
  }

  angular.module('tipo.common')
    .service('cognitoService', CognitoService);

})();