(function() {

  'use strict';

  function MainController(
    applicationMetadata,
    tipoRouter,
    tipoCache,
    tipoCustomJavascript,
    $state,
    $mdSidenav,
    $rootScope,
    $mdDialog,
    $scope,
    cognitoService) {

    var _instance = this;

    // $rootScope.applicationMetadata = applicationMetadata;
    $scope.htmlStyle = "width: 500px;";
    var perspectives;

    _instance.logo = "g/public/assets/images/logo.png?version_stamp=" + $rootScope.version_stamp;

    _instance.toogleNavigation = function(){
      $mdSidenav('left').toggle();
    };

    _instance.toPerspective = function(name) {
      var params;
      $rootScope.currentPerspective = name;
      if (name !== 'logout') {
        if(name !== 'home'){
          params = {perspective: name};
        }

        if (!S(name).contains('TipoApp')) {
        tipoRouter.to('dashboard', 'layout', params, false);
        }else{
          var tipoParams = name.split('.');
          tipoRouter.toTipoView(tipoParams[0],tipoParams[1],params);
        }
      }else{
        _instance.signOut();
      }
    };

    _instance.signOut = function(){
      var function_name = applicationMetadata.TipoApp.application_name + "_Logout";
        if (typeof tipoCustomJavascript[function_name] === 'function') {
            tipoCustomJavascript[function_name]();
        }
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

    document.addEventListener("mouseleave", function(e){
      if( e.clientY < 0 )
      {
        var function_name = applicationMetadata.TipoApp.application_name + "_ExistApp";
        if (typeof tipoCustomJavascript[function_name] === 'function') {
            tipoCustomJavascript[function_name]();
        }
      }
    }, false);
  }

  angular.module('tipo.main')
  .controller('MainController', MainController);

})();