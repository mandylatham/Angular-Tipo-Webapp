(function() {

  'use strict';

  function TipoViewRootController(
    tipoDefinition,
    tipo,
    tipoInstanceDataService,
    tipoRouter,
    $state,
    $scope) {

    var _instance = this;

    var perspective = $scope.perspective;

    _instance.tipoDefinition = tipoDefinition;
    _instance.tipo = tipo;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;
    var tipo_id = tipo.tipo_id;

    _instance.edit = function(){
      tipoRouter.toTipoEdit(tipo_name, tipo_id);
    };

    _instance.delete = function(){
      tipoRouter.startStateChange();
      tipoInstanceDataService.deleteOne(tipo_name, tipo_id).then(function(){
        if(tipoRouter.stickyExists()){
          tipoRouter.toStickyAndReset();
        }else{
          tipoRouter.toTipoList(tipo_name);
        }
      });
    };

    _instance.toList = function(){
      tipoRouter.toTipoList(tipo_name);
    };

    _instance.toSubTipoList = function(subTipo){
      tipoRouter.to('subTipoListState', undefined, {sub_tipo_field_name: subTipo.field_name}, true);
    };

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