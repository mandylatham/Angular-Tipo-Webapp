(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldView', function () {
      return {
        scope: {
          field: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-field-view.tpl.html',
        link: function(scope, element, attrs){
          var field = scope.field;
          scope.hasValue = !_.isUndefined(field._value);
          scope.isArray = Boolean(field._ui.isArray);
          scope.isSingle = !scope.isArray;
          scope.isTipoRef = Boolean(field._ui.isTipoRelationship);
          scope.isSelfField = !scope.isTipoRef;
        }
      };
    }
  );

})();
