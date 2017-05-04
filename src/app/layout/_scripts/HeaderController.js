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
          disable: false,
          perspective: 'Home'
        }, {
          name: 'Settings',
          icon: 'settings',
          disable: false,
          perspective: 'Settings'
        }
      ];
        
        if (homeMeta.application === userMeta.application) {
            _instance.perspectives.push({
                name: 'Profile',
                icon: 'account_box',
                disable: false,
                perspective: 'ProfilePerspective'
              });
        } else {
            _instance.perspectives.push({
                name: 'Profile',
                icon: 'account_box',
                disable: true,
                perspective: 'ProfilePerspective'
              });
        }
        
      if (homeMeta.application_owner_account === userMeta.account ) {
        _instance.perspectives.push({
          name: 'Develop',
          icon: 'build',
          disable: false,
          perspective: 'TipoApp.' + homeMeta.application
        });
      }
      
      if (homeMeta.application === userMeta.application) {
          _instance.perspectives.push({
              name: 'Log Out',
              icon: 'exit_to_app',
              disable: false,
              perspective: 'logout'
          });
      } else {
          _instance.perspectives.push({
              name: 'Log Out',
              icon: 'exit_to_app',
              disable: true,
              perspective: 'logout'
          });
      }
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