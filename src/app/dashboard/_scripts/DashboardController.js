(function() {

  'use strict';
   
  function DashboardController(
    $scope,
    $location,
    $mdToast,
    cognitoService) {

    var _instance = this;

    _instance.verifyConfirmationCode = function(){
      $scope.title = 'Dashboard';
      var params = $location.search();
      if (params.code) {
        cognitoService.verifyCode(params.code).then(function() {
          _instance.toast = {
            header: 'Email confirmation',
            body: 'Your email address is confirmed successfully.'
          };
        }, function(err) {
          console.error(err);
        });
      }
    };

    $scope.$watch(function() {
      return _instance.toast;
    }, function(newValue, oldValue) {
      if(newValue){
        var toast = $mdToast.tpToast();
        toast._options.locals = newValue;
        $mdToast.show(toast);
      }
    });

  }
  angular.module('tipo.dashboard')
  .controller('DashboardController', DashboardController);

})();