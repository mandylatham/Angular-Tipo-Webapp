(function() {

  'use strict';

  var ACCOUNT_RESOURCE = 'TipoAccount/default';

  function AccountService (
    tipoResource,
    tipoErrorHandler,
    $window) {

    var _instance = this;

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
  }

  angular.module('tipo.common')
    .service('accountService', AccountService);

})();