(function() {

  'use strict';

  function MainController(
    tipoRouter,
    cognitoService,
    $mdSidenav,
    $state,
    $rootScope,
    $mdDialog,
    $window
    ) {

    var _instance = this;
    console.warn('Bootstrapping the main controller. This should happen only once');

    this.showNavigation = function(){
      $mdSidenav('left').open();
    };

    this.showLoginForm = function($event) {
       var parentEl = angular.element(document.body);
       $mdDialog.show({
          parent: parentEl,
          targetEvent: $event,
          templateUrl: 'user/_views/login.tpl.html',
          controller: function DialogController($scope, $mdDialog) {
            $scope.submit = function() {
              var promise = cognitoService.authenticate($scope.username, $scope.password); 
              promise.then(function(result) {
                  $mdDialog.hide();
                  var alertDlg = $mdDialog.alert()
                    .title('Login')
                    .content('User ' + $scope.username + ' login successfully')
                    .ok('Close');
                  $mdDialog.show(alertDlg);  
              }, function (err) {
                  $mdDialog.hide();
                  $window.alert(err);   
              });               
            };

            $scope.cancel = function() {
              $mdDialog.hide();
            };
          }
      });      
    };      

    this.signUp = function(){
      $state.go('registerUser');      
    };

    this.signOut = function(){
      cognitoService.signOut();      
    };

    this.isSignedIn = function(){
       return cognitoService.isCurrentUserSigned();     
    };

    // Register state change interactions for visual transition cues
    $rootScope.$on('$stateChangeStart', function() {
      tipoRouter.startStateChange();
    });
 
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
      tipoRouter.endStateChange();
      $state.previous = fromState;
    });
    
    $rootScope.$on('$stateChangeError', function() {
      tipoRouter.endStateChange();
    });

    _instance.routing = {
      isStateChanging: tipoRouter.isStateChanging,
      reloadCurrent: tipoRouter.reloadCurrent
    };
  }

  angular.module('tipo.main')
  .controller('MainController', MainController);

})();