(function() {

  'use strict';

  function TipoObjectDialogController(
    tipoDefinition,
    tipoManipulationService,
    $scope,
    $mdDialog,
    tipoRouter,
    tipoCache,
    tipoRegistry,
    tipoHandle,
    $mdSelect) {

    var _instance = this;
    var label_field = $scope.label_field;
    _instance.tiposWithDefinition = tipoDefinition.tiposWithDefinition;
    _instance.tipoDefinition = tipoDefinition.tipoDefinition;
    _instance.tipos = tipoDefinition.tipos;
    var tipo_perm = tipoRegistry.get($scope.tipo_name + '_resdata');
    _instance.perm = tipo_perm.perm;
    _instance.popup = true;
    _instance.tipo_fields = $scope.tipo_fields;
    _instance.disablecreate = $scope.disablecreate;
    _instance.selectedTipos = $scope.selectedTipos;
    $scope.fullscreen = true;
    if (!_.isUndefined($scope.selectedTipos) && !_.isEmpty($scope.selectedTipos)) {
      _.each(_instance.tipos, function(tipo){
          if (!_.isUndefined(tipo.tipo_id)){
            tipo.key = tipo.tipo_id;
            tipo.label = tipo[label_field];
          };
          _.each($scope.selectedTipos,function(selected){
            if (!_.isUndefined(selected)) {
              if(tipo.key === selected.key){
                tipo.selected = true;
              }
            };
          })
        });
    }else{
      $scope.selectedTipos = [];
    }
    _instance.maximize = function(){
      $scope.fullscreen = true;
    };

    _instance.restore = function(){
      $scope.fullscreen = false;
    };

    _instance.selectTipo = function(tipoSelected,event,tiposData){
      if (!$scope.isArray) {
        $scope.selectedTipos = [];
        _.each(tiposData, function(tipo){
          tipo.selected = false;
        });
      }
      tipoSelected.selected = !tipoSelected.selected;
      if(tipoSelected.selected){
        $scope.selectedTipos.push(tipoSelected);
      }else{
        _.remove($scope.selectedTipos,function(tipo){
          return (tipo.key === tipoSelected.key);
        });
      }
      event.stopPropagation();
    }
    _instance.finish = function() {    
      $mdDialog.hide($scope.selectedTipos);
    };
    _instance.addTipo = function() {
      $mdSelect.hide();
      var promise = $mdDialog.show({
        templateUrl: 'framework/_directives/_views/tp-lookup-popup-select-new.tpl.html',
        controller: 'TipoCreateRootController',
        controllerAs: 'tipoRootController',
        fullscreen: true,
        resolve: /*@ngInject*/
        {
          tipo: function() {
            return undefined;
          },
          tipoDefinition: function(){
            return _instance.tipoDefinition;
          }
        },
        skipHide: true,
        clickOutsideToClose: true,
        fullscreen: true
      });
      promise.then(function(tipos){
        if (_.isArray(tipos)) {
          _instance.tipos = tipos;
          _instance.tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(_instance.tipoDefinition, tipos, $scope.label_field);
        };
        tipoRouter.endStateChange();
      })
      return promise;
    };
    _instance.cancel = function() {
      $mdDialog.cancel();
    };
    _instance.search = function(){
      var filter = {};
      if (!_.isEmpty(_instance.searchText)) {
        filter.tipo_filter = "(_all:(" + _instance.searchText + "*))";
      };
      var page = 1;
      filter.page = angular.copy(page);
      filter.per_page = _instance.tipoDefinition.tipo_meta.default_page_size;
      tipoRouter.startStateChange();
      tipoCache.evict($scope.tipo_name);
      tipoHandle.getTipos($scope.tipo_name, filter).then(function(tiposData){
        _instance.tipos = tiposData;
        var tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(_instance.tipoDefinition, tiposData, label_field);
        _instance.tiposWithDefinition = tiposWithDefinition;
        page++;
        tipoRouter.endStateChange();
      });
    }
  }

  function TipoEditRootController(
    tipo,
    tipoManipulationService,
    tipoHandle,
    tipoRouter,
    tipoRegistry,
    metadataService,
    $scope,
    $mdToast,
    $stateParams,
    $mdDialog,
    $templateCache,
    tipoDefinitionDataService,
    tipoClientJavascript,
    $mdSelect,
    tipoCache,
    $sce) {
    
    var _instance = this;
    _instance.updateUrl = tipoHandle.updateUrl($stateParams.tipo_name);
    _instance.createUrl = tipoHandle.createUrl($stateParams.tipo_name);
    _instance.detailUrl = tipoHandle.detailUrl($stateParams.tipo_name);
    // _instance.tipoDefinition.tipo_field_groups = tipo.tipo_field_groups;
    var clonedTipoId = $stateParams.copyFrom;
    _instance.tipo = tipo;

    // var tipo_name = tipoDefinition.tipo_meta.tipo_name;
    var tipo_name = $stateParams.tipo_name;
    var tipo_id = $stateParams.tipo_id;

    var perspective = $scope.perspective;

    if ($stateParams.message) {
      var toast = $mdToast.tpToast();
      toast._options.locals = {
        header: 'Action successfully completed',
        body: $stateParams.message
      };
      $mdToast.show(toast);
    };

    _instance.save = function(form,action){
      if (!form.$valid && form !== 'dialog') {
        var container = angular.element(document.getElementById('inf-wrapper'));
        var invalidElement = document.getElementsByClassName("ng-invalid");
        container.scrollToElement(invalidElement[1],150,100);
        return false;
      }
      tipoRouter.startStateChange();
      //Clientside Javascript for OnSave
      var data = {};
      var parameters = {};
      tipoManipulationService.modifyTipoData(_instance.tipo);
      var function_name = $stateParams.tipo_name + "_OnSave";
      if(typeof tipoClientJavascript[function_name] === 'function'){
        tipoClientJavascript[function_name](_instance.tipo,action);
      }
      if (action === 'edit') {
        data.copy_from_tipo_id = tipo.copy_from_tipo_id;
        tipoHandle.saveTipo(tipo_name, tipo_id ,_instance.tipo).then(function(result){
          if(tipoRouter.stickyExists()){
            tipoRouter.toStickyAndReset();
          }else{
            // if (tipo_name === "TipoDefinition") {
            //   $templateCache.remove(_instance.tipoDefinition._ui.editTemplateUrl.replace(/___TipoDefinition/g,"___" + tipo_id));
            //   $templateCache.remove(_instance.tipoDefinition._ui.listTemplateUrl.replace(/___TipoDefinition/g,"___" + tipo_id));
            //   $templateCache.remove(_instance.tipoDefinition._ui.createTemplateUrl.replace(/___TipoDefinition/g,"___" + tipo_id));
            // }
            var registryName = $stateParams.tipo_name + '_resdata';
            var resData = tipoRegistry.get(registryName);
            tipoRegistry.pushData(tipo_name,result.tipo_id,result);
            tipoRouter.toTipoView(tipo_name, tipo_id);
          }
        });
      }else if (action === 'create') {
        tipo_name = tipo_name;
        var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
          if(perspectiveMetadata.fieldName && !_instance.tipo[perspectiveMetadata.fieldName]){
            _instance.tipo[perspectiveMetadata.fieldName] = perspectiveMetadata.tipoId;
          }
          if(!_.isUndefined(clonedTipoId)){
            _instance.tipo.copy_from_tipo_id = clonedTipoId;
          }
          tipoHandle.createTipo(tipo_name, _instance.tipo).then(function(result){
            if(tipoRouter.stickyExists()){
              tipoRouter.toStickyAndReset();
            }else{
              if (form === 'dialog') {
                tipoHandle.getTipos(tipo_name).then(function(tipos){
                  $mdDialog.hide(tipos);
                });            
              }else{
                var registryName = $stateParams.tipo_name + '_resdata';
                var resData = tipoRegistry.get(registryName);
                tipoRegistry.pushData(tipo_name,result[0].tipo_id,result[0]);
                tipoRouter.toTipoResponse(resData,tipo_name,result[0].tipo_id,parameters);
              }
            }
          });
      };
    };

    _instance.addTipo = function(baseFilter,tipo_name,label_field,uniq_name,prefix,label,index) {
      $mdSelect.hide();
      var promise = $mdDialog.show({
        templateUrl: 'framework/_directives/_views/tp-lookup-popup-select-new.tpl.html',
        controller: 'TipoCreateRootController',
        controllerAs: 'tipoRootController',
        fullscreen: true,
        resolve: /*@ngInject*/
        {
          tipo: function() {
            return undefined;
          },
          tipoDefinition: function(tipoDefinitionDataService){
            return tipoDefinitionDataService.getOne(tipo_name);
          }
        },
        skipHide: true,
        clickOutsideToClose: true
      });
      promise.then(function(tipos){
        if (_.isArray(tipos)) {
          _instance.loadOptions(baseFilter,tipo_name,label_field,uniq_name,prefix,label,index);
        };
        tipoRouter.endStateChange();
      })
      return promise;
    };

    _instance.stopBubbling = function(event){
      event.stopPropagation();
    };

    _instance.tipoSearch = function(searchText,baseFilter,tipo_name,label_field,uniq_name,prefix,label,index){
      _instance.loadOptions(baseFilter,tipo_name,label_field,uniq_name,prefix,label,index,searchText);
    };

     _instance.setInstance = function(uniq_name,data,prefix,label,index,tipo_name){
      var tipo_perm = tipoRegistry.get(tipo_name + '_resdata');
      if (_.isUndefined(_.get(_instance,uniq_name))) {
        _.set(_instance, uniq_name, {});
      };
      if(tipo_perm.perm.substr(2,1) === 0){
        _.set(_instance, uniq_name + '.disablecreate', true);
      }
      if (!_.isUndefined(data)) {
        _.set(_instance, uniq_name + '.options', data.options);
        _.set(_instance, uniq_name + '.tipos', data.tipos);
      };
      if (_.isUndefined(prefix)) {
        var tipo_data = _.get(_instance,'tipo.' + uniq_name);
      }else{
        var tipo_data = _instance.tipo[prefix][index][label];
      }
        if (!_.isUndefined(tipo_data) && !_.isNull(tipo_data)) {
          if (_.isArray(tipo_data)) {
            if (_.isUndefined(prefix)) {
              var objs = _.map(tipo_data, function(each){
                return {
                  key: each,
                  label: _.get(_instance.tipo, uniq_name + '_refs' + '.ref' + each)
                };
              });
               _.set(_instance, uniq_name + '.model', objs);
            }else{
              var objs = _.map(tipo_data, function(each){
                return {
                  key: each,
                  label: _instance.tipo[prefix][index][label + '_refs']['ref' + each]
                };
              });
              _.set(_instance, uniq_name + '.model', objs);
            }
          }else{
            if (_.isUndefined(prefix)) {
              _.set(_instance, uniq_name + '.model', {key: tipo_data, label: _.get(_instance.tipo, uniq_name + '_refs' + '.ref' + tipo_data) });
              // _instance[uniq_name].model = {key: tipo_data, label: _instance.tipo[uniq_name + '_refs']['ref' + tipo_data] }
            }else{
              if (_instance.tipo[prefix][index][label + '_refs']) {
                _.set(_instance, uniq_name + '.model', {key: tipo_data, label: _instance.tipo[prefix][index][label + '_refs']['ref' + tipo_data] });
              // _instance[uniq_name].model = {key: tipo_data, label: _instance.tipo[prefix][index][label + '_refs']['ref' + tipo_data] }  
              }else{
                _instance.tipo[prefix][index][label + '_refs'] = {};
                _.set(_instance, uniq_name + '.model', {key: tipo_data, label: _instance.tipo[prefix][index][label + '_refs']['ref' + tipo_data] });
              // _instance[uniq_name].model = {key: tipo_data, label: _instance.tipo[prefix][index][label + '_refs']['ref' + tipo_data] }  
              }
            }
          }
        };
    }

    function getPerspective(filter){
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      // TODO: Hack - Sushil as this is supposed to work only for applications
      if (perspectiveMetadata.fieldName === 'application') {
        filter.tipo_filter = perspectiveMetadata.tipoFilter;
      }
    }

    _instance.refresh = function(){
      var filter = {};
      tipoRouter.startStateChange();
      getPerspective(filter);
      tipoCache.evict($stateParams.tipo_name, $stateParams.tipo_id);
      $templateCache.remove(_instance.createUrl);
      $templateCache.remove(_instance.detailUrl);
      $templateCache.remove(_instance.updateUrl);
      tipoHandle.getTipo($stateParams.tipo_name, $stateParams.tipo_id, filter, true).then(function (data) {
        data.tipo_id = data.tipo_id || $stateParams.tipo_id;
        _instance.tipo = data;
        tipoRouter.endStateChange();
      });
    }

    _instance.initCollapsed = function(uniq_name,collapsed){
      if (!_.isNil(collapsed)) {
        _.set(_instance, uniq_name + '.collapsed', collapsed);
        // _instance[uniq_name] = {collapsed: collapsed};
      }else{
        _.set(_instance, uniq_name + '.collapsed', false);
        // _instance[uniq_name] = {collapsed: false};
      }
    }

    _instance.setLabel = function(prefix,label,index){
      _instance[prefix + index + label] = {};
      var tipo_data = _.get(_instance.tipo[prefix][index],label);
      if (_.startsWith(tipo_data,'Tipo') || _.startsWith(tipo_data,'FieldGroup')) {
        _instance[prefix + index + label].model={key: tipo_data , label: _.get(_instance.tipo[prefix][index],label + '_refs.ref' + tipo_data )}
      }else{
        _instance[prefix + index + label].model={key: tipo_data , label: _.get(_instance.tipo[prefix][index],label + '_refs.ref' + tipo_data )}
      }
    }

    _instance.renderSelection = function(tipo_name){
      var text = '<div class="placeholder"></div>';
        if (_instance[tipo_name].model && _instance[tipo_name].model.length){
          text = '<div class="multiple-list">';
          _.each(_instance[tipo_name].model, function(each){
            text += '<div>' +each.label + '</div>';
          });
          text += '</div>';
        }
          return text;
    };

    _instance.searchTerm = {};
    _instance.delete = function(){
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
        getPerspective(filter);
        // ends here
        tipoHandle.deleteTipo(tipo_name, tipo_id, filter).then(function(){
          if(tipoRouter.stickyExists()){
            tipoRouter.toStickyAndReset();
          }else{
            tipoRouter.toTipoList(tipo_name);
          }
        });
      });
    };
    _instance.cleanup = function(uniq_name,prefix,label,index){
      var tipo_data = _.get(_instance,uniq_name + '.model');
      if (!_.isUndefined(tipo_data)) {
        if (_.isUndefined(prefix)) {
          if (_.isArray(tipo_data)){
            _.set(_instance,'tipo.' + uniq_name, []);
            // _instance.tipo[uniq_name]=[];
            _.each(tipo_data,function(each){
              var objs = [];
              objs.push(each.key);
              _.set(_instance.tipo ,uniq_name, objs);
              _.set(_instance.tipo, uniq_name + '_refs.ref' + each.key, each.label);
            });
          }else{
            _.set(_instance.tipo ,uniq_name, tipo_data.key);
            // _instance.tipo[uniq_name] = tipo_data.key;
            _.set(_instance.tipo, uniq_name + '_refs.ref' + tipo_data.key, tipo_data.label);
          }
        }else{
          if (_.isArray(tipo_data)){
            _instance.tipo[prefix][index][label]=[];
            _.each(tipo_data,function(each){
              _instance.tipo[prefix][index][label].push(each.key);
              _.set(_instance.tipo[prefix][index], label + '_refs.ref' + each.key, each.label);
            });
          }else{
            _instance.tipo[prefix][index][label] = tipo_data.key;
            _.set(_instance.tipo[prefix][index], label + '_refs.ref' + tipo_data.key, tipo_data.label);
          }
        }
      }
      delete _instance.searchTerm.text;
    }

    _instance.edit = function(){
      tipoRouter.startStateChange();
      tipoRouter.toTipoEdit(tipo_name, tipo_id);
    };

    function generateGroupItem(field_name,definition){
      var newObject = {};
      // _.each(definition.tipo_fields,function(field){
      //   newObject[field.field_name] = null;
      // });
      var array = _.get(_instance.tipo,field_name);
      if (!array) {
        array = [];
      };
      array.push(newObject);
      _.set(_instance.tipo,field_name,array);
      var context = setContext(field_name);
      var function_name = $stateParams.tipo_name + '_' + field_name + '_OnArrayItemAdd'
      if(typeof tipoClientJavascript[function_name] === 'function'){
        tipoClientJavascript[function_name](_instance.tipo,context,array,newObject);
      }
      scrollToNewItem(array,field_name);
    }

    function scrollToNewItem(array,field_name){
      if (array.length > 1) {
        if (_instance.popupno > 0) {
          var container = angular.element(document.getElementById('dialogContent_dialog' + _instance.popupno));
        }else{
          var container = angular.element(document.getElementById('inf-wrapper'));
        }
        var scrollto = angular.element(document.getElementById(field_name + (array.length - 2)));
        container.scrollToElement(scrollto,150,100);
      };
    }


    function openTipoObjectDialog(allow_create,baseFilter,tipo_name,label_field,uniq_name,isArray,prefix,label,index){
      var promise1 =  tipoDefinitionDataService.getOne(tipo_name).then(function(definition){
        _instance.popupDefinition = definition;
        return _instance.loadPopupOptions(baseFilter,tipo_name,label_field,uniq_name,prefix,label,index,definition.tipo_meta.default_page_size);
      });
      promise1.then(function(){
      var newScope =$scope.$new();
      if (_.isUndefined(_.get(_instance,uniq_name))) {
        _.set(_instance,uniq_name,{});
      };
      var tipo_data = _.get(_instance,uniq_name + '.model');
      newScope.label_field = label_field;
      newScope.tipo_name = tipo_name;
      newScope.selectedTipos = [];
      if (isArray) {
        newScope.isArray = true;
        newScope.selectedTipos = tipo_data;
      }else{
        newScope.isArray = false;
        if (!_.isUndefined(tipo_data)) {
          newScope.selectedTipos.push(tipo_data);
        };
      }
      newScope.field = _instance.tipoDefinition;
      newScope.disablecreate = _.get(_instance, uniq_name + '.disablecreate') || !allow_create;
      newScope.tipo_fields = _instance.tipoDefinition.tipo_fields;
      var promise = $mdDialog.show({
        templateUrl: 'framework/_directives/_views/tp-lookup-popup-select.tpl.html',
        controller: TipoObjectDialogController,
        controllerAs: 'tipoRootController',
        scope: newScope,
        resolve: /*@ngInject*/
        {
          tipoDefinition: function(tipoManipulationService) {
              var tipos = _.get(_instance,uniq_name + '.tipos');
              var tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(_instance.popupDefinition, tipos, label_field);
              return {tipoDefinition: _instance.popupDefinition, tiposWithDefinition: tiposWithDefinition,tipos: tipos };
          }
        },
        skipHide: true,
        clickOutsideToClose: true,
        fullscreen: true
      });
      promise.then(function(selectedObjects){
          if (isArray) {
            var objs = _.map(selectedObjects, function(each){
              return {
                key: each.key,
                label: each.label
              };
            });
            _.set(_instance,uniq_name + '.model',objs);
          }else{
            _.set(_instance,uniq_name + '.model',{key: selectedObjects[0].key, label: selectedObjects[0].label});
          } 
            _instance.cleanup(uniq_name,prefix,label,index);
      });
      });

    }

    _instance.tipoObjecSelectiontDialog = function(allow_create,baseFilter,tipo_name,label_field,uniq_name,isArray,prefix,label,index){
      var promise = openTipoObjectDialog(allow_create,baseFilter,tipo_name,label_field,uniq_name,isArray,prefix,label,index);
    }

    _instance.toDate = function(date,init){
      if(init){
        return new Date(eval(init));
      }
      if (date) {
        return new Date(date);
      };
    }

    _instance.toList = function(){
      tipoRouter.toTipoList(tipo_name);
    };

    _instance.toView = function(){
      tipoRouter.toTipoView(tipo_name, tipo_id);
    };

    _instance.cancel = function(){
      if (tipo_id) {
        _instance.toView();
      }else{
        _instance.toList();
      }
    };

    function numDigits(x) {
      return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

    _instance.popupno = $scope.popupno || 0;

    _instance.showDetail = function(htmltemplate,index,field_name){
      // var definition = extractDatafromDefinition(field_name);
      // if (!_.isUndefined(index)) {
      //   definition = definition._items[index];
      //   // if (!_.isUndefined(_instance.tipo[field_name][index])) {
      //   //   tipoManipulationService.mergeDefinitionAndData(definition,_instance.tipo[field_name][index]);
      //   // }
      // }else{
      //   // if (!_.isUndefined(_instance.tipo[field_name])) {
      //   //   tipoManipulationService.mergeDefinitionAndData(definition,_instance.tipo[field_name]);
      //   // };
      // }
      var newScope = $scope.$new();
      // newScope.definition = definition;
      _instance.popupno++;
      newScope.popupno = _instance.popupno;
      htmltemplate = atob(htmltemplate);
      if (!_.isUndefined(index)) {
        if (_.isUndefined($scope.recursiveGroupRef)) {
          newScope.recursiveGroupRef = {};
          newScope.recursiveGroupRef.field_names = field_name + "/";
          newScope.recursiveGroupRef.arrayindex = index.toString();
          newScope.recursiveGroupRef.digits = numDigits(index).toString();
        }else{
          newScope.recursiveGroupRef = {};
          newScope.recursiveGroupRef.field_names = $scope.recursiveGroupRef.field_names + field_name + "/";
          newScope.recursiveGroupRef.arrayindex = $scope.recursiveGroupRef.arrayindex + index.toString();
          newScope.recursiveGroupRef.digits = $scope.recursiveGroupRef.digits + numDigits(index).toString();
        }
        var nth = 0;
        var loop = 0;
        _.each(newScope.recursiveGroupRef.field_names.split('/'),function(stringVal){
          if(!_.isEmpty(stringVal)){
            var digits = newScope.recursiveGroupRef.digits.substr(loop,1);
            var regex = new RegExp(stringVal + "\\[\\$index", "g");
            htmltemplate = htmltemplate.replace(regex,stringVal + "[" + newScope.recursiveGroupRef.arrayindex.toString().substr(nth,digits));
            nth = nth + digits;
            loop++;
          }
        });
      }else{
        if (newScope.recursiveGroupRef) {
          _.each(newScope.recursiveGroupRef.field_names.split('/'),function(stringVal){
            if(!_.isEmpty(stringVal)){
              var digits = newScope.recursiveGroupRef.digits.substr(loop,1);
              var regex = new RegExp(stringVal, "g");
              htmltemplate = htmltemplate.replace(regex,stringVal + "[" + newScope.recursiveGroupRef.arrayindex.toString().substr(nth,digits) + "]");
              nth = nth + digits;
              loop++;
            }
          });
        };
      }
      // newScope.root = _instance.tipoDefinition;
      newScope.mode = "edit";
      newScope.fullscreen = true;
      var promise = $mdDialog.show({
        template: '<md-dialog id="dialog' + _instance.popupno +  '" ng-cloak ng-class="{\'fullscreen\': fullscreen}"><md-toolbar class="tipo-toolbar"><div class="md-toolbar-tools"><h2>{{definition.display_name}}</h2><span flex></span><md-button class="md-icon-button" ng-click="maximize()" ng-if="!fullscreen"><md-icon aria-label="Maximize">crop_square</md-icon></md-button><md-button class="md-icon-button" ng-click="restore()" ng-if="fullscreen"><md-icon aria-label="Restore size">filter_none</md-icon></md-button><md-button class="md-icon-button" ng-click="cancel()"><md-icon aria-label="Close dialog">close</md-icon></md-button></div></md-toolbar><md-dialog-content><div class="tp-detail dialog">' + 
                  htmltemplate +
                  '</div>  </md-dialog-content><md-dialog-actions layout="row"><span flex></span><md-button ng-click="hide()" ng-if="!(mode === \'edit\')">Close</md-button><md-button md-theme="reverse" class="md-raised md-primary" ng-click="hide()" ng-if="mode === \'edit\'">Done</md-button></md-dialog-actions></md-dialog>',
        controller: 'TipoEditRootController',
        controllerAs: 'tipoRootController',
        resolve: /*@ngInject*/
        {
          tipo: function() {
                  return _instance.tipo;
          },
          tipoDefinition: function() {
                  return _instance.tipoDefinition;
          },
        },
        scope: newScope,
        skipHide: true,
        clickOutsideToClose: true,
        fullscreen: true
      });
      promise.then(function(){
        _instance.popupno--;
        // updateDatafromDefinition(definition,index,field_name);
      },function(){
        _instance.popupno--;
      });
    }
    _instance.lookupTipo = function(relatedTipo,labelfield,prefix,baseFilter,queryparams,key_field,label_field){
      var newScope = $scope.$new();
      newScope.root = _instance.tipo;
      newScope.relatedTipo = relatedTipo;
      newScope.labelfield = labelfield;
      newScope.baseFilter = baseFilter;
      newScope.queryparams = queryparams;
      //Not passing key_field because tipo_id is key_field for Embed relation
      // newScope.key_field = key_field;
      newScope.label_field = label_field;
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
        _.set(_instance.tipo,prefix,tipo);
      });
    }

    _instance.trustHtml = function(html){
      return $sce.trustAsHtml(html);
    }

    _instance.generateItem = function(field_name){
      // var definition = extractDatafromDefinition(field_name);
      // tipoManipulationService.generateGroupItem(definition);
      generateGroupItem(field_name);
    }

    _instance.deleteItem = function(field_name,index){
      // var group = extractDatafromDefinition(field_name);
      // var groupItem = group._items[index];
      // if(_.isUndefined(groupItem._ui.hash)){
      //   // indicates that this item was never saved on the backend, hence just delete it
      //   _.remove(group._items, function(each){
      //     return each === groupItem;
      //   });
      // }else{
      //   // indicates that this item already exists in the backend, hence flagging it for deletion
      //   groupItem._ui.deleted = true;
      // }
      var delItem = _.get(_instance.tipo,field_name)
      if (_.isUndefined(delItem[index]._ARRAY_META)) {
        _.remove(delItem, function(each){
          return each === delItem[index];
        });
      }else{
        delItem[index]._ARRAY_META._STATUS = 'DELETED';
      }
      _.set(_instance.tipo,field_name,delItem);
      var context = setContext(field_name);
      var function_name = $stateParams.tipo_name + '_' + field_name + '_OnArrayItemRemove';
      if(typeof tipoClientJavascript[function_name] === 'function'){
        tipoClientJavascript[function_name](_instance.tipo,context,delItem,delItem[index]);
      }
    }

    _instance.cloneItem = function(field_name,index){
      // var group = extractDatafromDefinition(field_name);
      var groupItem = _.get(_instance.tipo,field_name)
      var clonedItem = angular.copy(groupItem[index]);
      delete clonedItem._ARRAY_META;
      groupItem.push(clonedItem);
      _.set(_instance.tipo,field_name,groupItem);
      scrollToNewItem(groupItem,field_name);
    }

      var val = false;
    _instance.filterByDeleted = function(obj){
      if ( _.isUndefined(obj._ARRAY_META)) {
        val = true;
      }else{
        if (obj._ARRAY_META._STATUS !== "DELETED") {
          val = true;
        }
      };
      return val;
    }
    _instance.convertToBoolean = function(boolVal){
      if (boolVal && boolVal === "true") {
        boolVal = true;
      }
      if (boolVal && boolVal === "false") {
        boolVal = false;
      }
      return boolVal;
    }

    _instance.initAllowedValues = function(allowed_values,field_name,index,prefix,label){
      if (_.isUndefined(index)) {
        if (_.isUndefined(_.get(_instance,field_name))) {
          _.set(_instance,field_name,{});
        };
        if (!_.isEmpty(allowed_values) && _.isArray(allowed_values)) {
          _.set(_instance,field_name + '.allowed_values',allowed_values);
        };
      }else{
        if (_.isUndefined(_.get(_instance,prefix + index + label))) {
          _.set(_instance,prefix + index + label,{});
        };
        if (!_.isEmpty(allowed_values) && _.isArray(allowed_values)) {
          _.set(_instance,prefix + index + label + '.allowed_values',allowed_values);
        };
      }
    }

    _instance.addValue = function(field_name,index,prefix,label){
      if (_.isUndefined(index)) {
        var allowed_values = _.get(_instance,field_name + '.allowed_values');
        allowed_values.push( _.get(_instance,field_name + '.allowed_value'));
        _.set(_instance,field_name + '.allowed_values',allowed_values);
        delete _instance[field_name].allowed_value;
      }else{
        var allowed_values = _.get(_instance,prefix + index + label + '.allowed_values');
        allowed_values.push( _.get(_instance,prefix + index + label + '.allowed_value'));
        _.set(_instance,prefix + index + label + '.allowed_values',allowed_values);
        delete _instance[prefix + index + label].allowed_value;
      }
    }

    _instance.toSubTipoList = function(relatedTipo,tipo_filter,sub_tipo_field_name){
      tipoRouter.to('subTipoListState', undefined, {related_tipo: relatedTipo,tipo_filter: tipo_filter,sub_tipo_field_name: sub_tipo_field_name}, true);
    };

    _instance.fieldChange = function(function_name,context,new_value,field_name){
      if(typeof tipoClientJavascript[function_name] === 'function'){
        tipoClientJavascript[function_name](_instance.tipo,context,_.get(_instance.tipo,field_name + "_old"),new_value)
      }
    }

    _instance.OnArrayItemAdd = function(field_name,item,array,context){
      var function_name = $stateParams.tipo_name + '_' + field_name + '_OnArrayItemAdd';
      if(typeof tipoClientJavascript[function_name] === 'function'){
        tipoClientJavascript[function_name](_instance.tipo,context,array,item);
      }
    }

    _instance.OnArrayItemRemove = function(field_name,item,array,context){
      var function_name = $stateParams.tipo_name + '_' + field_name + '_OnArrayItemRemove';
      if(typeof tipoClientJavascript[function_name] === 'function'){
        tipoClientJavascript[function_name](_instance.tipo,context,array,item);
      }
    }

    function setContext(field_name){
      var fields = field_name.split(".");
      var ctx = field_name.indexOf("." + fields[fields.length - 1]);
      if (ctx > -1) {
        var context = _.get(_instance.tipo,field_name.substr(0,ctx));
      }else{
        var context = _instance.tipo;
      }
      return context;
    }

    function setCurrentActiveTab(name){
      if(_.isUndefined(name)){
        var currentStateName = tipoRouter.getCurrent().name;
        if(_.startsWith(currentStateName, 'subTipo')){
          name = $stateParams.sub_tipo_field_name;
        }else{
          name = 'main';
        }
      }
      _instance.activeTab = name;
    }

    setCurrentActiveTab();

    $scope.maximize = function(){
      $scope.fullscreen = true;
    };

    $scope.restore = function(){
      $scope.fullscreen = false;
    };

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

  }

  angular.module('tipo.framework')
  .controller('TipoEditRootController', TipoEditRootController);

})();