(function() {

  'use strict';

  var stateChangeIndicator = function(){
    return {
      scope: {
        show: '&'
      },
      restrict: 'E',
      templateUrl: 'common/ui/_views/state-change-indicator.tpl.html'
    };
  };

  angular.module('tipo.common')
    .directive('stateChangeIndicator', stateChangeIndicator);

})();