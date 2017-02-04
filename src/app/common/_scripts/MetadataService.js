(function () {

  'use strict';

  var SUBSCRIPTION_RESOURCE = 'subscription';
  var ACCOUNT_RESOURCE = 'TipoAccount/default';
  var PROFILE_RESOURCE = 'TipoUser/default';

  function MetadataService(
    tipoResource,
    tipoErrorHandler,
    $mdMedia,
    $q,
    $window) {

    var _instance = this;

    function checksum(string) {
      var hash = 0x12345678;
      var len = string.length;
      for (var i = 0; i < len; i++) {
        hash += (string.charCodeAt(i) * (i + 1));
      }
      return (hash & 0xffffffff).toString(16);
    }

    _instance.loadAppMetadata = function () {
      var origin = $window.location.href;
      var promise = tipoResource.one(SUBSCRIPTION_RESOURCE).get({
        type: 'application',
        url: origin
      });
      promise = promise.then(function (metadata) {
        _instance.applicationMetadata = metadata;
        return metadata;
      }, function () {
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

    _instance.loadAccount = function () {
      var promise = tipoResource.one(ACCOUNT_RESOURCE).get();
      return promise.then(function (account) {
        _instance.account = account;
        return account;
      }, function () {
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

    _instance.loadUserMetadata = function () {
      var promise = tipoResource.one(PROFILE_RESOURCE).get(undefined, {'Cache-Control': 'max-age:0'});
      return promise.then(function (profile) {
        _instance.userMetadata = profile;
        _instance.cckey = checksum(profile.role);
        return profile;
      });
    };

    function loadGeolocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            _instance.geoLocation = position.coords;
          });
      }
    }

    function loadDeviceInformation() {
      _instance.deviceInformation = $.ua.device;
      var isSmallScreen = $mdMedia('xs');
      _instance.deviceInformation.isMobile = isSmallScreen || _instance.deviceInformation.type === 'mobile';
    }

    loadGeolocation();
    loadDeviceInformation();
  }

  angular.module('tipo.common')
    .service('metadataService', MetadataService);

})();