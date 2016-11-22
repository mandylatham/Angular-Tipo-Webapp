(function () {

  'use strict';

  var module = angular.module('tipo.framework');
  return module.directive('tpS3Fileselector', function () {
      return {
        templateUrl: 'framework/_directives/_views/tp-s3-fileselector-view.tpl.html',
        controller: controller
      };

      function controller($scope, $mdDialog, s3SelectionModel) {

        $scope.showS3Explorer = function(event) {
            s3SelectionModel.current.clear();
            $mdDialog.show({
                controller: function($scope) {
                    $scope.onOk = function(event) {
                        $mdDialog.hide();
                    }

                    $scope.onCancel = function(event) {
                        $mdDialog.cancel();
                    }
                },
                templateUrl: 'framework/_directives/_views/tp-s3-fileselector-select.tpl.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: false,
                escapeToClose: false
            })
            .then(function() {
                $scope.items = s3SelectionModel.addCurrent().listItems();
            }, function() {
                // You cancelled the dialog.
            });
        }

        $scope.deleteItem = function($index) {
            console.log('Delete item', $index);
            $scope.items = s3SelectionModel.total.removeByIndex($index);
        }
      }
  });
})();
