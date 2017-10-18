(function() {

  'use strict';

  function SubTipoListRootController(
    tipoDefinition,
    subTipoDefinition,
    subTipos,
    tipoManipulationService,
    tipoHandle,
    tipoInstanceDataService,
    tipoRouter,
    tipoRegistry,
    $state,
    $stateParams) {

    var _instance = this;

    var parentTipo = tipoDefinition;

    _instance.tipoDefinition = subTipoDefinition;
    _instance.tipos = subTipos;
    _instance.hideActions = true;

    var tipo_name = subTipoDefinition.tipo_meta.tipo_name;

    var tiposWithDefinition = [];

    // _.each(subTipos, function(tipo){
    //   var clonedDefinition = _.cloneDeep(subTipoDefinition);
    //   tipoManipulationService.mergeDefinitionAndData(clonedDefinition, tipo);
    //   clonedDefinition.tipo_fields = tipoManipulationService.extractShortDisplayFields(clonedDefinition);
    //   tiposWithDefinition.push({
    //     key: tipo.tipo_id,
    //     value: clonedDefinition
    //   });
    // });
    // _instance.tiposWithDefinition = tiposWithDefinition;
    var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
    var filter = {};
    var per_page = _instance.tipoDefinition.tipo_meta.default_page_size;
    filter.per_page = per_page;
    if (perspectiveMetadata.tipoFilter) {
      filter.tipo_filter = perspectiveMetadata.tipoFilter;
    }
    if (!_.isUndefined($stateParams.tipo_filter) && !_.isEmpty($stateParams.tipo_filter)){
      var sub_filter = $stateParams.tipo_filter;
      if (filter.tipo_filter) {
        filter.tipo_filter += " AND " + tipoManipulationService.expandFilterExpression(sub_filter, tipoDefinition);
      } else {
        filter.tipo_filter = tipoManipulationService.expandFilterExpression(sub_filter, tipoDefinition);
      }
    }
    _instance.hasTipos = subTipos.length > 0;
    var responseData = tipoRegistry.get(tipo_name + '_resdata');
    _instance.perm = responseData.perm;
    _instance.restricted_actions = responseData.restricted_actions;
    var count = responseData.count;
    _instance.infiniteItems = tipoManipulationService.getVirtualRepeatObject(per_page ,tipo_name,tipoHandle.getTipos,filter,subTipos,count);
    _instance.infiniteItems.serverResultHandler = function(){

    };

    _instance.createNew = function(){
      tipoRouter.recordSticky();
      var data = tipoManipulationService.extractContextualData(tipoDefinition, subTipoDefinition);
      data = encodeURIComponent(angular.toJson(data));
      tipoRouter.toTipoCreate(tipo_name, {data: data});
    };

    _instance.toDetail = function(id){
      tipoRouter.recordSticky();
      tipoRouter.toTipoView(tipo_name, id);
    };

    _instance.clone = function(id){
      tipoRouter.toTipoCreate(tipo_name, {copyFrom: id});
    };

  }

  angular.module('tipo.framework')
  .controller('SubTipoListRootController', SubTipoListRootController);

})();