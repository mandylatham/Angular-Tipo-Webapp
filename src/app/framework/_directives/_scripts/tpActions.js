(function() {

    'use strict';

    var module = angular.module('tipo.framework');

    function TipoActionDialogController(
        tipoDefinition,
        tipoAction,
        tipoHandle,
        tipoManipulationService,
        $scope,
        tipoRouter,
        tipoInstanceDataService,
        $mdDialog) {

        var _instance = this;
        _instance.tipoDefinition = tipoDefinition;
        _instance.tipoAction = tipoAction;
        _instance.hide_actions = true;
        _instance.tipo = {};
        _instance.context = $scope.context;
        $scope.Date = Date;
        _instance.hooks = {};
        _instance.fullscreen = true;
        _instance.maximize = function() {
            _instance.fullscreen = true;
        };

        _instance.restore = function() {
            _instance.fullscreen = false;
        };

        _instance.lookupTipo = function(relatedTipo, labelfield, prefix) {
            var newScope = $scope.$new();
            newScope.root = _instance.tipoDefinition;
            newScope.relatedTipo = relatedTipo;
            newScope.labelfield = labelfield;
            newScope.tipo = _instance.tipo[prefix];
            var promise = $mdDialog.show({
                templateUrl: 'framework/_directives/_views/tp-lookup-dialog.tpl.html',
                controller: 'TipoLookupDialogController',
                scope: newScope,
                skipHide: true,
                clickOutsideToClose: true,
                fullscreen: true
            });
            promise.then(function(tipo) {
                _instance.tipo[prefix] = tipo;
            });
        }

        _instance.finish = function() {
            var tipoData = _instance.tipo;
            if (_instance.hooks.preFinish) {
                var result = _instance.hooks.preFinish();
                if (!result) {
                    return;
                }
                tipoData = _instance.data;
            }
            tipoRouter.startStateChange();
            if (_.isArray($scope.tipoids)) {
                tipoInstanceDataService.performBulkAction($scope.parentTipo, tipoAction.name, $scope.tipoids, $scope.tipo_name, tipoData)
                    .then(function(response) {
                        $mdDialog.hide(response);
                    }, function(error) {
                        tipoRouter.endStateChange();
                    });
            } else {
                tipoInstanceDataService.performSingleAction($scope.parentTipo, $scope.tipoids, tipoAction.name, $scope.tipo_name, tipoData)
                    .then(function(response) {
                        $mdDialog.hide(response);
                    }, function(error) {
                        tipoRouter.endStateChange();
                    });
            }
        };

        _instance.cancel = function() {
            $mdDialog.cancel();
        };
    }

    return module.directive('tpActions', function(
        tipoManipulationService,
        tipoInstanceDataService,
        tipoClientJavascript,
        tipoCustomJavascript,
        tipoHandle,
        tipoRouter,
        $mdDialog,
        $mdMedia,
        $window,
        $mdToast,
        $timeout,
        $location) {
        return {
            scope: {
                tipos: '=',
                tipoName: '=',
                tipoActions: '=',
                mode: '@?',
                bulkedit: '=',
                singleedit: '=',
                restrictedActions: '=',
                visibilityExpression: '=',
                field: "=",
                refresh: '&',
                selectedall: '=',
                context: '='
            },
            restrict: 'EA',
            replace: true,
            template: '<ng-include src="fieldTemplate" tp-include-replace/>',
            link: function(scope, element, attrs) {
                if (scope.field === "detail_in_list") {
                    scope.fieldTemplate = 'framework/_directives/_views/tp-detail-list-actions.tpl.html'
                } else if (scope.field) {
                    scope.fieldTemplate = 'framework/_directives/_views/tp-field-actions.tpl.html'
                }else {
                    scope.fieldTemplate = 'framework/_directives/_views/tp-actions.tpl.html'
                }
                scope.randomnumber = new Date().getUTCMilliseconds();
                var mode = scope.mode;
                scope.mobaction = { isOpen: false };
                scope.deskaction = { isOpen: false };
                scope.data_handle = {};
                scope.tipo_handle = tipoHandle;

                if (!mode) {
                    mode = 'view';
                }

                scope.mode = mode;

                var tipo_name = scope.tipoName;
                var tipo_id;
                if (mode === 'view' && scope.tipos) {
                    // only a single tipo
                    tipo_id = scope.tipos.tipo_id;
                    scope.edit = false;
                    if (!_.isUndefined(scope.tipos.restricted_actions)) {
                        var restrictedActions = scope.tipos.restricted_actions.split(',');
                    };
                } else {
                    if (!_.isUndefined(scope.restrictedActions)) {
                        var restrictedActions = scope.restrictedActions.split(',');
                    }
                }

                function prepareActions() {
                    var tipoActions = scope.tipoActions;
                    var actions = [];
                    _.forEach(tipoActions, function(each) {
                        if (restrictedActions) {
                            var restriced = _.find(restrictedActions, function(o) { return o === each.tipo_action; });
                        } else {
                            var restriced = false;
                        }
                        if (!restriced) {
                            var visibility_expression = scope.$eval(atob(each.visibility_expression));
                            if (_.isUndefined(visibility_expression)) {
                                visibility_expression = true;
                            };
                            actions.push({
                                name: each.tipo_action,
                                label: each.display_name,
                                highlight: each.highlight,
                                enable_confirmation: each.enable_confirmation,
                                confirmation_text: each.confirmation_text,
                                bulk_select: each.bulk_select,
                                single_select: each.single_select,
                                restriced: restriced,
                                visibility_expression: visibility_expression,
                                icon: each.icon,
                                additionalTipo: _.get(each, 'client_dependency.tipo_name')
                            });
                        };
                    });

                    return actions;
                }

                scope.actions = prepareActions();
                scope.tooltipMob = false;

                scope.openMenu = function(menuOpenFunction, event) {
                    menuOpenFunction(event);
                };

                scope.updateBulkEdit = function(action) {
                    if (action.bulk_select) {
                        scope.bulkedit = !scope.bulkedit;
                        scope.edit = !scope.edit;
                    };
                    if (action.single_select) {
                        scope.singleedit = !scope.singleedit;
                        scope.edit = !scope.edit;
                    };
                }

                scope.triggeractions = function() {
                    angular.element('#actionmob').trigger('click');
                }

                scope.triggerdeskActions = function() {
                    if (scope.field) {
                        angular.element('#actiondesk' + scope.randomnumber).trigger('click');
                    }else{
                        angular.element('#actiondesk').trigger('click');
                    }
                }

                scope.performAction = function(action) {
                    scope.deskaction.isOpen = false;
                    scope.mobaction.isOpen = false;
                    if (mode === 'view') {
                        performAction(action);
                    } else {
                        if (action.bulk_select) {
                            if (scope.bulkedit) {
                                performAction(action);
                            } else {
                                scope.selectedAction = action;
                                scope.bulkedit = !scope.bulkedit;
                                scope.edit = !scope.edit;
                            }
                        } else if (action.single_select) {
                            if (scope.singleedit) {
                                performAction(action);
                            } else {
                                scope.selectedAction = action;
                                scope.singleedit = !scope.singleedit;
                                scope.edit = !scope.edit;
                            }
                        } else {
                            performAction(action);
                        }

                    }
                };
                scope.icon = "check_box_outline_blank";
                scope.tooltip = "Select All";
                scope.selectall = function() {
                    scope.selectedall = !scope.selectedall;
                    if (!scope.selectedall) {
                        scope.icon = "check_box_outline_blank";
                        scope.tooltip = "Select All";
                    } else {
                        scope.icon = "check_box";
                        scope.tooltip = "Deselect All";
                    }
                    _.map(scope.tipos, function(tipo) {
                        tipo.selected = scope.selectedall;
                    });
                }

                function performResponseActions(message, return_url, name) {
                    if (!_.isEmpty(return_url) || !_.isUndefined(return_url)) {
                        if (!_.isEmpty(message) || !_.isUndefined(message)) {
                            return_url = return_url + '?message=' + message;
                        };
                        if (S(return_url).contains('http')) {
                            // $window.open(return_url, "_blank")
                            var confirm = $mdDialog.confirm()
                                .clickOutsideToClose(true)
                                .title(name + ' Completed')
                                .textContent(message)
                                .ariaLabel('Action completed')
                                .ok('OK')

                            $mdDialog.show(confirm).then(function() {
                                $window.open(return_url, "_blank")
                            });
                        } else {
                            $location.url(return_url);
                        }
                    } else {
                        var toast = $mdToast.tpToast();
                        toast._options.locals = {
                            header: 'Action successfully completed',
                            body: message
                        };
                        $mdToast.show(toast);
                    }
                }

                function performSingleAction(action) {
                    if (action.additionalTipo) {
                        var additionalTipo = action.additionalTipo;
                        var promise = openAdditionalTipoDialog(additionalTipo, action, tipo_name, tipo_id);
                        promise.then(function(response) {
                            response.message = response.user_message;
                            tipoRouter.toTipoResponse(response);
                            tipoInstanceDataService.getOne(tipo_name, tipo_id, "", true).then(function(tipoData) {
                                scope.tipos = tipoData;
                                tipoRouter.toTipoView(tipo_name, tipo_id);
                                tipoRouter.toTipoResponse(response);
                                tipoRouter.endStateChange();
                            });
                        });
                    } else {
                        tipoRouter.startStateChange();
                        tipoInstanceDataService.performSingleAction(tipo_name, tipo_id, action.name)
                            .then(function(response) {
                                response.message = response.user_message;

                            });
                    }
                }

                function handleResponse(response) {
                    response.message = response.user_message;
                    tipoRouter.toTipoResponse(response);
                    scope.refresh();
                    tipoRouter.endStateChange();
                }

                function callAction(tipo_name, action_name, selected_tipo_ids, selected_tipos, additional_tipo_name, additional_tipo) {
                    if (scope.field) {
                        var function_name = tipo_name + "_" + action_name;
                    } else if (mode === 'view') {
                        var function_name = tipo_name + "_" + "detail" + "_" + action_name;
                    } else {
                        var function_name = tipo_name + "_" + "list" + "_" + action_name;
                    }
                    if (typeof tipoCustomJavascript[function_name] === 'function') {
                        scope.data_handle.tipo_name = tipo_name;
                        scope.data_handle.action_name = action_name;
                        if (mode === 'view') {
                            scope.data_handle.selected_tipo_id = selected_tipo_ids[0];
                            scope.data_handle.selected_tipo = selected_tipos[0];
                        }
                        scope.data_handle.context = scope.context;
                        scope.data_handle.selected_tipo_ids = selected_tipo_ids;
                        scope.data_handle.selected_tipos = selected_tipos;
                        scope.data_handle.additional_tipo_name = additional_tipo_name;
                        scope.data_handle.additional_tipo = additional_tipo;
                        tipoCustomJavascript[function_name](scope.data_handle);
                        tipoRouter.endStateChange();
                    }
                    if (typeof tipoClientJavascript[function_name] === 'function') {
                        scope.data_handle.tipo_name = tipo_name;
                        scope.data_handle.action_name = action_name;
                        if (mode === 'view') {
                            scope.data_handle.selected_tipo_id = selected_tipo_ids[0];
                            scope.data_handle.selected_tipo = selected_tipos[0];
                        }
                        scope.data_handle.context = scope.context;
                        scope.data_handle.selected_tipo_ids = selected_tipo_ids;
                        scope.data_handle.selected_tipos = selected_tipos;
                        scope.data_handle.additional_tipo_name = additional_tipo_name;
                        scope.data_handle.additional_tipo = additional_tipo;
                        tipoClientJavascript[function_name](scope.data_handle);
                        tipoRouter.endStateChange();
                    } else if (typeof tipoCustomJavascript[function_name] !== 'function') {
                        tipoRouter.startStateChange();
                        tipoHandle.callAction(tipo_name, action_name, selected_tipo_ids, additional_tipo_name, additional_tipo)
                            .then(function(response) {
                                if (mode === 'view') {
                                    tipoHandle.getTipo(tipo_name, tipo_id, {}, true).then(function(tipoData) {
                                        scope.tipos = tipoData;
                                        tipoRouter.toTipoView(tipo_name, tipo_id);
                                        handleResponse(response);
                                    });
                                } else {
                                    tipoRouter.toTipoList(tipo_name);
                                    handleResponse(response);
                                }
                            });
                    }
                }

                function performAction(action) {
                    if (tipo_id) {
                        var selected_tipo_ids = [tipo_id];
                        var selected_tipos = [scope.tipos];
                    } else {
                        var selected_tipos = _.filter(scope.tipos, 'selected');
                        selected_tipo_ids = _.map(selected_tipos, function(each) {
                            return each.tipo_id;
                        });
                    }
                    // if(!_.isEmpty(selected_tipo_ids)){
                    if (action.additionalTipo) {
                        var additionalTipo = action.additionalTipo;
                        var promise = tipoHandle.presentForm(additionalTipo, scope.tipos, action.label);
                        promise.then(function(response) {
                            callAction(tipo_name, action.name, selected_tipo_ids, selected_tipos, action.additionalTipo, response);
                        });
                    } else if (action.enable_confirmation) {
                        var confirm = $mdDialog.confirm()
                            .title('Confirm')
                            .textContent(action.confirmation_text)
                            .ok('OK')
                            .cancel('CANCEL');

                        $mdDialog.show(confirm).then(function() {
                            tipoRouter.startStateChange();
                            callAction(tipo_name, action.name, selected_tipo_ids, selected_tipos)
                        }, function() {
                            return;
                        });
                    } else {
                        console.log('Will just perform the action without opening any dialogs');
                        tipoRouter.startStateChange();
                        callAction(tipo_name, action.name, selected_tipo_ids, selected_tipos)
                    }
                    // }
                }

                function openAdditionalTipoDialog(tipo_name, action, parentTipo, tipoids) {
                    var newScope = scope.$new();
                    newScope.parentTipo = parentTipo;
                    newScope.tipoids = tipoids;
                    newScope.context = scope.tipos;
                    newScope.tipo_name = tipo_name;
                    var promise = $mdDialog.show({
                        templateUrl: 'framework/_directives/_views/tp-action-dialog.tpl.html',
                        controller: TipoActionDialogController,
                        controllerAs: 'tipoRootController',
                        scope: newScope,
                        resolve: /*@ngInject*/ {
                            tipoDefinition: function(tipoHandle, tipoManipulationService) {
                                return tipoHandle.getTipoDefinition(tipo_name);
                            },
                            tipoAction: function() {
                                return action;
                            }
                        },
                        skipHide: true,
                        clickOutsideToClose: true,
                        fullscreen: true
                    });
                    return promise;
                }

                scope.$watch('mobaction.isOpen', function(newVal, oldVal) {
                    if (newVal) {
                        $timeout(function() {
                            scope.tooltipMob = scope.mobaction.isOpen;
                        }, 600);
                    } else {
                        scope.tooltipMob = scope.mobaction.isOpen;
                    }
                }, true);

                scope.$watch('deskaction.isOpen', function(newVal, oldVal) {
                    if (newVal) {
                        $timeout(function() {
                            scope.tooltipDesk = scope.deskaction.isOpen;
                        }, 600);
                    } else {
                        scope.tooltipDesk = scope.deskaction.isOpen;
                    }
                }, true);

            }
        };
    });

})();