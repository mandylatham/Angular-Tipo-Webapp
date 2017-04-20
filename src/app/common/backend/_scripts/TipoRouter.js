(function() {

  'use strict';

  // Tipo router. Contains common functions for state traversal, reload, etc.
  function TipoRouter(
    tipoManipulationService,
    $rootScope,
    $state,
    $stateParams,
    ngProgressFactory,
    $mdColors, 
    $mdColorUtil,
    $mdDialog,
    $mdToast,
    $location) {

    var _stateChanging = false;

    var _stickyState = {};
    $rootScope.progressbar = ngProgressFactory.createInstance();
    $rootScope.progressbar.setColor($mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-50')));
    // $rootScope.progressbar.setColor('#FFF');
    $rootScope.progressbar.setHeight('3px');

    function isStateChanging(){
      return _stateChanging;
    }

    function startStateChange(){
      // _stateChanging = true;
      $rootScope.progressbar.start();
    }

    function endStateChange(){
      // _stateChanging = false;
      $rootScope.progressbar.complete();
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
      return $state.go($state.current, reloadFlagParameters, {reload: $state.current});
    }

    function setPerspectiveIfRequired(parameters){
      parameters = parameters || {};
      if(!parameters.perspective && $stateParams.perspective){
        parameters.perspective = $stateParams.perspective;
      }
    }

    function to(state, reload, parameters, inherit){
      var stateOptions = angular.isDefined(reload) ? {reload: reload} : {reload: state};
      stateOptions.inherit = Boolean(inherit);
      setPerspectiveIfRequired(parameters);
      return $state.go(state, parameters, stateOptions);
    }

    function toParent(reload){
      var stateOptions = angular.isDefined(reload) ? {reload: reload} : {};
      return $state.go('^', undefined, stateOptions);
    }

    function toTipoList(tipoName, parameters, resetPerspective){
      var stateOptions = {reload: 'tipoList'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      if(perspectiveMetadata.tipoName){
        if(resetPerspective){
          parameters.perspective = undefined;
        }else{
          parameters.perspective = perspectiveMetadata.perspective;
        }
      }
      stateOptions.inherit = false;
      setPerspectiveIfRequired(parameters);
      return $state.go('tipoList', parameters, stateOptions);
    }

    function toTipoCreate(tipoName, parameters){
      var stateOptions = {reload: 'tipoCreate'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      if(perspectiveMetadata.tipoName){
        parameters.perspective = perspectiveMetadata.perspective;
      }
      stateOptions.inherit = false;
      setPerspectiveIfRequired(parameters);
      return $state.go('tipoCreate', parameters, stateOptions);
    }

    function toTipoView(tipoName, tipoId, parameters){
      var stateOptions = {reload: 'tipoView'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      parameters.tipo_id = tipoId;
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      if(perspectiveMetadata.tipoName){
        parameters.perspective = perspectiveMetadata.perspective;
      }
      stateOptions.inherit = false;
      setPerspectiveIfRequired(parameters);
      return $state.go('tipoView', parameters, stateOptions);
    }

    function toTipoEdit(tipoName, tipoId, parameters){
      var stateOptions = {reload: 'tipoEdit'};
      parameters = parameters || {};
      parameters.tipo_name = tipoName;
      parameters.tipo_id = tipoId;
      stateOptions.inherit = true;
      setPerspectiveIfRequired(parameters);
      return $state.go('tipoEdit', parameters, stateOptions);
    }

    function openTabPopup (url, tipo_name , message) {
      var confirm = $mdDialog.show({
          clickOutsideToClose: true,
          template: '<md-dialog class="md-padding">' +
                    '  <md-dialog-content class="md-padding">' +
                     message +
                    '  </md-dialog-content>' +
                    '<md-dialog-actions layout="row">' + 
                    '<md-button href="' + url +
                    '" target="_blank" ng-click="closeDialog()" md-autofocus>' +
                    'OK' +
                    '</md-button>' + 
                    '</md-dialog-actions>' + 
                    '</md-dialog>',
           controller: function DialogController($scope, $mdDialog) {
               $scope.closeDialog = function() {
                  $mdDialog.hide();
               }
            }
        });
    }

    function openMessageToast(message){
      var toast = $mdToast.tpToast();
      toast._options.locals = {
        header: 'Action successfully completed',
        body: $stateParams.message
      };
      $mdToast.show(toast);
    }

    function toTipoResponse (resData,tipo_name,tipo_id,parameters) {
      if(!_.isEmpty(resData.return_url) || !_.isUndefined(resData.return_url)){
          if (!S(resData.return_url).contains('?')) {
            var return_url = resData.return_url + '?';
          }else{
            var return_url = resData.return_url + '&';
          }
          if (!_.isEmpty(resData.message) || !_.isUndefined(resData.message)) {
            return_url = return_url + 'message=' + resData.message + '&';
          };
          if(!_.isEmpty(resData.tab_url) || !_.isUndefined(resData.tab_url)){
            if (S(resData.tab_url).contains('#')) {
              resData.tab_url = resData.tab_url.replace(/\#/,'%23');
            };
            return_url = return_url + 'tab_url=' + resData.tab_url;
          };
          $location.url(return_url);
        }else{
          if (!_.isEmpty(resData.tab_url) || !_.isUndefined(resData.tab_url)){
            openTabPopup(resData.tab_url,tipo_name,resData.message);
          }else{
            if (!parameters) {
              var parameters = {};
            };
            parameters.message = resData.message;
            if (!_.isEmpty(tipo_name) || !_.isUndefined(tipo_name)){
              toTipoView(tipo_name, tipo_id, parameters);
            }
            if (!_.isEmpty(resData.message) || !_.isUndefined(resData.message)){
              openMessageToast(resData.message);
            }
          }
        }
    }

    function recordSticky(){
      _stickyState.name = getCurrent().name;
      var parent = getCurrent().parent.name;
      if(parent !== 'layout'){
        _stickyState.reloadFrom = parent;
      }else{
        _stickyState.reloadFrom = _stickyState.name;
      }
      _stickyState.params = angular.copy($state.params);
    }

    function toStickyAndReset(){
      to(_stickyState.name, _stickyState.reloadFrom, _stickyState.params, false).then(function(){
        _stickyState = {};
      });
    }

    function stickyExists(){
      return !_.isEmpty(_stickyState);
    }

    function toMenuItem(menuItem){
      if(menuItem.state){
        return to(menuItem.state, menuItem.state);
      }else if(menuItem.tipo_name){
        var parameters = {};
        if(menuItem.perspective){
          parameters = {
            perspective: menuItem.perspective
          };
        }
        if(menuItem.isSingleton){
          return toTipoView(menuItem.tipo_name, 'default', parameters);
        }else{
          if(menuItem.quickFilters){
            parameters.filter = menuItem.quickFilters;
          }
          return toTipoList(menuItem.tipo_name, parameters);
        }
      }
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
      toTipoResponse: toTipoResponse,
      recordSticky: recordSticky,
      toStickyAndReset: toStickyAndReset,
      stickyExists: stickyExists,
      toRegisterUser: toRegisterUser,
      toMenuItem: toMenuItem
    };

  }

  angular.module('tipo.common')
    .factory('tipoRouter', TipoRouter);

})();