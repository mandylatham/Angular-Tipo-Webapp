(function () {

  'use strict';

  var module = angular.module('tipo.framework');
  return module.directive('tpFileView', function () {
      return {
        templateUrl: 'framework/_directives/_views/tp-file-view.tpl.html',
        controller: controller
      };
      
      function controller($scope, $mdDialog, s3Service) {
        $scope.files = $scope.field._value.key.files || [];
      }
  });
})();