(function() {

  'use strict';


  function TipoHandle(tipoCache,
                      tipoInstanceDataService,
                      tipoDefinitionDataService,
                      metadataService,
                      $location,
                      $mdToast,
                      $mdDialog,
                      $stateParams){

    var role = metadataService.userMetadata.role;
     
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

     function saveTipos(tipo_name, tipo_data){
      return tipoInstanceDataService.updateAll(tipo_name,tipo_data);
     }

     function createTipo(tipo_name, tipo_data, query_params){
      return tipoInstanceDataService.upsertAll([tipo_name],tipo_data);
     }

     function createTipos(tipo_name, tipo_data, query_params){
      return tipoInstanceDataService.upsertAll(tipo_name,tipo_data);
     }

     function deleteTipo(tipo_name,tipo_id){
      return tipoInstanceDataService.deleteOne(tipo_name,tipo_id);
     }

     function getTipo(tipo_name, tipo_id, query_params){
      tipoCache.evict(tipo_name, tipo_id);
      return tipoInstanceDataService.getOne(tipo_name, tipo_id, query_params);
     }

     function getTipos(tipo_name, query_params){
      tipoCache.evict(tipo_name);
      return tipoInstanceDataService.search(tipo_name);
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

     function updateUrl(tipo_name){
      return "g/public/gen_temp/common/views/update.tpl.html." + role + "___" + tipo_name;
     }

     function createUrl(tipo_name){
      return "g/public/gen_temp/common/views/create.tpl.html." + role + "___" + tipo_name;
     }

     function detailUrl(tipo_name){
      return "g/public/gen_temp/common/views/view.tpl.html." + role + "___" + tipo_name;
     }

     this.getConfirmation = getConfirmation;
     this.hideElement = hideElement;
     this.showElement = showElement;
     this.getTipoDefinition = getTipoDefinition;
     this.routeTo = routeTo;
     this.saveTipo = saveTipo;
     this.deleteTipo = deleteTipo;
     this.getTipo = getTipo;
     this.getTipos = getTipos;
     this.presentForm = presentForm;
     this.showMessage = showMessage;
     this.updateUrl = updateUrl;
     this.createUrl = createUrl;
     this.detailUrl = detailUrl;




  }

  // Added Tipo Handle Service in Custom Module
  angular.module('tipo.framework')
         .service('tipoHandle', TipoHandle);; 

})();