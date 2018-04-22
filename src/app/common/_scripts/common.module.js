(function() {

  'use strict';

  // Common Module declaration
  var module = angular.module('tipo.common', [
    'ui.router',
    'restangular',
    'LocalStorageModule',
    'ngMaterial',
    'ngMessages',
    'angular-cache',
    'md.data.table',
    'textAngular',
    'vcRecaptcha',
    'lfNgMdFileInput',
    'cgBusy',
    'ngProgress',
    'ngAnimate',
    'ngPageTitle',
    'cleave.js',
    'naif.base64',
    'duScroll',
    'ngMap',
    'google.places',
    'text-mask',
    'angular-flatpickr',
    'infinite-scroll',
    'cl.paging',
    'angularSpectrumColorpicker',
    'angular-intro',
    'angular-echarts'
  ]);

  module.config(function ($mdThemingProvider, $mdToastProvider, $compileProvider) {
    prepareThemes($mdThemingProvider);
    prepareToastPresets($mdToastProvider);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tipotapp):/);
  });

  module.run(function ($mdColors, $mdColorUtil){
    prepareGraphThemes($mdColors, $mdColorUtil);
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

  function prepareGraphThemes($mdColors, $mdColorUtil) {
    var color = [
      $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500')),
      $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-900')),
      $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-900')),
      $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-200')),
      $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-200')),
      $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-400')),
      $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-400')),
      $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-A200')),
      $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-A200')),
 
    ]
    echarts.registerTheme('custom', {
      "color": color,
      "backgroundColor": "rgba(242,234,191,0.15)",
      "textStyle": {
          "fontSize" : 10,
          "lineHeight" : 0.5
      },
      "title": {
          "textStyle": {
              "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500'))
          },
          "subtextStyle": {
              "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-900'))
          }
      },
      "line": {
          "itemStyle": {
              "normal": {
                  "borderWidth": "2"
              }
          },
          "lineStyle": {
              "normal": {
                  "width": "2"
              }
          },
          "symbolSize": "6",
          "symbol": "emptyCircle",
          "smooth": false
      },
      "radar": {
          "itemStyle": {
              "normal": {
                  "borderWidth": "2"
              }
          },
          "lineStyle": {
              "normal": {
                  "width": "2"
              }
          },
          "symbolSize": "6",
          "symbol": "emptyCircle",
          "smooth": true
      },
      "bar": {
          "itemStyle": {
              "normal": {
                  "barBorderWidth": 0,
                  "barBorderColor": "#ccc"
              },
              "emphasis": {
                  "barBorderWidth": 0,
                  "barBorderColor": "#ccc"
              }
          }
      },
      "pie": {
          "itemStyle": {
              "normal": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              },
              "emphasis": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              }
          }
      },
      "scatter": {
          "itemStyle": {
              "normal": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              },
              "emphasis": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              }
          }
      },
      "boxplot": {
          "itemStyle": {
              "normal": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              },
              "emphasis": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              }
          }
      },
      "parallel": {
          "itemStyle": {
              "normal": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              },
              "emphasis": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              }
          }
      },
      "sankey": {
          "itemStyle": {
              "normal": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              },
              "emphasis": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              }
          }
      },
      "funnel": {
          "itemStyle": {
              "normal": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              },
              "emphasis": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              }
          }
      },
      "gauge": {
          "itemStyle": {
              "normal": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              },
              "emphasis": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              }
          }
      },
      "candlestick": {
          "itemStyle": {
              "normal": {
                  "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-900')),
                  "color0": "transparent",
                  "borderColor": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-900')),
                  "borderColor0": "#58c470",
                  "borderWidth": "2"
              }
          }
      },
      "graph": {
          "itemStyle": {
              "normal": {
                  "borderWidth": 0,
                  "borderColor": "#ccc"
              }
          },
          "lineStyle": {
              "normal": {
                  "width": 1,
                  "color": "#aaaaaa"
              }
          },
          "symbolSize": "6",
          "symbol": "emptyCircle",
          "smooth": true,
          "color": color,
          "label": {
              "normal": {
                  "textStyle": {
                      "color": "#ffffff"
                  }
              }
          }
      },
      "map": {
          "itemStyle": {
              "normal": {
                  "areaColor": "#f3f3f3",
                  "borderColor": "#999999",
                  "borderWidth": 0.5
              },
              "emphasis": {
                  "areaColor": "rgba(255,178,72,1)",
                  "borderColor": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-900')),
                  "borderWidth": 1
              }
          },
          "label": {
              "normal": {
                  "textStyle": {
                      "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500'))
                  }
              },
              "emphasis": {
                  "textStyle": {
                      "color": "rgb(137,52,72)"
                  }
              }
          }
      },
      "geo": {
          "itemStyle": {
              "normal": {
                  "areaColor": "#f3f3f3",
                  "borderColor": "#999999",
                  "borderWidth": 0.5
              },
              "emphasis": {
                  "areaColor": "rgba(255,178,72,1)",
                  "borderColor": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-900')),
                  "borderWidth": 1
              }
          },
          "label": {
              "normal": {
                  "textStyle": {
                      "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500'))
                  }
              },
              "emphasis": {
                  "textStyle": {
                      "color": "rgb(137,52,72)"
                  }
              }
          }
      },
      "categoryAxis": {
          "axisLine": {
              "show": true,
              "lineStyle": {
                  "color": "#aaaaaa"
              }
          },
          "axisTick": {
              "show": false,
              "lineStyle": {
                  "color": "#333"
              }
          },
          "axisLabel": {
              "show": true,
              "textStyle": {
                  "color": "#999999"
              }
          },
          "splitLine": {
              "show": true,
              "lineStyle": {
                  "color": [
                      "#e6e6e6"
                  ]
              }
          },
          "splitArea": {
              "show": false,
              "areaStyle": {
                  "color": [
                      "rgba(250,250,250,0.05)",
                      "rgba(200,200,200,0.02)"
                  ]
              }
          }
      },
      "valueAxis": {
          "axisLine": {
              "show": true,
              "lineStyle": {
                  "color": "#aaaaaa"
              }
          },
          "axisTick": {
              "show": false,
              "lineStyle": {
                  "color": "#333"
              }
          },
          "axisLabel": {
              "show": true,
              "textStyle": {
                  "color": "#999999"
              }
          },
          "splitLine": {
              "show": true,
              "lineStyle": {
                  "color": [
                      "#e6e6e6"
                  ]
              }
          },
          "splitArea": {
              "show": false,
              "areaStyle": {
                  "color": [
                      "rgba(250,250,250,0.05)",
                      "rgba(200,200,200,0.02)"
                  ]
              }
          }
      },
      "logAxis": {
          "axisLine": {
              "show": true,
              "lineStyle": {
                  "color": "#aaaaaa"
              }
          },
          "axisTick": {
              "show": false,
              "lineStyle": {
                  "color": "#333"
              }
          },
          "axisLabel": {
              "show": true,
              "textStyle": {
                  "color": "#999999"
              }
          },
          "splitLine": {
              "show": true,
              "lineStyle": {
                  "color": [
                      "#e6e6e6"
                  ]
              }
          },
          "splitArea": {
              "show": false,
              "areaStyle": {
                  "color": [
                      "rgba(250,250,250,0.05)",
                      "rgba(200,200,200,0.02)"
                  ]
              }
          }
      },
      "timeAxis": {
          "axisLine": {
              "show": true,
              "lineStyle": {
                  "color": "#aaaaaa"
              }
          },
          "axisTick": {
              "show": false,
              "lineStyle": {
                  "color": "#333"
              }
          },
          "axisLabel": {
              "show": true,
              "textStyle": {
                  "color": "#999999"
              }
          },
          "splitLine": {
              "show": true,
              "lineStyle": {
                  "color": [
                      "#e6e6e6"
                  ]
              }
          },
          "splitArea": {
              "show": false,
              "areaStyle": {
                  "color": [
                      "rgba(250,250,250,0.05)",
                      "rgba(200,200,200,0.02)"
                  ]
              }
          }
      },
      "toolbox": {
          "iconStyle": {
              "normal": {
                  "borderColor": "#999999"
              },
              "emphasis": {
                  "borderColor": "#666666"
              }
          }
      },
      "legend": {
          "textStyle": {
              "color": "#999999"
          }
      },
      "tooltip": {
          "axisPointer": {
              "lineStyle": {
                  "color": "#cccccc",
                  "width": 1
              },
              "crossStyle": {
                  "color": "#cccccc",
                  "width": 1
              }
          }
      },
      "timeline": {
          "lineStyle": {
              "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500')),
              "width": 1
          },
          "itemStyle": {
              "normal": {
                  "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500')),
                  "borderWidth": 1
              },
              "emphasis": {
                  "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-200'))
              }
          },
          "controlStyle": {
              "normal": {
                  "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500')),
                  "borderColor": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500')),
                  "borderWidth": 0.5
              },
              "emphasis": {
                  "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500')),
                  "borderColor": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500')),
                  "borderWidth": 0.5
              }
          },
          "checkpointStyle": {
              "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-900')),
              "borderColor": "rgba(255,178,72,0.41)"
          },
          "label": {
              "normal": {
                  "textStyle": {
                      "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500'))
                  }
              },
              "emphasis": {
                  "textStyle": {
                      "color": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-500'))
                  }
              }
          }
      },
      "visualMap": {
          "color": color
      },
      "dataZoom": {
          "backgroundColor": "rgba(255,255,255,0)",
          "dataBackgroundColor": "rgba(255,178,72,0.5)",
          "fillerColor": "rgba(255,178,72,0.15)",
          "handleColor": $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-200')),
          "handleSize": "100%",
          "textStyle": {
              "color": "#333333"
          }
      },
      "markPoint": {
          "label": {
              "normal": {
                  "textStyle": {
                      "color": "#ffffff"
                  }
              },
              "emphasis": {
                  "textStyle": {
                      "color": "#ffffff"
                  }
              }
          }
      }
  });
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
          position: 'bottom right',
          hideDelay: 7000
        };
      }
    });
    $mdToastProvider.addPreset('tpErrorToast', {
      options: function() {
        return {
          templateUrl: 'common/backend/_views/error-toast.tpl.html',
          bindToController: true,
          controllerAs: 'errorToast',
          controller: /*@ngInject*/ function($scope, $mdToast, header, body){
            this.close = function(){
              $mdToast.hide();
            };
          },
          position: 'top right',
          toastClass: 'error-toast',
          hideDelay: 10000
        };
      }
    });
  }

})();