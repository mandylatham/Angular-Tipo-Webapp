(function() {

  'use strict';

  function TipoEditRootController(
    tipoDefinition,
    tipo,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $scope,
    $mdToast,
    $stateParams) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipoDefinition.tipo_field_groups = tipo.tipo_field_groups;
    _instance.tipo = tipo;
    console.log("_instance.tipo");
    console.log(_instance.tipo);
    console.log("_instance.tipoDefinition");
    console.log(_instance.tipoDefinition);

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;
    var tipo_id = tipo.tipo_id;

    var perspective = $scope.perspective;

    if ($stateParams.message) {
      var toast = $mdToast.tpToast();
      toast._options.locals = {
        header: 'Action successfully completed',
        body: $stateParams.message
      };
      $mdToast.show(toast);
    };

    _instance.save = function(){
      tipoRouter.startStateChange();
      var data = {};
      tipoManipulationService.extractDataFromMergedDefinition(_instance.tipoDefinition, data);
      tipoManipulationService.modifyTipoData(_instance.tipo);
      data.copy_from_tipo_id = tipo.copy_from_tipo_id;
      console.log("_instance.tipo");
      console.log(_instance.tipo);
      tipoInstanceDataService.updateOne(tipo_name, _instance.tipo, tipo_id).then(function(result){
        if(tipoRouter.stickyExists()){
          tipoRouter.toStickyAndReset();
        }else{
          tipoRouter.toTipoView(tipo_name, tipo_id);
        }
      });
    };

    _instance.Date = function(date){
      return new Date(date);
    }

    _instance.toList = function(){
      tipoRouter.toTipoList(tipo_name);
    };

    _instance.toView = function(){
      tipoRouter.toTipoView(tipo_name, tipo_id);
    };

    _instance.cancel = function(){
      _instance.toView();
    };


  }

  angular.module('tipo.framework')
  .controller('TipoEditRootController', TipoEditRootController);

})();