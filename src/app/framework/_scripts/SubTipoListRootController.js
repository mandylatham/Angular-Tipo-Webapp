(function() {

  'use strict';

  function SubTipoListRootController(
    tipoDefinition,
    subTipoDefinition,
    subTipos,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $state) {

    var _instance = this;

    tipoRouter.recordSticky();

    var parentTipo = tipoDefinition;

    _instance.tipoDefinition = subTipoDefinition;
    _instance.tipos = subTipos;

    var tipo_name = subTipoDefinition.tipo_meta.tipo_name;

    var tiposWithDefinition = [];

    _.each(subTipos, function(tipo){
      var clonedDefinition = _.cloneDeep(subTipoDefinition);
      tipoManipulationService.mergeDefinitionAndData(clonedDefinition, tipo);
      clonedDefinition.tipo_fields = tipoManipulationService.extractShortDisplayFields(clonedDefinition);
      tiposWithDefinition.push({
        key: tipo.tipo_id,
        value: clonedDefinition
      });
    });
    _instance.tiposWithDefinition = tiposWithDefinition;

    _instance.hasTipos = subTipos.length > 0;

    _instance.createNew = function(){
      var data = tipoManipulationService.extractContextualData(tipoDefinition, subTipoDefinition);
      data = encodeURIComponent(angular.toJson(data));
      tipoRouter.toTipoCreate(tipo_name, {data: data});
    };

    _instance.toDetail = function(id){
      tipoRouter.toTipoView(tipo_name, id);
    };

    _instance.clone = function(id){
      tipoRouter.toTipoCreate(tipo_name, {copyFrom: id});
    };

  }

  angular.module('tipo.framework')
  .controller('SubTipoListRootController', SubTipoListRootController);

})();