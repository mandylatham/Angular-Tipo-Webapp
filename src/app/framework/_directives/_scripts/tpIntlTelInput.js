(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpIntlTelInput', function ($log) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl){
          // Warning for bad directive usage.
          if ((!!attrs.type && (attrs.type !== 'text' && attrs.type !== 'tel' && attrs.type !== 'number')) || element[0].tagName !== 'INPUT') {
            $log.warn('ng-intl-tel-input can only be applied to a *text* or *tel* input');
            return;
          };
          var initObj = {};
          initObj.formatOnDisplay = true;
          initObj.utilsScript = "_scripts/non-bower-managed/phonenumber_utils.js";
          element.intlTelInput(initObj);

          // Validation.
          ctrl.$validators.ngIntlTelInput = function (value) {
            // if phone number is deleted / empty do not run phone number validation
            if (value || element[0].value.length > 0) {
                return element.intlTelInput('isValidNumber');
            } else {
                return true;
            }
          };
          // Set model value to valid, formatted version.
          ctrl.$parsers.push(function (value) {
            var test = element.intlTelInput('getNumber',"International");
            element.intlTelInput("setNumber", element.intlTelInput('getNumber',"International"));
            return element.intlTelInput('getNumber');
          });
          // Set input value to model value and trigger evaluation.
          ctrl.$formatters.push(function (value) {
            if (value) {
              if(value.charAt(0) !== '+') {
                value = '+' + value;
              }
              element.intlTelInput('setNumber', value);
            }
            return value;
          });

          // scope.$watch(attrs.ngModel,function(new_val,old_val){
          //   if (!element.intlTelInput('isValidNumber')){
              
          //   }
          // })
        }
      };
    }
  );

})();