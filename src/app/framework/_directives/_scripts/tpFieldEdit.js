(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldEdit', function () {
      return {
        require: '^tpView',
        scope: {
          root: '=',
          context: '=',
          parent: '=',
          field: '='
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-field-edit.tpl.html',
        link: function(scope, element, attrs,tpView){
          var field = scope.field;
          scope.addnew = "";
          scope.isId = field.field_name === 'tipo_id';
          scope.hasValue = !_.isUndefined(field._value);
          scope.isArray = Boolean(field._ui.isArray);
          scope.isSingle = !scope.isArray;
          scope.isTipoRef = Boolean(field._ui.isTipoRelationship);
          scope.tipoForm = tpView.getForm();
          scope.isSelfField = !scope.isTipoRef;
          if (field.field_type === 'boolean' && field._value && field._value.key && field._value.key === "true") {
            field._value.key = true;
          };
          if (field.field_type === 'boolean' && field._value && field._value.key && field._value.key === "false") {
            field._value.key = false;
          };
          if (field.validations) {
            field.decvalidations = new RegExp(atob(field.validations));
          };
          if(scope.isArray && !scope.hasValue){
            field._value = [];
          }
          if(scope.isSingle && !scope.hasValue){
            if(field.allowed_values && field.mandatory){
              field._value = {
                key: field.allowed_values[0]
              };
            }
          }

          scope.wrapSimpleValue = function(key){
            return {
              key: key
            };
          };

          scope.allowed = {};
          scope.addValue = function(){
            field.allowed_values.push(scope.allowed.value);
            delete scope.allowed.value;
          }

          scope.dummy = function(){
            console.log('blurred - ' + field.field_name);
          }
        }
      };
    }
  );

})();
