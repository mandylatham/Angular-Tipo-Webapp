(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFile', function (
    tipoManipulationService
  ) {
    return {
      scope: {
        field: '=',
        mode: '@?'
      },
      restrict: 'EA',
      replace: true,
      templateUrl: 'framework/_directives/_views/tp-file.tpl.html',
      link: function (scope, element, attrs) {
        var mode = scope.mode || 'view';
        scope.mode = mode;
        var field = scope.field;
        var isArray = Boolean(field._ui.isArray);
        var isMandatory = Boolean(field.mandatory);
        var fileTarget = tipoManipulationService.getFieldMeta(field, 'file.target');        
      }
    };
  });

})();