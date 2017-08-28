(function() {

  'use strict';

  function TipoListRootController(
    tipoManipulationService,
    tipoHandle,
    tipoRouter,
    tipoRegistry,
    tipoCache,
    metadataService,
    $state,
    $stateParams,
    $mdToast,
    $mdDialog,
    $window,
    $rootScope,
    $scope,
    $templateCache,
    tipoClientJavascript) {

    var _instance = this;
    var role = metadataService.userMetadata.role;
    var tipo_name = $stateParams.tipo_name;
    _instance.tipo_name = $stateParams.tipo_name;
    $scope.data_handle = {};
    _instance.listUrl = "g/public/gen_temp/common/views/list.tpl.html." + role + "___" + $stateParams.tipo_name;

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

    _instance.initTiposData = function(tipoFilters,page_size,allow_search){
      var filter = {};
      _instance.hasTipos = true;
      _instance.allow_search = allow_search;
      if ($stateParams.filter) {
        _instance.tipoFilters = tipoManipulationService.convertToFilterExpression(tipoFilters,$stateParams.filter);
        getPerspective(filter);
      };
      filter.page = 1;
      _instance.page = 2;
      _instance.per_page = page_size || 10;
      filter.per_page = _instance.per_page;
      _instance.busy = true;
      tipoHandle.getTipos($stateParams.tipo_name, filter).then(function(tipos){
        var function_name = $stateParams.tipo_name + "_OnList";
        if(typeof tipoClientJavascript[function_name] === 'function'){
          $scope.data_handle.tipo_list = tipos;
          tipoClientJavascript[function_name]($scope.data_handle);
        }
        _instance.tipos = tipos;
        _instance.hasTipos = tipos.length > 0;
        _instance.initTipos = angular.copy(tipos);
        _instance.busy = false;
        _instance.updatetipo = {};
        _instance.loading = false;
        var per_page = _instance.per_page;
        var responseData = tipoRegistry.get($stateParams.tipo_name + '_resdata');
        _instance.perm = responseData.perm;
        _instance.restricted_actions = responseData.restricted_actions;
        _instance.bulkedit = false;
        _instance.singleedit = false;
      });
    }
    function getPerspective(filter){
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      // TODO: Hack - Sushil as this is supposed to work only for applications
      if (!_.isEmpty(_instance.searchText)) {
          filter.tipo_filter = "(_all:(" + _instance.searchText + "*))";
      };
      if (perspectiveMetadata.tipoName) {
        if (perspectiveMetadata.tipoName !== $stateParams.tipo_name && perspectiveMetadata.tipoFilter) {
          if (filter.tipo_filter) {
            filter.tipo_filter += " AND " + perspectiveMetadata.tipoFilter;
          }else{
            filter.tipo_filter = perspectiveMetadata.tipoFilter;
          }
        } 
      }

      if ($stateParams.filter) {
        if (filter.tipo_filter) {
          filter.tipo_filter += " AND " + tipoManipulationService.expandFilterExpression(_instance.tipoFilters.currentExpression);
        } else {
          filter.tipo_filter = tipoManipulationService.expandFilterExpression(_instance.tipoFilters.currentExpression);
        }
      }
    }

    function bulkUpdateTipos(tipo){
      tipoHandle.saveTipos(tipo_name, tipo).then(function(result){
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

    function bulkCreateTipos(tipo){
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      if(perspectiveMetadata.fieldName && !tipo[perspectiveMetadata.fieldName]){
        tipo[perspectiveMetadata.fieldName] = perspectiveMetadata.tipoId;
      }
      tipoHandle.createTipos(tipo_name, tipo).then(function(result){
        if(tipoRouter.stickyExists()){
          tipoRouter.toStickyAndReset();
        }else{ 
          var registryName = $stateParams.tipo_name + '_resdata';
          var resData = tipoRegistry.get(registryName);
          tipoRegistry.pushData(tipo_name,result[0].tipo_id,result[0]);
          tipoRouter.toTipoList(tipo_name);
        }
      });
    }

    _instance.quickAdd = function(){
      var newObject = {edit: true};
      _instance.tipos.push(newObject);
    }

    _instance.createNew = function(){
      //Clientside Javascript for OnCreate 
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      var function_name = $stateParams.tipo_name + "_OnCreate";
      if(typeof tipoClientJavascript[function_name] === 'function'){
        $scope.data_handle.tipo_list = _instance.tipos;
        tipoClientJavascript[function_name]($scope.data_handle);
      }
      if(perspectiveMetadata.fieldName){
        var data = {};
        data[perspectiveMetadata.fieldName] = perspectiveMetadata.tipoId;
        data = encodeURIComponent(angular.toJson(data));
        tipoRouter.toTipoCreate(tipo_name, {data: data});
      }else{
        tipoRouter.toTipoCreate(tipo_name);
      }
    };

    _instance.toDetail = function(id,tipos,tipo){
      //Clientside Javascript for OnClick
      // if(typeof tipoClientJavascript[tipo_name + '_List_OnClick'] === 'function'){
      //   tipoClientJavascript[tipo_name + '_List_OnClick'](tipo,tipo_name);
      // }else{
        if (!tipo.edit) {
          tipoRouter.toTipoView(tipo_name, id);
        };
      // }
    };

    _instance.clone = function(tipo){
      //Clientside Javascript for OnClone
      var function_name = $stateParams.tipo_name + "_OnCreate";
      if(typeof tipoClientJavascript[function_name] === 'function'){
        $scope.data_handle.tipo_list = _instance.tipos;
        $scope.data_handle.tipo = tipo;
        tipoClientJavascript[function_name]($scope.data_handle);
      }
      tipoRouter.toTipoCreate(tipo_name, {copyFrom: tipo.tipo_id});
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
      var function_name = $stateParams.tipo_name + "_OnClick";
      var res = false;
      if(typeof tipoClientJavascript[function_name] === 'function'){
         $scope.data_handle.tipo_list = _instance.tipos;
         $scope.data_handle.selected_tipo = tipo;
         $scope.data_handle.event = event;
         res = tipoClientJavascript[function_name]($scope.data_handle);
         _.set(tipo,"",$scope.data_handle.selected_tipo);
      }
      if (_instance.bulkedit || _instance.singleedit || _instance.bulkupdate || res) {
        event.stopPropagation();
      }
    }

    _instance.updateSelected = function(field_name,label_){
      _.each(_instance.tipos,function(tp){
        if (tp.selected) {
          _.set(tp,field_name,_.get(_instance.updatetipo,field_name));
          var label = _.get(_instance.updatetipo,field_name + "_labels");
          if (label) {
            _.set(tp,field_name + "_labels",_.get(_instance.updatetipo,field_name + "_labels"));
          };
        };
      });
    }

    _instance.save = function(tipo,action){
      tipoRouter.startStateChange();
      var data = tipo;
      var parameters = {};
      tipoManipulationService.modifyTipoData(tipo);
      if (!_.isArray(tipo)) {
        if (data.tipo_id) {
          bulkUpdateTipos([data]);
        }else{
          bulkCreateTipos([data]);
        }
      }else{
        var createTipos = _.filter(data, function(tp){return !tp.tipo_id; });
        var updateTipos = _.filter(data, function(tp){return tp.tipo_id; });
        bulkCreateTipos(createTipos);
        bulkUpdateTipos(updateTipos);
      }
    };

    _instance.delete = function(tipo,index){
      if (!tipo.tipo_id) {
        _.remove(_instance.tipos,function(val,inx){
          return inx === index;
        });
      }else{
        var confirmation = $mdDialog.confirm()
            .title('Delete Confirmation')
            .textContent('Are you sure that you want to delete ' + tipo_name + ' ' + tipo.tipo_id + '?')
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
          var function_name = $stateParams.tipo_name + "_OnDelete";
          var res = true;
          if(typeof tipoClientJavascript[function_name] === 'function'){
            $scope.data_handle.tipo = tipo;
             res = tipoClientJavascript[function_name](tipo);
          }
          if (res) {
            tipoHandle.deleteTipo(tipo_name, tipo.tipo_id, filter).then(function(){
              tipoRouter.toTipoList(tipo_name);
            });
          }else{
            tipoRouter.endStateChange();
          }
        });
      }
    };

    _instance.refresh = function(){
      var filter = {};
      tipoRouter.startStateChange();
      getPerspective(filter);
      tipoCache.evict($stateParams.tipo_name);
      $templateCache.remove(_instance.listUrl);
      tipoHandle.getTipos($stateParams.tipo_name, filter).then(function(tiposData){
        _instance.tipos = tiposData;
        var function_name = $stateParams.tipo_name + "_OnList";
        if(typeof tipoClientJavascript[function_name] === 'function'){
          $scope.data_handle.tipo_list = tiposData;
          tipoClientJavascript[function_name]($scope.data_handle);
        }
        tipoRouter.endStateChange();
      });
    }

    _instance.nextPage = function(){
      if (_instance.busy) {return;}
      _instance.busy = true;
      _instance.loading = true;
      var filter = {};
      getPerspective(filter);
      filter.page = angular.copy(_instance.page);
      filter.per_page = _instance.per_page;
      tipoRouter.startStateChange();
      tipoHandle.getTipos($stateParams.tipo_name, filter).then(function(tiposData){
        if (!_.isEmpty(tiposData)) {
          _instance.tipos = _.union(_instance.tipos,tiposData);
          var function_name = $stateParams.tipo_name + "_OnList";
          if(typeof tipoClientJavascript[function_name] === 'function'){
            $scope.data_handle.tipo_list = _instance.tipos;
            tipoClientJavascript[function_name]($scope.data_handle);
          }
          _instance.busy = false;
          _instance.page++;
        };
        _instance.loading = false;
        tipoRouter.endStateChange();
      });
    }

    _instance.search = function(){
      var filter = {};
      getPerspective(filter);
      _instance.page = 1;
      filter.page = angular.copy(_instance.page);
      filter.per_page = _instance.per_page;
      tipoRouter.startStateChange();
      tipoCache.evict($stateParams.tipo_name);
      tipoHandle.getTipos($stateParams.tipo_name, filter).then(function(tiposData){
        _instance.tipos = tiposData;
        var function_name = $stateParams.tipo_name + "_OnList";
        if(typeof tipoClientJavascript[function_name] === 'function'){
          $scope.data_handle.tipo_list = _instance.tipos;
          tipoClientJavascript[function_name]($scope.data_handle);
        }
        _instance.page++;
        _instance.busy = false;
        tipoRouter.endStateChange();
      });
    }

    _instance.undoEdit = function(){
      _instance.tipos = _instance.initTipos;
      _instance.bulkupdate = !_instance.bulkupdate
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

    _instance.icon = "check_box_outline_blank";
    _instance.tooltip = "Select All";
    _instance.selectall = function(){
      _instance.selectedall = !_instance.selectedall;
      if (!_instance.selectedall) {
        _instance.icon = "check_box_outline_blank";
        _instance.tooltip = "Select All";
      }else{
        _instance.icon = "check_box";
        _instance.tooltip = "Deselect All";
      }
      _.map(_instance.tipos,function(tipo){
        tipo.selected = _instance.selectedall;
      });
    }

    $scope.$watch(function(){return $scope.data_handle},function(new_value,old_value){
      _instance.tipos = $scope.data_handle.tipo_list;
    },true);
    
  }

  angular.module('tipo.framework')
  .controller('TipoListRootController', TipoListRootController);

})();