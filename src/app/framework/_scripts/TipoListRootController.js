(function() {

  'use strict';

  function TipoListRootController(
    tipoDefinition,
    tipoFilters,
    tipos,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    $state,
    $stateParams,
    $mdToast,
    $mdDialog) {

    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipoFilters = tipoFilters;
    _instance.tipos = tipos;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;

    _instance.tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(tipoDefinition,tipos);
    _instance.bulkedit = false;

    _instance.hasTipos = tipos.length > 0;

    if ($stateParams.message) {
      var toast = $mdToast.tpToast();
      toast._options.locals = {
        header: 'Action successfully completed',
        body: $stateParams.message
      };
      $mdToast.show(toast);
    };

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
      if (_instance.bulkedit) {
        event.stopPropagation();
      }
    }

    _instance.delete = function(tipo_id){
      var confirmation = $mdDialog.confirm()
          .title('Delete Confirmation')
          .textContent('Are you sure that you want to delete ' + tipo_name + ' ' + tipo_id + '?')
          .ariaLabel('Delete Confirmation')
          .ok('Yes')
          .cancel('No');
      $mdDialog.show(confirmation).then(function(){
        tipoRouter.startStateChange();
        // handle application perspective
        var filter = {};
        var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
        if(perspectiveMetadata.fieldName === 'application'){
          filter.tipo_filter = perspectiveMetadata.tipoFilter;
        }
        // ends here
        tipoInstanceDataService.deleteOne(tipo_name, tipo_id, filter).then(function(){
          if(tipoRouter.stickyExists()){
            tipoRouter.toStickyAndReset();
          }else{
            tipoRouter.toTipoList(tipo_name);
          }
        });
      });
    };

    
  }

  angular.module('tipo.framework')
  .controller('TipoListRootController', TipoListRootController);

})();