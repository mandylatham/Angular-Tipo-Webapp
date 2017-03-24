(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function TipoObjectDialogController(
    tipoDefinition,
    tipoManipulationService,
    $scope,
    $mdDialog) {

    var _instance = this;

    _instance.tiposWithDefinition = tipoDefinition.tiposWithDefinition;
    _instance.tipoDefinition = tipoDefinition.tipoDefinition;
    _instance.popup = true;
    _instance.tipo_field_groups = $scope.tipo_field_groups;
    _instance.selectedTipos = $scope.selectedTipos;
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
  }
  return module.directive('tpLookup', function (
    tipoInstanceDataService,
    tipoManipulationService,
    $mdDialog) {
      return {
        scope: {
          root: '=',
          context: '=',
          parent: '=',
          field: '=',
          fieldData: '=',
          tipoData: '=',
        },
        restrict: 'EA',
        replace: true,
        template: '<ng-include src="fieldTemplate" tp-include-replace/>',
        link: function(scope, element, attrs){
          var tipoData = scope.tipoData;
          console.log("tipoData");
          console.log(scope.tipoData);
          var fieldData = scope.fieldData;
          var isArray = Boolean(scope.fieldData.isArray);
          var isGroup = Boolean(scope.fieldData.isGroup);
          var isMandatory = Boolean(scope.fieldData.mandatory);
          scope.isPopup = Boolean(scope.fieldData.isPopup);

          var fieldTemplate;
          if(isArray && !isGroup){
            fieldTemplate = 'framework/_directives/_views/tp-lookup-multiple.tpl.html';
          }else{
            fieldTemplate = 'framework/_directives/_views/tp-lookup-single.tpl.html';
          }
          scope.fieldTemplate = fieldTemplate;

          var baseFilter = scope.fieldData.baseFilter;
          scope.tipo_name = scope.fieldData.relatedTipo;

          var label_field = scope.fieldData.labelField;

          scope.selectedTipos = [];          
          if(isArray){
            scope.selfield = [];
            _.each(scope.field, function(each){
                    scope.selfield.push({
                      key: each,
                      label: _.get(tipoData, scope.fieldData.fieldKey + '_refs.ref' + each)
                    });
                  });
            scope.selectedTipos = scope.selfield;
          }else{
            scope.selfield = {};
            if(scope.field){
              scope.selfield.key = scope.field;
              scope.selfield.label = _.get(tipoData, scope.fieldData.fieldKey + '_refs.ref' + scope.field);
              scope.selectedTipos = [scope.selfield];
            }
          }

          function optionsFormat(results){
            scope.optionSelected = _.map(results, function(each){
              return {
                key: each.key,
                label: each.label
              };
            });
          }

          function loadOptions(){
            delete scope.options;
            var searchCriteria = {};
            var filter;
            var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
            /*if(tipo_name !== perspectiveMetadata.tipoName){
              filter = perspectiveMetadata.tipoFilter;
            }*/
            // TODO: Hack - Sushil as this is supposed to work only for applications
            if(perspectiveMetadata.fieldName === 'application'){
              filter = perspectiveMetadata.tipoFilter;
            }
            if(!_.isUndefined(baseFilter)){
              var baseFilterExpanded = tipoManipulationService.expandFilterExpression(baseFilter, scope.root, scope.context);
              if(_.isUndefined(filter)){
                filter = baseFilterExpanded;
              }else{
                filter += ' and ' + baseFilterExpanded;
              }
            }
            if(!_.isUndefined(filter)){
              searchCriteria.tipo_filter = filter;
            }
            return tipoInstanceDataService.search(scope.tipo_name, searchCriteria).then(function(results){
              scope.tipos = results;
              console.log("results");
              console.log(results);
              console.log(label_field);
              scope.options = _.map(results, function(each){
                return {
                  key: each.tipo_id,
                  label: each[label_field]
                };
              });
              console.log(scope.options)
              if(isMandatory && !field){
                if(isArray){
                  field = [scope.options[0]];
                }else{
                  field = scope.options[0];
                }
              }
            });
          }

          scope.loadOptions = loadOptions;

          scope.searchTerm = {};
          scope.cleanup = function(){
            delete scope.searchTerm.text;
          };

          scope.stopBubbling = function(event){
            event.stopPropagation();
          };

          scope.renderSelection = function(){
            var text = '<div class="placeholder"></div>';
            if (field && field.length){
              text = '<div class="multiple-list">';
              _.each(field, function(each){
                text += '<div>' +each.label + '</div>';
              });
              text += '</div>';
            }
            return text;
          };

          loadOptions();

          function openTipoObjectDialog(){
            var newScope = scope.$new();
            newScope.isArray = isArray;
            newScope.field = scope.context;
            if (scope.parent.tipo_field_groups) {
            newScope.tipo_field_groups = scope.parent.tipo_field_groups}else{
            newScope.tipo_field_groups = scope.context.tipo_field_groups;
            }
            newScope.selectedTipos = scope.selectedTipos;
            var promise = $mdDialog.show({
              templateUrl: 'framework/_directives/_views/tp-lookup-popup-select.tpl.html',
              controller: TipoObjectDialogController,
              controllerAs: 'tipoRootController',
              scope: newScope,
              resolve: /*@ngInject*/
              {
                tipoDefinition: function(tipoDefinitionDataService, tipoManipulationService) {
                  return tipoDefinitionDataService.getOne(scope.tipo_name).then(function(definition){
                    var tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(definition, scope.tipos, label_field);
                    return {tipoDefinition: definition, tiposWithDefinition: tiposWithDefinition}
                  });
                }
              },
              skipHide: true,
              clickOutsideToClose: true,
              fullscreen: true
            });
            return promise;
          }

          scope.tipoObjecSelectiontDialog = function(){
            var promise = openTipoObjectDialog();
            promise.then(function(selectedObjects){
              optionsFormat(selectedObjects);
              if(isArray){
                field = scope.optionSelected;
                scope.selectedTipos = field;
              }else{
                field = scope.optionSelected[0];
                scope.selectedTipos = [field];
              }
            });
          }

        }
      };
    }
  );

})();
