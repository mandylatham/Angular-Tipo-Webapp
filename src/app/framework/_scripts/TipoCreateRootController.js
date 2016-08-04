(function() {

  'use strict';

  function TipoCreateRootController(
    tipoDefinition,
    tipoRouter) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;

    _instance.printDefinition = function(){
      console.log(angular.toJson(_instance.tipoDefinition));
    };

    _instance.save = function(){
      console.log('Save changes called');
    };

    _instance.cancel = function(){
      var tipo_name = tipoDefinition.tipo_meta.tipo_name;
      tipoRouter.toTipoList(tipo_name);
    };

  }

  angular.module('tipo.framework')
  .controller('TipoCreateRootController', TipoCreateRootController);

})();