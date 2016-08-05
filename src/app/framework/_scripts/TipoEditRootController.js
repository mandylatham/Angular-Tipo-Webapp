(function() {

  'use strict';

  function TipoEditRootController(
    tipoDefinition,
    tipo,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipo = tipo;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;
    var tipo_id = tipo.TipoID;

    _instance.save = function(){
      tipoRouter.startStateChange();
      var data = {};
      tipoManipulationService.extractDataFromMergedDefinition(_instance.tipoDefinition, data);
      tipoInstanceDataService.updateOne(tipo_name, data, tipo_id).then(function(result){
        tipoRouter.toTipoView(tipo_name, tipo_id);
      });
    };

    _instance.cancel = function(){
      tipoRouter.toTipoView(tipo_name, tipo_id);
    };

  }

  angular.module('tipo.framework')
  .controller('TipoEditRootController', TipoEditRootController);

})();