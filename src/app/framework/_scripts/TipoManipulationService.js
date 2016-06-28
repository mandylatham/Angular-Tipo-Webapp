(function() {

  'use strict';

  function TipoManipulationService(tipoRegistry) {

    function mapDefinitionToUI(definition){
      if(_.isUndefined(definition.tipo_meta)){
        definition = {
          tipo_meta: definition
        };
      }
      
      var meta = definition.tipo_meta;

      if(_.isUndefined(definition._ui)){
        var listTemplate = meta.tipo_list_view || 'framework.generic.list';
        var viewTemplate = meta.tipo_detail_view || 'framework.generic.view';
        var createTemplate = meta.tipo_create_view || 'framework.generic.create';
        var editTemplate = meta.tipo_edit_view || 'framework.generic.edit';

        definition._ui = {
          listTemplate: listTemplate,
          listTemplateUrl: getActualTemplateUrl(listTemplate),
          viewTemplate: viewTemplate,
          viewTemplateUrl: getActualTemplateUrl(viewTemplate),
          createTemplate: createTemplate,
          createTemplateUrl: getActualTemplateUrl(createTemplate),
          editTemplate: editTemplate,
          editTemplateUrl: getActualTemplateUrl(editTemplate)
        };
      }

      return definition;
    }

    function extractShortDisplayFields(definition){
      var eligibleFields = [];
      extractShortDisplayFieldsRecursive(definition, eligibleFields);
      return eligibleFields;
    }

    function extractShortDisplayFieldsRecursive(definition, collection){
      var eligibleFields = _.filter(definition.tipo_fields, {short_display: true});
      _.each(eligibleFields, function(each){
        if(each._ui.isGroup || each._ui.isTipoRelationship){
          extractShortDisplayFieldsRecursive(each, collection);
        }else{
          collection.push(each);
        }
      });
    }

    function expandFieldHierarchy(definition){
      definition = _.cloneDeep(definition);
      prepareFieldHierarchyRecursive(definition);
      definition._ui.hierarchyPrepared = true;
      return definition;
    }

    function prepareFieldHierarchyRecursive(definition, currentRoot, parentAccessor, isSecondLevelTipo){
      if(definition._ui.hierarchyPrepared){
        // this method needs to be idempotent, hence returning if the hierarchy is already prepared
        return;
      }
      currentRoot = currentRoot || definition;
      isSecondLevelTipo = Boolean(isSecondLevelTipo);
      if(isSecondLevelTipo){
        currentRoot.tipo_fields = _.filter(currentRoot.tipo_fields, function(each){
          return each.primary_key || each.meaningful_key;
        });
      }
      if(currentRoot.tipo_fields){
        _.each(currentRoot.tipo_fields, function(tipo_field){
          tipo_field._ui = tipo_field._ui || {};
          var fieldName = tipo_field.field_name;
          var fieldType = tipo_field.field_type;
          var isArray = Boolean(tipo_field.tipo_array);
          var currentAccessor = parentAccessor ? parentAccessor + '.' + fieldName : fieldName;

          tipo_field._ui.isArray = isArray;
          tipo_field._ui.accessor = currentAccessor;

          var parts = fieldType.split('.');
          if(parts.length > 1){
            var nextAccessor = currentAccessor;
            var keyField;
            if(parts[0] === 'FieldGroup'){
              tipo_field._ui.isGroup = true;
              var fieldGroup = _.cloneDeep(_.find(definition.tipo_field_groups, {tipo_group_name: parts[1]}));
              tipo_field.tipo_fields = fieldGroup.tipo_fields;
              if(isArray){
                nextAccessor += '[$index]';
              }
              prepareFieldHierarchyRecursive(definition, tipo_field, nextAccessor);
            }else if(parts[0] === 'Tipo'){
              tipo_field._ui.isTipoRelationship = true;
              tipo_field._ui.relatedTipo = parts[1];
              var relatedTipoDefinition = _.cloneDeep(tipoRegistry.get(parts[1]));
              tipo_field.tipo_fields = _.filter(relatedTipoDefinition.tipo_fields, function(each){
                return each.primary_key || each.meaningful_key;
              });
              if(isArray){
                // find the property which represents the primary identifier for the group
                // nextAccessor += '[TipoID]';
                nextAccessor += '[$index]';
              }
              prepareFieldHierarchyRecursive(relatedTipoDefinition, tipo_field, nextAccessor);
            }
          }else{
            // Do nothing for now. Eventually we may need to set other UI specific metadata
          }
        });
      }
    }

    function getFieldValue(tipo, expression){
      if(expression.indexOf('[') === -1){
        // simple extraction without any arrays
        return _.get(tipo, expression);
      }else{
        var value;
        // more elaborate extraction
        var firstPart = expression.substring(0, expression.indexOf('['));
        value = _.get(tipo, firstPart);
        if(!_.isUndefined(value)){
          var indexPart = expression.substring(expression.indexOf('[') + 1, expression.indexOf(']'));
          // need to standardize the index, else quite impossible to derive the value
          // value = _.find(value, {TipoID: indexPart});
          value = value[parseInt(indexPart, 10)];
          if(!_.isUndefined(value)){
            var remainingPart = expression.substring(expression.indexOf(']') + 2);
            if(!_.isEmpty(remainingPart)){
              value = getFieldValue(value, remainingPart);
            }
          }
        }
        return value;
      }
    }

    function getActualTemplateUrl(templateId){
      var parts = templateId.split('.');
      var folders = _.initial(parts);
      var file = _.last(parts);
      return folders.join('/') + '/_views/' + file + '.tpl.html';
    }

    // Expose the functions that need to be consumed from outside
    this.mapDefinitionToUI = mapDefinitionToUI;
    this.expandFieldHierarchy = expandFieldHierarchy;
    this.extractShortDisplayFields = extractShortDisplayFields;
    this.getFieldValue = getFieldValue;

  }

  angular.module('tipo.framework')
    .service('tipoManipulationService', TipoManipulationService);

})();