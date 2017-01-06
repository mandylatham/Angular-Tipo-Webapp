(function() {

  'use strict';

  var SUBSCRIPTION_RESOURCE = 'subscription';

  function MetadataService(
    tipoResource,
    tipoErrorHandler,
    $window) {

    var _instance = this;

    _instance.loadAppMetadata = function() {
      var origin = $window.location.origin;
      var promise = tipoResource.one(SUBSCRIPTION_RESOURCE).get({ type: 'application', url: origin });
      promise = promise.then(function(metadata){
        _instance.applicationMetadata = metadata;
        return metadata;
      }, function(){
        console.warn('Could not fetch the application metadata. This indicates that the Tipo APIs are not reachable');
        var exception = {
          headerCode: '500',
          headerMessage: 'Application Unreachable',
          detailCode: '500',
          detailMessage: 'Could not fetch the application metadata. This indicates that the backend APIs are not reachable'
        };
        tipoErrorHandler.handleError(exception);
        return {};
      });
      return promise;
    };
  }

  angular.module('tipo.common')
    .service('metadataService', MetadataService);

})();