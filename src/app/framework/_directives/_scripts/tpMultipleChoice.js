(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpMultipleChoice', function($mdColorUtil, $mdColors) {
        return {
            require: '?ngModel',
            scope: {
                isarray: '=',
                istiporequired: '=',
                allowedvalues: '=',
                defaultValue: '@',
                description: '=',
                fieldname: '=',
                readOnly: '=',
                fieldvalue: '=',
            },
            restrict: 'EA',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-multiple-choice.tpl.html',
            link: function(scope, element, attrs, ctrl) {
                scope.primaryColor = $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-500'));
                scope.model = {};
                scope.model.field = scope.fieldvalue;
                if (scope.isarray && !scope.model.field) {
                    scope.model.field = [];
                };

                scope.toggle = function(item, list) {
                    if (list && list.length >= 0) {
                        var idx = list.indexOf(item);
                        if (idx > -1) {
                            list.splice(idx, 1);
                        } else {
                            list.push(item);
                        }
                        ctrl.$setViewValue(list);
                        // scope.ngModel = angular.copy(list);
                    }
                };

                scope.exists = function(item, list) {
                    if (list && list.length >= 0) {
                        return list.indexOf(item) > -1;
                    } else {
                        return false;
                    }
                };

                scope.updateValue = function(selectedObj) {
                    ctrl.$setViewValue(selectedObj);
                    // scope.ngModel = angular.copy(selectedObj);
                }

            }
        };
    });

})();