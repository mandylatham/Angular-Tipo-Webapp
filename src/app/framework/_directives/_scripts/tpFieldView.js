(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldView', function () {
      return {
        scope: {
          field: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-field-view.tpl.html',
        link: function(scope, element, attrs){
        }
      };
    }
  );

})();
