(function() {

    'use strict';

    var module = angular.module('tipo.framework')
        .controller('TipoObjectDialogController', TipoObjectDialogController);

    function TipoObjectDialogController(
        tipoManipulationService,
        tipoRegistry,
        tipoDefinition,
        $scope,
        $timeout,
        $mdDialog,
        tipoCache,
        tipoRouter,
        tipoInstanceDataService,
        tipoHandle,
        tipoClientJavascript,
        tipoCustomJavascript) {

        var _instance = this;
        _instance.tipoDefinition = tipoDefinition;
        _instance.activeTab = 'main';
        _instance.popup = true;
        _instance.selectedTipos = $scope.selectedTipos;
        _instance.ngModel = $scope.ngModel;
        _instance.root = $scope.root;
        _instance.queryparams = $scope.queryparams;
        _instance.tipo_name = $scope.tipo_name;
        _instance.listUrl = tipoHandle.listUrl(_instance.tipo_name);
        _instance.hideActions = true;
        _instance.bulkedit = true;
        $scope.fullscreen = true;
        $scope.data_handle = {};
        _instance.hasTipos = true;
        _instance.disablecreate = $scope.disablecreate;

        function initselectedTipos() {
            _.each(_instance.infiniteItems.tipos, function(tipo) {
                if (tipo.edit) {
                    tipo.edit = false;
                };
                _.each(_instance.selectedTipos, function(selected) {
                    if (tipo[$scope.key_field] === selected[$scope.key_field] && !_.isUndefined(tipo[$scope.key_field])) {
                        tipo.selected = true;
                    }
                })
            });
        };
        _instance.infiniteItems = $scope.infiniteItems;
        _instance.infiniteItems.fetchMoreItems_("", 1);
        _instance.steps = tipoManipulationService.calculatePageViews();
        _instance.infiniteItems.serverResultHandler = function(page) {
            this.tipos = _.uniqWith(this.tipos, _.isEqual);
            _instance.tipos = this.tipos;
            if (page === 1) {
                var tipo_perm = tipoRegistry.get(_instance.tipo_name + '_resdata');
                _instance.perm = tipo_perm.perm;
                if (tipo_perm.perm.substr(2, 1) === 0) {
                    _instance.disablecreate = true;
                }
                if (_instance.tipos.length === 0) {
                    _instance.hasTipos = false;
                };
                initselectedTipos();
            };
        };
        _instance.maximize = function() {
            $scope.fullscreen = true;
        };

        _instance.restore = function() {
            $scope.fullscreen = false;
        };

        _instance.selectTipo = function(tipoSelected, event, tiposData) {
            if (typeof tipoCustomJavascript[$scope.tipo_name + '_OnClick'] === 'function') {
                tipoRouter.startStateChange();
                $scope.data_handle.selected_tipo = tipoSelected;
                $scope.data_handle.tipo_name = $scope.tipo_name;
                $scope.data_handle.queryparams = $scope.queryparams;
                $scope.data_handle.event = event;
                var proceedcustom = tipoCustomJavascript[$scope.tipo_name + '_OnClick']($scope.data_handle);
            } else {
                var proceedcustom = true;
            }
            if (typeof tipoClientJavascript[$scope.tipo_name + '_OnClick'] === 'function') {
                tipoRouter.startStateChange();
                $scope.data_handle.selected_tipo = tipoSelected;
                $scope.data_handle.tipo_name = $scope.tipo_name;
                $scope.data_handle.queryparams = $scope.queryparams;
                $scope.data_handle.event = event;
                var proceed = tipoClientJavascript[$scope.tipo_name + '_OnClick']($scope.data_handle);
            } else {
                var proceed = true;
            }
            if (proceed && proceedcustom) {
                if (!$scope.isarray) {
                    _.each(tiposData, function(tipo) {
                        tipo.selected = false;
                        _instance.selectedTipos = [];
                    });
                }
                tipoSelected.selected = !tipoSelected.selected;
                if (tipoSelected.selected) {
                    _instance.selectedTipos.push(tipoSelected);
                } else {
                    _.remove(_instance.selectedTipos, function(tipo) {
                        return tipo[$scope.key_field] === tipoSelected[$scope.key_field];
                    });
                }
                if (event) {
                    event.stopPropagation();
                };
            };
        }
        _instance.finish = function() {
            $mdDialog.hide(_instance.selectedTipos);
        };

        _instance.cancel = function() {
            $mdDialog.cancel();
        };

        _instance.addTipo = function() {
            var newScope = $scope.$new();
            newScope.hide_actions = true;
            newScope.tipo_name = _instance.tipoDefinition.tipo_meta.tipo_name;
            newScope.queryparams = _instance.queryparams;
            var promise = $mdDialog.show({
                templateUrl: 'framework/_directives/_views/tp-lookup-popup-select-new.tpl.html',
                controller: 'TipoEditRootController',
                controllerAs: 'tipoRootController',
                scope: newScope,
                resolve: /*@ngInject*/ {
                    tipo: function() {
                        return undefined;
                    },
                    tipoDefinition: function() {
                        return _instance.tipoDefinition;
                    }
                },
                skipHide: true,
                clickOutsideToClose: true,
                fullscreen: true
            });
            promise.then(function(tipos) {
                if (_.isArray(tipos)) {
                    _instance.infiniteItems.fetchMoreItems_("", 1);
                };
                tipoRouter.endStateChange();
            })
            return promise;
        };

        _instance.search = function() {
            var filter = {};
            filter = _instance.queryparams;
            if(_.isEmpty(_instance.searchText)) {
                delete filter.tipo_filter;
            } else if (!_.isEmpty(_instance.searchText) && !filter.tipo_filter) {
                filter.tipo_filter = "(_all:(" + _instance.searchText + "*))";
            } else if (!_.isEmpty(_instance.searchText) && filter.tipo_filter && !_.isEmpty(filter.tipo_filter)) {
                filter.tipo_filter = filter.tipo_filter + " AND (_all:(" + _instance.searchText + "*))";
            }
            var page = 1;
            filter.page = angular.copy(page);
            filter.per_page = _instance.tipoDefinition.tipo_meta.default_page_size;
            tipoRouter.startStateChange();
            tipoCache.evict($scope.tipo_name);
            tipoInstanceDataService.search($scope.tipo_name, filter).then(function(tiposData) {
                tiposData = _.uniqWith(tiposData, _.isEqual);
                _instance.infiniteItems.filter = filter;
                _instance.infiniteItems.page = page;
                _instance.infiniteItems.tipos = tiposData;
                var responseData = tipoRegistry.get($scope.tipo_name + '_resdata');
                _instance.infiniteItems.numLoaded_ = responseData.count;
                _instance.infiniteItems.maxpages = Math.ceil(responseData.count / filter.per_page);
                page++;
                tipoRouter.endStateChange();
            });
        }

        $scope.$watch(function() { return _instance.tipos; }, function() {
            initselectedTipos();
        })

        $scope.$watch(function() { return $scope.data_handle.tipo_list }, function(new_value, old_value) {
            if ($scope.data_handle.tipo_list) {
                _instance.infiniteItems.tipos = $scope.data_handle.tipo_list;
                _instance.tipos = $scope.data_handle.tipo_list;
            };
        });
    }
    return module.directive('tpLookup', function(
        tipoInstanceDataService,
        tipoManipulationService,
        tipoRouter,
        tipoRegistry,
        tipoHandle,
        $mdDialog,
        $mdSelect,
        $timeout,
        $stateParams,
        $compile,
        tipoClientJavascript,
        tipoCustomJavascript) {
        return {
            require: 'ngModel',
            scope: {
                root: '=',
                context: '=',
                parent: '=',
                index: '=',
                fieldname: '=',
                fqfieldname: '=',
                fieldlabel: '=',
                basefilter: '=',
                realtedtipo: '=',
                isarray: '=',
                ispopup: '=',
                queryparams: '=',
                istipomandatory: '=',
                labelfield: '=',
                allowcreate: '=',
                selectfield: '=',
                selectkeyfield: '=',
                selectlabelfield: '=',
                labelexpression: '=',
                readOnly: '='
            },
            restrict: 'EA',
            replace: true,
            template: '<ng-include src="fieldTemplate" tp-include-replace/>',
            link: function(scope, element, attrs, ctrl) {
                // Initialize
                scope._ = _;
                scope.data_handle = {};
                scope.model = {};
                var isarray = Boolean(scope.isarray);
                scope.isMandatory = Boolean(scope.istipomandatory);
                var fqfieldname = scope.fqfieldname.replace("index", scope.index);
                var fieldTemplate;
                if (isarray) {
                    fieldTemplate = 'framework/_directives/_views/tp-lookup-multiple.tpl.html';
                } else {
                    fieldTemplate = 'framework/_directives/_views/tp-lookup-single.tpl.html';
                }
                scope.fieldTemplate = fieldTemplate;

                var basefilter = scope.basefilter;
                scope.tipo_name = scope.realtedtipo;
                scope.key_field = scope.selectkeyfield || 'tipo_id';
                scope.label_field = scope.selectlabelfield || scope.labelfield || 'tipo_id';
                var key_field = scope.key_field;
                var label_field = scope.label_field;
                if (!scope.allowcreate) {
                    scope.disablecreate = true;
                } else {
                    scope.disablecreate = false;
                }

                function optionsFormat(results) {
                    return _.map(results, function(each) {
                        var option = {}
                        _.set(option, key_field, _.get(each, key_field));
                        _.set(option, label_field, _.get(each, label_field));
                        return option;
                    });
                }

                // function extractDropdownList(tipo_data,options,startName,remName){
                //   if (!startName) {
                //     if (_.isArray(tipo_data[remName])) {
                //       _.each(tipo_data[remName],function(each){
                //         options.push({
                //           key: each,
                //           label: each
                //         });
                //       })
                //     }else{
                //       options.push({
                //         key: tipo_data[remName],
                //         label: tipo_data[remName]
                //       });
                //     }
                //     return;
                //   };
                //   if (_.isArray(tipo_data[startName])) {
                //     _.each(tipo_data[startName],function(each){
                //       extractDropdownList(each,options,remName.substr(0,remName.indexOf('.')),remName.substr(remName.indexOf('.') + 1));
                //     });
                //   }else{
                //     extractDropdownList(tipo_data[startName],options,remName.substr(0,remName.indexOf('.')),remName.substr(remName.indexOf('.') + 1));
                //   }
                // }

                function numDigits(x) {
                    return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
                }

                function initmodel(initdirective) {
                    if (scope.tipos && !initdirective) {
                        scope.model.field = _.filter(scope.tipos, function(o) { return _.includes(scope.ngModel, o[key_field]) });
                        if (!isarray) {
                            scope.model.field = scope.model.field[0];
                        };
                    } else {
                        scope.initload = true;
                        scope.ngModel = _.get(scope.root, fqfieldname);
                        scope.fieldlabel = _.get(scope.root, fqfieldname + "_labels");
                        if (isarray) {
                            scope.model.field = [];
                            if (!_.isUndefined(scope.ngModel)) {
                                scope.options = [];
                                var singlefield = {};
                                _.each(scope.ngModel, function(value, key) {
                                    _.set(singlefield, key_field, value);
                                    _.set(singlefield, label_field, scope.fieldlabel[key]);
                                    scope.model.field.push(singlefield);
                                    singlefield = {};
                                });
                                scope.options.push(scope.model.field);
                            }
                        } else {
                            scope.model.field = {};
                            if (_.isUndefined(scope.ngModel)) {
                                scope.fieldlabel = "";
                            } else {
                                scope.options = [];
                                _.set(scope.model.field, key_field, scope.ngModel);
                                _.set(scope.model.field, label_field, scope.fieldlabel || scope.ngModel);
                                scope.fieldlabel = scope.fieldlabel || scope.ngModel;
                                scope.options.push(scope.model.field);
                            }
                        }
                        // scope.infiniteItems = {
                        //   getItemAtIndex: function(index){
                        //     return scope.options[index];
                        //   },
                        //   getLength: function(index){
                        //     return scope.options.length;
                        //   }
                        // };
                    }
                }
                initmodel();

                scope.afterlookupEvent = function() {
                    var function_name = $stateParams.tipo_name + '_' + fqfieldname.replace(/\./g, "_").replace(/\[\d\]/g, "") + '_AfterLookup';
                    if (typeof tipoCustomJavascript[function_name] === 'function') {
                        // _.join(_.dropRight(fqfieldname.split(".")),".") used for initial client side js
                        scope.data_handle.root = scope.root;
                        scope.data_handle.context = scope.context;
                        scope.data_handle.tipo_list = scope.model.field;
                        scope.data_handle.options = scope.options;
                        tipoCustomJavascript[function_name](scope.root, scope.context, scope.model.field, scope.options);
                    }
                    if (typeof tipoClientJavascript[function_name] === 'function') {
                        // _.join(_.dropRight(fqfieldname.split(".")),".") used for initial client side js
                        scope.data_handle.root = scope.root;
                        scope.data_handle.context = scope.context;
                        scope.data_handle.tipo_list = scope.model.field;
                        scope.data_handle.options = scope.options;
                        tipoClientJavascript[function_name](scope.root, scope.context, scope.model.field, scope.options);
                    }
                }
                scope.triggerDropdown = function(searchText) {
                    scope.initload = false;
                    scope.options = [];
                    return $timeout(function() {
                        scope.$broadcast("$md-resize");
                        scope.loadOptions(searchText);
                    }, 100);
                }

                scope.loadOptions = function(searchText, page_size) {
                    // delete scope.options;
                    var searchCriteria = {};
                    var filter;
                    var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
                    /*if(tipo_name !== perspectiveMetadata.tipoName){
                      filter = perspectiveMetadata.tipoFilter;
                    }*/
                    // if (!_.isUndefined(scope.$parent.recursiveGroupRef) && !_.isUndefined(scope.index)) {
                    //   scope.arrayindex = scope.$parent.recursiveGroupRef.arrayindex + scope.index.toString();
                    //   scope.digits = scope.$parent.recursiveGroupRef.digits + numDigits(scope.index).toString();
                    //   scope.field_names = scope.$parent.recursiveGroupRef.field_names + scope.field_name + "/";
                    // }else{
                    //   if (!_.isUndefined(scope.index)) {
                    //     scope.arrayindex = scope.index.toString(); 
                    //     scope.digits = numDigits(scope.index).toString(); 
                    //     scope.field_names = scope.field_name + "/";
                    //   }
                    //   else if (!_.isUndefined(scope.$parent.recursiveGroupRef)) {
                    //     scope.arrayindex = scope.$parent.recursiveGroupRef.arrayindex;
                    //     scope.digits = scope.$parent.recursiveGroupRef.digits ;
                    //     scope.field_names = scope.$parent.recursiveGroupRef.field_names;
                    //   }
                    // }
                    if (!_.isUndefined(basefilter)) {
                        // scope.basefilter = "jsdsjjnjsj {{root.integer_4}}";
                        // var linkFn = $compile(scope.basefilter);
                        // var linkedContent = linkFn(scope);
                        //  scope.$apply();
                        //  var result = linkedContent.html();
                        var basefilterExpanded = scope.basefilter;
                        filter = basefilterExpanded;
                    }
                    if (!_.isUndefined(filter) && filter !== "") {
                        searchCriteria.tipo_filter = filter;
                    }
                    if ((scope.selectkeyfield && !_.isEmpty(scope.selectkeyfield)) || (scope.selectlabelfield && !_.isEmpty(scope.selectlabelfield))) {
                        // searchCriteria.tipo_fields = key_field + ',' + label_field;
                    };
                    searchCriteria.page = 1;
                    // If for the dropdown we require custom page size then we can get from the page_size parameter
                    searchCriteria.per_page = page_size || 10;
                    if (!_.isEmpty(scope.queryparams)) {
                        var contextTipo = _.join(_.dropRight(scope.fqfieldname.split("."), 1), ".");
                        contextTipo = contextTipo.replace("[index", "[" + scope.index);
                        contextTipo = contextTipo.replace("$index", scope.index);
                        _.forOwn(scope.queryparams, function(value, key) {
                            value = value.replace("$index", scope.index);
                            value = value.replace("[index", "[" + scope.index);
                            if (value.indexOf("$tipo") !== -1 || value.indexOf("$tipo_root") !== -1) {
                                if (value.indexOf("$tipo") !== -1 && contextTipo != "") {
                                    value = value.replace("$tipo.", "$tipo." + contextTipo + ".");
                                };
                                value = value.replace("$tipo.", "").replace("$tipo_root.", "");
                                var baseParamExpanded = _.get(scope.root, value) || '___NA___';
                            } else {
                                var baseParamExpanded = value;
                            }
                            searchCriteria[key] = baseParamExpanded;
                        })
                    };
                    if (!_.isUndefined(searchCriteria.tipo_filter) && !_.isEmpty(searchCriteria.tipo_filter) && !_.isUndefined(searchText)) {
                        searchCriteria.tipo_filter += " AND (" + key_field + ":(" + searchText + "*) OR " + label_field + ":(" + searchText + "*))";
                    } else {
                        if (!_.isUndefined(searchText)) {
                            searchCriteria.tipo_filter = "(" + key_field + ":(" + searchText + "*) OR " + label_field + ":(" + searchText + "*))";
                        }
                    };
                    searchCriteria.list_display = 'N';
                    if (isarray && scope.ngModel && scope.ngModel.length > 0) {
                        searchCriteria.must_include_key = key_field;
                        searchCriteria.must_include_values = _.join(scope.ngModel, ',');
                        searchCriteria.must_include_values = tipoManipulationService.addEscElascticReservedKeys(searchCriteria.must_include_values);
                    } else if (!isarray && scope.ngModel && scope.ngModel !== "") {
                        searchCriteria.must_include_key = key_field;
                        searchCriteria.must_include_values = scope.ngModel;
                        searchCriteria.must_include_values = tipoManipulationService.addEscElascticReservedKeys(searchCriteria.must_include_values);
                    }
                    var function_name = $stateParams.tipo_name + '_' + fqfieldname.replace(/\./g, "_").replace(/\[\d\]/g, "") + '_BeforeLookup';
                    scope.data_handle.root = scope.root;
                    scope.data_handle.context = scope.context;
                    scope.data_handle.searchCriteria = searchCriteria;
                    scope.data_handle.tipo_name = scope.tipo_name;
                    scope.data_handle.key_field = scope.key_field;
                    scope.data_handle.label_field = scope.label_field;
                    if (typeof tipoCustomJavascript[function_name] === 'function') {
                        var return_value = tipoCustomJavascript[function_name](scope.data_handle);
                        if (return_value === "set_infiniteItems") {
                            scope.infiniteItems = angular.copy(scope.data_handle.infiniteItems);
                        };
                    }
                    if (typeof tipoClientJavascript[function_name] === 'function') {
                        tipoClientJavascript[function_name](scope.data_handle);
                    }
                    if (!return_value) {
                        if (!scope.ispopup) {
                            searchCriteria.drop_down = 'Y';
                            searchCriteria.key_field = scope.data_handle.key_field;
                            searchCriteria.label_field = scope.data_handle.label_field;
                        };
                        console.log(element);
                        scope.searchCriteria = scope.data_handle.searchCriteria;
                        scope.infiniteItems = tipoManipulationService.getVirtualRepeatObject(scope.searchCriteria.per_page, scope.data_handle.tipo_name, tipoHandle.getTipos, scope.searchCriteria);
                        scope.infiniteItems.serverResultHandler = function(page) {
                            this.tipos = _.uniqWith(this.tipos, _.isEqual);
                            scope.tipos = _.uniqWith(this.tipos, _.isEqual);
                            scope.options = optionsFormat(scope.tipos);
                            initmodel();
                            scope.afterlookupEvent();
                            if (page === 1) {
                                var tipo_perm = tipoRegistry.get(scope.tipo_name + '_resdata');
                                scope.perm = tipo_perm.perm;
                                if (tipo_perm.perm.substr(2, 1) === 0) {
                                    scope.disablecreate = true;
                                }
                            };
                        };
                    };
                };

                scope.searchTerm = {};
                scope.cleanup = function() {
                    delete scope.searchTerm.text;
                    if (!isarray) {
                        scope.ngModel = scope.model.field[key_field];
                        scope.fieldlabel = scope.getLabel(scope.model.field);
                    } else {
                        scope.ngModel = [];
                        scope.fieldlabel = [];
                        _.each(scope.model.field, function(val) {
                            scope.ngModel.push(val[key_field]);
                            scope.fieldlabel.push(scope.getLabel(val));
                        });
                    }
                    if (attrs.ngChange) {
                        _.set(scope.root, fqfieldname + "_labels", scope.fieldlabel);
                    };
                    ctrl.$setViewValue(scope.ngModel);
                };

                scope.stopBubbling = function(event) {
                    event.stopPropagation();
                };

                //template setting
                _.templateSettings.interpolate = /{([\s\S]+?)}/g;
                if (scope.labelexpression && (scope.labelexpression.indexOf("$tipo") !== -1 || scope.labelexpression.indexOf("$tipo_root") !== -1)) {
                    // var labelexpression = _.replace(scope.labelexpression,/$tipo./, "");
                    var labelexpression = scope.labelexpression.replace(/\$tipo\./g, "").replace("$tipo_root.", "");
                    var compiled = _.template(labelexpression);
                }
                var label;
                scope.getLabel = function(option) {
                    if (labelexpression && !_.isNull(option)) {
                        label = compiled(option);
                    } else {
                        label = _.get(option, label_field);
                    }
                    return label;
                }

                scope.renderSelection = function() {
                    var text = '<div class="placeholder"> </div>';
                    if ((_.isArray(scope.fieldlabel) && scope.fieldlabel.length)) {
                        text = '<div class="multiple-list">';
                        _.each(scope.fieldlabel, function(each) {
                            text += '<div>' + each + '</div>';
                        });
                        text += '</div>';
                    } else if (scope.model.field && scope.getLabel(scope.model.field)) {
                        text = '<div class="multiple-list">';
                        text += '<div>' + scope.getLabel(scope.model.field) + '</div>';
                        text += '</div>';
                    }
                    return text;
                };

                if (scope.ispopup) {
                    tipoHandle.getTipoDefinition(scope.tipo_name).then(function(definition) {
                        var searchText;
                        scope.popupDefinition = definition;
                    });
                }

                function openTipoObjectDialog() {
                    var searchText;
                    scope.loadOptions(searchText, scope.popupDefinition.tipo_meta.default_page_size);
                    var newScope = scope.$new();
                    newScope.isarray = isarray;
                    newScope.field = scope.context;
                    newScope.disablecreate = scope.disablecreate;
                    newScope.tipo_name = scope.tipo_name;
                    newScope.root = scope.root;
                    newScope.perm = scope.perm;
                    newScope.queryparams = scope.searchCriteria;
                    newScope.label_field = label_field;
                    newScope.key_field = key_field;
                    if (!isarray) {
                        newScope.selectedTipos = [scope.model.field];
                    } else {
                        newScope.selectedTipos = scope.model.field;
                    }
                    var promise = $mdDialog.show({
                        templateUrl: 'framework/_directives/_views/tp-lookup-popup-select.tpl.html',
                        controller: TipoObjectDialogController,
                        controllerAs: 'tipoRootController',
                        scope: newScope,
                        resolve: /*@ngInject*/ {
                            tipoDefinition: function(tipoManipulationService) {
                                return scope.popupDefinition;
                            }
                        },
                        skipHide: true,
                        clickOutsideToClose: true,
                        fullscreen: true
                    });
                    return promise;
                }

                scope.tipoSearch = function(searchText) {
                    scope.loadOptions(searchText);
                };

                scope.addTipo = function() {
                    var newScope = scope.$new();
                    newScope.tipo_name = scope.tipo_name;
                    newScope.hide_actions = true;
                    newScope.fullscreen = true;
                    $mdSelect.hide();
                    var promise = $mdDialog.show({
                        templateUrl: 'framework/_directives/_views/tp-lookup-popup-select-new.tpl.html',
                        controller: 'TipoEditRootController',
                        controllerAs: 'tipoRootController',
                        scope: newScope,
                        fullscreen: true,
                        resolve: /*@ngInject*/ {
                            tipo: function() {
                                return undefined;
                            },
                            tipoDefinition: function(tipoHandle) {
                                return tipoHandle.getTipoDefinition(scope.tipo_name);
                            }
                        },
                        skipHide: true,
                        clickOutsideToClose: true
                    });
                    promise.then(function(tipos) {
                        if (_.isArray(tipos)) {
                            scope.loadOptions();
                        };
                        tipoRouter.endStateChange();
                    })
                    return promise;
                };

                scope.clearModel = function() {
                    scope.selectedTipos = [];
                    if (isarray) {
                        scope.model.field = [];
                        scope.ngModel = [];
                        scope.fieldlabel = [];
                    } else {
                        scope.model.field = {};
                        scope.ngModel = "";
                        scope.fieldlabel = "";
                    }
                    ctrl.$setViewValue(scope.ngModel);
                }

                scope.tipoObjecSelectiontDialog = function() {
                    var promise = openTipoObjectDialog();
                    promise.then(function(selectedObjects) {
                        tipoRouter.endStateChange();
                        scope.model.field = optionsFormat(selectedObjects);
                        if (!isarray) {
                            scope.model.field = scope.model.field[0];
                        }
                        scope.cleanup();
                    }, function() {
                        tipoRouter.endStateChange();
                    });
                }

                ctrl.$viewChangeListeners.push(function() {
                    scope.$eval(attrs.ngChange);
                });

                scope.$watch(function() { return scope.data_handle.tipo_name }, function(new_value) {
                    if (new_value) {
                        scope.tipo_name = new_value;
                    };
                });
                scope.$watch(function() { return scope.data_handle.key_field }, function(new_value) {
                    if (new_value) {
                        scope.key_field = new_value;
                        key_field = new_value;
                    };
                })
                scope.$watch(function() { return scope.data_handle.label_field }, function(new_value) {
                    if (new_value) {
                        scope.label_field = new_value;
                        label_field = new_value;
                    };
                })
                scope.$watch(function() { return scope.ngModel }, function(new_value, old_value) {
                    var function_name;
                    if (isarray) {
                        if (new_value && old_value && new_value.length < old_value.length) {
                            function_name = $stateParams.tipo_name + "_" + fqfieldname.replace(/\./g, "_").replace(/\[\d\]/g, "") + "_OnArrayItemRemove";
                            scope.data_handle.item = _.difference(old_value, new_value);
                        };
                        if ((old_value && new_value && new_value.length > old_value.length) || (!old_value && new_value)) {
                            function_name = $stateParams.tipo_name + "_" + fqfieldname.replace(/\./g, "_").replace(/\[\d\]/g, "") + "_OnArrayItemAdd";
                            scope.data_handle.item = _.difference(new_value, old_value);
                        };
                        if (typeof tipoClientJavascript[function_name] === 'function') {
                            scope.data_handle.tipo = scope.root;
                            scope.data_handle.context = scope.context;
                            scope.data_handle.new_value = new_value;
                            tipoClientJavascript[function_name](scope.data_handle);
                        }
                    }
                    if (new_value !== old_value) {
                        if (!isarray) {
                            function_name = $stateParams.tipo_name + "_" + fqfieldname.replace(/\./g, "_").replace(/\[\d\]/g, "") + "_OnChange";
                            if (typeof tipoCustomJavascript[function_name] === 'function') {
                                scope.data_handle.tipo = scope.root;
                                scope.data_handle.context = scope.context;
                                scope.data_handle.old_value = old_value;
                                scope.data_handle.new_value = new_value;
                                scope.data_handle.new_object = scope.model.field;
                                scope.data_handle.label = scope.fieldlabel;
                                tipoCustomJavascript[function_name](scope.data_handle);
                                _.set(scope.ngModel, scope.data_handle.new_value);
                            }
                            if (typeof tipoClientJavascript[function_name] === 'function') {
                                scope.data_handle.tipo = scope.root;
                                scope.data_handle.context = scope.context;
                                scope.data_handle.old_value = old_value;
                                scope.data_handle.new_value = new_value;
                                scope.data_handle.label = scope.fieldlabel;
                                tipoClientJavascript[function_name](scope.data_handle);
                                _.set(scope.ngModel, scope.data_handle.new_value);
                            }
                        }
                        initmodel();
                    };
                    // if (scope.model.field.key !== scope.ngModel) {
                    //   scope.loadOptions();
                    //   if (!isarray) {
                    //     scope.model.field.key = scope.ngModel;
                    //     scope.model.field.label = scope.fieldlabel || angular.copy(scope.ngModel);
                    //   };
                    // };
                });
                scope.$watch(function() { return scope.fieldlabel }, function(new_value, old_value) {
                    if (new_value !== old_value) {
                        initmodel();
                    };
                });
            }
        };
    });

})();