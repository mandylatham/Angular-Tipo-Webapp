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
    initSession();
    
    // Update credentials when user refreshes the page
    function initSession() {
      var cognitoUser = userPool.getCurrentUser();
      if (cognitoUser != null) {
        cognitoUser.getSession(function(err, result) {
          if (result) {
            
            var logins = {};
            var loginsKey = 'cognito-idp.' + TIPO_CONSTANTS.COGNITO.REGION + '.amazonaws.com/' + TIPO_CONSTANTS.COGNITO.USER_POOL_ID;
            logins[loginsKey] = result.getIdToken().getJwtToken();
            // Add the User's Id Token to the Cognito credentials login map.
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: TIPO_CONSTANTS.COGNITO.IDENTITY_POOL_ID,
                Logins: logins
            });
            awsRefresh();
          }
        });
      }
    }
        
    function signUp(username, password, email, account) {
      var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
        Name : 'email',
        Value : email
      });
      var attributeAccount = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
        Name : 'custom:account',
        Value : account.toUpperCase()
      });
      
      var attributeList = [];
      attributeList.push(attributeEmail);
      attributeList.push(attributeAccount);

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
          console.log('Identity token: ', result.getIdToken().getJwtToken());
          var securityContext = {
            'tokenDetails.access_token': result.getIdToken().getJwtToken(),
            'loggedInUser': username
          };
          securityContextService.saveContext(securityContext);

          var loginsKey = 'cognito-idp.' + TIPO_CONSTANTS.COGNITO.REGION + '.amazonaws.com/' + TIPO_CONSTANTS.COGNITO.USER_POOL_ID;
          
          var params = {};
          params.IdentityPoolId = TIPO_CONSTANTS.COGNITO.IDENTITY_POOL_ID;
          params.Logins = {};
          params.Logins[loginsKey] = result.getIdToken().getJwtToken();
          
          AWS.config.update({
            region: TIPO_CONSTANTS.COGNITO.REGION,
            credentials: new AWS.CognitoIdentityCredentials(params)
          });

          awsRefresh().then(function(id) {
            deferred.resolve(result);
          }, function(err) {
            deferred.reject(err);
          });
        },

        onFailure: function(err) {
          deferred.reject(err);
        }

      });
      return deferred.promise;
    }

    function signOut() {
      AWS.config.credentials.clearCachedId();
      var cognitoUser = userPool.getCurrentUser();
      if(cognitoUser !== null) {
        cognitoUser.signOut();
        securityContextService.clearContext();
        return true;
      }
      return false;
    }

    function resendCode() {
      var cognitoUser = userPool.getCurrentUser();
      if (cognitoUser === null) {
        console.log('No cached user');
        return;
      }
      cognitoUser.getSession(function(err, session) {
          if (err) {
              console.error(err);
              return;
          }
          cognitoUser.getAttributeVerificationCode('email', {
            onSuccess: function (result) {
                console.log('Call result: ' + result);
            },
            onFailure: function(err) {
                console.log(err);
            },
            inputVerificationCode() {
                var verificationCode = prompt('Check you email for a verification code and enter it here: ' ,'');
                cognitoUser.verifyAttribute('email', verificationCode, this);
            }
          });
      });
      
    }

    function isCurrentUserSigned() {
      var cognitoUser = userPool.getCurrentUser();
      return cognitoUser !== null;
    }

    function awsRefresh() {
      var deferred = $q.defer();
      AWS.config.credentials.refresh(function(err) {
          if (err) {
              deferred.reject(err);
          } else {
              deferred.resolve(AWS.config.credentials.identityId);
          }
      });
      return deferred.promise;
    }

    return {
      signUp: signUp,
      confirmRegistration: confirmRegistration,
      authenticate: authenticate,
      signOut: signOut,
      isCurrentUserSigned: isCurrentUserSigned,
      resendCode: resendCode
    };
  }

  angular.module('tipo.common')
  .service('cognitoService', CognitoService);

})();