(function() {

    'use strict';

    var module = angular.module('tipo.framework');

    return module.directive('tpDatePicker', function(tipoManipulationService) {
        return {
            restrict: 'A',
            scope: {
                fpOpts: '&',
                fpOnSetup: '&',
                fieldvalue: '=',
                ngModel: '='
            },
            link: function(scope, element, attrs, ctrl) {
                var vp = new flatpickr(element[0], scope.fpOpts());
                if(navigator.platform === 'iPhone' || navigator.platform === 'iPad') {
                    if(!scope.fieldvalue) {
                        scope.fieldvalue = tipoManipulationService.getISODate();
                        scope.ngModel = angular.copy(scope.fieldvalue);
                    }
                }
                  
                if (scope.fpOnSetup) {
                    scope.fpOnSetup({
                        fpItem: vp
                    });
                }

                // destroy the flatpickr instance when the dom element is removed
                element.on('$destroy', function() {
                    vp.destroy();
                });
            }
        };
    });

})();