(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function TipoGroupDialogController($scope, $mdDialog) {

    this.mode = $scope.mode;

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

  return module.directive('tpGroupContainer', function ($mdDialog) {
      return {
        scope: {
          group: '=',
          mode: '@?'
        },
        require: '?^tpView',
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-group-container.tpl.html',
        link: function(scope, element, attrs, tpViewController){

          var mode = scope.mode;
          if(!mode && tpViewController){
            mode = tpViewController.getMode();
          }
          if(!mode){
            mode = 'view';
          }

          scope.mode = mode;

          function showDetail(definition){
            if(_.isUndefined(definition)){
              definition = scope.group;
            }
            var newScope = scope.$new();
            newScope.definition = definition;
            newScope.mode = mode;
            $mdDialog.show({
              templateUrl: 'framework/generic/_views/view-dialog.tpl.html',
              controller: TipoGroupDialogController,
              scope: newScope,
              skipHide: true,
              clickOutsideToClose: true,
              fullscreen: true
            });
          }
          scope.showDetail = showDetail;
        }
      };
    }
  );

})();
