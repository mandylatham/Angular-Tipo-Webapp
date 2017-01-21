(function() {

  'use strict';

  function TipoAppController(
    tipoRouter,
    $window,
    $scope) {

    var _instance = this;

    var tipo_name = $scope.tipoRootController.tipoDefinition.tipo_meta.tipo_name;

    var tipos = angular.copy($scope.tipoRootController.tipos);

    _.each(tipos, function(each, index){
      var logo;
      if(each.app_name === 'Tipo App'){
        logo = 'tipoapp';
      } else if(index < 7){
        logo = index + 1;
      }else{
        logo = 'no-image';
      }
      each.logo = logo + '.png';
    });

    _instance.tipos = tipos;

    _instance.toEdit = function(tipo_id){
      tipoRouter.toTipoEdit(tipo_name, tipo_id);
    };

    _instance.launch = function(tipo){
      $window.open(tipo.app_url, '_blank');
    };

  }

  angular.module('tipo.tipoapp')
  .controller('TipoAppController', TipoAppController);

})();