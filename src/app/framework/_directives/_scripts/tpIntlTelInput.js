(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpIntlTelInput', function($log) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                // Warning for bad directive usage.
                if ((!!attrs.type && (attrs.type !== 'text' && attrs.type !== 'tel' && attrs.type !== 'number')) || element[0].tagName !== 'INPUT') {
                    $log.warn('ng-intl-tel-input can only be applied to a *text* or *tel* input');
                    return;
                };
                element.intlTelInput("destroy");
                var initObj = {};
                initObj.formatOnDisplay = true;
                initObj.utilsScript = "g/public/common/views/tipoapp/phonenumber_utils.js";
                initObj.initialCountry = "auto";
                initObj.separateDialCode = true;
                initObj.geoIpLookup = function(callback) {
                    $.get("https://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                        var countryCode = (resp && resp.country) ? resp.country : "";
                        callback(countryCode);
                    });
                }
                var disabled = (attrs.ngDisabled === "true");
                if (disabled) {
                    initObj.customPlaceholder = function() {
                        return "--N/A--";
                    };
                    // initObj.separateDialCode = false;
                } else {
                    initObj.customPlaceholder = function() {
                        return "Enter phone number";
                    }
                }
                element.intlTelInput(initObj);
                // Validation.
                ctrl.$validators.ngIntlTelInput = function(value) {
                    // if phone number is deleted / empty do not run phone number validation
                    if (value || element[0].value.length > 0) {
                        return element.intlTelInput('isValidNumber');
                    } else {
                        return true;
                    }
                };
                // Set model value to valid, formatted version.
                ctrl.$parsers.push(function(value) {
                    var test = element.intlTelInput('getNumber', "International");
                    test = element.intlTelInput('getNumber', "NATIONAL");
                    test = element.intlTelInput('getNumber', "E164");
                    element.intlTelInput("setNumber", element.intlTelInput('getNumber', "International"));
                    return element.intlTelInput('getNumber');
                });
                // Set input value to model value and trigger evaluation.
                ctrl.$formatters.push(function(value) {
                    if (value) {
                        element.intlTelInput('setNumber', value);
                        var countryCode = element.intlTelInput("getSelectedCountryData");
                        if (value.contains("+" + countryCode.dialCode)) {
                            value.replace("+" + countryCode.dialCode, "");
                        }
                        element.intlTelInput('setNumber', value);
                    }
                    return value;
                });
                // For Rejecting characters
                // scope.$watch(attrs.ngModel,function(new_val,old_val){
                //   if (!element.intlTelInput('isValidNumber')){

                //   }
                // })
            }
        };
    });

})();