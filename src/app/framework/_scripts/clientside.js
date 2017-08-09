(function() {

  'use strict';


  function TipoClientJavascript(tipoHandle){

    function TipoS3Browser_List_OnClick (tipoData,selectedTipo,tipo_name,query_params,event){
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

    function TipoS3Browser_List_OnLoad(selectedTipos,query_params){
      if (selectedTipos.length > 0) {
        var folders = _.dropRight(_.drop(selectedTipos[0].key.split("/")));
        query_params.fq_folder = _.join(folders,"/") + "/";
      };
    }

    function TipoStandingData_Lookup_OnChange(selectedValue,lookupData,root,context){
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

    this.TipoS3Browser_List_OnClick = TipoS3Browser_List_OnClick;
    this.TipoS3Browser_List_OnLoad = TipoS3Browser_List_OnLoad;
    this.TipoStandingData_Lookup_OnChange = TipoStandingData_Lookup_OnChange;

  }

  // Added Client Side Javascript Service in Custom Module
  angular.module('tipo.custom')
         .service('tipoClientJavascript', TipoClientJavascript);; 

})();