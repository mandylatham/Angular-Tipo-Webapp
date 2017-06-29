(function() {

  'use strict';


  function TipoHandle(tipoCache,
                      tipoInstanceDataService,
                      tipoDefinitionDataService,
                      $mdToast,
                      $mdDialog){
    var _instance = this;


    _instance.showMessage = function(user_heading,user_message){
      var toast = $mdToast.tpToast();
      toast._options.locals = {
        header: user_heading,
        body: user_message
      };
      $mdToast.show(toast);
    };

    _instance.getConfirmation = function(title, user_message){
      var confirmation = $mdDialog.confirm()
            .title(title)
            .textContent(user_message)
            .ariaLabel(title)
            .ok('Yes')
            .cancel('No');
      $mdDialog.show(confirmation).then(function(){
        return true;
      },function(){
        return false;
      });
    }

    _instance.getTipos = function(tipo_name,tipoData,query_params){
      tipoCache.evict(tipo_name);
      tipoData = tipoInstanceDataService.search(tipo_name).then(function(tipos){
        return tipos;
      });
    }

    _instance.getTipo = function(tipo_name, tipo_id, tipoData,query_params){
      tipoCache.evict(tipo_name, tipo_id);
      tipoData = tipoInstanceDataService.getOne(tipo_name, tipo_id).then(function(tipo){
        return tipo;
      });
    }

    _instance.getTipoDefiniton = function(tipo_name,query_params){
      tipoDefinitionDataService.getOne(tipo_name).then(function(definition){
        return definition;
      });
    }

    _instance.callAction = function(tipo_name, action, selected_tipo_ids, additional_tipo_name, additional_tipo){
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

    _instance.modifyTipoConfig = function(tipo_name){

    }

    _instance.generateTipoConfigs = function(file){

    }





  }

  // Added Tipo Handle Service in Custom Module
  angular.module('tipo.framework')
         .service('tipoHandle', TipoHandle);; 

})();