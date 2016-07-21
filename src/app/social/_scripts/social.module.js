(function() {

  'use strict';

  function registerStates($stateProvider) {
   
  }

  function configureModule($stateProvider) {
    registerStates($stateProvider);
  }

  var module = angular.module('tipo.social', []);  

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();