(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function DefinitionDialogController($scope, $mdDialog) {

    this.mode = $scope.tipoMode;

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

  return module.directive('tpView', function ($mdDialog, tipoManipulationService) {
      return {
        scope: {
          definition: '=',
          mode: '@?'
        },
        controller: function($scope){
          $scope.mode = $scope.mode || 'view';

          this.getMode = function(){
            return $scope.mode;
          };

        },
        restrict: 'EA',
        replace: false,
        templateUrl: 'framework/_directives/_views/tp-view.tpl.html',
        link: function(scope, element, attrs){
        }
      };
    }
  );

})();
