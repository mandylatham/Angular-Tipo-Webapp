(function () {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('tpNoContent', function () {
      return {
        scope: {
        },
        restrict: 'EA',
        templateUrl: 'common/ui/_views/no-content.tpl.html',
        link: function(scope, element, attrs){
          scope.message = attrs.message;
        }
      };
    }
  );

})();
