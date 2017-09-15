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
    var stripe = Stripe('pk_test_JD6zYPAyxr6qz1pVtzSphiYQ');
      var elements = stripe.elements();
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
      var cardElement = elements.create('card', {style: style});
      cardElement.mount('#card-element');
    function extractPlans(plan_name,response){
      plan_name = _.toLower(plan_name);
      var userinx = _.findIndex(response, function(o) { return o.data.id == plan_name + 'user'; });
      var creatorinx = _.findIndex(response, function(o) { return o.data.id == plan_name + 'creator'; });
      _instance.plans.push({
        plan_name: _.upperFirst(plan_name),
        app_user: {
          amount: response[userinx].data.amount
        },
        creator_user: {
          amount: response[creatorinx].data.amount
        },
      });
    }
    function getPlans(){
      tipoHandle.callAction($scope.tipoRootController.tipo_name,'list_stripe_plans',[_instance.tipo.tipo_id]).then(function(response){
        extractPlans("Bronze",response);
        extractPlans("Silver",response);
      })
    }

    _instance.testStripr = function(){
      stripe.createToken(cardElement).then(function(result) {
        if (result.error) {
          // Inform the user if there was an error
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server
          stripeTokenHandler(result.token);
        }
      });
    }

    getPlans();
    // Your business logic.

  }

  angular.module('tipo.tipoapp')
  .controller('MyTemplateController', MyTemplateController)
  .controller('TipoSubscribtionController', TipoSubscribtionController)
  .controller('TipoTypeController', TipoTypeController)
  .service('TipoTypeService', TipoTypeService);

})();