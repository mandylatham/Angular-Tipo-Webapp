(function() {

  'use strict';

  var SUBSCRIPTION_RESOURCE = 'subscription';
  var ACCOUNT_RESOURCE = 'TipoAccount/default';

  function MetadataService(
    tipoResource,
    tipoErrorHandler,
    $q,
    $window) {

    var _instance = this;

    _instance.loadAppMetadata = function() {
      var origin = $window.location.href;
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

    _instance.loadAccount = function() {
      var promise = tipoResource.one(ACCOUNT_RESOURCE).get();
      return promise.then(function(account){
        _instance.account = account;
        return account;
      }, function(){
        console.warn('Could not fetch the account. This indicates that the Tipo APIs are not reachable');
        var exception = {
          headerCode: '500',
          headerMessage: 'Application Unreachable',
          detailCode: '500',
          detailMessage: 'Could not fetch the account. This indicates that the backend APIs are not reachable'
        };
        tipoErrorHandler.handleError(exception);
        return {};
      });
    };

    function loadGeolocation(){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
          function(position){
            _instance.geoLocation = position.coords;
          });
      }
    }
    loadGeolocation();
  }

  angular.module('tipo.common')
    .service('metadataService', MetadataService);

})();