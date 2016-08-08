(function() {

  'use strict';

  function TipoViewRootController(
    tipoDefinition,
    tipo,
    tipoInstanceDataService,
    tipoRouter) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipo = tipo;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;
    var tipo_id = tipo.TipoID;

    _instance.edit = function(){
      tipoRouter.toTipoEdit(tipo_name, tipo_id);
    };

    _instance.delete = function(){
      tipoRouter.startStateChange();
      tipoInstanceDataService.deleteOne(tipo_name, tipo_id).then(function(){
        tipoRouter.toTipoList(tipo_name);
      });
    };

    _instance.toList = function(){
      tipoRouter.toTipoList(tipo_name);
    };

  }

  angular.module('tipo.framework')
  .controller('TipoViewRootController', TipoViewRootController);

})();