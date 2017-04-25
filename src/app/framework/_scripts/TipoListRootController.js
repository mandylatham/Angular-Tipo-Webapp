(function() {

  'use strict';

  function TipoListRootController(
    tipoDefinition,
    tipoFilters,
    tipos,
    tipoManipulationService,
    tipoInstanceDataService,
    tipoRouter,
    tipoRegistry,
    tipoCache,
    $state,
    $stateParams,
    $mdToast,
    $mdDialog,
    $window,
    $rootScope,
    $scope) {

    var _instance = this;
    _instance.tipoDefinition = tipoDefinition;
    _instance.tipoFilters = tipoFilters;
    _instance.tipos = tipos;
    _instance.busy = false;
    _instance.loading = false;
    var page = 2;
    var per_page = 10;
    var tipo_perm = tipoRegistry.get($stateParams.tipo_name + '_resdata');
    _instance.perm = tipo_perm.perm;

    var tipo_name = tipoDefinition.tipo_meta.tipo_name;

    _instance.tiposWithDefinition = tipoManipulationService.mergeDefinitionAndDataArray(tipoDefinition,tipos);
    _instance.bulkedit = false;

    _instance.hasTipos = tipos.length > 0;

    if ($stateParams.tab_url) {
      var resData = tipoRegistry.get($stateParams.tab_url);
      var confirm = $mdDialog.show({
          clickOutsideToClose: true,
          $scope: $scope,
          template: '<md-dialog class="md-padding">' +
                    '  <md-dialog-content class="md-padding">' +
                     $stateParams.message +
                    '  </md-dialog-content>' +
                    '<md-dialog-actions layout="row">' + 
                    '<md-button href="' + $stateParams.tab_url +
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
    }else{
      if ($stateParams.message) {
        var toast = $mdToast.tpToast();
        toast._options.locals = {
          header: 'Action successfully completed',
          body: $stateParams.message
        };
        $mdToast.show(toast);
      };
    };

    function getPerspective(filter){
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      // TODO: Hack - Sushil as this is supposed to work only for applications
      if (!_.isEmpty(_instance.searchText)) {
          filter.tipo_filter = "(_all:(" + _instance.searchText + "*))";
      };
      if (perspectiveMetadata.tipoName) {
        if (perspectiveMetadata.tipoName !== tipoDefinition.tipo_meta.tipo_name && perspectiveMetadata.tipoFilter) {
          if (filter.tipo_filter) {
            filter.tipo_filter += " AND " + perspectiveMetadata.tipoFilter;
          }else{
            filter.tipo_filter = perspectiveMetadata.tipoFilter;
          }
        } 
      }

      if ($stateParams.filter) {
        if (filter.tipo_filter) {
          filter.tipo_filter += " AND " + tipoManipulationService.expandFilterExpression(tipoFilters.currentExpression);
        } else {
          filter.tipo_filter = tipoManipulationService.expandFilterExpression(tipoFilters.currentExpression);
        }
      }
    }

    _instance.createNew = function(){
      var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
      if(perspectiveMetadata.fieldName){
        var data = {};
        data[perspectiveMetadata.fieldName] = perspectiveMetadata.tipoId;
        data = encodeURIComponent(angular.toJson(data));
        tipoRouter.toTipoCreate(tipo_name, {data: data});
      }else{
        tipoRouter.toTipoCreate(tipo_name);
      }
    };

    _instance.toDetail = function(id){
      tipoRouter.toTipoView(tipo_name, id);
    };

    _instance.clone = function(id){
      tipoRouter.toTipoCreate(tipo_name, {copyFrom: id});
    };

    _instance.selectTipo = function(tipo,event){
      tipo.selected = !tipo.selected;
      if (_instance.bulkedit) {
        event.stopPropagation();
      }
    }

    _instance.delete = function(tipo_id){
      var confirmation = $mdDialog.confirm()
          .title('Delete Confirmation')
          .textContent('Are you sure that you want to delete ' + tipo_name + ' ' + tipo_id + '?')
          .ariaLabel('Delete Confirmation')
          .ok('Yes')
          .cancel('No');
      $mdDialog.show(confirmation).then(function(){
        tipoRouter.startStateChange();
        // handle application perspective
        var filter = {};
        var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
        if(perspectiveMetadata.fieldName === 'application'){
          filter.tipo_filter = perspectiveMetadata.tipoFilter;
        }
        // ends here
        tipoInstanceDataService.deleteOne(tipo_name, tipo_id, filter).then(function(){
          tipoRouter.toTipoList(tipo_name);
        });
      });
    };

    _instance.refresh = function(){
      var filter = {};
      tipoRouter.startStateChange();
      getPerspective(filter);
      tipoCache.evict($stateParams.tipo_name);
      tipoInstanceDataService.search($stateParams.tipo_name, filter).then(function(tiposData){
        _instance.tipos = tiposData;
        tipoRouter.endStateChange();
      });
    }

    _instance.nextPage = function(){
      if (_instance.busy) {return;}
      _instance.busy = true;
      _instance.loading = true;
      var filter = {};
      getPerspective(filter);
      filter.page = angular.copy(page);
      filter.per_page = per_page;
      tipoRouter.startStateChange();
      tipoInstanceDataService.search($stateParams.tipo_name, filter).then(function(tiposData){
        if (!_.isEmpty(tiposData)) {
          _instance.tipos = _.union(_instance.tipos,tiposData);
          _instance.busy = false;
          page++;
        };
        _instance.loading = false;
        tipoRouter.endStateChange();
      });
    }

    _instance.search = function(){
      var filter = {};
      getPerspective(filter);
      page = 1;
      filter.page = angular.copy(page);
      filter.per_page = per_page;
      tipoRouter.startStateChange();
      tipoCache.evict($stateParams.tipo_name);
      tipoInstanceDataService.search($stateParams.tipo_name, filter).then(function(tiposData){
        _instance.tipos = tiposData;
        page++;
        _instance.busy = false;
        tipoRouter.endStateChange();
      });
    }

    
  }

  angular.module('tipo.framework')
  .controller('TipoListRootController', TipoListRootController);

})();