(function() {

  'use strict';

  function TipoViewRootController(
    tipoDefinition,
    tipo,
    tipoInstanceDataService,
    tipoManipulationService,
    tipoRouter,
    $state,
    $scope,
    $mdDialog,
    $mdToast,
    $stateParams,
    tipoRegistry,
    tipoCache) {

    var _instance = this;

    var perspective = $scope.perspective;

    _instance.tipoDefinition = tipoDefinition;
    _instance.tipo = tipo;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;
    var tipo_id = tipo.tipo_id;

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
      if (perspectiveMetadata.fieldName === 'application') {
        filter.tipo_filter = perspectiveMetadata.tipoFilter;
      }
    }

    _instance.edit = function(){
      tipoRouter.startStateChange();
      tipoRouter.toTipoEdit(tipo_name, tipo_id);
    };

    _instance.delete = function(){
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
        getPerspective(filter);
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

    _instance.toList = function(){
      tipoRouter.toTipoList(tipo_name);
    };

    _instance.toSubTipoList = function(subTipo){
      tipoRouter.to('subTipoListState', undefined, {sub_tipo_field_name: subTipo.field_name}, true);
    };

    _instance.refresh = function(){
      var filter = {};
      tipoRouter.startStateChange();
      getPerspective(filter);
      tipoCache.evict($stateParams.tipo_name, $stateParams.tipo_id);
      tipoInstanceDataService.getOne($stateParams.tipo_name, $stateParams.tipo_id, filter, true).then(function (data) {
        data.tipo_id = data.tipo_id || $stateParams.tipo_id;
        _instance.tipo = data;
        _instance.tipoDefinition = tipoManipulationService.mergeDefinitionAndData(tipoRegistry.get($stateParams.tipo_name), _instance.tipo);
        tipoRouter.endStateChange();
      });
    }

    function setCurrentActiveTab(name){
      if(_.isUndefined(name)){
        var currentStateName = tipoRouter.getCurrent().name;
        if(_.startsWith(currentStateName, 'subTipo')){
          name = $state.params.sub_tipo_field_name;
        }else{
          name = 'main';
        }
      }
      _instance.activeTab = name;
    }

    setCurrentActiveTab();

  }

  angular.module('tipo.framework')
  .controller('TipoViewRootController', TipoViewRootController);

})();