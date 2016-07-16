(function() {

  'use strict';

  function registerStates($stateProvider) {
    var registerUserState = {
      name: 'registerUser',
      url: '/register',
      parent: 'layout',
      views: {
        'content@layout': {
          templateUrl: 'user/_views/registration.tpl.html',
          controller: 'UserController',
          controllerAs: 'userController'
        }
      }
    };

    var confirmRegistrationState = {
      name: 'confirmRegistration',
      url: '/confirmation/{confirmationCode}',
      parent: 'layout',
      views: {
        'content@layout': {
          templateUrl: 'user/_views/confirmation.tpl.html',
          controller: 'UserController',
          controllerAs: 'userController'
        }
      }
    };

    var loginState = {
      name: 'login',
      url: '/login',
      parent: 'layout',
      onEnter: function($rootScope, $state, $stateParams, $mdDialog) {
        console.log($stateParams);
        
        var ev = null; // this should be the $event 
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            targetEvent: ev,
            templateUrl: 'user/_views/login.tpl.html',
            controller: function DialogController($rootScope, $scope, $mdDialog, cognitoService) {
              $scope.submit = function() {
                var promise = cognitoService.authenticate($scope.username, $scope.password); 
                promise.then(function(result) {
                    $mdDialog.hide();
                    var alertDlg = $mdDialog.alert()
                      .title('Login')
                      .content('User ' + $scope.username + ' login successfully')
                      .ok('Close');
                    $mdDialog.show(alertDlg);                   
                }, function (err) {
                    $mdDialog.hide();
                    $window.alert(err);
                });                                          
              };

              $scope.cancel = function() {
                $mdDialog.hide(); 
              };
            }
        }).then(function(answer) {
          $state.go($rootScope.$previousState);
        }, function() {
          $state.go($rootScope.$previousState);
        });
      }
    };

    $stateProvider
      .state(registerUserState)
      .state(loginState)
      .state(confirmRegistrationState);  
  }

  function configureModule($stateProvider) {
    registerStates($stateProvider);
  }

  var module = angular.module('tipo.user', []);
  module.run(function ($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
        $rootScope.$previousState = from;
    });
  });

  module.config(function ($stateProvider) {
    configureModule($stateProvider);
  });

})();