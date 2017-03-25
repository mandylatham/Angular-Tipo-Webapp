(function() {

  'use strict';

  function MainController(
    applicationMetadata,
    tipoRouter,
    tipoCache,
    $state,
    $mdSidenav,
    $rootScope,
    $mdDialog,
    cognitoService) {

    var _instance = this;

    $rootScope.applicationMetadata = applicationMetadata;

    var perspectives;

    _instance.showNavigation = function(){
      $mdSidenav('left').open();
    };

    _instance.toPerspective = function(name) {
      var params;
      if (name!='Develop') {
      if(name !== 'home'){
        params = {perspective: name};
      }
      tipoRouter.to('dashboard', 'layout', params, false);
      }else{
      tipoRouter.toTipoView("TipoApp",applicationMetadata.application);
      }
    };

    _instance.signOut = function(){
      cognitoService.signOut();
      delete $rootScope.$previousState;
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

    _instance.printCache = function(){
      var cache = tipoCache.getDefault();
      console.log('CACHE KEYS', angular.toJson(cache.keySet()));
    };
  }

  angular.module('tipo.main')
  .controller('MainController', MainController);

})();