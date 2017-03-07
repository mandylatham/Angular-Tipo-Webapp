(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpPerm', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        console.log("enetered tpPerm");
        console.log(scope);
        console.log(scope.tipo);
        if (scope.tipo) {
          var perm = scope.tipo.perm;
          if (perm.substr(0,1) === '0'){
            element.hide();
          }
          if (perm.substr(1,1) === '0') {
            scope.tipo.disableclick = true;
          }
        }else{
          if (scope.tipoRootController.tipo.perm) {
            var perm = scope.tipoRootController.tipo.perm;            
            if (perm.substr(1,1) === '0'){
              element.hide();
            }
            if (perm.substr(3,1) === '0') {
              scope.disableedit = true;
            }
            if (perm.substr(6,1) === '0') {
              scope.disabledelete = true;
            };
          };
        }
      }
    };
  });

})();