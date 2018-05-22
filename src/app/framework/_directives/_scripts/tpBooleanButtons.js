(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpBooleanButtons', function($mdColorUtil, $mdColors) {
        return {
            require: 'ngModel',
            scope: {
                truevalues: '=',
                falsevalues: '=',
                defaultValue: '@',
                description: '=',
                fieldname: '=',
                readOnly: '=',
                fieldvalue: '=',
            },
            restrict: 'EA',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-boolean-buttons.tpl.html',
            link: function(scope, element, attrs, ctrl) {
                scope.primaryColor = $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-500'));
                scope.model = {};
                scope.model.field = scope.fieldvalue || scope.defaultValue;

                scope.updateValue = function(selectedObj) {
                    ctrl.$setViewValue(selectedObj);
                }

            }
        };
    });

})();