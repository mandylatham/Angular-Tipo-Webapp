(function() {

  'use strict';

  var TIPO_API_URLS = {
    BASE: '/dev'
  };

  function getAllInterceptors(securityContextService) {

    return {
      request: {
        // Removes any unnecessary fields that are passed to the backend
        sanitize: function(element, operation) {
          if (operation === 'remove') {
            return null;
          } else {
            return element;
          }
        },
        security: function(element, operation, route, url, headers, params, httpConfig) {
          var accessToken = securityContextService.getCurrentAccessToken();
          if(!_.isUndefined(accessToken)){
            headers = _.extend(headers, {'Authorization': accessToken});
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
        extractData: function(rawData) {
          //var extractedData = rawData.data || {};
          //return extractedData;
          return rawData;
        }
      },
      errors: {
        handleError: function(response, deferred) {
          console.log('error handling');
          console.error(response);
          return false;
        }
      }
    };
  }

  // Configures Restangular for API interactions
  function configureRestangular(RestangularConfigurer, securityContextService) {
 
    var interceptors = getAllInterceptors(securityContextService);
    
    RestangularConfigurer.setBaseUrl(TIPO_API_URLS.BASE);
    //RestangularConfigurer.addRequestInterceptor(interceptors.request.sanitize);
    RestangularConfigurer.addFullRequestInterceptor(interceptors.request.security);
    RestangularConfigurer.addResponseInterceptor(interceptors.response.extractData);
    RestangularConfigurer.setErrorInterceptor(interceptors.errors.handleError);
  }

  // Tipo Resource. This shall be used for invoking the Tipo REST APIs
  function TipoResource(Restangular, securityContextService) {
    var factory = Restangular.withConfig(_.partialRight(configureRestangular, securityContextService));
    return factory;
  }

  angular.module('tipo.common')
    .factory('tipoResource', TipoResource);

})();