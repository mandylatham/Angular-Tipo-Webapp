(function() {

  'use strict';

  function TipoListRootController(
    tipoDefinition,
    tipos,
    tipoManipulationService,
    tipoRouter) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipos = tipos;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;

    var tiposWithDefinition = [];

    _.each(tipos, function(tipo){
      var clonedDefinition = _.cloneDeep(tipoDefinition);
      tipoManipulationService.mergeDefinitionAndData(clonedDefinition, tipo);
      clonedDefinition.tipo_fields = tipoManipulationService.extractShortDisplayFields(clonedDefinition);
      tiposWithDefinition.push({
        key: tipo.tipo_id,
        value: clonedDefinition
      });
    });
    _instance.tiposWithDefinition = tiposWithDefinition;

    _instance.hasTipos = tipos.length > 0;

    _instance.createNew = function(){
      tipoRouter.toTipoCreate(tipo_name);
    };

    _instance.toDetail = function(id){
      tipoRouter.toTipoView(tipo_name, id);
    };

  }

  angular.module('tipo.framework')
  .controller('TipoListRootController', TipoListRootController);

})();