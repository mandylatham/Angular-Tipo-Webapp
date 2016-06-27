(function() {

  'use strict';

  function TipoListRootController(
    tipoDefinition,
    tipos) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;

    _instance.tipos = tipos;
    _instance.hasTipos = tipos.length > 0;

    _instance.accessor = 'Customer';

  }

  angular.module('tipo.framework')
  .controller('TipoListRootController', TipoListRootController);

})();