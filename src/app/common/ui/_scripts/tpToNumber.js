(function () {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('tpToNumber', function ($window) {
      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          ngModel.$formatters.push(function(value) {
            return parseFloat(value);
          });
        }
      };
    }
  );

})();
