(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpMultipleChoice', function($mdColorUtil, $mdColors) {
        return {
            require: 'ngModel',
            scope: {
                isarray: '=',
                fieldvalue: '=',
                istiporequired: '=',
                allowedvalues: '=',
                defaultValue: '@',
                allowcreate: '=',
                description: '=',
                fieldname: '=',
                readOnly: '='
            },
            restrict: 'EA',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-multiple-choice.tpl.html',
            link: function(scope, element, attrs, ctrl) {
                scope.primaryColor = $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-500'));
                scope.model = {};
                scope.model.field = scope.fieldvalue;

                scope.toggle = function(item, list) {
                    var idx = list.indexOf(item);
                    if (idx > -1) {
                        list.splice(idx, 1);
                    } else {
                        list.push(item);
                    }
                };

                scope.exists = function(item, list) {
                    return list.indexOf(item) > -1;
                };

                scope.updateValue = function() {
                    scope.fieldvalue = scope.model.field;
                }

                scope.$watch(function() { return scope.fieldvalue }, function(newValue, oldValue) {
                    if (scope.fieldvalue && (scope.model.field !== scope.fieldvalue)) {
                        scope.model.field = scope.fieldvalue;
                    }
                    // ctrl.$setViewValue(scope.fieldvalue);
                }, true);
            }
        };
    });

})();