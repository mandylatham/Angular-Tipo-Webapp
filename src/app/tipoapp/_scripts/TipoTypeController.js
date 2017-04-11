(function() {

  'use strict';

  function TipoTypeController(
    tipoRouter,
    $window,
    $scope,
    $rootScope,
    tipoInstanceDataService,
    TipoTypeService,
    $stateParams) {

    var _instance = this;
    var tipo_types = [];
    var tipo_name = $scope.tipoRootController.tipoDefinition.tipo_meta.tipo_name;
    var tipo_types = angular.copy(TipoTypeService.gettipo_types());
    var application = $scope.tipoRootController.tipoDefinition.application;
    var tipo_groups = _.find($scope.tipoRootController.tipo_fields,function(field){
      return field.field_name === "tipo_field_groups"
    });
    if (!_.isUndefined(tipo_groups)) {
      _.each(tipo_groups._items,function(tipo_group){
        var group_name = _.find(tipo_group.tipo_fields,function(group){
        return group.field_name === "tipo_group_name"
      });
        tipo_types.push({ key: "FieldGroup." + group_name._value.key,
                          label: group_name._value.key,
                          icon: "group_work",
                          field_group: true});
      });
    };
    tipoInstanceDataService.search("TipoDefinition").then(function(tipo_objects){
      _instance.tipo_objects = tipo_objects;
      _.each(tipo_objects,function(tipo_object){
    	  /**Either Tipos are from the same application or other application that the user has access to. 
    	   * But, don't allow others to refer to Tipo application objects. 
    	   * TODO: We may have to allow refering to TipoAccount & TipoUser, that can be allowed explicitly. */
      if ( application === tipo_object.application ||
    		  ! (tipo_object.application === "1000000001" 
    	  && tipo_object.application_owner_account === "2000000001"))
      tipo_types.push({ key: "Tipo." + tipo_object.tipo_id,
                        label: tipo_object.tipo_meta.display_name,
                        icon: tipo_object.tipo_meta.icon,
                        tipo_object: true});
      });
      if ($scope.tipoRootController.selectedTipos.length > 0) {
      _.each(tipo_types, function(tipo){
          _.each($scope.tipoRootController.selectedTipos,function(selected){
            if(tipo.key === selected.key){
              tipo.selected = true;
            }
          })
        });
      };
      _instance.tipo_types = tipo_types;
    });
    var tipos = angular.copy($scope.tipoRootController.tiposWithDefinition);

    _instance.tipos = tipos;
    

    _instance.toEdit = function(tipo_id){
      tipoRouter.toTipoEdit(tipo_name, tipo_id);
    };

    _instance.launch = function(tipo){
      $window.open(tipo.app_url, '_blank');
    };

  }

  function TipoTypeService(){
    var tipo_types = [{
      key: "integer",
      label: "Integer",
      icon: "format_list_numbered",
    },{
      key: "string",
      label: "Simple String",
      icon: "sort_by_alpha",
    },{
      key: "longstring",
      label: "Paragraph",
      icon: "view_array",
    },{
      key: "richstring",
      label: "Rich Text",
      icon: "format_shapes",
    },{
      key: "htmlLink",
      label: "Link",
      icon: "link",
    },{
      key: "boolean",
      label: "True/False",
      icon: "check_box",
    },{
      key: "password",
      label: "Password",
      icon: "enhanced_encryption",
    },{
      key: "date_time",
      label: "Date/Time",
      icon: "perm_contact_calendar",
    },{
      key: "colour",
      label: "Colour",
      icon: "color_lens",
    },{
      key: "file",
      label: "File",
      icon: "insert_drive_file",
    },{
      key: "divider",
      label: "Divider",
      icon: "remove",
    },{
      key: "s3explorer",
      label: "DO NOT USE - S3 Browser",
      icon: "open_in_browser",
    }];

    return{
      gettipo_types: function(){
        return tipo_types;
      },
    }
  }

  angular.module('tipo.tipoapp')
  .controller('TipoTypeController', TipoTypeController)
  .service('TipoTypeService', TipoTypeService);;

})();