(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function TipoObjectDialogController(
    tipoDefinition,
    tipoManipulationService,
    $scope,
    $timeout,
    $mdDialog,
    tipoCache,
    tipoRouter,
    tipoInstanceDataService,
    tipoClientJavascript) {

    var _instance = this;

    _instance.tiposWithDefinition = tipoDefinition.tiposWithDefinition;
    _instance.tipoDefinition = tipoDefinition.tipoDefinition;
    _instance.popup = true;
    _instance.tipos = $scope.tipos;
    _instance.tipo_fields = $scope.tipo_fields;
    _instance.selectedTipos = $scope.selectedTipos;
    _instance.perm = $scope.perm;
    _instance.queryparams = $scope.queryparams;
    _instance.tipo_name = $scope.tipo_name;
    _instance.disablecreate = $scope.disablecreate;
    _instance.bulkedit = true;
    $scope.fullscreen = true;

    function initselectedTipos(){
      if ($scope.selectedTipos.length > 0) {
        _.each(_instance.tiposWithDefinition, function(tipo){
            _.each($scope.selectedTipos,function(selected){
              if(tipo.key === selected.key){
                tipo.selected = true;
              }
            })
          });
        _.each(_instance.tipos, function(tipo){
            _.each($scope.selectedTipos,function(selected){
              if(tipo[$scope.key_field] === selected.key || tipo[$scope.key_field] === selected[$scope.key_field]){
                tipo.selected = true;
              }
            })
          });
      };
    };
    initselectedTipos();
    _instance.maximize = function(){
      $scope.fullscreen = true;
    };

    _instance.restore = function(){
      $scope.fullscreen = false;
    };

    _instance.selectTipo = function(tipoSelected,event,tiposData){
      if(typeof tipoClientJavascript[$scope.tipo_name + '_List_OnClick'] === 'function'){
        tipoRouter.startStateChange();
        var instance = {};
        instance.tipos = _instance.tipos;
        var proceed = tipoClientJavascript[$scope.tipo_name + '_List_OnClick'](instance,tipoSelected,$scope.tipo_name,$scope.queryparams,event);
        $timeout(function() {
          _instance.tipos = instance.tipos;
          tipoRouter.endStateChange();
        }, 1000);
      }
      else{
        var proceed = true;
      }
      if (proceed) {
        if (!$scope.isarray) {
          _.each(tiposData, function(tipo){
            tipo.selected = false;
            $scope.selectedTipos = [];
          });
        }
        tipoSelected.selected = !tipoSelected.selected;
        if(tipoSelected.selected){
          $scope.selectedTipos.push(tipoSelected);
        }else{
          _.remove($scope.selectedTipos,function(tipo){
            return (tipo.key && (tipo.key === tipoSelected.key)) || (tipo[$scope.key_field] === tipoSelected[$scope.key_field]) || (tipo.key === tipoSelected[$scope.key_field]);
          });
        }
        if (event) {
          event.stopPropagation();
        };
      };
    }
    _instance.finish = function() {      
      $mdDialog.hide($scope.selectedTipos);
    };

    _instance.cancel = function() {
      $mdDialog.cancel();
    };

    _instance.addTipo = function() {
      var promise = $mdDialog.show({
        templateUrl: 'framework/_directives/_views/tp-lookup-popup-select-new.tpl.html',
        controller: 'TipoEditRootController',
        controllerAs: 'tipoRootController',
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
        var tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(_instance.tipoDefinition, tiposData, $scope.label_field);
        _instance.tiposWithDefinition = tiposWithDefinition;
        page++;
        tipoRouter.endStateChange();
      });
    }

    $scope.$watch(function(){return _instance.tipos;},function(){
      initselectedTipos();
    })
  }
  return module.directive('tpLookup', function (
    tipoInstanceDataService,
    tipoManipulationService,
    tipoRouter,
    tipoRegistry,
    $mdDialog,
    $mdSelect,
    tipoDefinitionDataService,
    tipoClientJavascript) {
      return {
        scope: {
          root: '=',
          context: '=',
          parent: '=',
          field: '=',
          index: '=',
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
          ngModel: '=',
          ngChange: '&',
        },
        restrict: 'EA',
        replace: true,
        template: '<ng-include src="fieldTemplate" tp-include-replace/>',
        link: function(scope, element, attrs){
          scope.model = {};
          var isarray = Boolean(scope.isarray);
          // var isGroup = Boolean(field._ui.isGroup);
          scope.isMandatory = Boolean(scope.istipomandatory);
          scope.isPopup = scope.ispopup;
          var fieldTemplate;
          if(isarray){
            fieldTemplate = 'framework/_directives/_views/tp-lookup-multiple.tpl.html';
          }else{
            fieldTemplate = 'framework/_directives/_views/tp-lookup-single.tpl.html';
          }
          scope.fieldTemplate = fieldTemplate;

          var basefilter = scope.basefilter;
          scope.tipo_name = scope.realtedtipo;
          var key_field = scope.selectkeyfield || 'tipo_id';
          var label_field = scope.selectlabelfield || scope.labelfield || 'tipo_id';
          

          scope.selectedTipos = [];
          if(isarray){
            scope.model.field = [];
            if (!_.isUndefined(scope.fieldvalue)) {
              angular.forEach(scope.fieldvalue,function(val,inx){
                if (!scope.fieldlabel) {
                  scope.fieldlabel = [];
                };
                scope.model.field.push({key: val, label: scope.fieldlabel[inx]});
              });
              scope.selectedTipos = scope.model.field;
            }else{
              scope.selectedTipos = [];
            }            
          }else{
            scope.model.field = {key: scope.fieldvalue};
            if (!_.isUndefined(scope.fieldvalue)) {
              scope.model.field.label = scope.fieldlabel || angular.copy(scope.fieldvalue);
            }else{
              scope.model.field.key = "";
              scope.model.field.label = "";
              scope.fieldlabel = "";
            }
            scope.selectedTipos = [scope.model.field];
          }
          scope.ngModel = scope.model.field;

          if(!scope.allowcreate){
            scope.disablecreate = true;
          }else{
            scope.disablecreate = false;
          }

          function optionsFormat(results){
            scope.optionSelected = _.map(results, function(each){
              return {
                key: each[key_field] || each.key,
                label: each[label_field] || each.label
              };
            });
          }

          function extractDropdownList(tipo_data,options,startName,remName){
            if (!startName) {
              if (_.isArray(tipo_data[remName])) {
                _.each(tipo_data[remName],function(each){
                  options.push({
                    key: each,
                    label: each
                  });
                })
              }else{
                options.push({
                  key: tipo_data[remName],
                  label: tipo_data[remName]
                });
              }
              return;
            };
            if (_.isArray(tipo_data[startName])) {
              _.each(tipo_data[startName],function(each){
                extractDropdownList(each,options,remName.substr(0,remName.indexOf('.')),remName.substr(remName.indexOf('.') + 1));
              });
            }else{
              extractDropdownList(tipo_data[startName],options,remName.substr(0,remName.indexOf('.')),remName.substr(remName.indexOf('.') + 1));
            }
          }

          function numDigits(x) {
            return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
          }

          scope.loadOptions = function (searchText,page_size){
            delete scope.options;
            var searchCriteria = {};
            var filter;
            var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
            /*if(tipo_name !== perspectiveMetadata.tipoName){
              filter = perspectiveMetadata.tipoFilter;
            }*/
            if (!_.isUndefined(scope.$parent.recursiveGroupRef) && !_.isUndefined(scope.index)) {
              scope.arrayindex = scope.$parent.recursiveGroupRef.arrayindex + scope.index.toString();
              scope.digits = scope.$parent.recursiveGroupRef.digits + numDigits(scope.index).toString();
              scope.field_names = scope.$parent.recursiveGroupRef.field_names + scope.field_name + "/";
            }else{
              if (!_.isUndefined(scope.index)) {
                scope.arrayindex = scope.index.toString(); 
                scope.digits = numDigits(scope.index).toString(); 
                scope.field_names = scope.field_name + "/";
              }
              else if (!_.isUndefined(scope.$parent.recursiveGroupRef)) {
                scope.arrayindex = scope.$parent.recursiveGroupRef.arrayindex;
                scope.digits = scope.$parent.recursiveGroupRef.digits ;
                scope.field_names = scope.$parent.recursiveGroupRef.field_names;
              }
            }
            if(!_.isUndefined(basefilter)){
              var basefilterExpanded = tipoManipulationService.expandFilterExpression(basefilter, scope.root, scope.context,scope.arrayindex);
              filter = basefilterExpanded;
            }
            if(!_.isUndefined(filter)){
              searchCriteria.tipo_filter = filter;
            }
            if ((scope.selectkeyfield && !_.isEmpty(scope.selectkeyfield)) || (scope.selectlabelfield && !_.isEmpty(scope.selectlabelfield)) ) {
              // searchCriteria.tipo_fields = key_field + ',' + label_field;
            };
            searchCriteria.page = 1;
            // If for the dropdown we require custom page size then we can get from the page_size parameter
            searchCriteria.per_page = 1000;
            if (!_.isEmpty(scope.queryparams)) {
              _.forOwn(scope.queryparams,function(value,key){
                var baseParamExpanded = tipoManipulationService.expandFilterExpression(value, scope.root, scope.context,scope.arrayindex);
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
            searchCriteria.short_display = 'N';
            scope.searchCriteria = searchCriteria;
            if(typeof tipoClientJavascript[scope.tipo_name + '_List_OnLoad'] === 'function'){
              tipoClientJavascript[scope.tipo_name + '_List_OnLoad'](scope.selectedTipos,scope.searchCriteria);
            }
            return tipoInstanceDataService.search(scope.tipo_name, searchCriteria).then(function(results){
              scope.tipos = results;
              
              if (!scope.selectfield) {
                scope.options = _.map(results, function(each){
                  return {
                    key: each[key_field],
                    label: each[label_field]
                  };
                });
              }else{
                scope.options = [];
                var remName = scope.selectfield.substr(scope.selectfield.indexOf('.') + 1);
                var startName = scope.selectfield.substr(0,scope.selectfield.indexOf('.'));
                if (results[0][startName] || results[0][remName]) {
                  extractDropdownList(results[0],scope.options,startName,remName)
                };
              }
              var tipo_perm = tipoRegistry.get(scope.tipo_name + '_resdata');
              scope.perm = tipo_perm.perm;
              if(tipo_perm.perm.substr(2,1) === 0){
                scope.disablecreate = true;
              }
            });
          };

          scope.searchTerm = {};
          scope.cleanup = function(){
            delete scope.searchTerm.text;
            if(typeof tipoClientJavascript[scope.tipo_name + '_Lookup_OnChange'] === 'function'){
              tipoClientJavascript[scope.tipo_name + '_Lookup_OnChange'](scope.model.field,scope.options,scope.root,_.join(_.dropRight(scope.fqfieldname.split(".")),"."));
            }
              if (!isarray) {
                if (!_.isUndefined(scope.fieldvalue)) {
                scope.fieldvalue = scope.model.field.key;
                if (_.isUndefined(scope.fieldlabel)) {
                  scope.fieldlabel = "";
                }
                scope.fieldlabel = scope.model.field.label;
                scope.ngModel = scope.model.field.key;
              };
            }else{
              scope.fieldvalue = [];
              scope.fieldlabel = [];
              if (!_.isUndefined(scope.fieldvalue)) {
                _.each(scope.model.field,function(val){
                  scope.fieldvalue.push(val.key);
                  scope.fieldlabel.push(val.label);
                });
                scope.ngModel = scope.fieldvalue;
              }

            }
          };

          scope.stopBubbling = function(event){
            event.stopPropagation();
          };

          scope.renderSelection = function(){
            var text = '<div class="placeholder"> </div>';
            if (scope.model.field && scope.model.field.length){
              text = '<div class="multiple-list">';
              _.each(scope.model.field, function(each){
                text += '<div>' +each.label + '</div>';
              });
              text += '</div>';
            }
            return text;
          };

          if (scope.ispopup) {
            tipoDefinitionDataService.getOne(scope.tipo_name).then(function(definition){
              var searchText;
              scope.popupDefinition = definition;
              scope.loadOptions(searchText,definition.tipo_meta.default_page_size);
            });
          }else{
            scope.loadOptions()
          }

          function openTipoObjectDialog(){
            var searchText;
            scope.loadOptions(searchText,scope.popupDefinition.tipo_meta.default_page_size);            
            var newScope = scope.$new();
            newScope.isarray = isarray;
            newScope.field = scope.context;
            newScope.disablecreate = scope.disablecreate;
            newScope.tipo_name = scope.tipo_name;
            newScope.perm = scope.perm;
            newScope.queryparams = scope.searchCriteria;
            newScope.label_field = label_field;
            newScope.key_field = label_field;
            if (scope.root) {
            newScope.tipo_fields = scope.root.tipo_field_groups}
            newScope.selectedTipos = scope.selectedTipos;
            var promise = $mdDialog.show({
              templateUrl: 'framework/_directives/_views/tp-lookup-popup-select.tpl.html',
              controller: TipoObjectDialogController,
              controllerAs: 'tipoRootController',
              scope: newScope,
              resolve: /*@ngInject*/
              {
                tipoDefinition: function(tipoManipulationService) {
                  var tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(scope.popupDefinition, scope.tipos, label_field);
                  return {tipoDefinition: scope.popupDefinition, tiposWithDefinition: tiposWithDefinition}
                }
              },
              skipHide: true,
              clickOutsideToClose: true,
              fullscreen: true
            });
            return promise;
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
            }else{
              scope.model.field = {};
              scope.fieldvalue = "";
            }
          }

          scope.tipoObjecSelectiontDialog = function(){
            var promise = openTipoObjectDialog();
            promise.then(function(selectedObjects){
              optionsFormat(selectedObjects);
              if(isarray){
                scope.model.field = scope.optionSelected;
                scope.selectedTipos = scope.model.field;
              }else{
                scope.model.field = scope.optionSelected[0];
                scope.selectedTipos = [scope.model.field];
              }
              scope.cleanup();
            });
          }
          scope.$watch(function(){return scope.fieldvalue},function(){
            if (scope.model.field.key !== scope.fieldvalue) {
              if (!scope.model.field.key) {
                scope.loadOptions();
              };
              if (!isarray) {
                scope.model.field.key = scope.fieldvalue;
                scope.model.field.label = scope.fieldlabel || angular.copy(scope.fieldvalue);;
              };
            };
          })
        }
      };
    }
  );

})();