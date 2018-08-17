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
        UserPoolId: TIPO_CONSTANTS.COGNITO.USER_POOL_ID,
        ClientId: TIPO_CONSTANTS.COGNITO.CLIENT_ID
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    function CognitoService($q, securityContextService) {
        var awsSession = initSession();

        // Update credentials when user refreshes the page
        function initSession() {
            var deferred = $q.defer();
            var cognitoUser = userPool.getCurrentUser();
            if (cognitoUser != null) {
                cognitoUser.getSession(function(err, result) {
                    if (result) {
                        var logins = {};
                        var loginsKey = 'cognito-idp.' + TIPO_CONSTANTS.COGNITO.REGION + '.amazonaws.com/' + TIPO_CONSTANTS.COGNITO.USER_POOL_ID;
                        logins[loginsKey] = result.getIdToken().getJwtToken();
                        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                            IdentityPoolId: TIPO_CONSTANTS.COGNITO.IDENTITY_POOL_ID,
                            Logins: logins
                        });
                    }
                });
            }
            awsRefresh().then(function(result) {
                deferred.resolve(cognitoUser);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function signUp(username, password, email, account, accountName, recaptcha) {
            var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
                Name: 'email',
                Value: email
            });
            var attributeAccount = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
                Name: 'custom:account',
                Value: account
            });
            var attributeRecaptcha = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
                Name: 'custom:recaptcha',
                Value: recaptcha
            });

            var attributeList = [];
            attributeList.push(attributeEmail);
            attributeList.push(attributeAccount);
            attributeList.push(attributeRecaptcha);

            accountName = accountName || 'accountName' + account;
            var attributeAccountName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
                Name: 'custom:accountName',
                Value: accountName
            });
            attributeList.push(attributeAccountName);

            var deferred = $q.defer();
            userPool.signUp(username, password, attributeList, null, function(err, result) {
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
                Username: username,
                Pool: userPool
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

        function authenticate(username, password, action) {
            // Clear the cached Cognito ID to prevent 'Logins don't match. Please include at least one valid login for this identity or identity pool' error
            AWS.config.credentials.clearCachedId();

            var authenticationData = {
                Username: username,
                Password: password,
            };
            var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

            var userData = {
                Username: username,
                Pool: userPool
            };
            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            var deferred = $q.defer();

            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function(result) {
                    var email_verified = false;
                    if (action === "signup") {
                      authenticateSuccess(username, password, result, deferred);
                    } else {
                        cognitoUser.getUserAttributes(function(err, attributes) {
                            if (err) {
                                alert(err);
                                return;
                            }
                            for (i = 0; i < attributes.length; i++) {
                                if (attributes[i].getName() === "email_verified" && _.toLower(attributes[i].getValue()) === "true") {
                                    email_verified = true;
                                };
                            }
                            if (email_verified) {
                                authenticateSuccess(username, password, result, deferred);
                            } else {
                                deferred.reject({ type: 'Verify Email', value: result });
                            }
                        });
                    }
                },

                onFailure: function(err) {
                    deferred.reject(err);
                },

                newPasswordRequired: function(userAttributes, requiredAttributes) {
                    var deferredPassword = $q.defer();
                    deferred.resolve({ type: 'PasswordChallenge', value: deferredPassword });
                    deferredPassword.promise.then(function(resolveObj) {
                        delete userAttributes.email_verified;
                        cognitoUser.completeNewPasswordChallenge(resolveObj.newPassword, userAttributes, {
                            onSuccess: function(result) {
                                result.userAttributes = userAttributes;
                                resolveObj.deferredComplete.resolve(result);
                                console.log('Password Challange', result);
                            },
                            onFailure: function(err) {
                                resolveObj.deferredComplete.reject(err);
                                console.error('Password Challange', err);
                            }
                        });
                    });
                }

            });
            return deferred.promise;
        }

        function signOut() {
            AWS.config.credentials.clearCachedId();
            var cognitoUser = userPool.getCurrentUser();
            if (cognitoUser !== null) {
                cognitoUser.signOut();
                securityContextService.clearContext();
                return true;
            }
            return false;
        }

        function resendCode() {
            var deferred = $q.defer();
            getUserSession().then(function(cognitoUser) {
                cognitoUser.getAttributeVerificationCode('email', {
                    onSuccess: function(result) {
                        deferred.resolve(result);
                    },
                    onFailure: function(err) {
                        deferred.reject(err);
                    },
                    inputVerificationCode: function() {
                        deferred.resolve();
                    }
                });
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function verifyCode(verificationCode) {
            var deferred = $q.defer();
            getUserSession().then(function(cognitoUser) {
                cognitoUser.verifyAttribute('email', verificationCode, {
                    onSuccess: function(result) {
                        deferred.resolve(result);
                    },
                    onFailure: function(err) {
                        deferred.reject(err);
                    }
                });
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        /**
         * Reset password. Send an email with verification code
         */
        function forgotPassword(username) {
            var userData = {
                Username: username,
                Pool: userPool
            };
            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            var deferred = $q.defer();
            cognitoUser.forgotPassword({
                onSuccess: function(result) {
                    deferred.resolve(result);
                },
                onFailure: function(err) {
                    deferred.reject(err);
                },
                inputVerificationCode: function(data) {
                    deferred.resolve(data);
                }
            });
            return deferred.promise;
        }

        /**
         * Reset old password. Confirm a new one
         */
        function resetPassword(username, newPassword, verificationCode) {
            var userData = {
                Username: username,
                Pool: userPool
            };
            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            var deferred = $q.defer();
            cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess: function(result) {
                    deferred.resolve(result);
                },
                onFailure: function(err) {
                    deferred.reject(err);
                },
                inputVerificationCode: function(data) {
                    deferred.resolve(data);
                }
            });
            return deferred.promise;
        }

        /**
         * Get current user session from the cache
         */
        function getUserSession() {
            var deferred = $q.defer();
            var cognitoUser = userPool.getCurrentUser();
            if (cognitoUser === null) {
                return $q.reject('No cached user');
            }
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(cognitoUser);
            });
            return deferred.promise;
        }

        /**
         * Check whether the user logged in
         */
        function isCurrentUserSigned() {
            var cognitoUser = userPool.getCurrentUser();
            return cognitoUser !== null;
        }

        /**
         * Refresh AWS credentials
         */
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

        function authenticateSuccess(username, password, result, deferred) {
            var securityContext = {
                'tokenDetails.id_token': result.getIdToken().getJwtToken(),
                'tokenDetails.access_token': result.getAccessToken().getJwtToken(),
                'loggedInUser': username
            };
            securityContextService.saveContext(securityContext);

            var logins = {};
            var loginsKey = 'cognito-idp.' + TIPO_CONSTANTS.COGNITO.REGION + '.amazonaws.com/' + TIPO_CONSTANTS.COGNITO.USER_POOL_ID;
            logins[loginsKey] = result.getIdToken().getJwtToken();
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: TIPO_CONSTANTS.COGNITO.IDENTITY_POOL_ID,
                Logins: logins
            });

            awsRefresh().then(function(id) {
                deferred.resolve({ type: 'Regular', value: result });
            }, function(err) {
                // Return resolve even when err occurred
                console.error(err);
                deferred.resolve({ type: 'Regular', value: result });
            });
        }

        return {
            signUp: signUp,
            confirmRegistration: confirmRegistration,
            authenticate: authenticate,
            signOut: signOut,
            isCurrentUserSigned: isCurrentUserSigned,
            resendCode: resendCode,
            verifyCode: verifyCode,
            forgotPassword: forgotPassword,
            resetPassword: resetPassword,
            getUserSession: getUserSession
        };
    }

    angular.module('tipo.common')
        .service('cognitoService', CognitoService);

})();