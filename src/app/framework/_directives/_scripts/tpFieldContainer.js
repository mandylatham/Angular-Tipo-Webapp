(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldContainer', function($templateCache, $compile) {
      return {
        restrict: 'AE',
        scope: {
          field: '=',
          mode: '@?'
        },
        replace: true,
        template: '<ng-include src="fieldTemplate" tp-include-replace/>',
        link: function(scope, element, attrs){
          var mode = scope.mode || 'view';
          scope.mode = mode;

          var fieldTemplate;
          if(mode === 'edit'){
            fieldTemplate = 'framework/_directives/_views/tp-field-container-edit.tpl.html';
          }else{
            fieldTemplate = 'framework/_directives/_views/tp-field-container-view.tpl.html';
          }
          scope.fieldTemplate = fieldTemplate;

          var field = scope.field;
          var sizing = _.get(field, 'sizing') || 1;
          if(sizing === 1){
            scope.sizeGtSm = 45;
            scope.sizeGtMd = 30;
          } else if(sizing === 2){
            scope.sizeGtSm = 100;
            scope.sizeGtMd = 60;
          }
        }
      };
    }
  );

})();
