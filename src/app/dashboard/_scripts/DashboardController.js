(function() {

  'use strict';
   
  function DashboardController(
    $scope,
    $location,
    cognitoService) {
        

    function verifyConfirmationCode() {
      var params = $location.search();
      if (params.code) {
        cognitoService.verifyCode(params.code).then(function() {
            $scope.title = 'Email has been confirmed';
        }, function(err) {
            console.error(err);
        });
        return;
      }
      $scope.title = 'Dashboard';
    }

    return {
      verifyConfirmationCode: verifyConfirmationCode
    };
  }
  angular.module('tipo.dashboard')
  .controller('DashboardController', DashboardController);

})();