(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpSimpleDropdown', function () {
      return {
        scope: {
          isArray: '=',
          fieldValue: '=',
          required: '=',
          allowedValues: '=',
          alloweCreate: '=',
          placeholder: '=',
          name: '='
        },
        restrict: 'EA',
        replace: true,
        template: 'framework/_directives/_views/tp-group-container.tpl.html',
        link: function(scope, element, attrs){         
          scope.searchTerm = {};
          scope.addValue = function(){
            allowedValues.push(scope.searchTerm.text);
            scope.searchTerm.text = "";
          }

        }
      };
    }
  );

})();