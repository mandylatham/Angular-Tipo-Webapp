(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpSimpleImageUpload', function () {
      return {
        scope: {
          isarray: '=',
          isrequired: '=',
          model: '=',
          direction: '=',
          effect: '=',
          paginationType: '=',
          paginationHide: '=',
          mouseWheelControl: '=',
          loop: '=',
        },
        restrict: 'E',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-simple-image-upload.tpl.html',
        link: function(scope, element, attrs){
          scope.modId = _.camelCase(attrs.name);
          scope.clientWidth = element[0].clientWidth;
          if (scope.isarray && !scope.model) {
            scope.model = [];
          }else if (!scope.model) {
            scope.model = {};
          };

          scope.onLoad= function(e, fileList,File,FileList,FileObjects,Object){
            if (scope.isarray) {
              scope.model.push(Object);
            }else{
              scope.model = Object;
            }
          };
        }
      };
    }
  );

})();