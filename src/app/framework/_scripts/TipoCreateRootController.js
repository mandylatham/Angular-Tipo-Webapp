(function() {

  'use strict';

  function TipoCreateRootController(
    tipoDefinition) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;

  }

  angular.module('tipo.framework')
  .controller('TipoCreateRootController', TipoCreateRootController);

})();