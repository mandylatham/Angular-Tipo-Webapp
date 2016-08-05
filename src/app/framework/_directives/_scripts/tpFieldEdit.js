(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldEdit', function () {
      return {
        scope: {
          field: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-field-edit.tpl.html',
        link: function(scope, element, attrs){
          var field = scope.field;
          scope.isId = field.field_name === 'TipoID';
          scope.hasValue = !_.isUndefined(field._value);
          scope.isArray = Boolean(field._ui.isArray);
          scope.isSingle = !scope.isArray;
          scope.isTipoRef = Boolean(field._ui.isTipoRelationship);
          scope.isSelfField = !scope.isTipoRef;
          if(scope.isArray && !scope.hasValue){
            field._value = [];
          }

          scope.wrapSimpleValue = function(key){
            return {
              key: key
            };
          };
        }
      };
    }
  );

})();
