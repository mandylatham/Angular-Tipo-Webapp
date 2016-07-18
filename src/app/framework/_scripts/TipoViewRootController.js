(function() {

  'use strict';

  function TipoViewRootController(
    tipoDefinition,
    tipo) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipo = tipo;

  }

  angular.module('tipo.framework')
  .controller('TipoViewRootController', TipoViewRootController);

})();