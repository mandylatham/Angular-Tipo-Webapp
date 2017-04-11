(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldView', function ($sce) {
      return {
        scope: {
          field: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-field-view.tpl.html',
        link: function(scope, element, attrs){
          var field = scope.field;
          if (field.field_type === 'richstring'){
            scope.formattedText = $sce.trustAsHtml(field._value.label);
          }
          scope.hasValue = !_.isUndefined(field._value);
          if (field.field_type === 'divider'){
            scope.hasValue = true;
          }
          scope.isArray = Boolean(field._ui.isArray);
          scope.isSingle = !scope.isArray;
          scope.isTipoRef = Boolean(field._ui.isTipoRelationship);
          scope.isSelfField = !scope.isTipoRef;
        }
      };
    }
  );

})();
