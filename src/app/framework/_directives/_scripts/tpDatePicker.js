(function() {

    'use strict';

    var module = angular.module('tipo.framework');

    return module.directive('tpDatePicker', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                fpOpts: '&',
                fpOnSetup: '&'
            },
            link: function(scope, element, attrs) {
                var vp = new flatpickr(element[0], scope.fpOpts());;

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