(function () {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('tpIncludeReplace', function () {
      return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
          el.replaceWith(el.children());
        }
      };
    }
  );

})();
