(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function TipoObjectDialogController(
    tipoDefinition,
    tipoManipulationService,
    $scope,
    $mdDialog,
    tipoCache,
    tipoRouter,
    tipoInstanceDataService) {

    var _instance = this;

    _instance.tiposWithDefinition = tipoDefinition.tiposWithDefinition;
    _instance.tipoDefinition = tipoDefinition.tipoDefinition;
    _instance.popup = true;
    _instance.tipos = $scope.tipos;
    _instance.tipo_fields = $scope.tipo_fields;
    _instance.selectedTipos = $scope.selectedTipos;
    _instance.perm = $scope.perm;
    _instance.disablecreate = $scope.disablecreate;
    $scope.fullscreen = true;
    if ($scope.selectedTipos.length > 0) {
      _.each(_instance.tiposWithDefinition, function(tipo){
          _.each($scope.selectedTipos,function(selected){
            if(tipo.key === selected.key){
              tipo.selected = true;
            }
          })
        });
    };
    _instance.maximize = function(){
      $scope.fullscreen = true;
    };

    _instance.restore = function(){
      $scope.fullscreen = false;
    };

    _instance.selectTipo = function(tipoSelected,event,tiposData){
      if (!$scope.isArray) {
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
          return tipo.key === tipoSelected.key;
        });
      }
      event.stopPropagation();
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
  }
  return module.directive('tpLookup', function (
    tipoInstanceDataService,
    tipoManipulationService,
    tipoRouter,
    tipoRegistry,
    $mdDialog,
    $mdSelect,
    tipoDefinitionDataService) {
      return {
        scope: {
          root: '=',
          context: '=',
          parent: '=',
          field: '='
        },
        restrict: 'EA',
        replace: true,
        template: '<ng-include src="fieldTemplate" tp-include-replace/>',
        link: function(scope, element, attrs){
          var field = scope.field;
          var isArray = Boolean(field._ui.isArray);
          var isGroup = Boolean(field._ui.isGroup);
          var isMandatory = Boolean(field.mandatory);
          scope.isPopup = field.popup_select;
          scope.isArray = isArray;

          var fieldTemplate;
          if(isArray && !isGroup){
            fieldTemplate = 'framework/_directives/_views/tp-lookup-multiple.tpl.html';
          }else{
            fieldTemplate = 'framework/_directives/_views/tp-lookup-single.tpl.html';
          }
          scope.fieldTemplate = fieldTemplate;

          var baseFilter = field.relationship_filter;
          scope.tipo_name = field._ui.relatedTipo;
          var label_field;
          if(_.isUndefined(field.label_field)){
            label_field = field.key_field.field_name;
          }else{
            label_field = field.label_field.field_name;
          }

          scope.selectedTipos = [];
          if(isArray){
            scope.selectedTipos = field._value;
          }else{
            if(_.get(field, '_value.key')){
              scope.selectedTipos = [field._value];
            }
          }

          if(!field.allow_create){
            scope.disablecreate = true;
          }else{
            scope.disablecreate = false;
          }

          function optionsFormat(results){
            scope.optionSelected = _.map(results, function(each){
              return {
                key: each.key,
                label: each.label
              };
            });
          }

          scope.loadOptions = function (searchText,page_size){
            delete scope.options;
            var searchCriteria = {};
            var filter;
            var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
            /*if(tipo_name !== perspectiveMetadata.tipoName){
              filter = perspectiveMetadata.tipoFilter;
            }*/
            if(!_.isUndefined(baseFilter)){
              var baseFilterExpanded = tipoManipulationService.expandFilterExpression(baseFilter, scope.root, scope.context);
              filter = baseFilterExpanded;
            }
            if(!_.isUndefined(filter)){
              searchCriteria.tipo_filter = filter;
            }
            searchCriteria.page = 1;
            searchCriteria.per_page = page_size;
            if (!_.isUndefined(searchText)) {
              searchCriteria.tipo_filter = "(_all:(" + searchText + "*))";
            };
            return tipoInstanceDataService.search(scope.tipo_name, searchCriteria).then(function(results){
              scope.tipos = results;
              scope.options = _.map(results, function(each){
                return {
                  key: each.tipo_id,
                  label: each[label_field]
                };
              });
              if(isMandatory && !field._value){
                if(isArray){
                  field._value = [scope.options[0]];
                }else{
                  field._value = scope.options[0];
                }
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
          };

          scope.stopBubbling = function(event){
            event.stopPropagation();
          };

          scope.renderSelection = function(){
            var text = '<div class="placeholder">' + field.field_description + '</div>';
            if (field._value && field._value.length){
              text = '<div class="multiple-list">';
              _.each(field._value, function(each){
                text += '<div>' +each.label + '</div>';
              });
              text += '</div>';
            }
            return text;
          };

          if (scope.isPopup) {
            tipoDefinitionDataService.getOne(scope.tipo_name).then(function(definition){
              var searchText;
              scope.popupDefinition = definition;
              scope.loadOptions(searchText,definition.tipo_meta.default_page_size);
            });
          }else{
            if(isArray){
              scope.options = scope.field._value;
            }
          }

          function openTipoObjectDialog(){
            var searchText;
            scope.loadOptions(searchText,scope.popupDefinition.tipo_meta.default_page_size);            
            var newScope = scope.$new();
            newScope.isArray = isArray;
            newScope.field = scope.context;
            newScope.disablecreate = scope.disablecreate;
            newScope.tipo_name = scope.tipo_name;
            newScope.perm = scope.perm;
            newScope.label_field = label_field;
            if (scope.root) {
            newScope.tipo_fields = scope.root.tipo_fields}
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
              controller: 'TipoCreateRootController',
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

          scope.tipoObjecSelectiontDialog = function(){
            var promise = openTipoObjectDialog();
            promise.then(function(selectedObjects){
              optionsFormat(selectedObjects);
              if(isArray){
                field._value = scope.optionSelected;
                scope.selectedTipos = field._value;
              }else{
                field._value = scope.optionSelected[0];
                scope.selectedTipos = [field._value];
              }
            });
          }

        }
      };
    }
  );

})();