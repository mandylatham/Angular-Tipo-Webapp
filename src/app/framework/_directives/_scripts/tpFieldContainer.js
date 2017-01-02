(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldContainer', function($templateCache, $compile) {
      return {
        restrict: 'AE',
        scope: {
          root: '=',
          context: '=',
          field: '=',
          mode: '@?'
        },
        replace: true,
        template: '<ng-include src="fieldTemplate" tp-include-replace/>',
        link: function(scope, element, attrs){
          var mode = scope.mode || 'view';
          scope.mode = mode;

          var field = scope.field;
          scope.isId = field.field_name === 'tipo_id';

          var sizing = _.get(field, 'sizing') || 1;
          sizing = parseInt(sizing, 10);

          var fieldTemplate;
          if(mode === 'edit'){
            fieldTemplate = 'framework/_directives/_views/tp-field-container-edit.tpl.html';
          }else{
            if(sizing === 3){
              fieldTemplate = 'framework/_directives/_views/tp-field-container-view-t-b.tpl.html';
            }else{
              fieldTemplate = 'framework/_directives/_views/tp-field-container-view-l-r.tpl.html';
            }
          }
          scope.fieldTemplate = fieldTemplate;

          if(sizing === 1){
            scope.sizeGtSm = 50;
            scope.sizeGtMd = 33;
          } else if(sizing === 2){
            scope.sizeGtSm = 100;
            scope.sizeGtMd = 66;
          } else if(sizing === 3){
            scope.sizeGtSm = 100;
            scope.sizeGtMd = 100;
          }
        }
      };
    }
  );

})();
