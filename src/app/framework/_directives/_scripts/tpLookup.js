(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpLookup', function (tipoInstanceDataService) {
      return {
        scope: {
          field: '='
        },
        restrict: 'EA',
        replace: true,
        template: '<ng-include src="fieldTemplate" tp-include-replace/>',
        link: function(scope, element, attrs){
          var field = scope.field;
          var isArray = Boolean(field._ui.isArray);
          var fieldTemplate;
          if(isArray){
            fieldTemplate = 'framework/_directives/_views/tp-lookup-multiple.tpl.html';
          }else{
            fieldTemplate = 'framework/_directives/_views/tp-lookup-single.tpl.html';
          }
          scope.fieldTemplate = fieldTemplate;

          var tipo_name = field._ui.relatedTipo;
          var label_field = field.label_field.field_name;
          var searchCriteria = {};

          if(!_.isUndefined(field._value)){
            scope.selectedTipo = field._value;
          }

          scope.setValue = function(tipo){
            if(tipo){
              field._value = tipo;
            }else{
              delete field._value;
            }
          };

          scope.lookup = function(text){
            searchCriteria[label_field] = text;
            return tipoInstanceDataService.search(tipo_name, searchCriteria).then(function(results){
              return _.map(results, function(each){
                return {
                  key: each.TipoID,
                  label: each[label_field]
                };
              });
            });
          };
        }
      };
    }
  );

})();
