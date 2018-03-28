(function() {

    'use strict';

    function UserController(
        metadataService,
        tipoRouter,
        tipoResource,
        cognitoService,
        tipoCache,
        tipoInstanceDataService,
        tipoManipulationService,
        securityContextService,
        tipoCustomJavascript,
        vcRecaptchaService,
        $state,
        $stateParams,
        $mdToast,
        tipoHandle,
        $scope,
        $http,
        $q,
        $rootScope) {
        var _instance = this;
        $http.get('framework/_scripts/country-code.json').then(function(data) {
            _instance.country_code = data.data;
        });
        tipoManipulationService.initGA();
        _instance.inProgress = false;
        $scope.date = new Date();
        $scope.expiryDate = new Date();
        $scope.expiryDate.setMonth($scope.date.getMonth() + 1);
        $scope.creditCard;
        $scope.cardToken;
        $rootScope.appLoaded = true;
        var appMetadata = metadataService.applicationMetadata;
        var appMetadata = _.merge(_.get(appMetadata, "TipoApp"), _.get(appMetadata, "TipoConfiguration"));
        var function_name;
        _instance.header_template = metadataService.resolveAppCustomUrls("login_header_template", "user/_views/header.tpl.html")
        var user = {};
        var templates = [{ template_name: "registation_template", default_template: "user/_views/registration.tpl.html" },
            { template_name: "login_template", default_template: "user/_views/registration.tpl.html" },
            { template_name: "forgot_password_template", default_template: "user/_views/forgot-password.tpl.html" },
            { template_name: "reset_password_template", default_template: "user/_views/reset-password.tpl.html" },
            { template_name: "new_password_template", default_template: "user/_views/new-password-required.tpl.html" }
        ];

        function fetchAllTemplatesAsync() {
            _.each(templates, function(each) {
                metadataService.resolveAppCustomTemplates(each.template_name, each.default_template);
            })
        }
        fetchAllTemplatesAsync();
        user.fullName = function(username) {
            return appMetadata.application_owner_account + '.' + appMetadata.application + '.' + (username || _instance.user.email);
        };
        _instance.user = user;
        _instance.captureAccountNameDuringSignup = appMetadata.capture_account_name_during_signup;
        if (appMetadata && appMetadata.app_subscription) {
            _instance.skipCreditCard = appMetadata.app_subscription.skip_credit_card_to_demo;
        };
        _instance.allow_signup = appMetadata.allow_signup;

        _instance.toRegistration = function() {
            tipoRouter.to('registration');
        };

        _instance.toLogin = function() {
            tipoRouter.to('login');
        };

        _instance.toForgotPassword = function() {
            tipoRouter.to('forgotPassword');
        };

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
            _instance.inProgress = false;
            tipoManipulationService.initGA();
            delete _instance.lastError;
        });

        _instance.stateChange = function() {
            function_name = appMetadata.application_name + "_URLChange";
            callCustomJS();
        }

        function markProgress() {
            _instance.inProgress = true;
            delete _instance.lastError;
        }

        /**
         * Generate account id with range from 1000000000 to 9999999999
         */
        function generateAccountId() {
            var start = 1000000000;
            var end = 9999999999;
            return Math.floor(Math.random() * (end - start + 1)) + start;
        }

        /**
         * Verify account name
         * Account name should be unique, no integers, no spaces allowed.
         */
        function verifyAccountName(accountName) {
            return accountName ? /^[a-zA-Z0-9-_]+$/.test(accountName) : false;
        }

        function raiseError(err) {
            console.error(err);
            if (err.type === "Verify Email") {
                tipoRouter.to('verifyEmail');
                return;
            };
            if ($stateParams.retry) {
                $stateParams.retry.reject();
            }
            if (err && err.errorMessage) {
                _instance.lastError = err.errorMessage;
            } else if (err && err.data && err.data.errorMessage) {
                _instance.lastError = err.data.errorMessage;
            } else if (err && err.message) {
                _instance.lastError = err.message;
            }
            _instance.inProgress = false;
        }

        function callCustomJS(status) {
            if (typeof tipoCustomJavascript[function_name] === 'function') {
                tipoCustomJavascript[function_name](status, _instance.user);
            }
        }

        _instance.initCard = function() {
            $scope.creditCard = tipoManipulationService.initialiseCreditCard(appMetadata.app_subscription.publishable_key);
        }

        _instance.createToken = function() {
            $scope.creditCard.stripe.createToken($scope.creditCard.cardElement).then(function(result) {
                if (result.error) {
                    // Inform the user if there was an error
                    _instance.lastError = result.error.message;
                } else {
                    // Send the token to your server
                    delete _instance.lastError;
                    markProgress();
                    $scope.cardToken = result.token;
                    if ($scope.tipoAccountPromise) {
                        $scope.tipoAccountPromise.then(function(res) {
                            sendToken();
                        })
                    } else {
                        sendToken();
                    }
                }
            });
        }

        function sendToken() {
            tipoHandle.callAction('TipoSubscriptions', 'attach_card', ['2000000001'], 'TipoSubscriptions', { token_source: $scope.cardToken.id, credit_card: $scope.cardToken.card.last4 }).then(function(response) {
                tipoRouter.to('dashboard');
                function_name = appMetadata.application_name + "_Login";
                callCustomJS("success");
            }, function(err) {
                raiseError(err);
            });
        }

        _instance.signUp = function(attemptCnt) {
            markProgress();
            if (appMetadata.capture_account_name_during_signup && !verifyAccountName(user.accountName)) {
                raiseError({ message: 'Account name has invalid format' });
                return;
            }

            attemptCnt = attemptCnt || 0;
            var account = '' + generateAccountId();
            cognitoService.signUp(user.fullName(), user.password, user.email, account, user.accountName, user.recaptcha).then(function(result) {
                // Subscribe Trial plan
                var trial = {
                    customerEmail: user.email,
                    tipouser: user.fullName()
                };
                // Authenticate
                var criteria = { bare_event: 'Y', post_event: 'Y' };
                var user_attributes = { full_name: user.full_name, phone: user.phone_number };
                var org_attributes = { organization: user.companyName, first_name: user.full_name, phone: user.phone_number };
                cognitoService.authenticate(user.fullName(), user.password, "signup").then(function() {
                    cognitoService.resendCode().then(function() {
                        tipoCache.clearMemoryCache();
                        $scope.tipoAccountPromise = tipoInstanceDataService.upsertAll('TipoAccount', [{ account: account, application: appMetadata.application, tipo_id: account, account_name: user.accountName, application_owner_account: appMetadata.application_owner_account, company_name: user.companyName, org_attributes: org_attributes, user_attributes: user_attributes }], criteria).then(function(res) { _instance.userAccount = res[0]},
                            function(err) {
                                raiseError(err);
                            });
                        if (appMetadata.app_subscription.capture_credit_card) {
                            ga('send', 'event', 'CreateAccount', 'created', _instance.user.email);
                            tipoRouter.to('surveyResponse');
                        } else {
                            tipoRouter.to('dashboard');
                        }
                        function_name = appMetadata.application_name + "_Signup";
                        callCustomJS("success");
                    }, function(err) {
                        console.error(err);
                        tipoRouter.to('dashboard');
                    });
                }, raiseError);
            }, function(err) {
                if (err.message && err.message.indexOf('PreSignUp failed with error') === 0) {
                    return raiseError({ message: err.message.substring('PreSignUp failed with error'.length) });
                }
                raiseError(err);
            });
        };

        _instance.login = function(username, password) {
            markProgress();
            username = user.fullName(username);
            password = password || user.password;
            $scope.tipoAccountPromise = cognitoService.authenticate(username, password).then(function(result) {
                if ($stateParams.retry) {
                    $stateParams.retry.resolve();
                }
                if (result && result.type === 'PasswordChallenge') {
                    // Go to New Password Required page when facing PasswordChallenge
                    tipoRouter.to('newPasswordRequired', undefined, { deferredPassword: result.value });
                } else {
                    securityContextService.clearContext();
                    delete metadataService.userMetadata;
                    tipoCache.clearAll();
                    _instance.gotoPreviousView();
                }
                function_name = appMetadata.application_name + "_Login";
                callCustomJS("success");
            }, function(err) {
                if (appMetadata.application !== '1000000001' && err.message && err.message.indexOf('User does not exist') !== -1) {
                    username = '2000000001.1000000001.' + _instance.user.email;
                    return _instance.developerlogin(username, password);
                }
                function_name = appMetadata.application_name + "_Login";
                callCustomJS("failure");
                raiseError(err);
            });
        };

        _instance.developerlogin = function(username, password) {
            markProgress();
            cognitoService.authenticate(username, password).then(function(result) {
                if ($stateParams.retry) {
                    $stateParams.retry.resolve();
                }
                if (result && result.type === 'PasswordChallenge') {
                    // Go to New Password Required page when facing PasswordChallenge
                    tipoRouter.to('newPasswordRequired', undefined, { deferredPassword: result.value });
                } else {
                    securityContextService.clearContext();
                    delete metadataService.userMetadata;
                    tipoCache.clearAll();
                    _instance.gotoPreviousView();
                }
                function_name = appMetadata.application_name + "_Login";
                callCustomJS("success");
            }, function(err) {
                raiseError(err);
                function_name = appMetadata.application_name + "_Login";
                callCustomJS("failure");
            });
        };

        _instance.onForgotPassword = function() {
            markProgress();
            cognitoService.forgotPassword(user.fullName()).then(function(result) {
                _instance.toast = {
                    header: 'Check email',
                    body: 'We sent an email to ' + _instance.user.email + ', which contains a link to reset your password.'
                };
                _instance.toLogin();
            }, function(err) {
                if (err && err.message && err.message.indexOf('no registered/verified email') != -1) {
                    _instance.toast = {
                        header: 'Email is not verified',
                        body: 'Please confirm your email ' + _instance.user.email
                    };
                    return raiseError({ message: 'Please confirm your email ' + _instance.user.email });
                }
                raiseError(err);
            });
        };

        _instance.onVerifyEmail = function(){
            markProgress();
            tipoRouter.to('dashboard',undefined,{code: user.verificationcode,perspective: "Home", filter: "sampleapp"});
        }

        _instance.resetPassword = function() {
            markProgress();
            user.email = $stateParams.email;
            var code = $stateParams.code;
            cognitoService.resetPassword(user.fullName(), user.newPassword, code).then(function(result) {
                _instance.toast = {
                    header: 'Password changed',
                    body: 'Your Password has been successfully reset. Sign in to your account.'
                };
                _instance.toLogin();
                function_name = appMetadata.application_name + "_PasswordChange";
                callCustomJS();
            }, raiseError);
        };

        _instance.completePasswordChallenge = function() {
            markProgress();
            if ($stateParams.deferredPassword) {
                var deferredComplete = $q.defer();
                var resolvedPassword = { newPassword: user.newPassword, deferredComplete: deferredComplete };
                $stateParams.deferredPassword.resolve(resolvedPassword);
                deferredComplete.promise.then(function(result) {
                    _instance.toast = {
                        header: 'Password changed',
                        body: 'Your password has been changed successfully'
                    };
                    _instance.login(result.userAttributes.email, user.newPassword);
                    function_name = appMetadata.application_name + "_PasswordChange";
                    callCustomJS();
                }, function(err) {
                    _instance.toast = {
                        header: 'Password change was not successful',
                        body: err.message
                    };
                })

                return;
            }
            raiseError({ errorMessage: 'You must login first with your temporary credentials before attempting to change your password' });
        };

        _instance.gotoPreviousView = function() {
            if ($rootScope.$previousState && (typeof $rootScope.$previousState.abstract === 'undefined' || $rootScope.$previousState.abstract === false)) {
                $state.go($rootScope.$previousState, $rootScope.$previousParams);
            } else {
                $state.go('dashboard');
            }
        };

        _instance.resendCode = function(){
            cognitoService.resendCode().then(function(){
                _instance.toast = {
                        header: 'Email Verification Code Sent',
                        body: ''
                    };
            },function(err){
                _instance.toast = {
                        header: 'Failed to send the message',
                        body: err.message
                    };
            })
        }

        _instance.gotoSampleApps = function(){
            tipoRouter.toTipoList('TipoApp',{filter: "sampleapp",perspective: "Home"});
        }

        _instance.gotoSurveyResponse = function(){
            tipoRouter.to("surveyResponse");
        }

        _instance.setCategory = function(cat) {
            _instance.selectedIndex = 1;
            _instance.category = cat;
        }

        _instance.setPrice = function(price) {
            _instance.priceRange = price;
        }

        _instance.setCompSize = function(size) {
            _instance.company_size = size;
        }

        _instance.submitSurvey = function() {
            var data = {category: _instance.category, company_size: _instance.company_size, user: _instance.userAccount.email };
            tipoHandle.createTipo("TipoSurveyResponse", data).then(function(){
                tipoRouter.to("verifyEmail");
            })
        }

        _instance.recaptchaExpiration = function() {
            console.log("Captch Expired!!");
        }

        $scope.$watch(function() {
            return _instance.toast;
        }, function(newValue, oldValue) {
            if (newValue) {
                var toast = $mdToast.tpToast();
                toast._options.locals = newValue;
                $mdToast.show(toast);
            }
        });


    }
    angular.module('tipo.user')
        .controller('UserController', UserController);

})();