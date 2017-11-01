(function () {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('tpIsJs', function ($window) {
      return {
        restrict: 'A',
        require: '?ngModel',
        // scope: {
        //   tpIsJs: "="
        // },
        link: function(scope, element, attrs, ngModel) {
          if (!ngModel) return; // do nothing if no ng-model

          // watch own value and re-validate on change
          scope.$watch(attrs.ngModel, function() {
            validate();
          });

          var validate = function() {
            // values
            var jscode = ngModel.$viewValue;
                try {
                    eval(jscode); 
                    ngModel.$setValidity('tpIsJs', true);
                } catch (e) {
                    // set validity
                    ngModel.$setValidity('tpIsJs', false);
                    scope.tipoRootController.error_message = e.message;

                }
          };
        }
      };
    }
  );

})();
