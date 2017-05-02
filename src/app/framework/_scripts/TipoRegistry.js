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
        return _.cloneDeep(registry[tipo_name]);
      }
    };

    this.pushData = function(tipo_name,id,data){
      var meta = tipo_name + id;
      registry[meta] = data;
    };

    this.getData = function(tipo_name,id){
      if(_.isUndefined(tipo_name) || _.isUndefined(id)){
        return undefined;
      }else{
        var data = _.cloneDeep(registry[tipo_name + id]);
        if (data) {
          return data;
        }else{
          return undefined;
        }
        
      }
    };

  }

  angular.module('tipo.framework')
    .service('tipoRegistry', TipoRegistry);

})();