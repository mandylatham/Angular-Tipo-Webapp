(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpSimpleDropdown', function () {
      return {
        scope: {
          isarray: '=',
          fieldvalue: '=',
          required: '=',
          allowedvalues: '=',
          allowcreate: '=',
          description: '=',
          fieldname: '='
        },
        restrict: 'E',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-simple-dropdown.tpl.html',
        link: function(scope, element, attrs){         
          scope.searchTerm = {};
          scope.model = {};
          scope.model.field = scope.fieldvalue;
          scope.addValue = function(){
            allowedvalues.push(scope.searchTerm.text);
            scope.searchTerm.text = "";
          }

          scope.$watch(function(){return scope.model.field},function(){
            scope.fieldvalue = scope.model.field;
          }, true)

        }
      };
    }
  );

})();