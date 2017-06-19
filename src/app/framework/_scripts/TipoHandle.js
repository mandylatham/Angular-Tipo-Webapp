(function() {

  'use strict';


  function TipoHandle(tipoCache,tipoInstanceDataService,tipoDefinitionDataService){
    var _instance = this;

    _instance.refreshList = function(tipo_name,tipoData,query_params){
      tipoCache.evict(tipo_name);
      tipoData = tipoInstanceDataService.search(tipo_name).then(function(tipos){
        return tipos;
      });
    }

    _instance.refreshDetail = function(tipo_name, tipo_id, tipoData,query_params){
      tipoCache.evict(tipo_name, tipo_id);
      tipoData = tipoInstanceDataService.getOne(tipo_name, tipo_id).then(function(tipo){
        return tipo;
      });
    }

    _instance.getTipoConfig = function(tipo_name,query_params){
      tipoDefinitionDataService.getOne(tipo_name).then(function(definition){
        return definition;
      });
    }

    _instance.callAction = function(tipo_name, selected_tipo_ids, action, additional_tipo_name, additional_tipo){
      var definition = _instance.getDefinition(tipo_name);
    }

    _instance.routeTo = function(url){

    }

    _instance.search = function(tipo_name,tipoData,query_params){

    }

    _instance.saveTipo = function(tipoData,tipo_name,tipo_id){

    }

    _instance.createTipo = function(tipoData,tipo_name){

    }

    _instance.deleteTipo = function(tipoData,tipo_name,tipo_id){

    }

    _instance.getTipo = function(tipo_name,tipo_id,query_params){

    }

    _instance.getTipos = function(tipo_name, query_params){
      return tipoInstanceDataService.search(tipo_name,query_params);
    }

    _instance.modifyTipoConfig = function(tipo_name){

    }

    _instance.generateTipoConfigs = function(file){

    }





  }

  // Added Client Side Javascript Service in Custom Module
  angular.module('tipo.framework')
         .service('tipoHandle', TipoHandle);; 

})();