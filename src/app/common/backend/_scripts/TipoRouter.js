(function() {

  'use strict';

  // Tipo router. Contains common functions for state traversal, reload, etc.
  function TipoRouter(
    $rootScope,
    $state,
    $stateParams) {

    function reloadCurrentState(){
      var currentStateParameters = $stateParams;
      var reloadFlagParameters = _.keys(_.pick(currentStateParameters, function(value, key){
        return _.startsWith(key, 'reload');
      }));
      reloadFlagParameters = _.zipObject(reloadFlagParameters, _.fill(_.cloneDeep(reloadFlagParameters), true));
      return $state.go($state.current, reloadFlagParameters, {reload: true});
    }

    function transitionToState(state, reload, queryParameters){
      var stateOptions = angular.isDefined(reload) ? {reload: reload} : {};
      stateOptions.inherit = false;
      return $state.go(state, queryParameters, stateOptions);
    }

    function transitionToParent(reload){
      var stateOptions = angular.isDefined(reload) ? {reload: reload} : {};
      return $state.go('^', undefined, stateOptions);
    }

    function getCurrentState(){
      return $state.current;
    }

    return {
      reloadCurrentState: reloadCurrentState,
      transitionToState: transitionToState,
      transitionToParent: transitionToParent,
      getCurrentState: getCurrentState
    };

  }

  angular.module('tipo.common')
    .factory('tipoRouter', TipoRouter);

})();