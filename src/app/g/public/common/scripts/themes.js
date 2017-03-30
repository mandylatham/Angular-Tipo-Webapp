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
          '50': '#aff6fc',
          '100': '#65eefa',
          '200': '#2ee8f8',
          '300': '#07c8d8',
          '400': '#06acbb',
          '500': '#05919d',
          '600': '#04767f',
          '700': '#035a62',
          '800': '#023f44',
          '900': '#012326',
          'A100': '#aff6fc',
          'A200': '#65eefa',
          'A400': '#06acbb',
          'A700': '#035a62',
          'contrastDefaultColor': 'light',
          'contrastDarkColors': '50 100 200 300 A100 A200'
        });

        $mdThemingProvider.definePalette('tipoaccent', {
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
        
        $mdThemingProvider.definePalette('tipoprimary1', {
        	  '50': 'b5e0f7',
        	  '100': '70c4ef',
        	  '200': '3eafea',
        	  '300': '168cca',
        	  '400': '1379af',
        	  '500': '106693',
        	  '600': '0d5377',
        	  '700': '0a405c',
        	  '800': '072d40',
        	  '900': '041925',
        	  'A100': 'a3dfff',
        	  'A200': '3dbcff',
        	  'A400': '058bd1',
        	  'A700': '0e77af',
        	  'contrastDefaultColor': 'light',
        	  'contrastDarkColors': [
        	    '50',
        	    '100',
        	    '200',
        	    'A100',
        	    'A200'
        	  ],
        	  'contrastLightColors': [
        	    '300',
        	    '400',
        	    '500',
        	    '600',
        	    '700',
        	    '800',
        	    '900',
        	    'A400',
        	    'A700'
        	  ]
        	});
        	$mdThemingProvider.definePalette('tipoaccent1', {
        	  '50': 'ffffff',
        	  '100': 'fee4cd',
        	  '200': 'fdc795',
        	  '300': 'fca14f',
        	  '400': 'fc9131',
        	  '500': 'fb8113',
        	  '600': 'eb7204',
        	  '700': 'cd6303',
        	  '800': 'af5503',
        	  '900': '914602',
        	  'A100': 'ffffff',
        	  'A200': 'ffd1a8',
        	  'A400': 'ff9c42',
        	  'A700': 'ff8e28',
        	  'contrastDefaultColor': 'light',
        	  'contrastDarkColors': [
        	    '50',
        	    '100',
        	    '200',
        	    '300',
        	    '400',
        	    '500',
        	    '600',
        	    'A100',
        	    'A200',
        	    'A400',
        	    'A700'
        	  ],
        	  'contrastLightColors': [
        	    '700',
        	    '800',
        	    '900'
        	  ]
        	});
        	
        	$mdThemingProvider.definePalette('tipoprimary2', {
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
        	
        	$mdThemingProvider.definePalette('tipoaccent2', {
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
        		
        	
        	$mdThemingProvider.definePalette('background', {
        		  '50': 'ffffff',
        		  '100': 'ffffff',
        		  '200': 'ffffff',
        		  '300': 'ecf7fd',
        		  '400': 'd1ecfa',
        		  '500': 'b5e0f7',
        		  '600': '99d4f4',
        		  '700': '7ec9f1',
        		  '800': '62bdee',
        		  '900': '47b2eb',
        		  'A100': 'ffffff',
        		  'A200': 'ffffff',
        		  'A400': 'e1f4fe',
        		  'A700': 'cbeafb',
        		  'contrastDefaultColor': 'light',
        		  'contrastDarkColors': [
        		    '50',
        		    '100',
        		    '200',
        		    '300',
        		    '400',
        		    '500',
        		    '600',
        		    '700',
        		    '800',
        		    '900',
        		    'A100',
        		    'A200',
        		    'A400',
        		    'A700'
        		  ],
        		  'contrastLightColors': []
        		});

        $mdThemingProvider
        .theme('default')
        .primaryPalette('tipoprimary2')
        .accentPalette('tipoaccent2')
        .warnPalette('red')
        .backgroundPalette('grey');

        $mdThemingProvider
        .theme('reverse')
        .primaryPalette('tipoaccent2')
        .accentPalette('tipoprimary2')
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