(function() {

  'use strict';

  function MainController(
    tipoRouter,
    cognitoService,
    googleService,
    $mdSidenav,
    $state,
    $rootScope,
    $mdDialog,
    $window
    ) {

    var _instance = this;
    console.warn('Bootstrapping the main controller. This should happen only once');

    var perspectives;

    this.showNavigation = function(){
      $mdSidenav('left').open();
    };

    this.toPerspective = function(name) {
      tipoRouter.to(perspectives[name].root);
    };

    this.showLoginForm = function($event) {
      tipoRouter.to('login');
    };

    this.signUp = function(){
      $state.go('registerUser');
    };

    this.signOut = function(){
      if (cognitoService.signOut() === true) {
        $state.go('login');
        return;
      }
      googleService.signOut();
    };

    this.isSignedIn = function(){
      return cognitoService.isCurrentUserSigned() === true || googleService.isSignedIn() === true;
    };

    // Register state change interactions for visual transition cues
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
      tipoRouter.startStateChange();
    });
 
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
      tipoRouter.endStateChange();
      $state.previous = fromState;
    });
    
    $rootScope.$on('$stateChangeError', function() {
      tipoRouter.endStateChange();
    });

    $rootScope.$on('userLoggedInEvent', function(event) {
      perspectives = $rootScope.perspectives;
    });

    _instance.routing = {
      isStateChanging: tipoRouter.isStateChanging,
      reloadCurrent: tipoRouter.reloadCurrent
    };
  }

  angular.module('tipo.main')
  .controller('MainController', MainController);

})();