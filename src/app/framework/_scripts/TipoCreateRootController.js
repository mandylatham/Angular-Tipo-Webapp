(function() {

  'use strict';

  function TipoCreateRootController(
    tipoDefinition,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $stateParams) {

    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;

    var clonedTipoId = $stateParams.copyFrom;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;

    _instance.printDefinition = function(){
      console.log(angular.toJson(_instance.tipoDefinition));
    };

    _instance.save = function(){
      tipoRouter.startStateChange();
      var data = {};
      tipoManipulationService.extractDataFromMergedDefinition(_instance.tipoDefinition, data);
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      if(perspectiveMetadata && !data[perspectiveMetadata.fieldName]){
        data[perspectiveMetadata.fieldName] = perspectiveMetadata.tipoId;
      }
      if(!_.isUndefined(clonedTipoId)){
        data.copy_from_tipo_id = clonedTipoId;
      }
      tipoInstanceDataService.upsertAll(tipo_name, [data]).then(function(result){
        if(tipoRouter.stickyExists()){
          tipoRouter.toStickyAndReset();
        }else{
          tipoRouter.toTipoView(tipo_name, result[0].tipo_id);
        }
      });
    };

    _instance.toList = function(){
      tipoRouter.toTipoList(tipo_name);
    };

    _instance.cancel = function(){
      if(tipoRouter.stickyExists()){
        tipoRouter.toStickyAndReset();
      }else{
        _instance.toList();
      }
    };

  }

  angular.module('tipo.framework')
  .controller('TipoCreateRootController', TipoCreateRootController);

})();