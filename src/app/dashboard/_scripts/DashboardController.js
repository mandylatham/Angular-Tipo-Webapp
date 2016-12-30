(function() {

  'use strict';
   
  function DashboardController(
    $scope,
    $location,
    cognitoService) {

    var _instance = this;

    _instance.verifyConfirmationCode = function(){
      var params = $location.search();
      if (params.code) {
        cognitoService.verifyCode(params.code).then(function() {
          $scope.title = 'Email has been confirmed';
        }, function(err) {
          console.error(err);
          $scope.title = 'Dashboard';
        });
        return;
      }
      $scope.title = 'Dashboard';
    };

  }
  angular.module('tipo.dashboard')
  .controller('DashboardController', DashboardController);

})();