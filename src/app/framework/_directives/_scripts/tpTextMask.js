(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpTextMask', function () {
      return {
        scope: {
          textPattern: "=",
          fieldType: "=",
          fieldValue: "=",
          fieldLabel: "=",
          context: "=",
          forceValidation: "=",
          patternValidation: "=",
          placeholderChar: "=",
          guide: "="
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-text-mask.tpl.html',
        link: function(scope, element, attrs, ctrl){
          var pattern = scope.textPattern;
          scope.pattern = {mask: []};
          if (!scope.placeholderChar) {
            scope.pattern.placeholderChar = '\u2000';
          };
          if (scope.guide) {
            scope.pattern.guide = false;
          };
          scope.name = attrs.name;
          scope.fieldLabel = scope.fieldLabel || "";
          scope.fieldValue = scope.fieldValue || "";
          scope.regexValidation = ""
          for (var i = 0; i < pattern.length; i++) {
            if (pattern[i] !== "#") {
              scope.regexValidation = scope.regexValidation + "\\" + pattern[i];
              scope.pattern.mask.push(pattern[i]);
            }else{
              if (scope.fieldType === "integer") {
                scope.regexValidation = scope.regexValidation + "\\d";
                scope.pattern.mask.push(/\d/);
              }else{
                scope.regexValidation = scope.regexValidation + "\\w";
                scope.pattern.mask.push(/\w/);
              }
            };
          };
          if (!scope.forceValidation) {
            scope.regexValidation = scope.patternValidation || "";
          }else{
            scope.regexValidation = new RegExp(scope.regexValidation);
          }
          scope.convertToRaw = function(conformedValue,config){
            scope.fieldValue = "";
            for (var i = 0; i < config.currentCaretPosition; i++) {
              if (config.placeholder[i] === "_") {
                scope.fieldValue = scope.fieldValue + conformedValue[i];
              };
            }
            return conformedValue;
          }
          scope.pattern.pipe = scope.convertToRaw;
        }
      };
    }
  );

})();