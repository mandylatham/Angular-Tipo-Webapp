(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpColourPalette', function ($mdColorPalette,$mdColors, $mdColorUtil) {
      return {
        scope: {
          coloursSelected: '=ngModel',
          mode: '@?'
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-colour-palette.tpl.html',
        link: function(scope, element, attrs){
          var mode = scope.mode || 'view';
          scope.mode = mode;
          scope.colors = Object.keys($mdColorPalette);
          scope.isPrimary = true;
          console.log(scope.coloursSelected);
          if(_.isUndefined(scope.coloursSelected)){
            scope.coloursSelected = {};
            scope.coloursSelected.key = "purple,green";
            scope.primary = 'purple';
            scope.accent = 'green';
          }else{
            var selectedColors = scope.coloursSelected.key.split(',');
            scope.primary = selectedColors[0];
            scope.accent = selectedColors[1];
          }
          

          scope.getColor = function(color){
            return $mdColorUtil.rgbaToHex($mdColors.getThemeColor(color));
          }   

          scope.selectTheme = function(color){
            var selectedColors = scope.coloursSelected.key.split(',');
            if (scope.isPrimary) {
              selectedColors[0] = color;
              scope.primary = color;
              scope.isPrimary = false;
            }
            else {
              selectedColors[1] = color;
              scope.accent = color;
              scope.isPrimary = true;
            }
            scope.coloursSelected.key = selectedColors.join(',');
          }
        }
      };
    }
  );

})();
