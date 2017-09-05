(function() {

  'use strict';

  function TipoLookupDialogController(
    tipoInstanceDataService,
    tipoManipulationService,
    $scope,
    $mdDialog) {

    var target = $scope.target;
    $scope.fullscreen = true;

    var relatedTipoName = $scope.relatedTipo;

    $scope.tipoDisplayName = relatedTipoName;
    $scope.fieldlabel = {};

    $scope.tipoId = "";

    $scope.populateData = function() {
      var tipoId = $scope.tipoId;
      if(!_.isUndefined(tipoId)){
        tipoInstanceDataService.getOne(relatedTipoName, tipoId).then(function(tipo){
          $mdDialog.hide(tipo);
        });
      }
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

  function TipoActionDialogController(
    tipoDefinition,
    tipoManipulationService,
    $scope,
    tipoDialogInputs,
    tipoRouter,
    tipoInstanceDataService,
    $mdDialog) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.hide_actions = true;
    _instance.tipo = {};
    _instance.context = tipoDialogInputs.context;
    _instance.submit_label = tipoDialogInputs.submit_label;
    _instance.tipo_name =  tipoDialogInputs.tipo_name
    
    $scope.Date = Date;

    _instance.hooks = {};
    _instance.fullscreen = true;
    _instance.maximize = function(){
      _instance.fullscreen = true;
    };

    _instance.restore = function(){
      _instance.fullscreen = false;
    };

    _instance.lookupTipo = function(relatedTipo,labelfield,prefix){
      var newScope = $scope.$new();
      newScope.root = _instance.tipoDefinition;
      newScope.relatedTipo = relatedTipo;
      newScope.labelfield = labelfield;
      newScope.tipo = _instance.tipo[prefix];
      var promise = $mdDialog.show({
        templateUrl: 'framework/_directives/_views/tp-lookup-dialog.tpl.html',
        controller: 'TipoLookupDialogController',
        scope: newScope,
        skipHide: true,
        clickOutsideToClose: true,
        fullscreen: true
      });
      promise.then(function(tipo){
        _instance.tipo[prefix] = tipo;
      });
    }

    _instance.finish = function() {
      var tipoData = _instance.tipo;
      if(_instance.hooks.preFinish){
        var result = _instance.hooks.preFinish();
        if(!result){
          return;
        }
        tipoData = _instance.data;
      }
      $mdDialog.hide(tipoData);
    };

    _instance.cancel = function() {
      $mdDialog.cancel();
    };
  }


  function TipoHandle(tipoCache,
                      tipoInstanceDataService,
                      tipoDefinitionDataService,
                      tipoManipulationService,
                      metadataService,
                      $location,
                      $mdToast,
                      $mdDialog,
                      $q,
                      $stateParams){

    var role = metadataService.userMetadata.role;
    
     function getConfirmation(title, user_message){
       var confirmation = $mdDialog.confirm()
              .title(title)
              .textContent(user_message)
              .ariaLabel(title)
              .ok('Yes')
              .cancel('No');
       return $mdDialog.show(confirmation).then(function(){
          return true;
       },function(){
          return false;
       });
     }

     function hideElement(element_class){
      var elem = angular.element(document.querySelector("." + element_class));
      elem.style.display = 'none';
      $q.when(true);
     }

     function showElement(element_class){
      var elem = angular.element(document.querySelector("." + element_class));
      elem.style.display = 'block';
      $q.when(true);
     }

     function getTipoDefinition(tipo_name){
      return tipoDefinitionDataService.getOne(tipo_name);
     }

     function callAction(tipo_name, action_name, selected_tipo_ids, additional_tipo_name, additional_tipo){
      if (selected_tipo_ids.length > 1) {
        return tipoInstanceDataService.performBulkAction(tipo_name,action_name,selected_tipo_ids,additional_tipo_name,additional_tipo);
      }else{
        return tipoInstanceDataService.performSingleAction(tipo_name,selected_tipo_ids[0],action_name,additional_tipo_name,additional_tipo);
      }
     }

     function routeTo(url){
      $location.url(url);
      $q.when(true);
     }

     function saveTipo(tipo_name, tipo_id, tipo_data){
      return tipoInstanceDataService.updateOne(tipo_name,tipo_data,tipo_id);
     }

     function saveTipos(tipo_name, tipo_data){
      return tipoInstanceDataService.updateAll(tipo_name,tipo_data);
     }

     function createTipo(tipo_name, tipo_data, query_params){
      return tipoInstanceDataService.upsertAll(tipo_name,[tipo_data]);
     }

     function createTipos(tipo_name, tipo_data, query_params){
      return tipoInstanceDataService.upsertAll(tipo_name,tipo_data);
     }

     function deleteTipo(tipo_name,tipo_id){
      return tipoInstanceDataService.deleteOne(tipo_name,tipo_id);
     }

     function getTipo(tipo_name, tipo_id, query_params,reload){
      tipoCache.evict(tipo_name, tipo_id);
      query_params = tipoManipulationService.checkQueryParams(query_params);
      return tipoInstanceDataService.getOne(tipo_name, tipo_id, query_params, reload);
     }

     function getTipos(tipo_name, query_params){
      tipoCache.evict(tipo_name);
      query_params = tipoManipulationService.checkQueryParams(query_params);
      return tipoInstanceDataService.search(tipo_name,query_params);
     }


     function deleteItemFromArray(item,index){
      if (_.isUndefined(item[index]._ARRAY_META)) {
        _.remove(item, function(each){
          return each === item[index];
        });
      }else{
        item[index]._ARRAY_META._STATUS = 'DELETED';
      }
     }

     function presentForm(tipo_name, tipo, submit_label, show_cancel){
      var newScope = {};
      newScope.context = tipo;
      newScope.tipo_name = tipo_name;
      newScope.submit_label = submit_label;
      var promise = $mdDialog.show({
        templateUrl: 'framework/_directives/_views/tp-action-dialog.tpl.html',
        controller: TipoActionDialogController,
        controllerAs: 'tipoRootController',
        resolve: /*@ngInject*/
        {
          tipoDefinition: function(tipoManipulationService) {
            return getTipoDefinition(tipo_name);
          },
          tipoDialogInputs: function(){
            return {context: tipo, tipo_name: tipo_name, submit_label:submit_label }
          }
        },
        skipHide: true,
        clickOutsideToClose: true,
        fullscreen: true
      });
      return promise;
     }

     function showMessage(user_heading,user_message){
      var toast = $mdToast.tpToast();
      toast._options.locals = {
        header: user_heading,
        body: user_message
      };
      $mdToast.show(toast);
      $q.when(true);
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


     this.application_meta = metadataService.applicationMetadata;
     this.user_meta = metadataService.userMetadata;
     this.getConfirmation = getConfirmation;
     this.hideElement = hideElement;
     this.showElement = showElement;
     this.getTipoDefinition = getTipoDefinition;
     this.routeTo = routeTo;
     this.saveTipo = saveTipo;
     this.saveTipos = saveTipos;
     this.createTipo = createTipo;
     this.createTipos = createTipos;
     this.deleteTipo = deleteTipo;
     this.getTipo = getTipo;
     this.getTipos = getTipos;
     this.presentForm = presentForm;
     this.showMessage = showMessage;
     this.callAction = callAction;
     this.updateUrl = updateUrl;
     this.createUrl = createUrl;
     this.detailUrl = detailUrl;
     this.deleteItemFromArray = deleteItemFromArray;




  }

  // Added Tipo Handle Service in Custom Module
  angular.module('tipo.framework')
         .service('tipoHandle', TipoHandle);; 

})();