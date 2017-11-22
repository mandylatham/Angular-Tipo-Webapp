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
        $window) {

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
                        httpConfig.cache = tipoCache.getPersistent();
                    } else {
                        if (!deviceInformation.isMobile) {
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
            },
            response: {
                // Extracts the payload from the wrapped API response
                extractData: function(rawData, operation, what, url, response, deferred) {
                    var version_stamp = response.headers()["x-tipo-version-stamp"];
                    if ($rootScope.version_stamp && $rootScope.version_stamp !== version_stamp) {
                        console.log("refresh entire app stored : [" + $rootScope.version_stamp + "], received : [" + version_stamp + "]");
                        tipoCache.clearAll();
                        $templateCache.removeAll();
                        $window.location.reload();
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
                            var url = $location.protocol() + "://" + $location.host() + ":" +
                                $location.port() + "/" + value;
                            $httpDefaultCache.remove(url);

                            if (!_.startsWith(value,"api/")) {
                                $http({
                                method: "PURGE",
                                url: value, 
                                crossDomain: true,
                                headers: { "Content-Type": "text/plain" }
                                })
                                .then(function(){
                                    setTimeout(function() {
                                        $http.get(value).then(function(tpl){
                                            $templateCache.put(value,tpl.data);
                                            $templateCache.put(value + attach_version_stamp,tpl.data);
                                        });
                                    },2000);
                                });
                            }else{
                                var config = {headers:  {
                                                    'Pragma': 'no-cache',
                                                  }
                                              };
                                setTimeout(function() {
                                    $http.get(value,config);
                                    },2000);
                            }
                            // setTimeout(function() {
                                 
                            //     // var config = {};

                            //     // $templateCache.put(value, $.ajax({
                            //     //     type: "GET",
                            //     //     headers: {
                            //     //         'Pragma': 'no-cache',
                            //     //     },
                            //     //     url: value,
                            //     //     crossDomain: true
                            //     // }));
                            // }, 2000);

                            if (value.indexOf("CustomScript.js") !== -1) {
                                var head = document.getElementsByTagName('head')[0];
                                var script = document.createElement('script');
                                script.type = 'text/javascript';
                                script.src = url;
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
                        return rawData.response;
                    } else if (rawData && rawData.data) {
                        rawData.data.tab_url = rawData.tab_url;
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
                            // tipoRouter.toTipoView("TipoSubscriptions","default");
                            // tipoErrorHandler.handleError(response, deferred);
                        } if (response.status === 521) {
                          tipoRouter.to('captureCreditCard');              
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
        $window) {

        var interceptors = getAllInterceptors(tipoRouter, $rootScope, securityContextService, tipoErrorHandler, tipoCache, cognitoService, $templateCache, $cacheFactory, $location, $http, $q, $window);
        var location = $window.location;
        var relativeUrl = location.pathname;
        if (_.startsWith(relativeUrl, '/app')) {
            // relativeUrl = '/api/d/tipotapp/tourmanagmentapp' + relativeUrl.substring(4);
            // relativeUrl = '/api/d/tipotapp/sdm' + relativeUrl.substring(4);
            // relativeUrl = '/api/d/deltagene/billionbases' + relativeUrl.substring(4);
            relativeUrl = '/api' + relativeUrl.substring(4);
            // relativeUrl = '/api/d/hr/hrbuddy' + relativeUrl.substring(4);
            // relativeUrl = '/api/d/hr/dialadish' + relativeUrl.substring(4);
        } else {
            // relativeUrl = '/api/d/tipotapp/sdm';
            // relativeUrl = '/api/d/tipotapp/tourmanagmentapp';
            // relativeUrl = '/api/d/deltagene/billionbases';
            // relativeUrl = '/api/d/hr/dialadish';
            relativeUrl = '/api';
            // relativeUrl = '/api/d/hr/hrbuddy';
        }
        var baseUrl = location.origin + relativeUrl;
        console.info('API Url - ' + baseUrl);
        RestangularConfigurer.setBaseUrl(baseUrl);
        RestangularConfigurer.setPlainByDefault(true);
        RestangularConfigurer.addFullRequestInterceptor(interceptors.request.cache);
        RestangularConfigurer.addFullRequestInterceptor(interceptors.request.security);
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
        $window) {
        deviceInformation = $.ua.device;
        var isSmallScreen = $mdMedia('xs');
        deviceInformation.isMobile = isSmallScreen || deviceInformation.type === 'mobile';
        var factory = Restangular.withConfig(_.partialRight(configureRestangular, tipoRouter, $rootScope, securityContextService, tipoErrorHandler, tipoCache, cognitoService, $templateCache, $cacheFactory, $location, $http, $q, $window));
        return factory;
    }

    // Tipo Resource. This shall be used for all the HTTP XHR calls

    function httpInterceptors(localStorageService, $rootScope,$templateCache) {
        return {
            request: function(config) {
                // var accessToken = securityContextService.getCurrentIdToken();
                var accessToken = _.get(localStorageService.get('security_context'), 'tokenDetails.id_token');
                if ($rootScope.version_stamp) {
                    if (!config.params) {
                        config.params = {};
                    };
                    var relative_path = "";
                    if ($rootScope.relative_path) {
                        relative_path = $rootScope.relative_path;
                    };
                    if (_.startsWith(config.url, "g/") || _.startsWith(config.url, "api/")) {
                        config.params.version_stamp = $rootScope.version_stamp
                    };
                    if (!_.isUndefined(accessToken) && _.startsWith(config.url, "api/")) {
                        config.headers['Authorization'] = accessToken;
                    }
                    if (_.startsWith(config.url, "g/") && $rootScope.cdn_host && !$templateCache.get(config.url + "?version_stamp=" + config.params.version_stamp)) {
                        if (!_.startsWith(relative_path, "/")) {
                            relative_path = "/" + relative_path;
                        }
                        if (!_.endsWith(relative_path, "/")) {
                            relative_path = relative_path + "/";
                        }
                        config.url = "https://" + $rootScope.cdn_host + config.url;
                    };
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