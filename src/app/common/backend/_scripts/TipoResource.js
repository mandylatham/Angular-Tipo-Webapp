(function() {

  'use strict';

  var TIPO_API_URLS = {
    BASE: '/api/v1',
    METADATA: 'metadata',
    DATA: 'data'
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
        security: function(element, operation, route, url, headers) {
          var accessToken = securityContextService.getCurrentAccessToken();
          if(!_.isUndefined(accessToken)){
            headers = _.extend(headers, {Authorization: 'Bearer ' +  accessToken});
          }
 
          return {
            headers: headers,
            element: element
          };
        }
      },
      response: {
        // Extracts the payload from the wrapped API response
        extractData: function(rawData) {
          var extractedData = rawData.data || {};
          return extractedData;
        }
      },
      errors: {
        handleError: function(response, deferred) {
          console.error(response);
        }
      }
    };
  }



  // Configures Restangular for API interactions
  function configureRestangular(RestangularConfigurer, securityContextService) {
 
    var interceptors = getAllInterceptors(securityContextService);
    
    RestangularConfigurer.setBaseUrl(TIPO_API_URLS.BASE);
    RestangularConfigurer.addRequestInterceptor(interceptors.request.sanitize);
    RestangularConfigurer.addFullRequestInterceptor(interceptors.request.security);
    RestangularConfigurer.addResponseInterceptor(interceptors.response.extractData);
    RestangularConfigurer.setErrorInterceptor(interceptors.errors.handleError);
  }

  // Tipo Resource. This shall be used for invoking the Tipo REST APIs
  function TipoResource(Restangular, securityContextService) {
    var factory = Restangular.withConfig(_.partialRight(configureRestangular, securityContextService));

    factory.getMetadataSubDomain = function() {
      return factory.all(TIPO_API_URLS.METADATA);
    };

    factory.getDataSubDomain = function() {
      return factory.all(TIPO_API_URLS.DATA);
    };

    return factory;
  }

  angular.module('tipo.common')
    .factory('tipoResource', TipoResource);

})();