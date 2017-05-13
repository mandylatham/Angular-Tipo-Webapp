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
          scope.addValue = function(){
            allowedvalues.push(scope.searchTerm.text);
            scope.searchTerm.text = "";
          }

        }
      };
    }
  );

})();