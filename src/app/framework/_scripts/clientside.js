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
        if (event) {
          event.stopPropagation();
        };
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

    _instance.TipoStandingData_Lookup_OnChange = function(selectedValue,lookupData,root,context){
      if (selectedValue.label === "Value Based Style") {
        var context = _.get(root,context)
        if (context.allowed_values) {
          var expression = "";
          _.each(context.allowed_values,function(value){
            if (value !== context.allowed_values[context.allowed_values.length - 1]) {
              expression = expression + _.replace(_.replace(selectedValue.key,"$field","$tipo." + context.field_name),"$value",value) + " || ";
            }else{
              expression = expression + _.replace(_.replace(selectedValue.key,"$field","$tipo." + context.field_name),"$value",value);
            }
          });
          selectedValue.key = expression;
        };
      };
    }

  }

  // Added Client Side Javascript Service in Custom Module
  angular.module('tipo.custom')
         .service('tipoClientJavascript', TipoClientJavascript);; 

})();