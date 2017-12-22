(function() {

  'use strict';

  function ChangePasswordController($scope, $mdToast, securityContextService) {

    var _instance = this;
    _instance.data = {};

    var hooks = $scope.tipoRootController.hooks;

    _instance.showError = function (error) {
      var toast = $mdToast.tpErrorToast();
      toast._options.locals = {
          header: 'ERROR',
          body: error
      };
      $mdToast.show(toast);
    }

    hooks.preFinish = function() {
      if (!_instance.data.oldPassword) {
        var errorMsg = { data : { message : "Enter old password" }};
        _instance.showError(errorMsg);
        return false;
      }
      if (!_instance.data.newPassword) {
        var errorMsg = { data : { message : "Enter new password" }};
        _instance.showError(errorMsg);
        return false;
      }
      if (!_instance.data.renterPassword) {
        var errorMsg = { data : { message : "ReEnter new password" }};
        _instance.showError(errorMsg);
        return false;
      }
      if(_instance.data.newPassword !== _instance.data.renterPassword) {
        var errorMsg = { data : { message : "Password did not match" }};
        _instance.showError(errorMsg);
        return false;
      }
      $scope.tipoRootController.data = {
        accessToken: securityContextService.getCurrentAccessToken(),
        oldPassword: _instance.data.oldPassword,
        newPassword: _instance.data.newPassword,
        username: securityContextService.getCurrentUser()
      };
      return true;
    }
  }

  angular.module('tipo.tipoapp')
  .controller('ChangePasswordController', ChangePasswordController);

})();