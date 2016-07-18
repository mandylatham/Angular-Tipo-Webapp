(function() {

  'use strict';

  function TipoListRootController(
    tipoDefinition,
    tipos,
    tipoRouter) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;

    _instance.tipos = tipos;
    _instance.hasTipos = tipos.length > 0;

    _instance.createNew = function(){
      var tipo_name = tipoDefinition.tipo_meta.tipo_name;
      tipoRouter.toTipoCreate(tipo_name);
    };

    _instance.toDetail = function(id){
      var tipo_name = tipoDefinition.tipo_meta.tipo_name;
      tipoRouter.toTipoView(tipo_name, id);
    };

  }

  angular.module('tipo.framework')
  .controller('TipoListRootController', TipoListRootController);

})();