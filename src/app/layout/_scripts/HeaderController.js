(function () {

  'use strict';

  function HeaderController(
    tipoRouter,
    tipoHandle,
    tipoInstanceDataService,
    tipoManipulationService,
    metadataService,
    $mdMedia,
    $state,
    $stateParams,
    $scope,
    $rootScope,
    tipoRegistry) {

    var _instance = this;
    if ($stateParams.hideheader) {
      _instance.hideheader = true;
    };
    _instance.template = metadataService.resolveAppCustomUrls("app_header_template","layout/_views/app-header.tpl.html");

    function addPerspectives(userMeta,homeMeta){
        _instance.perspectives = [{
          name: 'Home',
          icon: 'home',
          disabled: false,
          perspective: 'Home'
        }, {
          name: 'Settings',
          icon: 'settings',
          disabled: false,
          perspective: 'Settings'
        }
      ];
        
        if (homeMeta.application === userMeta.application) {
            _instance.perspectives.push({
                name: 'Profile',
                icon: 'account_box',
                disabled: false,
                perspective: 'ProfilePerspective'
              });
        } else {
            _instance.perspectives.push({
                name: 'Profile',
                icon: 'account_box',
                disabled: false,
                perspective: 'ProfilePerspective'
              });
        }
        
      if ((userMeta.application_owner_account === '2000000001' && homeMeta.application_owner_account === userMeta.account) || metadataService.applicationMetadata.TipoApp.publish_app_as_sample_app )  {
        _instance.perspectives.push({
          name: 'Develop',
          icon: 'build',
          disabled: false,
          perspective: 'TipoApp.' + homeMeta.application
        });
      }
      
      if (homeMeta.application === userMeta.application) {
          _instance.perspectives.push({
              name: 'Log Out',
              icon: 'exit_to_app',
              disabled: false,
              perspective: 'logout'
          });
      } else {
          _instance.perspectives.push({
              name: 'Log Out',
              icon: 'exit_to_app',
              disabled: false,
              perspective: 'logout'
          });
      }
    }

    var userMeta = metadataService.userMetadata;
    var homeMeta = tipoRegistry.get('Home');
    if (!$rootScope.readonly) {
      if (_.isUndefined(homeMeta)) {
      tipoHandle.getTipoDefinition('Home').then(function(definition){
        homeMeta = definition;
        addPerspectives(userMeta,homeMeta);
        });
      }else{
        addPerspectives(userMeta,homeMeta);
      };
    }else{
      _instance.hideheader = true;
      _instance.hidesidemenu = true;
    }

    _instance.reload = function () {
      tipoRouter.reloadCurrent();
    };


  }

  angular.module('tipo.layout')
    .controller('HeaderController', HeaderController);

})();