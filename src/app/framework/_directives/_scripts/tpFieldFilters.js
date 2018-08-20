(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    function TipoFilterDialogController(fieldFilters, $scope,
        $timeout,
        $mdDialog,
        selectedfieldFilters,
        selectedfieldRangeFilters,
        selectedCustomFilters,
        multiSelect,
        filterLabel,
        tipoCustomFilters) {

        $scope.fieldFilters = fieldFilters;
        $scope.multiSelect = multiSelect;
        $scope.filterLabel = filterLabel;
        $scope.tipoCustomFilters = _.filter(tipoCustomFilters, function(filter) { return !filter.hidden_ });
        var filterObject = selectedfieldFilters || {};
        var filterRangeObject = selectedfieldRangeFilters || {};
        var filterExp = [];
        $scope.addToExpression = function(value, filter) {
            filterExp = _.get(filterObject, filter.key_) || [];
            if (value.selected) {
                filterExp.push(value.key);
            } else {
                _.remove(filterExp, function(o) { return o === value.key });
            }
            _.set(filterObject, filter.key_, filterExp);
        }
        $scope.addRangeToExpression = function(filter) {
            filterExp = _.get(selectedfieldRangeFilters, filter.key_) || [];
            if (filter.range && filter.type === 'date_time') {
                filterExp = [_.toUpper(filter.range)];
            } else if (filter.range) {
                filterExp = filter.range;
            } else {
                filterExp = [];
            }
            _.set(filterRangeObject, filter.key_, filterExp);
        }
        $scope.addCustomToExpression = function(filter) {
            filterExp = _.find(selectedCustomFilters, function(o) { return o === filter.display_name }) || [];
            if (filter.selected && filterExp.length === 0) {
                selectedCustomFilters.push(filter.display_name);
            } else if (!filter.selected && filterExp.length > 0) {
                _.remove(selectedCustomFilters, function(o) { return o === filter.display_name })
            }
        }
        $scope.finish = function() {
            var exp = "";
            _.each(filterObject, function(each, key) {
                exp = ((each.length > 0) && (exp + key + ".keyword:(" + _.join(each, " OR ") + ") AND ") || exp);
            });
            _.each(filterRangeObject, function(each, key) {
                exp = ((each.length > 0) && (exp + key + ":[" + _.join(each, " TO ") + "] AND ") || exp);
            });
            exp = exp.substring(0, exp.length - 5);
            if (exp !== "" && selectedCustomFilters.length > 0) {
                exp = exp + "&&" + selectedCustomFilters.join("&&");
            } else if (selectedCustomFilters.length > 0) {
                exp = exp + selectedCustomFilters.join("&&");
            }
            $mdDialog.hide(exp);
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }

    return module.directive('tpFieldFilters', function(
        tipoManipulationService,
        tipoInstanceDataService,
        tipoRouter,
        tipoRegistry,
        $mdDialog,
        $stateParams) {
        return {
            scope: {
                tipoName: '=',
                tipoFilters: '=',
                filterLabel: '=',
                multiSelect: '=',
                tipoCustomFilters: '='
            },
            restrict: 'EA',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-field-filters.tpl.html',
            link: function(scope, element, attrs) {
                var selectedfieldFilters = {};
                var selectedfieldRangeFilters = {};
                var customFilters = [];
                var tipoCustomFilters = angular.copy(scope.tipoCustomFilters);
                var tipo_name = scope.tipoName;
                function init() {
                    scope.fieldFilters = [];
                    if ($stateParams.filter) {
                        scope.filterApplied = true;
                        var selectedFilters = $stateParams.filter.split('&&');
                        var fieldFilterExp = "";
                        _.each(selectedFilters, function(filter) {
                            if (S(filter).contains(":")) {
                                var keyword = filter;
                                var key = keyword.slice(keyword.indexOf('.'), keyword.indexOf(':'));
                                fieldFilterExp = filter.replace(new RegExp(key, "g"), '');
                            } else {
                                customFilters.push(filter);
                            }
                        });
                        var fieldFilters = (fieldFilterExp !== "") && fieldFilterExp.split(" AND ") || undefined;
                        _.each(fieldFilters, function(filter) {
                            var startsWithBkts = filter.indexOf("(");
                            if (startsWithBkts !== -1) {
                                var eachfilters = filter.substring(startsWithBkts + 1, filter.indexOf(")")).split(" OR ");
                                _.set(selectedfieldFilters, filter.substring(0, filter.indexOf(":")), eachfilters);
                            } else {
                                var eachfilters = filter.substring(filter.indexOf("[") + 1, filter.indexOf("]")).split(" TO ");
                                _.set(selectedfieldRangeFilters, filter.substring(0, filter.indexOf(":")), eachfilters);
                            }
                        });
                        _.each(tipoCustomFilters, function(filter) {
                            _.each(customFilters, function(selectedfilter) {
                                if (filter.display_name == selectedfilter) {
                                    filter.selected = true;
                                };
                            })
                        });
                    };
                    getFiltersList();
                }

                scope.showFilters = function() {
                    $("#loader").addClass("loading");
                    init();
                }
                scope.loadDialog = function() {
                    $("#loader").removeClass("loading");
                    var promise = $mdDialog.show({
                        templateUrl: 'framework/_directives/_views/tp-field-filters-dialog.tpl.html',
                        controller: TipoFilterDialogController,
                        controllerAs: 'tipoRootController',
                        resolve: /*@ngInject*/ {
                            fieldFilters: function() {
                                return scope.fieldFilters;
                            },
                            selectedfieldFilters: function() {
                                return selectedfieldFilters;
                            },
                            selectedfieldRangeFilters: function() {
                                return selectedfieldRangeFilters;
                            },
                            selectedCustomFilters: function() {
                                return customFilters;
                            },
                            tipoCustomFilters: function() {
                                return tipoCustomFilters;
                            },
                            multiSelect: function() {
                                return scope.multiSelect;
                            },
                            filterLabel: function() {
                                return scope.filterLabel;
                            }
                        },
                        skipHide: true,
                        clickOutsideToClose: true,
                        fullscreen: true
                    });
                    promise.then(function(expression) {
                        tipoRouter.toTipoList(tipo_name, { filter: expression }, false, true);
                    });
                }

                function getFiltersList() {
                    _.each(scope.tipoFilters, function(each, inx) {
                        var filter = {};
                        each.fq_field_label = _.replace(each.fq_field_name, '.', '');
                        _.set(filter, "tipo_aggs", getElasticQuery(each));
                        if (inx + 1 === scope.tipoFilters.length) {
                            each.lastquery = true;
                        };
                        tipoInstanceDataService.aggegrationData(scope.tipoName, filter).then(function(results) {
                            console.log("results");
                            console.log(results);
                            if (each.field_type === 'integer' || each.field_type === 'date_time') {
                                var range = _.get(results[0], each.fq_field_label);
                                var selectedRange;
                                var selectedfieldFilter = _.get(selectedfieldRangeFilters, each.fq_field_label);
                                if (selectedfieldFilter && each.field_type === 'date_time') {
                                    selectedRange = selectedfieldFilter.join(" to ");
                                } else if (selectedfieldFilter && each.field_type === 'integer') {
                                    selectedRange = selectedfieldFilter;
                                };
                                scope.fieldFilters.push({
                                    label: each.display_name,
                                    key_: each.fq_field_label,
                                    doc_count: range.count,
                                    max: range.max,
                                    min: range.min,
                                    type: each.field_type,
                                    range: selectedRange
                                })
                            } else {
                                var buckets = _.get(results[0], each.fq_field_label + ".buckets");
                                var selectedfieldFilter = _.get(selectedfieldFilters, each.fq_field_label);
                                if (selectedfieldFilter || each.field_type === 'boolean') {
                                    var true_doc_count;
                                    var responseData = tipoRegistry.get(tipo_name + '_resdata');
                                    var totalRecords = responseData.count;
                                    _.each(buckets, function(bucket) {
                                        if (each.field_type === 'boolean') {
                                            if (bucket.key_as_string === 'false') {
                                                bucket.key = '!true';
                                                true_doc_count = true_doc_count || buckets[1].doc_count
                                                bucket.doc_count = totalRecords - true_doc_count;
                                            } else {
                                                bucket.key = bucket.key_as_string;
                                                true_doc_count = bucket.doc_count;
                                            }
                                        };
                                        if (selectedfieldFilter) {
                                            var selected = _.includes(selectedfieldFilter, bucket.key);
                                            bucket.selected = selected;
                                        }
                                    })
                                };
                                scope.fieldFilters.push({
                                    label: each.display_name,
                                    key_: each.fq_field_label,
                                    values: buckets,
                                    type: 'text'
                                })
                            }
                            if (each.lastquery) {
                                scope.loadDialog();
                            };
                        })
                    })
                }

                function getElasticQuery(filter) {
                    var query = {};
                    if (filter.field_type === 'integer' || filter.field_type === 'date_time') {
                        _.set(query, filter.fq_field_label + ".stats.field", filter.fq_field_name);
                    } else if (filter.field_type === 'boolean') {
                        _.set(query, filter.fq_field_label + ".terms.field", filter.fq_field_name);
                    } else {
                        _.set(query, filter.fq_field_label + ".terms.field", filter.fq_field_name + ".keyword");
                    }
                    return query;
                }

            }
        };
    });

})();