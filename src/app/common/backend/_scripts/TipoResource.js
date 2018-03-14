(function() {

    'use strict';

    var deviceInformation = {};


    function getAllInterceptors(
        tipoRouter,
        $rootScope,
        securityContextService,
        tipoErrorHandler,
        tipoCache,
        cognitoService,
        $templateCache,
        $cacheFactory,
        $location,
        $http,
        $q,
        $window,
        $mdDialog) {

        function refreshAccesstoken() {
            var deferred = $q.defer();
            cognitoService.getUserSession().then(function(result) {
                console.log('GetSession', result);
                var securityContext = {
                    'tokenDetails.id_token': result.getSignInUserSession().getIdToken().getJwtToken(),
                    'tokenDetails.access_token': result.getSignInUserSession().getAccessToken().getJwtToken(),
                    'loggedInUser': result.getUsername()
                };
                securityContextService.saveContext(securityContext);
                deferred.resolve();
            }, function(err) {
                console.log('GetSession error', err);
                // Refresh access-token logic
                securityContextService.relogin(deferred);
            });
            return deferred.promise;
        }

        return {
            request: {
                cache: function(element, operation, route, url, headers, params, httpConfig) {
                    if (S(url).contains('TipoDefinition')) {
                        httpConfig.cache = tipoCache.getMemory();
                    } else {
                        if (S(url).contains("TipoUser/default") || S(url).contains("tipo_app_info")) {
                            headers = _.extend(headers, {
                                'Cache-Control': 'no-store'
                            });
                        } else if (!deviceInformation.isMobile) {
                            httpConfig.cache = tipoCache.getMemory();
                        }
                    }
                    return {
                        element: element,
                        headers: headers,
                        params: params,
                        httpConfig: httpConfig
                    };
                },
                security: function(element, operation, route, url, headers, params, httpConfig) {
                    var accessToken = securityContextService.getCurrentIdToken();
                    if (!_.isUndefined(accessToken)) {
                        headers = _.extend(headers, {
                            'Authorization': accessToken
                        });
                    }

                    return {
                        element: element,
                        headers: headers,
                        params: params,
                        httpConfig: httpConfig
                    };
                }
                // version_stamp: function(element, operation, route, url, headers, params, httpConfig){
                //     if ($rootScope.only_cdn_host) {
                //         url = url.replace(/(\/\/.+\/)/,"//" + $rootScope.only_cdn_host + "/")
                //         url = url.replace("http","https");
                //         // url = "https://" + $rootScope.only_cdn_host + url;
                //     };

                //     return {
                //         element: element,
                //         headers: headers,
                //         params: params,
                //         url: url,
                //         httpConfig: httpConfig
                //     };
                // }
            },
            response: {
                // Extracts the payload from the wrapped API response
                extractData: function(rawData, operation, what, url, response, deferred) {
                    var headers = response.headers();
                    var version_stamp = headers["x-tipo-version-stamp"];
                    if ($rootScope.version_stamp && $rootScope.version_stamp !== version_stamp && !S(url).contains("TipoCustomization/default")) {
                        console.log("refresh entire app stored : [" + $rootScope.version_stamp + "], received : [" + version_stamp + "]");
                        tipoCache.clearAll();
                        $templateCache.removeAll();
                        $window.location.reload(true);
                    };
                    _.forEach(rawData.refresh_list, function(value) {
                        if (_.startsWith(value, "/")) {
                            value = value.substring(1);
                        }
                        if (_.startsWith(value, 'tipo/')) {
                            var broken = value.split("/");
                            tipoCache.evict(broken[2], broken[3]);
                        } else {
                            var attach_version_stamp = "?version_stamp=" + $rootScope.version_stamp;
                            $templateCache.remove(value + attach_version_stamp);
                            $templateCache.remove(value);
                            var $httpDefaultCache = $cacheFactory.get('$http');
                            $httpDefaultCache.remove(value);
                            $httpDefaultCache.remove(value + attach_version_stamp);
                            var port_string = $location.port() === "80" || $location.port() === "443" ? "" : ":" + $location.port();
                            var url = $location.protocol() + "://" + $location.host() + port_string + "/" + value;
                            var url_version_stamp = $location.protocol() + "://" + $location.host() + port_string + "/" + value + attach_version_stamp;
                            $httpDefaultCache.remove(url);
                            $httpDefaultCache.remove(url_version_stamp);
                            tipoCache.evict(value);
                            // $httpDefaultCache.removeAll();
                            // $templateCache.removeAll();

                            if (!_.startsWith(value, "api/")) {
                                var config = {
                                    headers: {
                                        'X-bypass-cdn': 'true',
                                        'Cache-Control': 'no-cache'
                                    },
                                    cache: false
                                };
                                $http({
                                    method: "PURGE",
                                    url: value,
                                    headers: { "Content-Type": "text/plain" }
                                }).then(function() {
                                    setTimeout(function() {
                                        $http.get(value + attach_version_stamp, config).then(function(tpl) {
                                            $templateCache.put(value, tpl.data);
                                            $templateCache.put(value + attach_version_stamp, tpl.data);
                                            if (S(value).contains("custom.css")) {
                                               tipoRouter.toTipoView("TipoCustomization","default");
                                               setTimeout(function() {
                                                $window.location.reload(true);
                                               },3000);
                                            };
                                        });
                                    }, 5000);
                                })
                            } else {
                                var config = {
                                    headers: {
                                        'X-bypass-cdn': 'true'
                                    }
                                };
                                setTimeout(function() {
                                    if (value.indexOf("CustomScript.js") !== -1) {
                                        $http.get(value + "?tipo_version_stamp=" + $rootScope.version_stamp, config);
                                    }else{
                                        $http.get(value , config);
                                    }
                                }, 2000);
                            }

                            // if (value.indexOf("CustomScript.js") !== -1) {
                            //     var head = document.getElementsByTagName('body')[0];
                            //     var script = document.createElement('script');
                            //     script.type = 'text/javascript';
                            //     script.src = value + attach_version_stamp;
                            //     setTimeout(function() {
                            //         head.appendChild(script);
                            //     },2000);
                            // }
                            if (value.indexOf("themes.js") !== -1) {
                                var head = document.getElementsByTagName('head')[0];
                                var script = document.createElement('script');
                                script.type = 'text/javascript';
                                script.src = "https://" + $rootScope.cdn_host + value;
                                head.appendChild(script);
                            }
                        }
                    });

                    if (rawData && rawData.response) {
                        var resp = rawData.response;
                        resp.tipo_name = rawData.tipo_name;
                        resp.perm = rawData.perm;
                        resp.count = rawData.count;
                        resp.tab_url = rawData.tab_url;
                        resp.user_message = rawData.user_message;
                        resp.return_url = rawData.return_url;
                        resp.restricted_actions = rawData.restricted_actions;
                        resp.last_evaluated_key = rawData.last_evaluated_key;
                        return rawData.response;
                    } else if (rawData && rawData.data) {
                        rawData.data.tab_url = rawData.tab_url;
                        rawData.data.perm = rawData.perm;
                        rawData.data.user_message = rawData.user_message;
                        rawData.data.return_url = rawData.return_url;
                        return rawData.data;
                    } else {
                        return rawData;
                    }
                }
            },
            errors: {
                handleError: function(response, deferred, responseHandler) {
                    console.log('error handling');
                    console.error(response);

                    if (response.status === 401) {
                        refreshAccesstoken().then(function() {
                            // Repeat the request and then call the handlers the usual way.
                            response.config.headers.Authorization = securityContextService.getCurrentIdToken();
                            $http(response.config).then(responseHandler, deferred.reject);
                            // Be aware that no request interceptors are called this way.
                        });
                        return false;
                    } else {
                        if (response.status === 520) {
                            $rootScope.readonly = true;
                            $rootScope.readonlytiponame = "TipoSubscriptions";
                            $rootScope.readonlyid = "default";
                            $rootScope.readonlyrf = "toTipoView";
                            tipoRouter.toTipoView("TipoSubscriptions","default");
                            // tipoErrorHandler.handleError(response, deferred);
                        }
                        if (response.status === 521) {
                            // tipoErrorHandler.handleError(response, deferred);
                            // tipoRouter.to('captureCreditCard');
                            tipoRouter.endStateChange();
                            var promise = $mdDialog.show({
                                templateUrl: 'user/_views/capture-creditcard-dialog.tpl.html',
                                skipHide: true,
                                clickOutsideToClose: false,
                                escapeToClose: false,
                                hasBackdrop: false,
                                controller: 'CreditCardController',
                                controllerAs: 'controller',
                                locals: {cardHeading : response.data.message}
                              });
                        } else {
                            tipoErrorHandler.handleError(response, deferred);
                        }
                    }
                    return true;
                }
            }
        };
    }



    // Configures Restangular for API interactions
    function configureRestangular(
        RestangularConfigurer,
        tipoRouter,
        $rootScope,
        securityContextService,
        tipoErrorHandler,
        tipoCache,
        cognitoService,
        $templateCache,
        $cacheFactory,
        $location,
        $http,
        $q,
        $window,
        $mdDialog) {

        var interceptors = getAllInterceptors(tipoRouter, $rootScope, securityContextService, tipoErrorHandler, tipoCache, cognitoService, $templateCache, $cacheFactory, $location, $http, $q, $window, $mdDialog);
        var location = $window.location;
        var relativeUrl = location.pathname;
        if (_.startsWith(relativeUrl, '/app')) {
            // relativeUrl = '/api/d/tipotapp/studentmanagementapp' + relativeUrl.substring(4);
            // relativeUrl = '/api/d/tipotapp/abcde' + relativeUrl.substring(4);
            // relativeUrl = '/api/d/deltagene/billionbases' + relativeUrl.substring(4);
            relativeUrl = '/api' + relativeUrl.substring(4);
            // relativeUrl = '/api/d/hr/hrbuddy' + relativeUrl.substring(4);
            // relativeUrl = '/api/d/hr/dialadish' + relativeUrl.substring(4);
        } else {
            // relativeUrl = '/api/d/tipotapp/abcde';
            // relativeUrl = '/api/d/tipotapp/studentmanagementapp';
            // relativeUrl = '/api/d/deltagene/billionbases';
            // relativeUrl = '/api/d/hr/dialadish';
            relativeUrl = '/api';
            // relativeUrl = '/api/d/hr/hrbuddy';
        }
        var baseUrl = location.origin + relativeUrl;
        console.info('API Url - ' + baseUrl);
        RestangularConfigurer.setBaseUrl(baseUrl);
        RestangularConfigurer.addFullRequestInterceptor(interceptors.request.cache);
        RestangularConfigurer.addFullRequestInterceptor(interceptors.request.security);
        RestangularConfigurer.setPlainByDefault(true);
        // RestangularConfigurer.addFullRequestInterceptor(interceptors.request.version_stamp);
        RestangularConfigurer.addResponseInterceptor(interceptors.response.extractData);
        RestangularConfigurer.setErrorInterceptor(interceptors.errors.handleError);
        RestangularConfigurer.setDefaultHeaders({
            'Content-Type': 'application/json'
        });
    }

    // Tipo Resource. This shall be used for invoking the Tipo REST APIs
    function TipoResource(
        Restangular,
        securityContextService,
        $rootScope,
        tipoRouter,
        tipoErrorHandler,
        tipoCache,
        cognitoService,
        $mdMedia,
        $cacheFactory,
        $location,
        $http,
        $templateCache,
        $q,
        $window,
        $mdDialog) {
        deviceInformation = $.ua.device;
        var isSmallScreen = $mdMedia('xs');
        deviceInformation.isMobile = isSmallScreen || deviceInformation.type === 'mobile';
        var factory = Restangular.withConfig(_.partialRight(configureRestangular, tipoRouter, $rootScope, securityContextService, tipoErrorHandler, tipoCache, cognitoService, $templateCache, $cacheFactory, $location, $http, $q, $window, $mdDialog));
        return factory;
    }

    // Tipo Resource. This shall be used for all the HTTP XHR calls

    function httpInterceptors(localStorageService, $rootScope, $templateCache, $stateParams, $location) {
        return {
            request: function(config) {
                // var accessToken = securityContextService.getCurrentIdToken();
                var accessToken = _.get(localStorageService.get('security_context'), 'tokenDetails.id_token');
                if ($rootScope.version_stamp) {
                    if (!config.params) {
                        config.params = {};
                    };
                    if (_.startsWith(config.url, "g/") || _.startsWith(config.url, "api/")) {
                        config.params.version_stamp = $rootScope.version_stamp
                    };
                    if (!_.isUndefined(accessToken) && _.startsWith(config.url, "api/")) {
                        config.headers['Authorization'] = accessToken;
                    }
                    if (_.startsWith(config.url, "g/") && $rootScope.cdn_host && !$templateCache.get(config.url + "?version_stamp=" + config.params.version_stamp)) {
                        // if (_.startsWith(config.url, "g/") && !S(config.url).contains("tipoapp") && $rootScope.cdn_host && !$templateCache.get(config.url + "?version_stamp=" + config.params.version_stamp)) {
                        if (_.endsWith(config.url, "___TipoApp") || _.endsWith(config.url, "___TipoDefinition") || (_.startsWith($stateParams.perspective, "TipoApp.") && !(config.headers['X-bypass-cdn'] === "true" || config.method === "PURGE") )) {
                            config.url = "https://" + $rootScope.only_cdn_host + config.url;
                            config.params.version_stamp = $rootScope.tipoapp_version || $rootScope.version_stamp;
                        } else {
                            if (config.headers['X-bypass-cdn'] === "true" || config.method === "PURGE") {
                                delete config.params.version_stamp;
                            }else{
                                // config.headers['Cache-Control'] = "no-cache";
                            }
                            config.url = "https://" + $rootScope.cdn_host + config.url;
                        }

                    } else {
                        if (config.method === "GET" && S(config.url).contains("/api/") && !S(config.url).contains("TipoUser/default")) {
                            config.params.url = angular.copy(config.url);
                            config.url = config.url.replace(/(\/\/.+\/api)/, "//" + $rootScope.only_cdn_host + "api");
                            if (!S(config.url).contains("https")) {
                                config.url = config.url.replace("http", "https");
                            };
                            config.params.version_stamp = $rootScope.version_stamp;
                        } else if ((config.method === "PUT" && config.params.tipo_action === "attach_card") && S(config.url).contains("/api/")) {
                            config.params.url = angular.copy(config.url);
                            config.url = config.url.replace(/(\/\/.+\/TipoSubscriptions)/, "//" + $rootScope.app_internal_host + "api/TipoSubscriptions");
                            if (!S(config.url).contains("https")) {
                                config.url = config.url.replace("http", "https");
                            };
                        } else if ((config.method === "PUT" || config.method === "POST") && S(config.url).contains("/api/")) {
                            config.params.url = angular.copy(config.url);
                            config.url = config.url.replace(/(\/\/.+\/api)/, "//" + $rootScope.app_internal_host + "api");
                            if (!S(config.url).contains("https")) {
                                config.url = config.url.replace("http", "https");
                            };
                        };
                        var port_string = $location.port() === "80" || $location.port() === "443" ? "" : ":" + $location.port();
                        var url = $location.protocol() + "://" + $location.host() + port_string;
                        config.headers['X-Tipo-Origin'] = url;
                        // if (!_.isUndefined(accessToken) && _.startsWith(config.url, "api/")) {
                        //     config.headers['Authorization'] = accessToken;
                        // }
                    }
                    // else if (_.startsWith(config.url, "api/") && $rootScope.only_cdn_host) {
                    //     config.url = "https://" + $rootScope.only_cdn_host + config.url;
                    // };
                };
                return config;
            }
        }
    }

    angular.module('tipo.common')
        .factory('httpInterceptors', httpInterceptors)
        .factory('tipoResource', TipoResource)
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('httpInterceptors');
        });

})();