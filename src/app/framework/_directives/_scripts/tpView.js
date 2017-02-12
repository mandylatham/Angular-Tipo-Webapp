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
        require: '^?form',
        scope: {
          root: '=',
          definition: '=',
          mode: '@?'
        },
        controller: function($scope){
          $scope.mode = $scope.mode || 'view';
          this.getForm = function(){
            return $scope.formCtrl;
          }
          this.getMode = function(){
            return $scope.mode;
          };

        },
        restrict: 'EA',
        replace: false,
        templateUrl: 'framework/_directives/_views/tp-view.tpl.html',
        link: function(scope, element, attrs, formCtrl){
          scope.formCtrl = formCtrl;
        }
      };
    }
  );

})();
