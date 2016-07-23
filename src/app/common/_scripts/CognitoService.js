(function() {

  'use strict';

  AWS.config.region = TIPO_CONSTANTS.COGNITO.REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: TIPO_CONSTANTS.COGNITO.IDENTITY_POOL_ID
  });

  AWSCognito.config.region = TIPO_CONSTANTS.COGNITO.REGION;
  AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: TIPO_CONSTANTS.COGNITO.IDENTITY_POOL_ID
  });

  var poolData = {
    UserPoolId : TIPO_CONSTANTS.COGNITO.USER_POOL_ID,
    ClientId : TIPO_CONSTANTS.COGNITO.CLIENT_ID
  };
  var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

  function CognitoService($q, securityContextService) {
        
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
          var securityContext = {
            'tokenDetails.access_token': result.getAccessToken().getJwtToken(),
            'loggedInUser': username
          };
          securityContextService.saveContext(securityContext);

          var loginsKey = 'cognito-idp.us-east-1.amazonaws.com/' + TIPO_CONSTANTS.COGNITO.USER_POOL_ID;
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : TIPO_CONSTANTS.COGNITO.IDENTITY_POOL_ID,
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
        securityContextService.clearContext();
        return true;
      }
      return false;
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