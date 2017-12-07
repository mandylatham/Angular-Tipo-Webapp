(function() {

  'use strict';

  function TipoColorController(
    $scope, $mdTheming) {

    var _instance = this;
      
    function getColorObject(value, name) {
      var c = tinycolor(value);
      return {
        name: name,
        hex: c.toHexString(),
        darkContrast: c.isLight()
      };
    }
    $scope.defaultPalette = [
      ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
      ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
      ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
      ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
      ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
      ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
    ];
    $scope.tipoRootController.palettecolors = {};


    function applyToAngularCode(pallete){
      var palleteObj = {};
      palleteObj['contrastDarkColors'] = [];
      palleteObj['contrastLightColors'] = [];
      _.each(pallete,function(each){
        palleteObj[each.name] = each.hex;
        if (each.darkContrast) {
          palleteObj['contrastDarkColors'].push(each.name);
        }else{
          palleteObj['contrastLightColors'].push(each.name);
        }
      });
      palleteObj['contrastDefaultColor'] = 'light';
      return palleteObj;
    }

    _instance.createAjsPaletteCode = function (palette) {
        return '$mdThemingProvider.definePalette(\'' + palette.name + '\', ' + _instance.createAjsPaletteJson(palette.colors) + ');';
    };

    // Function to make an exportable json array for themes.
    _instance.createAjsPaletteJson = function (colors) {
        var exportable = _instance.createAjsPaletteJsonObject(colors);
        return angular.toJson(exportable, 2).replace(/"/g, "'");
    };

    _instance.createAjsPaletteJsonObject = function(colors){
        var exportable = {};
        var darkColors = [];
        var lightColors = [];
        angular.forEach(colors, function (value, key) {
            exportable[value.name] = value.hex.replace('#', '');
            if (value.darkContrast) {
                darkColors.push(value.name);
            }else{
                lightColors.push(value.name);
            }
        });
        exportable.contrastDefaultColor = 'light';
        exportable.contrastDarkColors = darkColors;
        exportable.contrastLightColors = lightColors;
        return exportable;
    };

    _instance.calcColors = function(hex,palletename){
      var baseLight = tinycolor('#ffffff');
      var rgb = tinycolor(hex).toRgb();
      rgb.b = Math.floor(rgb.b * rgb.b / 255);
      rgb.g = Math.floor(rgb.g * rgb.g / 255);
      rgb.r = Math.floor(rgb.r * rgb.r / 255);
      var baseDark = tinycolor('rgb ' + rgb.r + ' ' + rgb.g + ' ' + rgb.b);
      var baseTriad = tinycolor(hex).tetrad();
      var palleteColors =  [
        getColorObject(tinycolor.mix(baseLight, hex, 12), '50'),
        getColorObject(tinycolor.mix(baseLight, hex, 30), '100'),
        getColorObject(tinycolor.mix(baseLight, hex, 50), '200'),
        getColorObject(tinycolor.mix(baseLight, hex, 70), '300'),
        getColorObject(tinycolor.mix(baseLight, hex, 85), '400'),
        getColorObject(tinycolor.mix(baseLight, hex, 100), '500'),
        getColorObject(tinycolor.mix(baseDark, hex, 87), '600'),
        getColorObject(tinycolor.mix(baseDark, hex, 70), '700'),
        getColorObject(tinycolor.mix(baseDark, hex, 54), '800'),
        getColorObject(tinycolor.mix(baseDark, hex, 25), '900'),
        getColorObject(tinycolor.mix(baseDark, baseTriad[4], 15).saturate(80).lighten(65), 'A100'),
        getColorObject(tinycolor.mix(baseDark, baseTriad[4], 15).saturate(80).lighten(55), 'A200'),
        getColorObject(tinycolor.mix(baseDark, baseTriad[4], 15).saturate(100).lighten(45), 'A400'),
        getColorObject(tinycolor.mix(baseDark, baseTriad[4], 15).saturate(100).lighten(40), 'A700')
      ];
      $scope.tipoRootController.palettecolors[palletename] = palleteColors;
    }

    _instance.initialiseColors = function() {
      var primaryArray = _.values(_.map($mdTheming.PALETTES.primary, function(value, key) { 
        return { name: key, hex: "#"+value.hex, darkContrast: value.contrast[0] === 0 } 
      }));
      var accentArray = _.values(_.map($mdTheming.PALETTES.accent, function(value, key) { 
        return { name: key, hex: "#"+value.hex, darkContrast: value.contrast[0] === 0 } 
      }));
      $scope.tipoRootController.palettecolors['primary'] = primaryArray;
      $scope.tipoRootController.palettecolors['accent'] = accentArray;
    }
    
    function convertToAngularCode(paletteName){
      var palette = {name: paletteName,colors: $scope.tipoRootController.palettecolors[paletteName]};
      return _instance.createAjsPaletteCode(palette);
    }

    _instance.save = function(tipoForm,mode){
      if (!$scope.tipoRootController.tipo.appearance_settings.material_theme) {
        $scope.tipoRootController.tipo.appearance_settings.material_theme = {};
      };
       $scope.tipoRootController.tipo.appearance_settings.material_theme.primary_ = convertToAngularCode('primary');
       $scope.tipoRootController.tipo.appearance_settings.material_theme.accent = convertToAngularCode('accent');
       $scope.tipoRootController.save(tipoForm,mode);
    }

    _instance.initialiseColors();
  }

  angular.module('tipo.tipoapp')
  .controller('TipoColorController', TipoColorController);

})();