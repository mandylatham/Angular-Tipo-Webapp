(function() {

  'use strict';

  // Common Module declaration
  var module = angular.module('tipo.custom');

  module.config(function ($mdThemingProvider, $mdToastProvider) {
    prepareThemes($mdThemingProvider);
    prepareToastPresets($mdToastProvider);
  });

  function prepareThemes($mdThemingProvider) {

      $mdThemingProvider.definePalette('tipoprimary', {
        '50': '#d0ddf3',
        '100': '#93b2e3',
        '200': '#6792d8',
        '300': '#336ac5',
        '400': '#2c5dac',
        '500': '#265094',
        '600': '#20437c',
        '700': '#1a3663',
        '800': '#13294b',
        '900': '#0d1b33',
        'A100': '#d0ddf3',
        'A200': '#93b2e3',
        'A400': '#2c5dac',
        'A700': '#1a3663',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 200 A100 A200'
      });

      $mdThemingProvider.definePalette('tipoaccent', {
        '50': '#fde9dc',
        '100': '#faba93',
        '200': '#f8985d',
        '300': '#f56d19',
        '400': '#e45e0a',
        '500': '#c75209',
        '600': '#aa4608',
        '700': '#8c3a06',
        '800': '#6f2e05',
        '900': '#522204',
        'A100': '#fde9dc',
        'A200': '#faba93',
        'A400': '#e45e0a',
        'A700': '#8c3a06',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 200 300 A100 A200'
      });

      $mdThemingProvider
      .theme('default')
      .primaryPalette('tipoprimary')
      .accentPalette('tipoaccent')
      .warnPalette('red')
      .backgroundPalette('grey');

      $mdThemingProvider
      .theme('reverse')
      .primaryPalette('tipoaccent')
      .accentPalette('tipoprimary')
      .warnPalette('red')
      .backgroundPalette('grey');
    }

  function prepareToastPresets($mdToastProvider){
    $mdToastProvider.addPreset('tpToast', {
      options: function() {
        return {
          templateUrl: 'common/ui/_views/tp-toast.tpl.html',
          bindToController: true,
          controllerAs: 'toast',
          controller: /*@ngInject*/ function($scope, $mdToast, header, body){
            this.close = function(){
              $mdToast.hide();
            };
          },
          position: 'top right',
          hideDelay: 7000
        };
      }
    });
  }

})();