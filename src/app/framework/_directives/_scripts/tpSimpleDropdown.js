(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpSimpleDropdown', function () {
      return {
        require: 'ngModel',
        scope: {
          isarray: '=',
          fieldvalue: '=',
          istiporequired: '=',
          allowedvalues: '=',
          allowcreate: '=',
          description: '=',
          fieldname: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-simple-dropdown.tpl.html',
        link: function(scope, element, attrs, ctrl){         
          scope.searchTerm = {};
          scope.model = {};
          scope.model.field = scope.fieldvalue;
          scope.addValue = function(){
            scope.allowedvalues.push(scope.searchTerm.text);
            scope.searchTerm.text = "";
          }

          ctrl.$viewChangeListeners.push(function() {
            scope.$eval(attrs.ngChange);
          });

          scope.$watch(function(){return scope.model.field},function(newValue, oldValue){
            scope.fieldvalue = scope.model.field;
            ctrl.$setViewValue(scope.fieldvalue);
          }, true);

          scope.$watch(function(){return scope.fieldvalue},function(newValue, oldValue){
              if (scope.model.field !== scope.fieldvalue) {
                scope.model.field = scope.fieldvalue;
              };
          });

        }
      };
    }
  );

})();