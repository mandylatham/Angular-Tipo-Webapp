(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFieldContainer', function($templateCache, $compile) {
      return {
        restrict: 'AE',
        scope: {
          field: '='
        },
        replace: true,
        templateUrl: function(element, attrs){
          if(attrs.mode === 'edit'){
            return 'framework/_directives/_views/tp-field-container-edit.tpl.html';
          }else{
            return 'framework/_directives/_views/tp-field-container-view.tpl.html';
          }
        },
        link: function(scope, element, attrs){
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
