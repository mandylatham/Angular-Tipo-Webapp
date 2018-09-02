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
                datenumber: '=',
                ngModel: '='
            },
            link: function(scope, element, attrs, ctrl) {
                var options = scope.fpOpts();
                options.onChange = function(selectedDates, dateStr, instance){
                    console.log(options);
                    if (options.enableTime && options.noCalendar) {
                        var time = moment.utc(dateStr).format('HH.mm.sss');
                        var timearray = time.split(".");
                        scope.datenumber = (timearray[0] * 3600) + (timearray[1] * 60) + (timearray[2]);
                    };
                }
                var vp = new flatpickr(element[0], options);
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