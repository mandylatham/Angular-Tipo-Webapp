(function() {

  'use strict';

  function TipoManipulationService() {

    this.mapDefinitionToUI = function(definition){
      if(_.isUndefined(definition.tipo_meta)){
        definition = {
          tipo_meta: definition
        };
      }
      
      var meta = definition.tipo_meta;

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

      return definition;
    };

    // Private functions
    function getActualTemplateUrl(templateId){
      var parts = templateId.split('.');
      var folders = _.initial(parts);
      var file = _.last(parts);
      return folders.join('/') + '/_views/' + file + '.tpl.html';
    }

  }

  angular.module('tipo.framework')
    .service('tipoManipulationService', TipoManipulationService);

})();