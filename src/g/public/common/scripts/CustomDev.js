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

  // function ChangePasswordController($scope, securityContextService) {

  //   var _instance = this;
  //   _instance.data = {};

  //   var hooks = $scope.tipoRootController.hooks;

  //   hooks.preFinish = function() {
  //     $scope.tipoRootController.data = {
  //       accessToken: securityContextService.getCurrentAccessToken(),
  //       oldPassword: _instance.data.oldPassword,
  //       newPassword: _instance.data.newPassword,
  //       username: securityContextService.getCurrentUser()
  //     };
  //     return true;
  //   }
  // }

  // function TipoAppController(
  //   tipoRouter,
  //   metadataService,
  //   $window,
  //   $scope,
  //   tipoCache) {

  //   var _instance = this;

  //   var tipo_name = $scope.tipoRootController.tipo_name;
  //   // var hooks = $scope.tipoRootController.hooks;

  //   // hooks.postFinish = function() {
  //   //   tipoCache.evict(tipo_name);
  //   //   tipoRouter.toTipoList(tipo_name);
  //   //   return true;
  //   // }

  //   function addLogotoData(tipos){
  //     _.each(tipos, function(each, index){
  //       var logo;
  //       if(each.app_name === 'Tipo App'){
  //         logo = 'tipoapp';
  //       } else if(index < 7){
  //         logo = index + 1;
  //       }else{
  //         logo = 'no-image';
  //       }
  //       each.logo = logo + '.png';
  //     });
  //     _instance.tipos = tipos;
  //   }
  //   addLogotoData($scope.tipoRootController.tipos);

  //   _instance.toEdit = function(tipo_id){
  //     tipoRouter.toTipoEdit(tipo_name, tipo_id);
  //   };

  //   _instance.delete = function(tipo_id){
  //     $scope.tipoRootController.delete(tipo_id);
  //   };

  //   _instance.launch = function(tipo){
  //     $window.open(tipo.app_url, '_blank');
  //   };

  //   $scope.$watch(function(){ return $scope.tipoRootController.tipos;}, function(){
  //     addLogotoData($scope.tipoRootController.tipos);
  //   })

  // }

  function TipoS3Browser(
    $scope,
    $filter,
    tipoHandle) {

    var _instance = this;


    function getS3Items(){
      var queryparams = $scope.tipoRootController.queryparams;
      var tipo_name = $scope.tipoRootController.tipo_name;
      delete queryparams.must_include_values;
      delete queryparams.must_include_key;
      tipoHandle.getTipos(tipo_name,queryparams).then(function(response){
        $scope.tipoRootController.tipos = response;
      });
    }

    getS3Items();
    
    function resolveFolderpath(){
    var folder_path = $scope.tipoRootController.tipos[0].is_folder ?  _.replace($scope.tipoRootController.tipos[0].fq_filename,$scope.tipoRootController.tipos[0].filename + "/","") : _.replace($scope.tipoRootController.tipos[0].fq_filename,$scope.tipoRootController.tipos[0].filename,"") 
    _instance.folder_path = folder_path.substring(0,folder_path.length-1).split("/");
    }

    _instance.goto = function(folder,index){
      var pathArray = _.dropRight(_instance.folder_path,_instance.folder_path.length - index);
      var folder_path = _.join(pathArray,"/")
      var queryparams = $scope.tipoRootController.queryparams;
      var tipo_name = $scope.tipoRootController.tipo_name;
      delete queryparams.must_include_values;
      delete queryparams.must_include_key;
      queryparams.fq_folder = folder_path + "/"
      tipoHandle.getTipos(tipo_name,queryparams).then(function(response){
        $scope.tipoRootController.tipos = response;
      });
    }

    _instance.removeTipo = function(chip){
      var tipoSelected = $filter('filter')($scope.tipoRootController.tipos,function(tipo){ return tipo.tipo_id === chip.tipo_id || tipo.tipo_id === chip.key});
      $scope.tipoRootController.selectTipo(tipoSelected[0],event,$scope.tipoRootController.tipos);
    }


    $scope.$watch(function(){return $scope.tipoRootController.tipos;},function(new_val,old_val){
      if (new_val && new_val !== old_val) {
        resolveFolderpath();
      };
    })

  }


  // function TipoTypeController(
  //   tipoRouter,
  //   $window,
  //   $scope,
  //   $rootScope,
  //   tipoInstanceDataService,
  //   TipoTypeService,
  //   tipoManipulationService,
  //   $stateParams) {

  //   var _instance = this;
  //   var tipo_types = [];
  //   var tipo_name = $scope.tipoRootController.tipoDefinition.tipo_meta.tipo_name;
  //   $scope.tipoRootController.hasTipos = true;
  //   var tipo_types = angular.copy(TipoTypeService.gettipo_types());
  //   var application = $scope.tipoRootController.tipoDefinition.application;
  //   var tipo_groups = $scope.tipoRootController.tipo_fields;
  //   if (!_.isUndefined(tipo_groups)) {
  //     _.each(tipo_groups,function(tipo_group){
  //       tipo_types.push({ key: "FieldGroup." + tipo_group.tipo_group_name,
  //                         label: tipo_group.tipo_group_name,
  //                         icon: "group_work",
  //                         field_group: true});
  //     });
  //   };
  //   var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
  //   var filter = {};
  //   if (perspectiveMetadata.tipoName) {
  //     if (perspectiveMetadata.tipoName !== $scope.tipoRootController.tipoDefinition.tipo_meta.tipo_name) {
  //       filter.tipo_filter = perspectiveMetadata.tipoFilter;
  //     }
  //   }
  //   filter.page = 1;
  //   filter.per_page = 100;
  //   tipoInstanceDataService.search("TipoDefinition",filter).then(function(tipo_objects){
  //     _instance.tipo_objects = tipo_objects;
  //     _.each(tipo_objects,function(tipo_object){
  //       /**Either Tipos are from the same application or other application that the user has access to. 
  //        * But, don't allow others to refer to Tipo application objects. 
  //        * TODO: We may have to allow refering to TipoAccount & TipoUser, that can be allowed explicitly. */
  //     if ( application === tipo_object.application ||
  //         ! (tipo_object.application === "1000000001" 
  //       && tipo_object.application_owner_account === "2000000001"))
  //     tipo_types.push({ key: "Tipo." + tipo_object.tipo_id,
  //                       label: tipo_object.tipo_meta.display_name,
  //                       icon: tipo_object.tipo_meta.icon,
  //                       tipo_object: true});
  //     });
  //     if ($scope.tipoRootController.selectedTipos.length > 0) {
  //     _.each(tipo_types, function(tipo){
  //         _.each($scope.tipoRootController.selectedTipos,function(selected){
  //           if(tipo.key === selected.key){
  //             tipo.selected = true;
  //           }
  //         })
  //       });
  //     };
  //     _instance.tipo_types = tipo_types;
  //   });
  //   var tipos = angular.copy($scope.tipoRootController.tiposWithDefinition);

  //   _instance.tipos = tipos;
    

  //   _instance.toEdit = function(tipo_id){
  //     tipoRouter.toTipoEdit(tipo_name, tipo_id);
  //   };

  //   _instance.launch = function(tipo){
  //     $window.open(tipo.app_url, '_blank');
  //   };

  // }

  // function TipoTypeService(){
  //   var tipo_types = [{
  //     key: "integer",
  //     label: "Integer",
  //     icon: "format_list_numbered",
  //   },{
  //     key: "string",
  //     label: "Simple String",
  //     icon: "sort_by_alpha",
  //   },{
  //     key: "longstring",
  //     label: "Paragraph",
  //     icon: "view_array",
  //   },{
  //     key: "richstring",
  //     label: "Rich Text",
  //     icon: "format_shapes",
  //   },{
  //     key: "htmlLink",
  //     label: "Link",
  //     icon: "link",
  //   },{
  //     key: "boolean",
  //     label: "True/False",
  //     icon: "check_box",
  //   },{
  //     key: "password",
  //     label: "Password",
  //     icon: "enhanced_encryption",
  //   },{
  //     key: "date_time",
  //     label: "Date/Time",
  //     icon: "perm_contact_calendar",
  //   },{
  //     key: "colour",
  //     label: "Colour",
  //     icon: "color_lens",
  //   },{
  //     key: "file",
  //     label: "File",
  //     icon: "insert_drive_file",
  //   },{
  //     key: "divider",
  //     label: "Divider",
  //     icon: "remove",
  //   },{
  //     key: "empty",
  //     label: "Empty",
  //     icon: "remove_circle_outline",
  //   },{
  //     key: "simpleimage",
  //     label: "Simple Image",
  //     icon: "photo_size_select_actual",
  //   },{
  //     key: "location",
  //     label: "Location",
  //     icon: "location_on",
  //   },{
  //     key: "s3explorer",
  //     label: "S3 Browser",
  //     icon: "open_in_browser",
  //   },{
  //     key: "visualisation",
  //     label: "Visualisation",
  //     icon: "insert_chart",
  //   },{
  //     key: "action",
  //     label: "Action",
  //     icon: "alarm_add",
  //   }];

  //   return{
  //     gettipo_types: function(){
  //       return tipo_types;
  //     },
  //   }
  // }

  function TipoSubscribtionController(
    tipoHandle,
    metadataService,
    tipoManipulationService,
    $window,
    $scope,
    $mdDialog) {

    var _instance = this;
    /** In case of detail/edit/create pages, the tipo object that contains the data from server. */
    _instance.tipo = $scope.tipoRootController.tipo;
    var appMetadata = metadataService.applicationMetadata;
    var appMetadata = _.merge(_.get(appMetadata,"TipoApp"),_.get(appMetadata,"TipoConfiguration"));
    $scope.creditCard;
    $scope.tipoRootController.hide_actions = true;
    _instance.plans = [];
    _instance.allowed_values =  _.range(1, 11);
    _instance.edit_mode = {};
    _instance.cycleSelected = "Monthly";
    var tipo_plan = "TipoPlans";
    
    function getPlans(){
      var params = {};
      _instance.inProgress = true;
      params.list_display = 'N';
      // if (!change) {
        // selectCycle();
      // };
      params.tipo_filter = "(!(plan_status:Inactive))"
      // params.tipo_filter = params.tipo_filter + ' AND ' + _instance.cycleSelected.filter_expression;
      if (_instance.edit_current_plan) {
        params.tipo_filter = params.tipo_filter + 'AND (plan_group:' + (_instance.tipo.plan_group ) + ')';
      };
      tipoHandle.getTipos(tipo_plan,params).then(function(response){
        _instance.plans = response;
        _instance.inProgress = false;
      })
    }
    var planDisplayText;
    function getPlanDetails (plan) {
      planDisplayText = " " + plan.quantity + " " + plan.item;
      angular.forEach(_instance.plans, function(value, index) {
        angular.forEach(value.stripe_subscription_plans, function(subscriptionPlan, key){
          if(plan.item === subscriptionPlan.plane_name) {
            if(value.tipo_id === _instance.tipo.plan) {
              value.disableButton = true;
              value.buttonText = "Current Plan";
              if(plan.quantity <= subscriptionPlan.discounted_quantity) {
                planDisplayText = " Used <b>" + plan.quantity + " of " + subscriptionPlan.discounted_quantity  + " </b>included " + plan.item + "(s)" ;
              } else {
                var additionalQuantity = plan.quantity - subscriptionPlan.discounted_quantity;
                planDisplayText = " <b>" + subscriptionPlan.discounted_quantity + "</b> " + plan.item + " <b>+ " + additionalQuantity + " </b>additional " + plan.item + "(s)" ;
              }
            }
          } 
        })
      });
      return planDisplayText;
    }
    function getPlanCost(plan) {
      var planCost = 0;
      angular.forEach(plan.stripe_subscription_plans, function(subsPlan, index) {
        planCost = planCost + (subsPlan.discounted_quantity * subsPlan.plan_amount);
      })
      return  " $" + planCost + "/month" ;
    }
    // function selectCycle(){
    //   _instance.cycleSelected = _.find(_instance.billing_cycles, function(o) { return o.display_name === _instance.tipo.billing_cycle; });
    //   _instance.selectedIndex = _.findIndex(_instance.billing_cycles, function(o) { return o.display_name === _instance.tipo.billing_cycle; }) || 0;
    //   _instance.cycleSelected = _instance.cycleSelected || _instance.billing_cycles[0];
    //   console.log( _instance.cycleSelected);
    // }
    // function getBillingCycles(){
    //   tipoHandle.getTipoDefinition(tipo_plan,true).then(function(plan_def){
    //     _instance.billing_cycles = plan_def.tipo_list.filters;
    //     getPlans();
    //   })
    // }
    // getBillingCycles();
    function selectPlan(plan){
      // Code to block downgrades
      if (plan.buttonText === "Cannot downgrade plan") {
        return;
      }
      _instance.selectedPlan = plan;
      if (!_instance.tipo.credit_card && !_instance.cardElement) {
        showCreditCard();
      }else{
        var confirm = $mdDialog.confirm()
          .title('Confirmation')
          .textContent('Are you sure you want to change plan?')
          .ok('Yes')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
          var subscription = mapSubscrtoPlan();
          saveSubscription(subscription);
        }, function() {
        });
      }
    }

    function showCreditCard(){
      var promise = $mdDialog.show({
        controller: function cardController($scope,$mdDialog) {

          $scope.initCard = function(){
            $scope.creditCard = tipoManipulationService.initialiseCreditCard(appMetadata.app_subscription.publishable_key);
            endwatch();
          }

          $scope.createToken = function(){
            $scope.creditCard.stripe.createToken($scope.creditCard.cardElement).then(function(result) {
              if (result.error) {
                // Inform the user if there was an error
                $scope.showerror = true;
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
              } else {
                // Send the token to your server
                $mdDialog.hide(result); 
              }
            });
          }

          var endwatch = $scope.$watch(function(){return angular.element(document.getElementById('card-element'));},function(newval){
            if (newval) {
              $scope.initCard()
            };
          })
        },
        template: "<md-dialog style='width:50%'><md-dialog-content layout='column' layout-padding><div layout='row' layout-align='center center'><label for='card-element' flex='20'>Card</label><div id='card-element' flex='80'></div></div><md-button class='md-primary md-raised' ng-click='createToken()'>Update Card Details</md-button><div id='card-errors' ng-show='showerror'><i class='fa fa-exclamation-circle fa-fw'></i></div></md-dialog-content></md-dialog>",
        targetEvent: event,
        escapeToClose: true,
        skipHide: true,
        clickOutsideToClose: true,
        fullscreen: true
      });
      promise.then(function(result){
        createToken(result);
      })
      // _instance.cardElement.mount('#card-element');
      // var container = angular.element(document.getElementById('inf-wrapper'));
      // var scrollTo = angular.element(document.getElementById('card-element'));
      // container.scrollToElement(scrollTo,150,100);
    }

    function createToken(result){
      tipoHandle.callAction($scope.tipoRootController.tipo_name,'attach_card',[_instance.tipo.tipo_id],$scope.tipoRootController.tipo_name,{token_source: result.token.id, credit_card: result.token.card.last4}).then(function(response){
        _instance.tipo.credit_card = result.token.card.last4;
        _instance.last4 = result.token.card.last4;
        _instance.card_token = result.token.id;
        if (_instance.selectedPlan) {
          var subscription = mapSubscrtoPlan();
          subscription.updated_by = response.updated_by;
          subscription.updated_date = response.updated_date;
          subscription.updated_dt = response.updated_dt;
        }else{
          var subscription = mapCardinfo();
        }
        saveSubscription(subscription);
      });
    }
    function mapSubscrtoPlan(){
      var subscription = angular.copy(_instance.tipo);
      subscription.plan = _instance.selectedPlan.tipo_id;
      subscription.plan_group = _instance.selectedPlan.plan_group;
      subscription.billing_cycle = _instance.cycleSelected;
      subscription.credit_card = _instance.last4 || _instance.tipo.credit_card;
      subscription.card_token = _instance.card_token || _instance.tipo.card_token;
      subscription.plan_interval = _instance.selectedPlan.plan_period.plan_interval;
      subscription.plan_period_ = _instance.selectedPlan.plan_period.plan_period;
      subscription.total_cost = _instance.total_cost;
      delete subscription.plan_period;
      _instance.selectedPlan.stripe_subscription_plans = _.sortBy(_instance.selectedPlan.stripe_subscription_plans, [function(o) { return o.plan_id; }]);
      subscription.plan_items = _.sortBy(subscription.plan_items, [function(o) { return o.item_id; }]);
      _.each(_instance.selectedPlan.stripe_subscription_plans,function(each_item,key){
        if (!subscription.plan_items[key]) {
          subscription.plan_items.push({external_item_id: ""});
        };
        subscription.plan_items[key].item_id = each_item.plan_id;
        subscription.plan_items[key].item = each_item.plane_name;
        subscription.plan_items[key].currency = each_item.currency;
        subscription.plan_items[key].amount = each_item.plan_amount;
        // subscription.plan_items[key].quantity = _instance.plan_quantity[each_item.plane_name];
      });
      return subscription;
    }

    function mapCardinfo(){
      var subscription = _instance.tipo;
      subscription.credit_card = _instance.last4 || _instance.tipo.credit_card;
      subscription.card_token = _instance.card_token || _instance.tipo.card_token;
      return subscription;
    }

    function saveSubscription(subscription){
      tipoHandle.saveTipo($scope.tipoRootController.tipo_name, 'default', subscription).then(function(response){
        tipoHandle.toTipo("view",$scope.tipoRootController.tipo_name,'default');
      })
    }

    function deselectPlan(){
      _instance.edit_current_plan = false;
      getPlans();
    }

    function collapseAll(){
      _instance.collapsed = !_instance.collapsed;
      _.each(_instance.edit_mode,function(value,key){
        delete _instance.edit_mode[key];
      });
    }

    // Your business logic.

    this.createToken = createToken;
    this.showCreditCard = showCreditCard;
    this.getPlans = getPlans;
    this.selectPlan = selectPlan;
    this.deselectPlan = deselectPlan;
    this.collapseAll = collapseAll;
    this.getPlanDetails = getPlanDetails;
    this.getPlanCost = getPlanCost;

  }

  angular.module('tipo.tipoapp')
  .controller('MyTemplateController', MyTemplateController)
  .controller('TipoSubscribtionController', TipoSubscribtionController)
  // .controller('TipoTypeController', TipoTypeController)
  .controller('TipoS3Browser', TipoS3Browser)
  // .controller('TipoAppController', TipoAppController)
  // .controller('ChangePasswordController', ChangePasswordController)
  // .service('TipoTypeService', TipoTypeService);

})();