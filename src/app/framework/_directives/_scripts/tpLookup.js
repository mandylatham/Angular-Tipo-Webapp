(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpLookup', function (
    tipoInstanceDataService,
    tipoManipulationService) {
      return {
        scope: {
          root: '=',
          context: '=',
          field: '='
        },
        restrict: 'EA',
        replace: true,
        template: '<ng-include src="fieldTemplate" tp-include-replace/>',
        link: function(scope, element, attrs){
          var field = scope.field;
          var isArray = Boolean(field._ui.isArray);
          var isGroup = Boolean(field._ui.isGroup);
          var fieldTemplate;
          if(isArray && !isGroup){
            fieldTemplate = 'framework/_directives/_views/tp-lookup-multiple.tpl.html';
          }else{
            fieldTemplate = 'framework/_directives/_views/tp-lookup-single.tpl.html';
          }
          scope.fieldTemplate = fieldTemplate;

          var baseFilter = field.relationship_filter;

          var tipo_name = field._ui.relatedTipo;
          var label_field;
          if(_.isUndefined(field.label_field)){
            label_field = field.key_field.field_name;
          }else{
            label_field = field.label_field.field_name;
          }
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
            if(_.isUndefined(baseFilter)){
              if(!_.isEmpty(text)){
                searchCriteria.tipo_filter = 'begins_with(' + label_field + ', \\"' + text + '\\")';
              }else{
                delete searchCriteria.tipo_filter;
              }
            }else{
              var baseFilterExpanded = tipoManipulationService.expandFilterExpression(baseFilter, scope.root, scope.context);
              if(!_.isEmpty(text)){
                searchCriteria.tipo_filter = baseFilterExpanded + ' and begins_with(' + label_field + ', \\"' + text + '\\")';
              }else{
                searchCriteria.tipo_filter = baseFilterExpanded;
              }
            }
            return tipoInstanceDataService.search(tipo_name, searchCriteria).then(function(results){
              return _.map(results, function(each){
                return {
                  key: each.tipo_id,
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
