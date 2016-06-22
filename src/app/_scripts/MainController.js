(function() {

  'use strict';

  function MainController($mdSidenav) {
    
    var _instance = this;

    this.showNavigation = function(){
      $mdSidenav('left').open();
    };
  }

  angular.module('tipo.main')
  .controller('MainController', MainController);

})();