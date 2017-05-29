(function() {

  'use strict';


  function TipoClientJavascript(tipoHandle){
    var _instance = this;

    _instance.TipoS3Browser_List_OnClick = function(tipoData,selectedTipo,tipo_name,query_params,event){
    	console.log(tipoData);
    	if (selectedTipo.is_folder) {
    		query_params.fq_folder = selectedTipo.fq_filename;
    		tipoHandle.getTipos(tipo_name,query_params).then(function(response){
    		tipoData.tipos = response;
    		event.stopPropagation();
    	});
    		return false;
    	}
    	return true;
    }

    _instance.TipoS3Browser_List_OnLoad = function(selectedTipos,query_params){
    	if (selectedTipos.length > 0) {
    		var folders = _.dropRight(_.drop(selectedTipos[0].key.split("/")));
    		query_params.fq_folder = _.join(folders,"/") + "/";
    	};
    }
  }

  // Added Client Side Javascript Service in Custom Module
  angular.module('tipo.custom')
         .service('tipoClientJavascript', TipoClientJavascript);; 

})();