(function () {

  'use strict';

  var module = angular.module('tipo.social');

  module.directive('googleSignInButton', function (googleService) {
      return {
        scope: {
          buttonId: '@',
          options: '&'
        },
        template: '<div></div>',
        link: function(scope, element, attrs){
          var div = element.find('div')[0];
          if (div) {
            div.id = attrs.buttonId;

            var defaultOptions = {
                onsuccess: googleService.onSignIn
            };
            gapi.signin2.render(div.id, defaultOptions);
          }
        }
      };
  });

})();
