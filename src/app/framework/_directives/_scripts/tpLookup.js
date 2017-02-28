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
          var isMandatory = Boolean(field.mandatory);

          scope.isArray = isArray;

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

          if(isArray){
            scope.options = field._value;
          }else{
            if(_.get(field, '_value.key')){
              scope.options = [field._value];
            }
          }

          function loadOptions(){
            delete scope.options;
            var searchCriteria = {};
            var filter;
            var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
            /*if(tipo_name !== perspectiveMetadata.tipoName){
              filter = perspectiveMetadata.tipoFilter;
            }*/
            // TODO: Hack - Sushil as this is supposed to work only for applications
            if(perspectiveMetadata.fieldName === 'application'){
              filter = perspectiveMetadata.tipoFilter;
            }
            if(!_.isUndefined(baseFilter)){
              var baseFilterExpanded = tipoManipulationService.expandFilterExpression(baseFilter, scope.root, scope.context);
              if(_.isUndefined(filter)){
                filter = baseFilterExpanded;
              }else{
                filter += ' and ' + baseFilterExpanded;
              }
            }
            if(!_.isUndefined(filter)){
              searchCriteria.tipo_filter = filter;
            }
            return tipoInstanceDataService.search(tipo_name, searchCriteria).then(function(results){
              scope.options = _.map(results, function(each){
                return {
                  key: each.tipo_id,
                  label: each[label_field]
                };
              });
              if(isMandatory && !field._value){
                if(isArray){
                  field._value = [scope.options[0]];
                }else{
                  field._value = scope.options[0];
                }
              }
            });
          }

          scope.loadOptions = loadOptions;

          scope.searchTerm = {};
          scope.cleanup = function(){
            delete scope.searchTerm.text;
          };

          scope.stopBubbling = function(event){
            event.stopPropagation();
          };

          scope.renderSelection = function(){
            var text = '<div class="placeholder">' + field.field_description + '</div>';
            if (field._value && field._value.length){
              text = '<div class="multiple-list">';
              _.each(field._value, function(each){
                text += '<div>' +each.label + '</div>';
              });
              text += '</div>';
            }
            return text;
          };

          loadOptions();

        }
      };
    }
  );

})();
