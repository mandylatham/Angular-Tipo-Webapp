(function() {

  'use strict';
  
  /** Developer can create as many controllers required for all the templates. However, they must be bundled in a single JS file. */

  function MyTemplateController(
	tipoHandle,
    $window,
    $scope) {

    var _instance = this;
    /** In case of detail/edit/create pages, the tipo object that contains the data from server. */
    var tipo = $scope.tipoRootController.tipo;

    /** In case of list view, the tipos array contains the data from server. */
    var tipos = $scope.tipoRootController.tipos;

    // Your business logic.

  }

  function ChangePasswordController($scope, securityContextService) {

    var _instance = this;
    _instance.data = {};

    var hooks = $scope.tipoRootController.hooks;

    hooks.preFinish = function() {
      $scope.tipoRootController.data = {
        accessToken: securityContextService.getCurrentAccessToken(),
        oldPassword: _instance.data.oldPassword,
        newPassword: _instance.data.newPassword,
        username: securityContextService.getCurrentUser()
      };
      return true;
    }
  }

  function TipoAppController(
    tipoRouter,
    metadataService,
    $window,
    $scope,
    tipoCache) {

    var _instance = this;

    var tipo_name = $scope.tipoRootController.tipo_name;
    // var hooks = $scope.tipoRootController.hooks;

    // hooks.postFinish = function() {
    //   tipoCache.evict(tipo_name);
    //   tipoRouter.toTipoList(tipo_name);
    //   return true;
    // }

    function addLogotoData(tipos){
      _.each(tipos, function(each, index){
        var logo;
        if(each.app_name === 'Tipo App'){
          logo = 'tipoapp';
        } else if(index < 7){
          logo = index + 1;
        }else{
          logo = 'no-image';
        }
        each.logo = logo + '.png';
      });
      _instance.tipos = tipos;
    }
    addLogotoData($scope.tipoRootController.tipos);

    _instance.toEdit = function(tipo_id){
      tipoRouter.toTipoEdit(tipo_name, tipo_id);
    };

    _instance.delete = function(tipo_id){
      $scope.tipoRootController.delete(tipo_id);
    };

    _instance.launch = function(tipo){
      $window.open(tipo.app_url, '_blank');
    };

    $scope.$watch(function(){ return $scope.tipoRootController.tipos;}, function(){
      addLogotoData($scope.tipoRootController.tipos);
    })

  }

  function TipoS3Browser(
    $scope,
    $filter,
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

    _instance.removeTipo = function(chip){
      var tipoSelected = $filter('filter')($scope.tipoRootController.tipos,function(tipo){ return tipo.tipo_id === chip.tipo_id || tipo.tipo_id === chip.key});
      $scope.tipoRootController.selectTipo(tipoSelected[0],event,$scope.tipoRootController.tipos);
    }


    $scope.$watch(function(){return $scope.tipoRootController.tipos;},function(){
      resolveFolderpath();
    })

  }


  function TipoTypeController(
    tipoRouter,
    $window,
    $scope,
    $rootScope,
    tipoInstanceDataService,
    TipoTypeService,
    tipoManipulationService,
    $stateParams) {

    var _instance = this;
    var tipo_types = [];
    var tipo_name = $scope.tipoRootController.tipoDefinition.tipo_meta.tipo_name;
    $scope.tipoRootController.hasTipos = true;
    var tipo_types = angular.copy(TipoTypeService.gettipo_types());
    var application = $scope.tipoRootController.tipoDefinition.application;
    var tipo_groups = $scope.tipoRootController.tipo_fields;
    if (!_.isUndefined(tipo_groups)) {
      _.each(tipo_groups,function(tipo_group){
        tipo_types.push({ key: "FieldGroup." + tipo_group.tipo_group_name,
                          label: tipo_group.tipo_group_name,
                          icon: "group_work",
                          field_group: true});
      });
    };
    var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
    var filter = {};
    if (perspectiveMetadata.tipoName) {
      if (perspectiveMetadata.tipoName !== $scope.tipoRootController.tipoDefinition.tipo_meta.tipo_name) {
        filter.tipo_filter = perspectiveMetadata.tipoFilter;
      }
    }
    filter.page = 1;
    filter.per_page = 100;
    tipoInstanceDataService.search("TipoDefinition",filter).then(function(tipo_objects){
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
      key: "empty",
      label: "Empty",
      icon: "remove_circle_outline",
    },{
      key: "simpleimage",
      label: "Simple Image",
      icon: "photo_size_select_actual",
    },{
      key: "location",
      label: "Location",
      icon: "location_on",
    },{
      key: "s3explorer",
      label: "S3 Browser",
      icon: "open_in_browser",
    },{
      key: "visualisation",
      label: "Visualisation",
      icon: "insert_chart",
    },{
      key: "action",
      label: "Action",
      icon: "alarm_add",
    }];

    return{
      gettipo_types: function(){
        return tipo_types;
      },
    }
  }

  function TipoSubscribtionController(
  tipoHandle,
    $window,
    $scope) {

    var _instance = this;
    /** In case of detail/edit/create pages, the tipo object that contains the data from server. */
    _instance.tipo = $scope.tipoRootController.tipo;
    _instance.plans = [];
    _instance.allowed_values =  _.range(1, 11);
    _instance.edit_mode = {};
    var tipo_plan = "TipoPlans";
    
    function getPlans(){
      var params = {};
      params.short_display = 'N';
      params.tipo_filter = _instance.cycleSelected.filter_expression;
      tipoHandle.getTipos(tipo_plan,params).then(function(response){
        _instance.plans = response;
      })
    }
    function getBillingCycles(){
      tipoHandle.getTipoDefinition(tipo_plan,true).then(function(plan_def){
        _instance.billing_cycles = plan_def.tipo_list.filters;
        _instance.cycleSelected = plan_def.tipo_list.filters[0];
        getPlans();
      })
    }
    getBillingCycles();
    function showCreditCard(){
      _instance.show_card = true;
      _instance.stripe = Stripe('pk_test_JD6zYPAyxr6qz1pVtzSphiYQ');
      var elements = _instance.stripe.elements();
      var style = {
        base: {
          color: '#303238',
          fontSize: '16px',
          lineHeight: '48px',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#ccc',
          },
        },
        invalid: {
          color: '#e5424d',
          ':focus': {
            color: '#303238',
          },
        },
      };
      _instance.cardElement = elements.create('card', {style: style});
      _instance.cardElement.mount('#card-element');
      var container = angular.element(document.getElementById('inf-wrapper'));
      var scrollTo = angular.element(document.getElementById('card-element'));
      container.scrollToElement(scrollTo,150,100);
    }

    function createToken(saveplan){
      _instance.stripe.createToken(_instance.cardElement).then(function(result) {
        if (result.error) {
          // Inform the user if there was an error
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server
          tipoHandle.callAction($scope.tipoRootController.tipo_name,'attach_card',[_instance.tipo.tipo_id],$scope.tipoRootController.tipo_name,{token_source: result.token.id}).then(function(response){
            console.log(response);
          })
        }
      });
    }

    function selectPlan(plan_details,form){
      if (!form.$valid) {
        var container = angular.element(document.getElementById('inf-wrapper'));
        var invalidElement = document.getElementsByClassName("ng-invalid");
        container.scrollToElement(invalidElement[1],150,100);
        return false;
      }
    _instance.selectedPlan = plan_details;
      if (!_instance.tipo.credit_card && !_instance.cardElement) {
        showCreditCard();
        return;
      }else if(_instance.cardElement && !_instance.tipo.credit_card){
        createToken(true);
        return;
      }
    }

    function enableEditmode(id){
      _instance.edit_mode[id] = true;
      _.each(_instance.edit_mode,function(value,key){
        if (key !== id) {
          _instance.edit_mode[key] = false;
        }
      })
    }
    // Your business logic.

    this.createToken = createToken;
    this.showCreditCard = showCreditCard;
    this.selectPlan = selectPlan;
    this.getPlans = getPlans;
    this.enableEditmode = enableEditmode;

  }

  angular.module('tipo.tipoapp')
  .controller('MyTemplateController', MyTemplateController)
  .controller('TipoSubscribtionController', TipoSubscribtionController)
  .controller('TipoTypeController', TipoTypeController)
  .controller('TipoS3Browser', TipoS3Browser)
  .controller('TipoAppController', TipoAppController)
  .controller('ChangePasswordController', ChangePasswordController)
  .service('TipoTypeService', TipoTypeService);

})();