(function() {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('tpStateChangeIndicator', function () {
      return {
        scope: {
          show: '&'
        },
        restrict: 'E',
        templateUrl: 'common/ui/_views/state-change-indicator.tpl.html'
      };
    }
  );

})();