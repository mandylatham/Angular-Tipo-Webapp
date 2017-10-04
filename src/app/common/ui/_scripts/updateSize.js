(function () {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('updateSize', function ($window) {
      return {
        restrict: 'A',
        require: '^mdVirtualRepeatContainer',
        link: function(scope, element, attributes, mdVirtualRepeatContainer) {
          var footer = 10;
          function getHeight() {
            var height = $window.innerHeight - (element[0].getBoundingClientRect().top + footer);
            angular.element(element).css('height', height + 'px');
            return height;
          }
          function onResize() {
            mdVirtualRepeatContainer.setSize_(getHeight());
          }
          getHeight();
          angular.element($window).on('resize', onResize);
        }
      };
    }
  );

})();
