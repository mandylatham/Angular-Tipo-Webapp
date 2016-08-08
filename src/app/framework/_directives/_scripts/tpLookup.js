(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpLookup', function (
    $timeout,
    $q) {
      return {
        scope: {
          field: '='
        },
        restrict: 'EA',
        replace: true,
        template: '<ng-include src="fieldTemplate" tp-include-replace/>',
        link: function(scope, element, attrs){
          var field = scope.field;
          var isArray = Boolean(field._ui.isArray);
          var fieldTemplate;
          if(isArray){
            fieldTemplate = 'framework/_directives/_views/tp-lookup-multiple.tpl.html';
          }else{
            fieldTemplate = 'framework/_directives/_views/tp-lookup-single.tpl.html';
          }
          scope.fieldTemplate = fieldTemplate;

          scope.master = [
            {key: 'a', value: 'AA'},
            {key: 'b', value: 'BB'},
            {key: 'c', value: 'CC'},
            {key: 'd', value: 'DD'},
            {key: 'e', value: 'EE'},
            {key: 'f', value: 'FF'},
            {key: 'g', value: 'GG'},
            {key: 'h', value: 'HH'}
          ];

          scope.temp = [];

          scope.search = function(text){
            var eligible;
            if(_.isEmpty(text)){
              eligible = scope.master;
            }else{
              eligible = _.filter(scope.master, function(each){
                return _.startsWith(each.value, text);
              });
            }
            var deferred = $q.defer();
            $timeout(function () {
              deferred.resolve(eligible);
            }, Math.random() * 3000, false);
            scope.temp = deferred.promise;
          };
        }
      };
    }
  );

})();
