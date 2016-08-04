(function() {

  'use strict';

  function TipoEditRootController(
    tipoDefinition,
    tipo,
    tipoRouter) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipo = tipo;

    _instance.save = function(){
      console.log('Save changes called');
    };

    _instance.cancel = function(){
      var tipo_name = _instance.tipoDefinition.tipo_meta.tipo_name;
      var tipo_id = _instance.tipo.TipoID;
      tipoRouter.toTipoView(tipo_name, tipo_id);
    };

  }

  angular.module('tipo.framework')
  .controller('TipoEditRootController', TipoEditRootController);

})();