(function () {

    'use strict';
  
    var module = angular.module('tipo.framework');
  
    return module.directive('tpMultipleChoiceView', function ($mdColorUtil, $mdColors) {
        return {
          scope: {
            fieldvalue: '=',
            mode: '=',
            isarray: '=',
            allowedvalues: '=',
          },
          restrict: 'EA',
          replace: true,
          templateUrl: 'framework/_directives/_views/tp-multiple-choice-view.tpl.html',
          link: function(scope, element, attrs, ctrl){
            scope.primaryColor = $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-500')); 
            scope.model = [];
            if(scope.isarray) {
                scope.model = scope.fieldvalue;
            } else {
                scope.model.push(scope.fieldvalue);
            }

            scope.colourCheck = function (option) {
                var index = _.findIndex(scope.allowedvalues, ['value', option]);
                if(index >= 0) {
                    if( scope.allowedvalues[index].colour === 'NA') {
                        return scope.primaryColor;
                    } else {
                        return scope.allowedvalues[index].colour
                    }
                } else {
                    return '#ddd';
                }
            }
            scope.$watch(function(){return scope.fieldvalue},function(newValue, oldValue){
                if (newValue) {
                    scope.model = [];
                    if(scope.isarray) {
                        scope.model = scope.fieldvalue;
                    } else {
                        scope.model.push(scope.fieldvalue);
                    }
                } 
            }, true);
        }
        };
      }
    );
  
  })();
  