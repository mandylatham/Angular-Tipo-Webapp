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
    $rootScope) {

    var _instance = this;

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

    var userMeta = metadataService.userMetadata;
    if (userMeta.application_owner_account === userMeta.account) {
      _instance.perspectives.push({
        name: 'Develop',
        icon: 'edit',
        perspective: 'Develop'
      });
    };

    _instance.reload = function () {
      tipoRouter.reloadCurrent();
    };


  }

  angular.module('tipo.layout')
    .controller('HeaderController', HeaderController);

})();