(function() {

  'use strict';

  function MainController(
    applicationMetadata,
    tipoRouter,
    cognitoService,
    $state,
    $mdSidenav,
    $rootScope,
    $mdDialog) {

    var _instance = this;

    $rootScope.applicationMetadata = applicationMetadata;

    var perspectives;

    this.showNavigation = function(){
      $mdSidenav('left').open();
    };

    this.toPerspective = function(name) {
      //tipoRouter.to(perspectives[name].root);
      var params;
      if(name === 'settings'){
        params = {perspective: name};
      }
      tipoRouter.to('dashboard', 'layout', params, false);
    };

    _instance.signOut = function(){
      tipoRouter.to('login');
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