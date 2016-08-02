(function() {

  'use strict';

  function TipoViewRootController(
    tipoDefinition,
    tipo) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipo = tipo;

    this.printDefinition = function(){
      console.log(angular.toJson(_instance.tipoDefinition));
    };

  }

  angular.module('tipo.framework')
  .controller('TipoViewRootController', TipoViewRootController);

})();