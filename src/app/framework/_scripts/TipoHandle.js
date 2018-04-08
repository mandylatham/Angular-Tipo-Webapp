(function() {

    'use strict';

    function TipoLookupDialogController(
        tipoInstanceDataService,
        tipoManipulationService,
        $scope,
        $mdDialog) {

        var target = $scope.target;
        $scope.fullscreen = true;

        var relatedTipoName = $scope.relatedTipo;

        $scope.tipoDisplayName = relatedTipoName;
        $scope.fieldlabel = {};

        $scope.tipoId = "";

        $scope.populateData = function() {
            var tipoId = $scope.tipoId;
            if (!_.isUndefined(tipoId)) {
                tipoInstanceDataService.getOne(relatedTipoName, tipoId).then(function(tipo) {
                    $mdDialog.hide(tipo);
                });
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }

    function TipoActionDialogController(
        tipoDefinition,
        tipoManipulationService,
        $scope,
        tipoHandle,
        tipoDialogInputs,
        tipoRouter,
        tipoInstanceDataService,
        $mdDialog) {

        var _instance = this;
        _instance.tipoDefinition = tipoDefinition;
        tipoHandle.setPerspective();
        _instance.tipo_handle = tipoHandle;
        _instance.hide_actions = true;
        _instance.tipo = {};
        _instance.context = tipoDialogInputs.context;
        _instance.submit_label = tipoDialogInputs.submit_label;
        _instance.tipo_name = tipoDialogInputs.tipo_name
        _instance.createUrl = tipoHandle.createUrl(_instance.tipo_name);
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

        _instance.save = function(form) {
            if (form && !form.$valid) {
                return false;
            }
            var tipoData = _instance.tipo;
            if (_instance.hooks.preFinish) {
                var result = _instance.hooks.preFinish();
                if (!result) {
                    return;
                }
                tipoData = _instance.data;
            }
            $mdDialog.hide(tipoData);
        };

        _instance.cancel = function() {
            $mdDialog.cancel();
        };
    }


    function TipoHandle(tipoCache,
        tipoInstanceDataService,
        tipoDefinitionDataService,
        tipoManipulationService,
        metadataService,
        $location,
        $mdToast,
        $mdDialog,
        tipoRouter,
        $q,
        $filter,
        $stateParams,
        $window,
        ngIntroService,
        $http) {


        var TOUR_TIPO = "TipoTourData";
        var TOUR_TIPO_ID = "default";
        var role;

        function getConfirmation(title, user_message) {
            var confirmation = $mdDialog.confirm()
                .title(title)
                .textContent(user_message)
                .ariaLabel(title)
                .ok('Yes')
                .cancel('No');
            return $mdDialog.show(confirmation).then(function() {
                return true;
            }, function() {
                return false;
            });
        }

        function hideElement(element_class) {
            var elem = angular.element(document.querySelector("." + element_class));
            elem.style.display = 'none';
            $q.when(true);
        }

        function showElement(element_class) {
            var elem = angular.element(document.querySelector("." + element_class));
            elem.style.display = 'block';
            $q.when(true);
        }

        function getTipoDefinition(tipo_name, disableExpansion) {
            tipoRouter.startStateChange();
            return tipoDefinitionDataService.getOne(tipo_name, true).then(function(response) {
                tipoRouter.endStateChange();
                return response;
            });
        }

        function callAction(tipo_name, action_name, selected_tipo_ids, additional_tipo_name, additional_tipo) {
            tipoRouter.startStateChange();
            var additional_tipo = { tipo: additional_tipo };
            tipoManipulationService.modifyTipoData(additional_tipo.tipo);
            if (selected_tipo_ids.length === 1) {
                return tipoInstanceDataService.performSingleAction(tipo_name, selected_tipo_ids[0], action_name, additional_tipo_name, additional_tipo.tipo).then(function(response) {
                    tipoRouter.endStateChange();
                    return response;
                });
            } else {
                return tipoInstanceDataService.performBulkAction(tipo_name, action_name, selected_tipo_ids, additional_tipo_name, additional_tipo.tipo).then(function(response) {
                    tipoRouter.endStateChange();
                    return response;
                });
            }
        }

        function routeTo(url) {
            $location.url(url);
            // $q.when(true);
        }

        function toTipo(mode, tipo_name, tipo_id) {
            if (mode === 'view') {
                tipoRouter.toTipoView(tipo_name, tipo_id);
            } else if (mode === 'edit') {
                tipoRouter.toTipoEdit(tipo_name, tipo_id);
            } else if (mode === 'create') {
                tipoRouter.toTipoCreate(tipo_name);
            } else if (mode === 'list') {
                tipoRouter.toTipoList(tipo_name);
            };
        }

        function saveTipo(tipo_name, tipo_id, tipo_data) {
            tipoRouter.startStateChange();
            return tipoInstanceDataService.updateOne(tipo_name, tipo_data, tipo_id).then(function(response) {
                tipoRouter.endStateChange();
                return response;
            });
        }

        function saveTipos(tipo_name, tipo_data) {
            return tipoInstanceDataService.updateAll(tipo_name, tipo_data);
        }

        function createTipo(tipo_name, tipo_data, query_params) {
            return tipoInstanceDataService.upsertAll(tipo_name, [tipo_data]);
        }

        function createTipos(tipo_name, tipo_data, query_params) {
            return tipoInstanceDataService.upsertAll(tipo_name, tipo_data);
        }

        function deleteTipo(tipo_name, tipo_id) {
            return tipoInstanceDataService.deleteOne(tipo_name, tipo_id);
        }

        function getTipo(tipo_name, tipo_id, query_params, reload) {
            // tipoCache.evict(tipo_name, tipo_id);
            query_params = tipoManipulationService.checkQueryParams(query_params);
            return tipoInstanceDataService.getOne(tipo_name, tipo_id, query_params, reload);
        }

        function purgeAllTemplates(tipo_name) {
            tipoInstanceDataService.purgeTemplate(updateUrl(tipo_name));
            tipoInstanceDataService.purgeTemplate(createUrl(tipo_name));
            tipoInstanceDataService.purgeTemplate(detailUrl(tipo_name));
            tipoInstanceDataService.purgeTemplate(listUrl(tipo_name));
        }

        function purgeTipo(tipo_name, tipo_id) {
            tipoCache.evict(tipo_name, tipo_id);
            return purgeTipos(tipo_name);
        }

        function purgeTipos(tipo_name) {
            purgeAllTemplates(tipo_name);
            return tipoInstanceDataService.purgeAll(tipo_name);
        }

        function getTipos(tipo_name, query_params) {
            tipoRouter.startStateChange();
            query_params = tipoManipulationService.checkQueryParams(query_params);
            return tipoInstanceDataService.search(tipo_name, query_params).then(function(response) {
                tipoRouter.endStateChange();
                return response;
            });
        }

        function presentForm(tipo_name, tipo, submit_label, show_cancel) {
            var newScope = {};
            newScope.context = tipo;
            newScope.tipo_name = tipo_name;
            newScope.submit_label = submit_label;
            var promise = $mdDialog.show({
                templateUrl: 'framework/_directives/_views/tp-action-dialog.tpl.html',
                controller: TipoActionDialogController,
                controllerAs: 'tipoRootController',
                resolve: /*@ngInject*/ {
                    tipoDefinition: function(tipoManipulationService) {
                        return getTipoDefinition(tipo_name);
                    },
                    tipoDialogInputs: function() {
                        return { context: tipo, tipo_name: tipo_name, submit_label: submit_label }
                    }
                },
                skipHide: true,
                clickOutsideToClose: true,
                fullscreen: true
            });
            return promise;
        }

        function showMessage(user_heading, user_message) {
            var toast = $mdToast.tpToast();
            toast._options.locals = {
                header: user_heading,
                body: user_message
            };
            $mdToast.show(toast);
            $q.when(true);
        };

        function updateUrl(tipo_name) {
            return "g/public/gen_temp/common/views/update.tpl.html." + role + "___" + tipo_name;
        }

        function createUrl(tipo_name) {
            return "g/public/gen_temp/common/views/create.tpl.html." + role + "___" + tipo_name;
        }

        function detailUrl(tipo_name) {
            return "g/public/gen_temp/common/views/view.tpl.html." + role + "___" + tipo_name;
        }

        function listUrl(tipo_name) {
            return "g/public/gen_temp/common/views/list.tpl.html." + role + "___" + tipo_name;
        }

        function getISODate() {
            return tipoManipulationService.getISODate();
        }



        function setPerspective() {
            this.perspective = tipoManipulationService.resolvePerspectiveMetadata();
            this.perspective.tipo_name = this.perspective.tipoName;
            this.perspective.display_name = this.perspective.displayName;
            this.perspective.field_name = this.perspective.fieldName;
            this.perspective.tipo_id = this.perspective.tipoId;
        }

        function setMenuItem(menu_item) {
            this.menu_item = menu_item;
        }

        function getMenuItem() {
            return this.menu_item;
        }

        function getTourItem(tour_item) {
            var filter = {};
            filter.tipo_fields = tour_item;
            return getTipo(TOUR_TIPO, TOUR_TIPO_ID, filter)
        }

        function turnOffTour(tour_item, tipo) {
            tipo[tour_item] = true;
            saveTipo(TOUR_TIPO, TOUR_TIPO_ID, tipo);
        }

        function trackEvent(event_name) {
            getTourItem().then(function(tipo) {
                if (!tipo[event_name]) {
                    window.Intercom("trackEvent", event_name);
                    setTimeout(function() {
                        window.Intercom('update');
                        turnOffTour(event_name, tipo);
                    }, 5000);
                }
            });
        }

        function setTourObject(tour_item, tour_options, tipo) {
            ngIntroService.clear();
            ngIntroService.setOptions(tour_options);
            if (tipo) {
                ngIntroService.onExit(function() {
                    turnOffTour(tour_item, tipo);
                });
                ngIntroService.onComplete(function() {
                    turnOffTour(tour_item, tipo);
                });
            };
            ngIntroService.start();
        }

        function setMeta() {
            this.user_meta = metadataService.userMetadata;
            this.application_meta = metadataService.applicationMetadata;
            if (metadataService.userMetadata && metadataService.userMetadata.role) {
                role = metadataService.userMetadata.role;
            } else {
                role = "TipoUser";
            }
        }

        function sendHttpRequest(method, url, headers, data, successCallback, errorCallback) {
            $http({
                method: method,
                url: url,
                headers: headers,
                data: data
            }).then(function(response) {
                successCallback(response);
            }, function(error) {
                errorCallback(error);
            })
        }

        function sendProxyHttp(method, url, headers, data, successCallback, errorCallback) {
            var tipo_data = {
                url: url,
                headers: headers,
                method: method,
                body: btoa(JSON.stringify(data))
            }
            saveTipo("TipoSpecial.TipoHttp", "default", tipo_data).then(function(response) {
                successCallback(response)
            }, function(error) {
                errorCallback(error);
            });
        }

        function sendPushNotification(title, text, to, is_important, tipo_name, tipo_id, perspective, mode, actions, image_url) {
            var headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic $tipo_context.integration_map.pushcoms.serverApiKey"
            }
            var body = {
                app_id: "$tipo_context.integration_map.pushcoms.appId",
                headings: { en: title },
                contents: { en: text },
                filters: [],
                buttons: [],
                data: {
                    tipo_name: tipo_name,
                    tipo_id: tipo_id,
                    perspective: perspective,
                    mode: mode,
                    is_important: is_important
                },
                ios_attachments: {id1: image_url},
                big_picture: image_url
            };
            body.data.url = $window.location.origin + $window.location.pathname;
            if (_.endsWith(body.data.url, "/")) {
                body.data.url = body.data.url.slice(0, -1);
            };

            function successCallback(response) {
                console.log("Success: ", response);
            }

            function errorCallback(error) {
                console.log("Error: ", error);
            }
            if (_.isArray(to)) {
                var context = this;
                _.each(to, function(each_topic, index) {
                    body.filters.push({
                        field: "tag",
                        key: context.application_meta.TipoApp.application_owner_account + "." + context.application_meta.TipoApp.application + "." + context.user_meta.account + ".tipo_id",
                        relation: "=",
                        value: encodeURIComponent(each_topic)
                    })
                    if (index < to.length - 1) {
                        body.filters.push({
                            operator: "OR"
                        })
                    };
                });
                body.condition = condition;
            } else if (S(to).contains(" ")) {
                body.condition = to;
            } else if (S(to).contains("@")) {
                body.filters.push({
                    field: "tag",
                    key: this.application_meta.TipoApp.application_owner_account + "." + this.application_meta.TipoApp.application + "." + this.user_meta.account + ".tipo_id",
                    relation: "=",
                    value: encodeURIComponent(to)
                });
            } else {
                body.filters.push({
                    field: "tag",
                    key: this.application_meta.TipoApp.application_owner_account + "." + this.application_meta.TipoApp.application + ".role",
                    relation: "=",
                    value: to
                });
            }
            _.each(actions,function(action){
                body.buttons.push({
                    id: action.action_name,
                    text: action.label,
                    icon: action.icon
                });
                var action_item = {
                    action_type: action.type,
                    tipo_name: action.tipo_name,
                    tipo_id: action.tipo_id,
                    perspective: action.perspective,
                    url: body.data.url,
                    mode: action.mode
                }
                _.set(body.data, "actions." + action.action_name,action_item);
            });
            sendProxyHttp("POST", "https://onesignal.com/api/v1/notifications", headers, body, successCallback, errorCallback);
        }


        this.user_meta = metadataService.userMetadata;
        this.application_meta = metadataService.applicationMetadata;
        this.getConfirmation = getConfirmation;
        this.hideElement = hideElement;
        this.showElement = showElement;
        this.getTipoDefinition = getTipoDefinition;
        this.routeTo = routeTo;
        this.saveTipo = saveTipo;
        this.saveTipos = saveTipos;
        this.createTipo = createTipo;
        this.createTipos = createTipos;
        this.deleteTipo = deleteTipo;
        this.getTipo = getTipo;
        this.purgeTipo = purgeTipo;
        this.getTipos = getTipos;
        this.presentForm = presentForm;
        this.showMessage = showMessage;
        this.callAction = callAction;
        this.toTipo = toTipo;
        this.setPerspective = setPerspective;
        this.setMenuItem = setMenuItem;
        this.getMenuItem = getMenuItem;
        this.getTourItem = getTourItem;
        this.setTourObject = setTourObject;
        this.getISODate = getISODate;
        this.listUrl = listUrl;
        this.updateUrl = updateUrl;
        this.createUrl = createUrl;
        this.detailUrl = detailUrl;
        this.setMeta = setMeta;
        this.trackEvent = trackEvent;
        this.sendHttpRequest = sendHttpRequest;
        this.sendPushNotification = sendPushNotification;
        this.sendProxyHttp = sendProxyHttp;

    }

    // Added Tipo Handle Service in Custom Module
    angular.module('tipo.framework')
        .service('tipoHandle', TipoHandle)
        .constant('tipoHandleString', TipoHandle.toString());

})();