(function() {

  'use strict';

  function TipoListController(
    tipoDefinition,
    tipos) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;

    _instance.tipos = tipos;
    _instance.hasTipos = tipos.length > 0;

  }

  angular.module('tipo.framework')
  .controller('TipoListController', TipoListController);

})();