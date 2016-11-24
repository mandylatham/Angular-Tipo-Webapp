(function() {

  'use strict';

  function TipoEditRootController(
    tipoDefinition,
    tipo,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $scope) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipo = tipo;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;
    var tipo_id = tipo.tipo_id;

    var perspective = $scope.perspective;

    _instance.save = function(){
      tipoRouter.startStateChange();
      var data = {};
      tipoManipulationService.extractDataFromMergedDefinition(_instance.tipoDefinition, data);
      tipoInstanceDataService.updateOne(tipo_name, data, tipo_id).then(function(result){
        if(tipoRouter.stickyExists()){
          tipoRouter.toStickyAndReset();
        }else{
          if(perspective === 'settings'){
            tipoRouter.toSettingsView(tipo_name);
          }else{
            tipoRouter.toTipoView(tipo_name, tipo_id);
          }
        }
      });
    };

    _instance.toList = function(){
      tipoRouter.toTipoList(tipo_name);
    };

    _instance.toView = function(){
      if(perspective === 'settings'){
        tipoRouter.toSettingsView(tipo_name);
      }else{
        tipoRouter.toTipoView(tipo_name, tipo_id);
      }
    };

    _instance.cancel = function(){
      _instance.toView();
    };


  }

  angular.module('tipo.framework')
  .controller('TipoEditRootController', TipoEditRootController);

})();