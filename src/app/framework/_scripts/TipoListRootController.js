(function() {

  'use strict';

  function TipoListRootController(
    tipoDefinition,
    tipoFilters,
    tipos,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $state) {

    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipoFilters = tipoFilters;
    _instance.tipos = tipos;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;

    _instance.tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(tipoDefinition,tipos);
    _instance.bulkedit = false;

    _instance.hasTipos = tipos.length > 0;

    _instance.createNew = function(){
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      if(perspectiveMetadata.fieldName){
        var data = {};
        data[perspectiveMetadata.fieldName] = perspectiveMetadata.tipoId;
        data = encodeURIComponent(angular.toJson(data));
        tipoRouter.toTipoCreate(tipo_name, {data: data});
      }else{
        tipoRouter.toTipoCreate(tipo_name);
      }
    };

    _instance.toDetail = function(id){
      tipoRouter.toTipoView(tipo_name, id);
    };

    _instance.clone = function(id){
      tipoRouter.toTipoCreate(tipo_name, {copyFrom: id});
    };

    _instance.selectTipo = function(tipo,event){
      tipo.selected = !tipo.selected;
      console.log(_instance.bulkedit);
      if (_instance.bulkedit) {
        event.stopPropagation();
      }
    }

  }

  angular.module('tipo.framework')
  .controller('TipoListRootController', TipoListRootController);

})();