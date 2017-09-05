(function() {

  'use strict';
  
  /** Developer can create as many controllers required for all the templates. However, they must be bundled in a single JS file. */

  function MyTemplateController(
	tipoHandle,
    $window,
    $scope) {

    var _instance = this;
    /** In case of detail/edit/create pages, the tipo object that contains the data from server. */
    var tipo = $scope.tipoRootController.tipo;

    /** In case of list view, the tipos array contains the data from server. */
    var tipos = $scope.tipoRootController.tipos;

    // Your business logic.

  }

  angular.module('tipo.tipoapp')
  .controller('MyTemplateController', MyTemplateController);

})();