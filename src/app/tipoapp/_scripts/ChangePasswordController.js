// (function() {

//   'use strict';

//   function ChangePasswordController($scope, securityContextService) {

//     var _instance = this;
//     _instance.data = {};

//     var hooks = $scope.tipoRootController.hooks;

//     hooks.preFinish = function() {
//       $scope.tipoRootController.data = {
//         accessToken: securityContextService.getCurrentAccessToken(),
//         oldPassword: _instance.data.oldPassword,
//         newPassword: _instance.data.newPassword,
//         username: securityContextService.getCurrentUser()
//       };
//       return true;
//     }
//   }

//   angular.module('tipo.tipoapp')
//   .controller('ChangePasswordController', ChangePasswordController);

// })();