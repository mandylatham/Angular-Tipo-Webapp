(function() {

  'use strict';

  function ChangePasswordController($scope) {

    var _instance = this;

    var hooks = $scope.tipoRootController.hooks;
    var data = $scope.tipoRootController.data;

    hooks.preFinish = function(){
      data.accessToken = 'xxxxxxxxxxxx';
    }

  }

  angular.module('tipo.tipoapp')
  .controller('ChangePasswordController', ChangePasswordController);

})();