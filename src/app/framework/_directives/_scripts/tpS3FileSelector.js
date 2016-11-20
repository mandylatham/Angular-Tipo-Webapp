(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  /**
   * Return list of unique by href items
   */
  function unique(a) {
      var present = [], res = [];
      for (var i = 0; i < a.length; i++) {
          if (present[a[i].href]) {
              continue;
          }
          present[a[i].href] = true;
          res.push(a[i]);
      }
      return res;
  }
  
  return module.directive('tpS3Fileselector', function () {
      return {
        templateUrl: 'framework/_directives/_views/tp-s3-fileselector-view.tpl.html',
        controller: controller
      };

      function controller($scope, $mdDialog, s3Service) {

        $scope.items = [];  
        $scope.showS3Explorer = function(event) {
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
                $scope.items = unique($scope.items.concat(s3Service.listItems()));
            }, function() {
                // You cancelled the dialog.
            });
        }

        $scope.deleteItem = function($index) {
            console.log('Delete item', $index);
            $scope.items.splice($index, 1);
        }
      }
      
      
  });
})();
