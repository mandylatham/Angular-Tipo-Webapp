(function() {

  'use strict';

  function TipoRegistry() {

    var registry = {};

    this.set = function(newRegistry){
      registry = newRegistry;
    };

    this.push = function(definition){
      var meta = definition.tipo_meta || definition;
      registry[meta.tipo_name] = definition;
    };

    this.get = function(tipo_name){
      if(_.isUndefined(tipo_name)){
        return registry;
      }else{
        return registry[tipo_name];
      }
    };

  }

  angular.module('tipo.framework')
    .service('tipoRegistry', TipoRegistry);

})();