(function() {

  'use strict';

  // Common Module declaration
  var module = angular.module('tipo.common', [
    'ui.router',
    'restangular',
    'LocalStorageModule',
    'ngMaterial',
    'md.data.table'
  ]);

  module.config(function ($mdThemingProvider) {
    prepareThemes($mdThemingProvider);
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
        '50': '#ffffff',
        '100': '#fde3d2',
        '200': '#fbc19c',
        '300': '#f89658',
        '400': '#f6833a',
        '500': '#f5711d',
        '600': '#e9610a',
        '700': '#cc5509',
        '800': '#ae4908',
        '900': '#913c06',
        'A100': '#ffffff',
        'A200': '#fde3d2',
        'A400': '#f6833a',
        'A700': '#cc5509',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': '50 100 200 300 400 500 A100 A200 A400'
      });

      $mdThemingProvider
      .theme('default')
      .primaryPalette('tipoprimary')
      .accentPalette('tipoaccent')
      .warnPalette('red')
      .backgroundPalette('blue-grey');
    }

})();