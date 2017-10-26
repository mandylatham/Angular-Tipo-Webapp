(function () {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('tpPasswordMatch', function ($window) {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
          if (!ngModel) return; // do nothing if no ng-model

          // watch own value and re-validate on change
          scope.$watch(attrs.ngModel, function() {
            validate();
          });

          // observe the other value and re-validate on change
          attrs.$observe('tpPasswordMatch', function(val) {
            validate();
          });

          var validate = function() {
            // values
            var val1 = ngModel.$viewValue;
            var val2 = attrs.tpPasswordMatch;

            // set validity
            ngModel.$setValidity('tpPasswordMatch', val1 === val2);
          };
        }
      };
    }
  );

})();
