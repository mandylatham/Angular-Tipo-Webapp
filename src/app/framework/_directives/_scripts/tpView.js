(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpView', function ($mdDialog) {
      return {
        scope: {
          definition: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-view.tpl.html',
        link: function(scope, element, attrs){
          function showGroupItem(definition){
            var newScope = scope.$new();
            newScope.definition = definition;
            $mdDialog.show({
              template: '<tp:view definition="definition" />',
              scope: newScope,
              clickOutsideToClose: true,
              fullscreen: true
            });
          }
          scope.showGroupItem = showGroupItem;
        }
      };
    }
  );

})();
