(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function DefinitionDialogController($scope, $mdDialog) {

    this.tipoMode = $scope.tipoMode;

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

  return module.directive('tpView', function ($mdDialog) {
      return {
        scope: {
          definition: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-view.tpl.html',
        link: function(scope, element, attrs){

          scope.tipoMode = attrs.mode || 'view';

          function showFieldDetail(definition){
            var newScope = scope.$new();
            newScope.definition = definition;
            $mdDialog.show({
              templateUrl: 'framework/generic/_views/view-dialog.tpl.html',
              controller: DefinitionDialogController,
              scope: newScope,
              skipHide: true,
              clickOutsideToClose: true,
              fullscreen: true
            });
          }
          scope.showFieldDetail = showFieldDetail;
        }
      };
    }
  );

})();
