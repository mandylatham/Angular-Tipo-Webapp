// (function() {

//   'use strict';

//   function TipoAppController(
//     tipoRouter,
//     metadataService,
//     $window,
//     $scope,
//     tipoCache) {

//     var _instance = this;

//     var tipo_name = $scope.tipoRootController.tipo_name;
//     // var hooks = $scope.tipoRootController.hooks;

//     // hooks.postFinish = function() {
//     //   tipoCache.evict(tipo_name);
//     //   tipoRouter.toTipoList(tipo_name);
//     //   return true;
//     // }

//     function addLogotoData(tipos){
//       _.each(tipos, function(each, index){
//         var logo;
//         if(each.app_name === 'Tipo App'){
//           logo = 'tipoapp';
//         } else if(index < 7){
//           logo = index + 1;
//         }else{
//           logo = 'no-image';
//         }
//         each.logo = logo + '.png';
//       });
//       _instance.tipos = tipos;
//     }
//     addLogotoData($scope.tipoRootController.tipos);

//     _instance.toEdit = function(tipo_id){
//       tipoRouter.toTipoEdit(tipo_name, tipo_id);
//     };

//     _instance.delete = function(tipo_id){
//       $scope.tipoRootController.delete(tipo_id);
//     };

//     _instance.launch = function(tipo){
//       $window.open(tipo.app_url, '_blank');
//     };

//     $scope.$watch(function(){ return $scope.tipoRootController.tipos;}, function(){
//       addLogotoData($scope.tipoRootController.tipos);
//     })

//   }

//   angular.module('tipo.tipoapp')
//   .controller('TipoAppController', TipoAppController);

// })();