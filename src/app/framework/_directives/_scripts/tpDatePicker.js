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
                var options = scope.fpOpts();
                if(navigator.platform === 'iPhone' || navigator.platform === 'iPad') {
                    // options.disableMobile = true;
                    options.onOpen = function(selectedDates, dateStr, instance) {
                        if(dateStr === '') {
                            vp.setDate(Date.now(), true);
                        }
                    }
                }
                
                var vp = new flatpickr(element[0], options);;
                
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