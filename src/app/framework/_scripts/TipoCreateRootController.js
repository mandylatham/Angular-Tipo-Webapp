(function() {

  'use strict';

  function TipoCreateRootController(
    tipoDefinition,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $stateParams,
    tipoRegistry,
    $mdToast,
    $mdDialog,
    $scope,
    $location) {

    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;

    var clonedTipoId = $stateParams.copyFrom;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;


    if ($stateParams.message) {
      var toast = $mdToast.tpToast();
      toast._options.locals = {
        header: 'Action successfully completed',
        body: $stateParams.message
      };
      $mdToast.show(toast);
    };

    _instance.printDefinition = function(){
      console.log(angular.toJson(_instance.tipoDefinition));
    };

    _instance.save = function(formtype){
      tipoRouter.startStateChange();
      var data = {};
      var parameters = {};
      tipoManipulationService.extractDataFromMergedDefinition(_instance.tipoDefinition, data);
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      if(perspectiveMetadata.fieldName && !data[perspectiveMetadata.fieldName]){
        data[perspectiveMetadata.fieldName] = perspectiveMetadata.tipoId;
      }
      if(!_.isUndefined(clonedTipoId)){
        data.copy_from_tipo_id = clonedTipoId;
      }
      tipoInstanceDataService.upsertAll(tipo_name, [data]).then(function(result){
        if(tipoRouter.stickyExists()){
          tipoRouter.toStickyAndReset();
        }else{
          if (formtype === 'dialog') {
            tipoInstanceDataService.search(tipo_name).then(function(tipos){
              $mdDialog.hide(tipos);
            });            
          }else{
            var registryName = $stateParams.tipo_name + '_resdata';
            var resData = tipoRegistry.get(registryName);
            tipoRouter.toTipoResponse(resData,tipo_name,result[0].tipo_id,parameters);
          }
        }
      });
    };

    _instance.toList = function(){
      tipoRouter.toTipoList(tipo_name);
    };

    _instance.maximize = function(){
      $scope.fullscreen = true;
    };

    _instance.restore = function(){
      $scope.fullscreen = false;
    };

    _instance.cancel = function(formtype){
      if (formtype === 'dialog') {
        $mdDialog.hide();
      }else{
        if(tipoRouter.stickyExists()){
          tipoRouter.toStickyAndReset();
        }else{
          _instance.toList();
        }
      }
    };

  }

  angular.module('tipo.framework')
  .controller('TipoCreateRootController', TipoCreateRootController);

})();