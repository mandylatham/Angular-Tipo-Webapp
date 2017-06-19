(function() {

  'use strict';

  function TipoListRootController(
    tipoDefinition,
    tipoFilters,
    tipos,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    tipoRegistry,
    tipoCache,
    $state,
    $stateParams,
    $mdToast,
    $mdDialog,
    $window,
    $rootScope,
    $scope,
    tipoClientJavascript) {

    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipoFilters = tipoFilters;
    _instance.tipos = tipos;
    _instance.busy = false;
    _instance.updatetipo = {};
    _instance.loading = false;
    var page = 2;
    var per_page = tipoDefinition.tipo_meta.default_page_size;
    var responseData = tipoRegistry.get($stateParams.tipo_name + '_resdata');
    _instance.perm = responseData.perm;
    _instance.restricted_actions = responseData.restricted_actions;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;

    _instance.tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(tipoDefinition,tipos);
    _instance.bulkedit = false;
    _instance.singleedit = false;
    if (_.isUndefined(_instance.tipoDefinition.tipo_meta.allow_search)) {
      _instance.tipoDefinition.tipo_meta.allow_search = true;
    };

    _instance.hasTipos = tipos.length > 0;

    if ($stateParams.tab_url) {
      var resData = tipoRegistry.get($stateParams.tab_url);
      var confirm = $mdDialog.show({
          clickOutsideToClose: true,
          $scope: $scope,
          template: '<md-dialog class="md-padding">' +
                    '  <md-dialog-content class="md-padding">' +
                     $stateParams.message +
                    '  </md-dialog-content>' +
                    '<md-dialog-actions layout="row">' + 
                    '<md-button href="' + $stateParams.tab_url +
                    '" target="_blank" ng-click="closeDialog()" md-autofocus>' +
                    'OK' +
                    '</md-button>' + 
                    '</md-dialog-actions>' + 
                    '</md-dialog>',
           controller: function DialogController($scope, $mdDialog) {
               $scope.closeDialog = function() {
                  $mdDialog.hide();
               }
            }
        });
    }else{
      if ($stateParams.message) {
        var toast = $mdToast.tpToast();
        toast._options.locals = {
          header: 'Action successfully completed',
          body: $stateParams.message
        };
        $mdToast.show(toast);
      };
    };

    function getPerspective(filter){
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      // TODO: Hack - Sushil as this is supposed to work only for applications
      if (!_.isEmpty(_instance.searchText)) {
          filter.tipo_filter = "(_all:(" + _instance.searchText + "*))";
      };
      if (perspectiveMetadata.tipoName) {
        if (perspectiveMetadata.tipoName !== tipoDefinition.tipo_meta.tipo_name && perspectiveMetadata.tipoFilter) {
          if (filter.tipo_filter) {
            filter.tipo_filter += " AND " + perspectiveMetadata.tipoFilter;
          }else{
            filter.tipo_filter = perspectiveMetadata.tipoFilter;
          }
        } 
      }

      if ($stateParams.filter) {
        if (filter.tipo_filter) {
          filter.tipo_filter += " AND " + tipoManipulationService.expandFilterExpression(tipoFilters.currentExpression);
        } else {
          filter.tipo_filter = tipoManipulationService.expandFilterExpression(tipoFilters.currentExpression);
        }
      }
    }

    _instance.createNew = function(){
      if (tipoDefinition.tipo_meta.allow_edit_in_list_view) {
        var newObject = {edit: true};
        _instance.tipos.push(newObject);
      }else{
        var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
        if(perspectiveMetadata.fieldName){
          var data = {};
          data[perspectiveMetadata.fieldName] = perspectiveMetadata.tipoId;
          data = encodeURIComponent(angular.toJson(data));
          tipoRouter.toTipoCreate(tipo_name, {data: data});
        }else{
          tipoRouter.toTipoCreate(tipo_name);
        }
      }
    };

    _instance.toDetail = function(id,tipo){
      // if(typeof tipoClientJavascript[tipo_name + '_List_OnClick'] === 'function'){
      //   tipoClientJavascript[tipo_name + '_List_OnClick'](tipo,tipo_name);
      // }else{
        tipoRouter.toTipoView(tipo_name, id);
      // }
    };

    _instance.clone = function(id){
      tipoRouter.toTipoCreate(tipo_name, {copyFrom: id});
    };

    _instance.selectTipo = function(tipo,event){
      if (_instance.singleedit) {
        _.each(_instance.tipos,function(tp){
          if(tp !== tipo){
            tp.selected = false;
          }
        });
      };
      tipo.selected = !tipo.selected;
      if (_instance.bulkedit || _instance.singleedit) {
        event.stopPropagation();
      }
    }

    _instance.updateSelected = function(field_name){
      _.each(_instance.tipos,function(tp){
        if (!tp.selected) {
          _.set(tp,field_name,_.get(_instance.updatetipo,field_name)); 
        };
      });
      console.log(_instance.tipos);
    }

    _instance.save = function(tipo,action){
      tipoRouter.startStateChange();
      var data = {};
      var parameters = {};
      tipoManipulationService.modifyTipoData(tipo);
      if (tipo.tipo_id || _.isArray(tipo)) {
        if (_.isArray(tipo)) {
          tipoInstanceDataService.updateAll(tipo_name, tipo).then(function(result){
            if(tipoRouter.stickyExists()){
              tipoRouter.toStickyAndReset();
            }else{
              if (tipo_name === "TipoDefinition") {
                $templateCache.remove(_instance.tipoDefinition._ui.editTemplateUrl.replace(/___TipoDefinition/g,"___" + tipo_id));
                $templateCache.remove(_instance.tipoDefinition._ui.listTemplateUrl.replace(/___TipoDefinition/g,"___" + tipo_id));
                $templateCache.remove(_instance.tipoDefinition._ui.createTemplateUrl.replace(/___TipoDefinition/g,"___" + tipo_id));
              }
              tipoRouter.toTipoList(tipo_name);
            }
          });
        }else{
          data.copy_from_tipo_id = tipo.copy_from_tipo_id;
          tipoInstanceDataService.updateOne(tipo_name, tipo, tipo.tipo_id).then(function(result){
            if(tipoRouter.stickyExists()){
              tipoRouter.toStickyAndReset();
            }else{
              if (tipo_name === "TipoDefinition") {
                $templateCache.remove(_instance.tipoDefinition._ui.editTemplateUrl.replace(/___TipoDefinition/g,"___" + tipo_id));
                $templateCache.remove(_instance.tipoDefinition._ui.listTemplateUrl.replace(/___TipoDefinition/g,"___" + tipo_id));
                $templateCache.remove(_instance.tipoDefinition._ui.createTemplateUrl.replace(/___TipoDefinition/g,"___" + tipo_id));
              }
              tipoRouter.toTipoList(tipo_name);
            }
          });
        }
      }else {
        var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
          if(perspectiveMetadata.fieldName && !tipo[perspectiveMetadata.fieldName]){
            tipo[perspectiveMetadata.fieldName] = perspectiveMetadata.tipoId;
          }
          tipoInstanceDataService.upsertAll(tipo_name, [tipo]).then(function(result){
            if(tipoRouter.stickyExists()){
              tipoRouter.toStickyAndReset();
            }else{
              if (tipo === 'dialog') {
                tipoInstanceDataService.search(tipo_name).then(function(tipos){
                  $mdDialog.hide(tipos);
                });            
              }else{
                var registryName = $stateParams.tipo_name + '_resdata';
                var resData = tipoRegistry.get(registryName);
                tipoRegistry.pushData(tipo_name,result[0].tipo_id,result[0]);
                tipoRouter.toTipoList(tipo_name);
              }
            }
          });
      };
    };

    _instance.delete = function(tipo_id){
      var confirmation = $mdDialog.confirm()
          .title('Delete Confirmation')
          .textContent('Are you sure that you want to delete ' + tipo_name + ' ' + tipo_id + '?')
          .ariaLabel('Delete Confirmation')
          .ok('Yes')
          .cancel('No');
      $mdDialog.show(confirmation).then(function(){
        tipoRouter.startStateChange();
        // handle application perspective
        var filter = {};
        var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
        if(perspectiveMetadata.fieldName === 'application'){
          filter.tipo_filter = perspectiveMetadata.tipoFilter;
        }
        // ends here
        tipoInstanceDataService.deleteOne(tipo_name, tipo_id, filter).then(function(){
          tipoRouter.toTipoList(tipo_name);
        });
      });
    };

    _instance.refresh = function(){
      var filter = {};
      tipoRouter.startStateChange();
      getPerspective(filter);
      tipoCache.evict($stateParams.tipo_name);
      tipoInstanceDataService.search($stateParams.tipo_name, filter).then(function(tiposData){
        _instance.tipos = tiposData;
        tipoRouter.endStateChange();
      });
    }

    _instance.nextPage = function(){
      if (_instance.busy) {return;}
      _instance.busy = true;
      _instance.loading = true;
      var filter = {};
      getPerspective(filter);
      filter.page = angular.copy(page);
      filter.per_page = per_page;
      tipoRouter.startStateChange();
      tipoInstanceDataService.search($stateParams.tipo_name, filter).then(function(tiposData){
        if (!_.isEmpty(tiposData)) {
          _instance.tipos = _.union(_instance.tipos,tiposData);
          _instance.busy = false;
          page++;
        };
        _instance.loading = false;
        tipoRouter.endStateChange();
      });
    }

    _instance.search = function(){
      var filter = {};
      getPerspective(filter);
      page = 1;
      filter.page = angular.copy(page);
      filter.per_page = per_page;
      tipoRouter.startStateChange();
      tipoCache.evict($stateParams.tipo_name);
      tipoInstanceDataService.search($stateParams.tipo_name, filter).then(function(tiposData){
        _instance.tipos = tiposData;
        page++;
        _instance.busy = false;
        tipoRouter.endStateChange();
      });
    }

    _instance.toogleSearch = function(){
      _instance.showsearch = !_instance.showsearch;
      if (_instance.showsearch) {
        var container = angular.element(document.getElementById('inf-wrapper'));
        var scrollto = angular.element(document.getElementById('search'));
        container.scrollToElement(scrollto,150,100);
        return false;
      };
    }

    
  }

  angular.module('tipo.framework')
  .controller('TipoListRootController', TipoListRootController);

})();