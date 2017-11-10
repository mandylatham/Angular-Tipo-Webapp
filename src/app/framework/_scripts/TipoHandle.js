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
    tipoHandle,
    tipoDialogInputs,
    tipoRouter,
    tipoInstanceDataService,
    $mdDialog) {
    
    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    tipoHandle.setPerspective();
    _instance.tipo_handle = tipoHandle;
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
                      tipoRouter,
                      $q,
                      $filter,
                      $stateParams){

    if (metadataService.userMetadata && metadataService.userMetadata.role) {
      var role = metadataService.userMetadata.role;
    }else{
      var role = "ProfessionalPlanRole";
    }
    
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

     function getTipoDefinition(tipo_name, disableExpansion){
      tipoRouter.startStateChange();
      return tipoDefinitionDataService.getOne(tipo_name, disableExpansion).then(function(response){
          tipoRouter.endStateChange();
          return response;
        });
     }

     function callAction(tipo_name, action_name, selected_tipo_ids, additional_tipo_name, additional_tipo){
      tipoRouter.startStateChange();
      var additional_tipo = {tipo: additional_tipo};
      tipoManipulationService.modifyTipoData(additional_tipo.tipo);
      if (selected_tipo_ids.length === 1) {
        return tipoInstanceDataService.performSingleAction(tipo_name,selected_tipo_ids[0],action_name,additional_tipo_name,additional_tipo.tipo).then(function(response){
          tipoRouter.endStateChange();
          return response;
        });
      }else{
        return tipoInstanceDataService.performBulkAction(tipo_name,action_name,selected_tipo_ids,additional_tipo_name,additional_tipo.tipo).then(function(response){
          tipoRouter.endStateChange();
          return response;
        });
      }
     }

     function routeTo(url){
      $location.url(url);
      // $q.when(true);
     }

     function toTipo(mode,tipo_name,tipo_id){
      if (mode === 'view') {
        tipoRouter.toTipoView(tipo_name,tipo_id);
      }else if(mode === 'edit'){
        tipoRouter.toTipoEdit(tipo_name,tipo_id);
      }else if(mode === 'create'){
        tipoRouter.toTipoCreate(tipo_name);
      }else if (mode === 'list' ) {
        tipoRouter.toTipoView(tipo_name);
      };
     }

     function saveTipo(tipo_name, tipo_id, tipo_data){
      tipoRouter.startStateChange();
      return tipoInstanceDataService.updateOne(tipo_name,tipo_data,tipo_id).then(function(response){
          tipoRouter.endStateChange();
          return response;
        });
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
      tipoRouter.startStateChange();
      query_params = tipoManipulationService.checkQueryParams(query_params);
      return tipoInstanceDataService.search(tipo_name,query_params).then(function(response){
        tipoRouter.endStateChange();
        return response;
      });
     }


     function deleteItemFromArray(item,index){
      if (_.isUndefined(item[index]._ARRAY_META)) {
        // _.remove(item, function(each){
        //   return each === item[index];
        // });
        item[index]._UI_STATUS = 'DELETED';
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

     function listUrl(tipo_name){
      return "g/public/gen_temp/common/views/list.tpl.html." + role + "___" + tipo_name;
     }

     function getISODate(){
      var date = new Date();
      date.setHours(0, 0, 0, 0);
      return $filter('date')(date,'yyyy-MM-ddTHH:mm:ss.sss') + 'Z';
     }

     function setPerspective(){
      this.perspective = tipoManipulationService.resolvePerspectiveMetadata();
      this.perspective.tipo_name = this.perspective.tipoName;
      this.perspective.display_name = this.perspective.displayName;
      this.perspective.field_name = this.perspective.fieldName;
      this.perspective.tipo_id = this.perspective.tipoId;
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
     this.listUrl = listUrl;
     this.deleteItemFromArray = deleteItemFromArray;
     this.toTipo = toTipo;
     this.getISODate = getISODate;
     this.setPerspective = setPerspective;




  }

  // Added Tipo Handle Service in Custom Module
  angular.module('tipo.framework')
         .service('tipoHandle', TipoHandle);; 

})();