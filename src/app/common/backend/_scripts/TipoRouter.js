(function() {

  'use strict';

  // Tipo router. Contains common functions for state traversal, reload, etc.
  function TipoRouter(
    $rootScope,
    $state,
    $stateParams) {

    var _stateChanging = false;

    var _stickyState = {};

    function isStateChanging(){
      return _stateChanging;
    }

    function startStateChange(){
      _stateChanging = true;
    }

    function endStateChange(){
      _stateChanging = false;
    }

    function getCurrent(){
      return $state.current;
    }

    function reloadCurrent(){
      var currentStateParameters = $stateParams;
      var reloadFlagParameters = _.keys(_.pick(currentStateParameters, function(value, key){
        return _.startsWith(key, 'reload');
      }));
      reloadFlagParameters = _.zipObject(reloadFlagParameters, _.fill(_.cloneDeep(reloadFlagParameters), true));
      return $state.go($state.current, reloadFlagParameters, {reload: true});
    }

    function to(state, reload, parameters, inherit){
      var stateOptions = angular.isDefined(reload) ? {reload: reload} : {reload: state};
      stateOptions.inherit = Boolean(inherit);
      return $state.go(state, parameters, stateOptions);
    }

    function toParent(reload){
      var stateOptions = angular.isDefined(reload) ? {reload: reload} : {};
      return $state.go('^', undefined, stateOptions);
    }

    function toTipoList(tipoName, parameters){
      var stateOptions = {reload: 'tipoList'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      stateOptions.inherit = false;
      return $state.go('tipoList', parameters, stateOptions);
    }

    function toTipoCreate(tipoName, parameters){
      var stateOptions = {reload: 'tipoCreate'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      stateOptions.inherit = false;
      return $state.go('tipoCreate', parameters, stateOptions);
    }

    function toTipoView(tipoName, tipoId, parameters){
      var stateOptions = {reload: 'tipoView'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      parameters.tipo_id = tipoId;
      stateOptions.inherit = false;
      return $state.go('tipoView', parameters, stateOptions);
    }

    function toTipoEdit(tipoName, tipoId, parameters){
      var stateOptions = {reload: 'tipoEdit'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      parameters.tipo_id = tipoId;
      stateOptions.inherit = false;
      return $state.go('tipoEdit', parameters, stateOptions);
    }

    function toSettingsView(tipoName, parameters){
      var stateOptions = {reload: 'settingsView'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      stateOptions.inherit = false;
      return $state.go('settingsView', parameters, stateOptions);
    }

    function toSettingsEdit(tipoName, parameters){
      var stateOptions = {reload: 'settingsEdit'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      stateOptions.inherit = false;
      return $state.go('settingsEdit', parameters, stateOptions);
    }

    function recordSticky(){
      _stickyState.name = getCurrent().name;
      _stickyState.params = angular.copy($state.params);
    }

    function toStickyAndReset(){
      to(_stickyState.name, true, _stickyState.params, false);
      _stickyState = {};
    }

    function stickyExists(){
      return !_.isEmpty(_stickyState);
    }

    function toRegisterUser(parameters){
      var stateOptions = {reload: 'registerUser'};
      parameters = parameters || {};
      stateOptions.inherit = false;
      return $state.go('registerUser', parameters, stateOptions);
    }

    return {
      isStateChanging: isStateChanging,
      startStateChange: startStateChange,
      endStateChange: endStateChange,
      getCurrent: getCurrent,
      reloadCurrent: reloadCurrent,
      to: to,
      toParent: toParent,
      toTipoList: toTipoList,
      toTipoCreate: toTipoCreate,
      toTipoView: toTipoView,
      toTipoEdit: toTipoEdit,
      toSettingsView: toSettingsView,
      toSettingsEdit: toSettingsEdit,
      recordSticky: recordSticky,
      toStickyAndReset: toStickyAndReset,
      stickyExists: stickyExists,
      toRegisterUser: toRegisterUser
    };

  }

  angular.module('tipo.common')
    .factory('tipoRouter', TipoRouter);

})();