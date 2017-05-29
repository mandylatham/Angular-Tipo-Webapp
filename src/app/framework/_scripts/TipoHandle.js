(function() {

  'use strict';


  function TipoHandle(tipoCache,tipoInstanceDataService,tipoDefinitionDataService){
    var _instance = this;

    _instance.refreshList = function(tipo_name,tipoData){
      tipoCache.evict(tipo_name);
      tipoData = tipoInstanceDataService.search(tipo_name).then(function(tipos){
        return tipos;
      });
    }

    _instance.refreshDetail = function(tipo_name, id, tipoData){
      tipoCache.evict(tipo_name, id);
      tipoData = tipoInstanceDataService.getOne(tipo_name, id).then(function(tipo){
        return tipo;
      });
    }

    _instance.getTipoConfig = function(tipo_name){
      tipoDefinitionDataService.getOne(tipo_name).then(function(definition){
        return definition;
      });
    }

    _instance.callAction = function(tipo_name,action_name){
      var definition = _instance.getDefinition(tipo_name);
    }

    _instance.routeTo = function(url){

    }

    _instance.saveTipo = function(tipoData,tipo_name,tipo_id){

    }

    _instance.createTipo = function(tipoData,tipo_name,tipo_id){

    }

    _instance.deleteTipo = function(tipoData,tipo_name,tipo_id){

    }

    _instance.getTipo = function(tipo_name,tipo_id,query_params){

    }

    _instance.getTipos = function(tipo_name, query_params){

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