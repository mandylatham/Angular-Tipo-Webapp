(function() {

  'use strict';

  function TipoListRootController(
    tipoDefinition,
    tipoFilters,
    tipos,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    tipoRegistry,
    tipoCache,
    $state,
    $stateParams,
    $mdToast,
    $mdDialog) {

    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipoFilters = tipoFilters;
    _instance.tipos = tipos;
    var tipo_perm = tipoRegistry.get($stateParams.tipo_name + 'perm');
    _instance.perm = tipo_perm.perm;

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

    function getPerspective(filter){
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      // TODO: Hack - Sushil as this is supposed to work only for applications
      if (perspectiveMetadata.tipoName) {
        if (perspectiveMetadata.tipoName !== tipoDefinition.tipo_meta.tipo_name) {
          filter.tipo_filter = perspectiveMetadata.tipoFilter;
        } else {
          $rootScope.perspective = 'Home';
        }
      }

      if ($stateParams.filter) {
        if (filter.tipo_filter) {
          filter.tipo_filter += " and " + tipoManipulationService.expandFilterExpression(tipoFilters.currentExpression);
        } else {
          filter.tipo_filter = tipoManipulationService.expandFilterExpression(tipoFilters.currentExpression);
        }
      }
    }

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
          tipoRouter.toTipoList(tipo_name);
        });
      });
    };

    _instance.refresh = function(){
      var filter = {};
      tipoRouter.startStateChange();
      getPerspective(filter);
      tipoCache.evict($stateParams.tipo_name);
      tipoInstanceDataService.search($stateParams.tipo_name, filter).then(function(tiposData){
        _instance.tipos = tiposData;
        tipoRouter.endStateChange();
      });
    }

    
  }

  angular.module('tipo.framework')
  .controller('TipoListRootController', TipoListRootController);

})();