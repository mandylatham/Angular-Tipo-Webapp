(function () {

  'use strict';

  var module = angular.module('tipo.framework')
                .controller('TipoObjectDialogController', TipoObjectDialogController);

  function TipoObjectDialogController(
    tipoManipulationService,
    tipoDefinition,
    $scope,
    $timeout,
    $mdDialog,
    tipoCache,
    tipoRouter,
    tipoHandle,
    tipoInstanceDataService,
    tipoDefinitionDataService,
    tipoClientJavascript,
    tipoCustomJavascript) {

    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.popup = true;
    _instance.tipos = $scope.tipos;
    if (_instance.tipos.length>0) {
      _instance.hasTipos = true;
    };
    _instance.selectedTipos = $scope.selectedTipos;
    _instance.fieldvalue = $scope.fieldvalue;
    _instance.root = $scope.root;
    _instance.perm = $scope.perm;
    _instance.queryparams = $scope.queryparams;
    _instance.tipo_name = $scope.tipo_name;
    _instance.listUrl = tipoHandle.listUrl(_instance.tipo_name);
    _instance.disablecreate = $scope.disablecreate;
    _instance.hideActions = true;
    _instance.bulkedit = true;
    $scope.fullscreen = true;
    $scope.data_handle = {};
    function initselectedTipos(){
      _.each(_instance.tipos, function(tipo){
          if (tipo.edit) {
              tipo.edit = false;
          };
          _.each(_instance.selectedTipos,function(selected){
            if(tipo[$scope.key_field] === selected[$scope.key_field] && !_.isUndefined(tipo[$scope.key_field])){
              tipo.selected = true;
            }
          })
        });
    };
    initselectedTipos();
    _instance.maximize = function(){
      $scope.fullscreen = true;
    };

    _instance.restore = function(){
      $scope.fullscreen = false;
    };

    _instance.selectTipo = function(tipoSelected,event,tiposData){
      if(typeof tipoCustomJavascript[$scope.tipo_name + '_OnClick'] === 'function'){
        tipoRouter.startStateChange();
        $scope.data_handle.selected_tipo = tipoSelected;
        $scope.data_handle.tipo_name = $scope.tipo_name;
        $scope.data_handle.queryparams = $scope.queryparams;
        $scope.data_handle.event = event;
        var proceed = tipoCustomJavascript[$scope.tipo_name + '_OnClick']($scope.data_handle);
      }
      if(typeof tipoClientJavascript[$scope.tipo_name + '_OnClick'] === 'function'){
        tipoRouter.startStateChange();
        $scope.data_handle.selected_tipo = tipoSelected;
        $scope.data_handle.tipo_name = $scope.tipo_name;
        $scope.data_handle.queryparams = $scope.queryparams;
        $scope.data_handle.event = event;
        var proceed = tipoClientJavascript[$scope.tipo_name + '_OnClick']($scope.data_handle);
      }
      else{
        var proceed = true;
      }
      if (proceed) {
        if (!$scope.isarray) {
          _.each(tiposData, function(tipo){
            tipo.selected = false;
            _instance.selectedTipos = [];
          });
        }
        tipoSelected.selected = !tipoSelected.selected;
        if(tipoSelected.selected){
          _instance.selectedTipos.push(tipoSelected);
        }else{
          _.remove(_instance.selectedTipos,function(tipo){
            return tipo[$scope.key_field] === tipoSelected[$scope.key_field];
          });
        }
        if (event) {
          event.stopPropagation();
        };
      };
    }
    _instance.finish = function() {      
      $mdDialog.hide(_instance.selectedTipos);
    };

    _instance.cancel = function() {
      $mdDialog.cancel();
    };

    _instance.addTipo = function() {
      var newScope = $scope.$new();
      newScope.hide_actions = true;
      newScope.tipo_name = _instance.tipoDefinition.tipo_meta.tipo_name;
      var promise = $mdDialog.show({
        templateUrl: 'framework/_directives/_views/tp-lookup-popup-select-new.tpl.html',
        controller: 'TipoEditRootController',
        controllerAs: 'tipoRootController',
        scope: newScope,
        resolve: /*@ngInject*/
        {
          tipo: function() {
            return undefined;
          },
          tipoDefinition: function(tipoDefinitionDataService){
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
        };
        tipoRouter.endStateChange();
      })
      return promise;
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
      tipoInstanceDataService.search($scope.tipo_name, filter).then(function(tiposData){
        _instance.tipos = tiposData;
        page++;
        tipoRouter.endStateChange();
      });
    }

    $scope.$watch(function(){return _instance.tipos;},function(){
      initselectedTipos();
    })

    $scope.$watch(function(){return $scope.data_handle.tipo_list},function(new_value,old_value){
      if ($scope.data_handle.tipo_list) {
        _instance.tipos = $scope.data_handle.tipo_list;
      };
    });
  }
  return module.directive('tpLookup', function (
    tipoInstanceDataService,
    tipoManipulationService,
    tipoRouter,
    tipoRegistry,
    $mdDialog,
    $mdSelect,
    $stateParams,
    tipoDefinitionDataService,
    tipoClientJavascript,
    tipoCustomJavascript) {
      return {
        require: 'ngModel',
        scope: {
          root: '=',
          context: '=',
          parent: '=',
          index: '=',
          fieldname: '=',
          fqfieldname: '=',
          fieldvalue: '=',
          fieldlabel: '=',
          basefilter: '=',
          realtedtipo: '=',
          isarray: '=',
          ispopup: '=',
          queryparams: '=',
          istipomandatory: '=',
          labelfield: '=',
          allowcreate: '=',
          selectfield: '=',
          selectkeyfield: '=',
          selectlabelfield: '=',
        },
        restrict: 'EA',
        replace: true,
        template: '<ng-include src="fieldTemplate" tp-include-replace/>',
        link: function(scope, element, attrs, ctrl){
          // Initialize
          scope.data_handle = {};
          scope.model = {};
          var isarray = Boolean(scope.isarray);
          scope.isMandatory = Boolean(scope.istipomandatory);
          var fqfieldname = scope.fqfieldname.replace("$index", scope.index);
          var fieldTemplate;
          if(isarray){
            fieldTemplate = 'framework/_directives/_views/tp-lookup-multiple.tpl.html';
          }else{
            fieldTemplate = 'framework/_directives/_views/tp-lookup-single.tpl.html';
          }
          scope.fieldTemplate = fieldTemplate;

          var basefilter = scope.basefilter;
          scope.tipo_name = scope.realtedtipo;
          scope.key_field = scope.selectkeyfield || 'tipo_id';
          scope.label_field = scope.selectlabelfield || scope.labelfield || 'tipo_id';
          var key_field = scope.key_field;
          var label_field = scope.label_field;
          

          scope.ngModel = scope.fieldvalue;

          if(!scope.allowcreate){
            scope.disablecreate = true;
          }else{
            scope.disablecreate = false;
          }

          function optionsFormat(results){
            return _.map(results, function(each){
              var option = {}
              option[key_field] = each[key_field];
              option[label_field] = each[label_field];
              return option;
            });
          }

          // function extractDropdownList(tipo_data,options,startName,remName){
          //   if (!startName) {
          //     if (_.isArray(tipo_data[remName])) {
          //       _.each(tipo_data[remName],function(each){
          //         options.push({
          //           key: each,
          //           label: each
          //         });
          //       })
          //     }else{
          //       options.push({
          //         key: tipo_data[remName],
          //         label: tipo_data[remName]
          //       });
          //     }
          //     return;
          //   };
          //   if (_.isArray(tipo_data[startName])) {
          //     _.each(tipo_data[startName],function(each){
          //       extractDropdownList(each,options,remName.substr(0,remName.indexOf('.')),remName.substr(remName.indexOf('.') + 1));
          //     });
          //   }else{
          //     extractDropdownList(tipo_data[startName],options,remName.substr(0,remName.indexOf('.')),remName.substr(remName.indexOf('.') + 1));
          //   }
          // }

          function numDigits(x) {
            return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
          }

          function initmodel(){
            if (scope.options && ((isarray && scope.options !== scope.model.field) || (!isarray && scope.options[0] !== scope.model.field))) {
              scope.model.field = _.filter(scope.options,function(o){return _.includes(scope.fieldvalue,o[key_field])});
              if (!isarray) {
                scope.model.field = scope.model.field[0];
              };
            }else{
              if(isarray){
                scope.model.field = [];
                if (!_.isUndefined(scope.fieldvalue)) {
                  scope.options = [];
                  scope.singlefield = {};
                  _.each(scope.fieldvalue,function(value,key){
                    scope.singlefield[key_field] = value;
                    scope.singlefield[label_field] = scope.fieldlabel[key];
                    scope.model.field.push(scope.singlefield);
                  });
                  scope.options.push(scope.model.field);
                }          
              }else{
                scope.model.field = {};
                if (_.isUndefined(scope.fieldvalue)) {
                  scope.fieldlabel = "";
                }else{
                  scope.options = [];
                  scope.model.field[key_field] = scope.fieldvalue;
                  scope.model.field[label_field] = scope.fieldlabel;
                  scope.options.push(scope.model.field);
                }
              }
            }
          }
          initmodel();

          scope.loadOptions = function (searchText,page_size){
            delete scope.options;
            var searchCriteria = {};
            var filter;
            var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
            /*if(tipo_name !== perspectiveMetadata.tipoName){
              filter = perspectiveMetadata.tipoFilter;
            }*/
            // if (!_.isUndefined(scope.$parent.recursiveGroupRef) && !_.isUndefined(scope.index)) {
            //   scope.arrayindex = scope.$parent.recursiveGroupRef.arrayindex + scope.index.toString();
            //   scope.digits = scope.$parent.recursiveGroupRef.digits + numDigits(scope.index).toString();
            //   scope.field_names = scope.$parent.recursiveGroupRef.field_names + scope.field_name + "/";
            // }else{
            //   if (!_.isUndefined(scope.index)) {
            //     scope.arrayindex = scope.index.toString(); 
            //     scope.digits = numDigits(scope.index).toString(); 
            //     scope.field_names = scope.field_name + "/";
            //   }
            //   else if (!_.isUndefined(scope.$parent.recursiveGroupRef)) {
            //     scope.arrayindex = scope.$parent.recursiveGroupRef.arrayindex;
            //     scope.digits = scope.$parent.recursiveGroupRef.digits ;
            //     scope.field_names = scope.$parent.recursiveGroupRef.field_names;
            //   }
            // }
            if(!_.isUndefined(basefilter)){
              var basefilterExpanded = _.get(scope.root,scope.basefilter) || scope.basefilter;
              filter = basefilterExpanded;
            }
            if(!_.isUndefined(filter) && filter !== ""){
              searchCriteria.tipo_filter = filter;
            }
            if ((scope.selectkeyfield && !_.isEmpty(scope.selectkeyfield)) || (scope.selectlabelfield && !_.isEmpty(scope.selectlabelfield)) ) {
              // searchCriteria.tipo_fields = key_field + ',' + label_field;
            };
            searchCriteria.page = 1;
            // If for the dropdown we require custom page size then we can get from the page_size parameter
            searchCriteria.per_page = page_size || 10;
            if (!_.isEmpty(scope.queryparams)) {
              _.forOwn(scope.queryparams,function(value,key){
                value = value.replace("$index", scope.index);
                var baseParamExpanded = _.get(scope.root,value) || value;
                searchCriteria[key] = baseParamExpanded;
              })
            };
            if(!_.isUndefined(searchCriteria.tipo_filter) && !_.isEmpty(searchCriteria.tipo_filter)  && !_.isUndefined(searchText)){
              searchCriteria.tipo_filter += " AND ("+key_field+":(" + searchText + "*) OR " + label_field + ":(" + searchText + "*))" ;
            }else{
              if (!_.isUndefined(searchText)) {
                searchCriteria.tipo_filter = "("+key_field+":(" + searchText + "*) OR " + label_field + ":(" + searchText + "*))";
              }
            };
            searchCriteria.list_display = 'N';
            scope.searchCriteria = searchCriteria;
            if (isarray && scope.fieldvalue.length > 0) {
              searchCriteria.must_include_key = key_field;
              searchCriteria.must_include_values = _.join(scope.fieldvalue,',');
            }else if(!isarray && scope.fieldvalue && scope.fieldvalue !== ""){
              searchCriteria.must_include_key = key_field;
              searchCriteria.must_include_values = scope.fieldvalue;
            }
            var function_name = $stateParams.tipo_name + '_' + scope.fqfieldname.replace(/\./g,"_").replace(/\[\d\]/g, "") + '_BeforeLookup';
            if(typeof tipoCustomJavascript[function_name] === 'function'){
              scope.data_handle.root = scope.root;
              scope.data_handle.context = scope.context;
              scope.data_handle.searchCriteria = scope.searchCriteria;
              scope.data_handle.tipo_name = scope.tipo_name;
              scope.data_handle.key_field = scope.key_field;
              scope.data_handle.label_field = scope.label_field;
              tipoCustomJavascript[function_name](scope.data_handle);
            }
            if(typeof tipoClientJavascript[function_name] === 'function'){
              scope.data_handle.root = scope.root;
              scope.data_handle.context = scope.context;
              scope.data_handle.searchCriteria = scope.searchCriteria;
              tipoClientJavascript[function_name](scope.data_handle);
            }
            return tipoInstanceDataService.search(scope.tipo_name, searchCriteria).then(function(results){
              scope.tipos = _.uniq(results);
              // if (!scope.selectfield) {
              scope.options = optionsFormat(scope.tipos);
              initmodel();
              // }else{
              //   scope.options = [];
              //   var remName = scope.selectfield.substr(scope.selectfield.indexOf('.') + 1);
              //   var startName = scope.selectfield.substr(0,scope.selectfield.indexOf('.'));
              //   if (results[0][startName] || results[0][remName]) {
              //     extractDropdownList(results[0],scope.options,startName,remName)
              //   };
              // }
              var tipo_perm = tipoRegistry.get(scope.tipo_name + '_resdata');
              scope.perm = tipo_perm.perm;
              if(tipo_perm.perm.substr(2,1) === 0){
                scope.disablecreate = true;
              }
              var function_name = $stateParams.tipo_name + '_' + scope.fqfieldname.replace(/\./g,"_").replace(/\[\d\]/g, "") + '_AfterLookup';
              if(typeof tipoCustomJavascript[function_name] === 'function'){
              // _.join(_.dropRight(fqfieldname.split(".")),".") used for initial client side js
                scope.data_handle.root = scope.root;
                scope.data_handle.context = scope.context;
                scope.data_handle.tipo_list = scope.model.field;
                scope.data_handle.options = scope.options;
                tipoCustomJavascript[function_name](scope.root,scope.context,scope.model.field,scope.options);
              }
              if(typeof tipoClientJavascript[function_name] === 'function'){
              // _.join(_.dropRight(fqfieldname.split(".")),".") used for initial client side js
                scope.data_handle.root = scope.root;
                scope.data_handle.context = scope.context;
                scope.data_handle.tipo_list = scope.model.field;
                scope.data_handle.options = scope.options;
                tipoClientJavascript[function_name](scope.root,scope.context,scope.model.field,scope.options);
              }
            });
          };

          scope.searchTerm = {};
          scope.cleanup = function(){
            delete scope.searchTerm.text;
              if (!isarray) {
                scope.fieldvalue = scope.model.field[key_field];
                scope.fieldlabel = scope.model.field[label_field];
            }else{
              scope.fieldvalue = [];
              scope.fieldlabel = [];
              _.each(scope.model.field,function(val){
                scope.fieldvalue.push(val[key_field]);
                scope.fieldlabel.push(val[label_field]);
              });
            }
            if (attrs.ngChange) {
              _.set(scope.root, fqfieldname + "_labels", scope.fieldlabel);
            };
            ctrl.$setViewValue(scope.fieldvalue);
          };

          scope.stopBubbling = function(event){
            event.stopPropagation();
          };

          scope.renderSelection = function(){
            var text = '<div class="placeholder"> </div>';
            if (scope.fieldlabel && scope.fieldlabel.length){
              text = '<div class="multiple-list">';
              _.each(scope.fieldlabel, function(each){
                text += '<div>' +each + '</div>';
              });
              text += '</div>';
            }
            return text;
          };

          if (scope.ispopup) {
            tipoDefinitionDataService.getOne(scope.tipo_name).then(function(definition){
              var searchText;
              scope.popupDefinition = definition;
            });
          }

          function openTipoObjectDialog(){
            var searchText;
            var options = scope.loadOptions(searchText,scope.popupDefinition.tipo_meta.default_page_size);            
            return options.then(function(){
              var newScope = scope.$new();
              newScope.isarray = isarray;
              newScope.field = scope.context;
              newScope.disablecreate = scope.disablecreate;
              newScope.tipo_name = scope.tipo_name;
              newScope.root = scope.root;
              newScope.perm = scope.perm;
              newScope.queryparams = scope.searchCriteria;
              newScope.label_field = label_field;
              newScope.key_field = key_field;
              newScope.selectedTipos = _.filter(scope.tipos,function(o){return _.includes(scope.fieldvalue,o[key_field])});
              var promise = $mdDialog.show({
                templateUrl: 'framework/_directives/_views/tp-lookup-popup-select.tpl.html',
                controller: TipoObjectDialogController,
                controllerAs: 'tipoRootController',
                scope: newScope,
                resolve: /*@ngInject*/
                {
                  tipoDefinition: function(tipoManipulationService) {
                    return scope.popupDefinition;
                  }
                },
                skipHide: true,
                clickOutsideToClose: true,
                fullscreen: true
              });
              return promise;
            });
          }

          scope.tipoSearch = function(searchText){
            scope.loadOptions(searchText);
          };

          scope.addTipo = function() {
            $mdSelect.hide();
            var promise = $mdDialog.show({
              templateUrl: 'framework/_directives/_views/tp-lookup-popup-select-new.tpl.html',
              controller: 'TipoEditRootController',
              controllerAs: 'tipoRootController',
              fullscreen: true,
              resolve: /*@ngInject*/
              {
                tipo: function() {
                  return undefined;
                },
                tipoDefinition: function(tipoDefinitionDataService){
                  return tipoDefinitionDataService.getOne(scope.tipo_name);
                }
              },
              skipHide: true,
              clickOutsideToClose: true
            });
            promise.then(function(tipos){
              if (_.isArray(tipos)) {
                scope.loadOptions();
              };
              tipoRouter.endStateChange();
            })
            return promise;
          };

          scope.clearModel = function(){
            scope.selectedTipos = [];
            if (isarray) {
              scope.model.field = [];
              scope.fieldvalue = [];
              scope.fieldlabel = [];
            }else{
              scope.model.field = {};
              scope.fieldvalue = "";
              scope.fieldlabel = "";
            }
            ctrl.$setViewValue(scope.fieldvalue);
          }

          scope.tipoObjecSelectiontDialog = function(){
            var promise = openTipoObjectDialog();
            promise.then(function(selectedObjects){
              scope.model.field = optionsFormat(selectedObjects);
              if(!isarray){
                scope.model.field = scope.model.field[0];
              }
              scope.cleanup();
            });
          }

          ctrl.$viewChangeListeners.push(function() {
            scope.$eval(attrs.ngChange);
          });

          scope.$watch(function(){return scope.data_handle.tipo_name},function(new_value){
            if (new_value) {
              scope.tipo_name = new_value;
            };
          });
          scope.$watch(function(){return scope.data_handle.key_field},function(new_value){
            if (new_value) {
              scope.key_field = new_value;
              key_field = new_value;
            };
          })
          scope.$watch(function(){return scope.data_handle.label_field},function(new_value){
            if (new_value) {
              scope.label_field = new_value;
              label_field = new_value;
            };
          })
          scope.$watch(function(){return scope.fieldvalue},function(new_value,old_value){
            var function_name;
            if (isarray) {
              if (new_value && new_value.length < old_value.length) {
                function_name = $stateParams.tipo_name + "_" + scope.fqfieldname.replace(/\./g,"_").replace(/\[\d\]/g, "") + "_OnArrayItemRemove";
                scope.data_handle.item = _.difference(old_value,new_value);
              };
              if (new_value && new_value.length > old_value.length) {
                function_name = $stateParams.tipo_name + "_" + scope.fqfieldname.replace(/\./g,"_").replace(/\[\d\]/g, "") + "_OnArrayItemAdd";
                scope.data_handle.item = _.difference(new_value,old_value);
              };
              if(typeof tipoClientJavascript[function_name] === 'function'){
                scope.data_handle.tipo = scope.root;
                scope.data_handle.context = scope.context;
                scope.data_handle.new_value = new_value;
                tipoClientJavascript[function_name](scope.data_handle);
              }
            }
            if (new_value !== old_value) {
              initmodel();
            };
            // if (scope.model.field.key !== scope.fieldvalue) {
            //   scope.loadOptions();
            //   if (!isarray) {
            //     scope.model.field.key = scope.fieldvalue;
            //     scope.model.field.label = scope.fieldlabel || angular.copy(scope.fieldvalue);
            //   };
            // };
          })
        }
      };
    }
  );

})();