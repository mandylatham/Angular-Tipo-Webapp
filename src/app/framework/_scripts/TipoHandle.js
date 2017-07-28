(function() {

  'use strict';


  function TipoHandle(tipoCache,
                      tipoInstanceDataService,
                      tipoDefinitionDataService,
                      $location,
                      $mdToast,
                      $mdDialog){
     
     function getConfirmation(title, user_message){
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

     function hideElement(element_class){
      var elem = angular.element(document.querySelector("." + element_class));
      elem.style.display = 'none';
     }

     function showElement(element_class){
      var elem = angular.element(document.querySelector("." + element_class));
      elem.style.display = 'block';
     }

     function getTipoDefinition(tipo_name){
      tipoDefinitionDataService.getOne(tipo_name).then(function(definition){
        return definition;
      });
     }

     function callAction(tipo_name, action_name, selected_tipo_ids, additional_tipo_name, additional_tipo){
      tipoInstanceDataService.performBulkAction(tipo_name,action_name,selected_tipo_ids,additional_tipo_name,additional_tipo).then(function(response){
        return response;
      })
     }

     function routeTo(url){
      $location.url(url);
     }

     function saveTipo(tipo_name, tipo_id, tipo_data){
      tipoInstanceDataService.updateOne(tipo_name,tipo_data,tipo_id).then(function(tipoResponse){
        return true;
      });
     }

     function deleteTipo(tipo_name,tipo_id){
      tipoInstanceDataService.deleteOne(tipo_name,tipo_id).then(function(tipoResponse){
        return true;
      });
     }

     function getTipo(tipo_name, tipo_id, query_params){
      tipoCache.evict(tipo_name, tipo_id);
      tipoInstanceDataService.getOne(tipo_name, tipo_id, query_params).then(function(tipo){
        return tipo;
      });
     }

     function getTipos(tipo_name, query_params){
      tipoCache.evict(tipo_name);
      tipoInstanceDataService.search(tipo_name).then(function(tipos){
        return tipos;
      });
     }

     function presentForm(tipo_name, tipo, submit_label, show_cancel){

     }

     function showMessage(user_heading,user_message){
      var toast = $mdToast.tpToast();
      toast._options.locals = {
        header: user_heading,
        body: user_message
      };
      $mdToast.show(toast);
     };





  }

  // Added Tipo Handle Service in Custom Module
  angular.module('tipo.framework')
         .service('tipoHandle', TipoHandle);; 

})();