(function() {

  'use strict';

  function TipoTypeController(
    tipoRouter,
    $window,
    $scope,
    tipoInstanceDataService,
    TipoTypeService,
    $stateParams) {

    var _instance = this;
    var tipo_types = [];
    console.log("entered TipoTypeController");
    console.log(tipo_types.length);
    var tipo_name = $scope.tipoRootController.tipoDefinition.tipo_meta.tipo_name;
    var tipo_types = angular.copy(TipoTypeService.gettipo_types());
    console.log(tipo_types.length);
    _.each($scope.tipoRootController.tipo_field_groups,function(tipo_group){
      tipo_types.push({ key: "FieldGroup." + tipo_group.tipo_group_name,
                        label: "FieldGroup." + tipo_group.tipo_group_name,
                        icon: "group_work",
                        field_group: true});
    });
    console.log(tipo_types.length);
    tipoInstanceDataService.search("TipoDefinition").then(function(tipo_objects){
      _instance.tipo_objects = tipo_objects;
      _.each(tipo_objects,function(tipo_object){
      tipo_types.push({ key: "Tipo." + tipo_object.tipo_id,
                        label: "Tipo." + tipo_object.tipo_meta.tipo_name,
                        icon: tipo_object.tipo_meta.icon,
                        tipo_object: true});
      });
      console.log(tipo_types.length);
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
    // _.each(tipos, function(each, index){
    //   var logo;
    //   if(each.app_name === 'Tipo App'){
    //     logo = 'tipoapp';
    //   } else if(index < 7){
    //     logo = index + 1;
    //   }else{
    //     logo = 'no-image';
    //   }
    //   each.logo = logo + '.png';
    // });

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