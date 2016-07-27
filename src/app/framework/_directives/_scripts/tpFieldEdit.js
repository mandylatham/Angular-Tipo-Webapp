(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldEdit', function () {
      return {
        scope: {
          field: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-field-edit.tpl.html',
        link: function(scope, element, attrs){
        }
      };
    }
  );

})();
