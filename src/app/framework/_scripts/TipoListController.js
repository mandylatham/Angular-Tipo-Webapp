(function() {

  'use strict';

  function TipoListController(
    tipoDefinition) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;

  }

  angular.module('tipo.framework')
  .controller('TipoListController', TipoListController);

})();