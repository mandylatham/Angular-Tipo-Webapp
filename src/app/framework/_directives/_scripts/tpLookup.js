(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  function TipoObjectDialogController(
    tipoDefinition,
    tipoManipulationService,
    $scope,
    $mdDialog) {

    $scope.definition = tipoDefinition;
    $scope.fullscreen = true;
    if ($scope.selectedTipos.length > 0) {
      _.each($scope.definition, function(tipo){
          _.each($scope.selectedTipos,function(selected){
            if(tipo.key === selected.key){
              tipo.selected = true;
            }
          })
        });
    };
    $scope.maximize = function(){
      $scope.fullscreen = true;
    };

    $scope.restore = function(){
      $scope.fullscreen = false;
    };

    $scope.selectObject = function(tipoSelected){
      if (!$scope.isArray) {
        _.each($scope.definition, function(tipo){
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
    }
    $scope.finish = function() {      
      $mdDialog.hide($scope.selectedTipos);
    };
    $scope.cancel = function() {
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
          scope.isPopup = false;
          _.forEach(field.metadata, function(value) {
            if (value.key_ === "popup.select") {
              scope.isPopup = true;
            };
          });

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

          loadOptions();

          function openTipoObjectDialog(){
            var newScope = scope.$new();
            newScope.isArray = isArray;
            newScope.selectedTipos = scope.selectedTipos;
            var promise = $mdDialog.show({
              templateUrl: 'framework/_directives/_views/tp-lookup-popup-select.tpl.html',
              controller: TipoObjectDialogController,
              scope: newScope,
              resolve: /*@ngInject*/
              {
                tipoDefinition: function(tipoDefinitionDataService, tipoManipulationService) {
                  return tipoDefinitionDataService.getOne(scope.tipo_name).then(function(definition){
                    return tipoManipulationService.mergeDefinitionAndDataArray(definition, scope.tipos, label_field);
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
