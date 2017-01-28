(function () {

  'use strict';

  var module = angular.module('tipo.framework');
  return module.directive('tpS3ExplorerView', function () {
      return {
        templateUrl: 'framework/_directives/_views/tp-s3-explorer-view.tpl.html',
        controller: controller
      };
      
      function controller($scope, $mdDialog, s3Service) {
        $scope.selected = $scope.field._value.key.selected || [];
        $scope.Bucket = $scope.field._value.key && $scope.field._value.key.bucket || '<bucket>';
      }
  });
})();