(function() {

  'use strict';


  function TipoClientJavascript(tipoHandle){
    var _instance = this;

    _instance.S3Browser_List_OnClick = function(tipoData,selectedTipo,tipo_name){
    	console.log(tipoData);
    	tipoHandle.refreshList(tipo_name,tipoData);
    }
  }

  // Added Client Side Javascript Service in Custom Module
  angular.module('tipo.custom')
         .service('tipoClientJavascript', TipoClientJavascript);; 

})();