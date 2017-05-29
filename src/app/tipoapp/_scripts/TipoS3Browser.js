(function() {

  'use strict';

  function TipoS3Browser(
    $scope,
    tipoHandle) {

    var _instance = this;

    
    function resolveFolderpath(){
    var folder_path = $scope.tipoRootController.tipos[0].is_folder ?  _.replace($scope.tipoRootController.tipos[0].fq_filename,$scope.tipoRootController.tipos[0].filename + "/","") : _.replace($scope.tipoRootController.tipos[0].fq_filename,$scope.tipoRootController.tipos[0].filename,"") 
    _instance.folder_path = folder_path.substring(0,folder_path.length-1).split("/");
    }

    _instance.goto = function(folder,index){
      var pathArray = _.dropRight(_instance.folder_path,_instance.folder_path.length - index);
      var folder_path = _.join(pathArray,"/")
      var queryparams = $scope.tipoRootController.queryparams;
      var tipo_name = $scope.tipoRootController.tipo_name;
      queryparams.fq_folder = folder_path + "/"
      tipoHandle.getTipos(tipo_name,queryparams).then(function(response){
        $scope.tipoRootController.tipos = response;
      });
    }


    $scope.$watch(function(){return $scope.tipoRootController.tipos;},function(){
      resolveFolderpath();
    })

  }

  angular.module('tipo.tipoapp')
  .controller('TipoS3Browser', TipoS3Browser);

})();