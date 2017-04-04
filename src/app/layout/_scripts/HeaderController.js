(function () {

  'use strict';

  function HeaderController(
    tipoRouter,
    tipoDefinitionDataService,
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

    function addPerspectives(userMeta,homeMeta){
        _instance.perspectives = [{
          name: 'Home',
          icon: 'home',
          perspective: 'Home'
        }, {
          name: 'Settings',
          icon: 'settings',
          perspective: 'Settings'
        },
        {
          name: 'Profile',
          icon: 'account_box',
          perspective: 'ProfilePerspective'
        }
      ];
      if (homeMeta.application_owner_account === userMeta.account) {
        _instance.perspectives.push({
          name: 'Develop',
          icon: 'build',
          perspective: 'TipoApp.' + homeMeta.application
        });
      };

      _instance.perspectives.push({
          name: 'Log Out',
          icon: 'exit_to_app',
          perspective: 'logout'
      });
    }

    var userMeta = metadataService.userMetadata;
    var homeMeta = tipoRegistry.get('Home');
    if (_.isUndefined(homeMeta)) {
      tipoDefinitionDataService.getOne('Home').then(function(definition){
        homeMeta = definition;
        addPerspectives(userMeta,homeMeta);
      });
    }else{
      addPerspectives(userMeta,homeMeta);
    };

    _instance.reload = function () {
      tipoRouter.reloadCurrent();
    };


  }

  angular.module('tipo.layout')
    .controller('HeaderController', HeaderController);

})();