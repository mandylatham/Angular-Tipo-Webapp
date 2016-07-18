(function () {

  'use strict';

  var module = angular.module('tipo.common');

  return module.directive('googleSignInButton', function () {
      return {
        scope: {
          buttonId: '@',
	      options: '&'
        },
        template: '<span></span>',
        link: function(scope, element, attrs){
          var span = element.find('span')[0];
	      span.id = attrs.buttonId;
	      gapi.signin2.render(span.id, scope.options()); //render a google button, first argument is an id, second options
        }
      };
    }
  );

})();
