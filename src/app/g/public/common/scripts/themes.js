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
      
            	$mdThemingProvider.definePalette('primary', {
        		  '50': 'befaff',
        		  '100': '72f4ff',
        		  '200': '3af0ff',
        		  '300': '00def1',
        		  '400': '00c2d3',
        		  '500': '00a6b4',
        		  '600': '008a95',
        		  '700': '006e77',
        		  '800': '005158',
        		  '900': '00353a',
        		  'A100': 'b4f9ff',
        		  'A200': '4ef1ff',
        		  'A400': '00d5e7',
        		  'A700': '00bdcd',
        		  'contrastDefaultColor': 'light',
        		  'contrastDarkColors': [
        		    '50',
        		    '100',
        		    '200',
        		    '300',
        		    '400',
        		    'A100',
        		    'A200',
        		    'A400',
        		    'A700'
        		  ],
        		  'contrastLightColors': [
        		    '500',
        		    '600',
        		    '700',
        		    '800',
        		    '900'
        		  ]
        		});
      
            	$mdThemingProvider.definePalette('accent', {
        		  '50': 'ffffff',
        		  '100': 'fee1d9',
        		  '200': 'fcb7a3',
        		  '300': 'f9815e',
        		  '400': 'f86a41',
        		  '500': 'f75323',
        		  '600': 'f33e09',
        		  '700': 'd53608',
        		  '800': 'b82f07',
        		  '900': '9a2706',
        		  'A100': 'ffffff',
        		  'A200': 'ffc5b4',
        		  'A400': 'ff764e',
        		  'A700': 'fd6337',
        		  'contrastDefaultColor': 'light',
        		  'contrastDarkColors': [
        		    '50',
        		    '100',
        		    '200',
        		    '300',
        		    '400',
        		    'A100',
        		    'A200',
        		    'A400',
        		    'A700'
        		  ],
        		  'contrastLightColors': [
        		    '500',
        		    '600',
        		    '700',
        		    '800',
        		    '900'
        		  ]
        		});
            
            
            
      $mdThemingProvider
      .theme('default')
            .primaryPalette('primary')
                  .accentPalette('accent')
                  .warnPalette('red')
                  .backgroundPalette('grey');
	  	  
	  $mdThemingProvider
      .theme('reverse')
            .primaryPalette('accent')
                  .accentPalette('primary')
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