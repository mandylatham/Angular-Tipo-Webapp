(function () {

  'use strict';

  function DashboardController(
    cognitoService,
    menu,
    tipoRouter,
    $location,
    $mdToast,
    $rootScope,
    $scope) {

    var _instance = this;

    function showToast(toast) {
      var tpToast = $mdToast.tpToast();
      tpToast._options.locals = toast;
      $mdToast.show(tpToast);
    }

    function verifyConfirmationCode() {
      var params = $location.search();
      if (params.code) {
        cognitoService.verifyCode(params.code).then(function () {
          showToast({
            header: 'Email confirmation',
            body: 'Your email address is confirmed successfully.'
          });
        }, function (err) {
          showToast({
            header: 'Email confirmation',
            body: 'The confirmation code is expired. Please request a new code.'
          });
        });
      }
    };

    verifyConfirmationCode();

    tipoRouter.toMenuItem(menu[0]);

  }
  angular.module('tipo.dashboard')
    .controller('DashboardController', DashboardController);

})();