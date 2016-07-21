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

    this.showNavigation = function(){
      $mdSidenav('left').open();
    };

    this.showLoginForm = function($event) {
       $state.go('login');
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

    this.isGoogleSignedIn = function(){
      return googleService.isSignedIn();     
    };

    this.googleSignOut = function () {      
      googleService.signOut();
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