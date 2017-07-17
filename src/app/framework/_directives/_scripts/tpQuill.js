(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpQuill', function () {
      return {
        scope: {
          
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-quill.tpl.html',
        link: function(scope, element, attrs, ctrl){
          
        }
      };
    }
  );

})();