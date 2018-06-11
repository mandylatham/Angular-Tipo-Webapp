(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    function TipoObjectDialogController(fieldFilters, $scope,
        $timeout,
        $mdDialog,
        selectedfieldFilters) {

        $scope.fieldFilters = fieldFilters;
        var filterObject = selectedfieldFilters || {};
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
        $scope.finish = function() {
            var exp = "";
            _.each(filterObject, function(each, key) {
                exp = ((each.length > 0) && (exp + key + ":(" + _.join(each, " OR ") + ") AND ") || exp);
            });
            exp = exp.substring(0, exp.length - 5);
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
        $mdDialog,
        $stateParams) {
        return {
            scope: {
                tipoName: '=',
                tipoFilters: '=',
                filterLabel: '='
            },
            restrict: 'EA',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-field-filters.tpl.html',
            link: function(scope, element, attrs) {

                var tipo_name = scope.tipoName;
                getFiltersList();
                scope.fieldFilters = [];
                if ($stateParams.filter) {
                    var selectedFilters = $stateParams.filter.split('&&');
                    var fieldFilterExp = "";
                    var customFilters = [];
                    _.each(selectedFilters, function(filter) {
                        if (S(filter).contains(":")) {
                            fieldFilterExp = filter;
                        } else {
                            customFilters.push(filter);
                        }
                    });
                    var fieldFilters = fieldFilterExp.split(" AND ");
                    var selectedfieldFilters = {};
                    _.each(fieldFilters, function(filter) {
                        var eachfilters = filter.substring(filter.indexOf("(") + 1, filter.indexOf(")")).split(" OR ");
                        _.set(selectedfieldFilters, filter.substring(0, filter.indexOf(":")), eachfilters);
                    });
                };

                scope.showFilters = function() {
                    var promise = $mdDialog.show({
                        templateUrl: 'framework/_directives/_views/tp-field-filters-dialog.tpl.html',
                        controller: TipoObjectDialogController,
                        controllerAs: 'tipoRootController',
                        resolve: /*@ngInject*/ {
                            fieldFilters: function() {
                                return scope.fieldFilters;
                            },
                            selectedfieldFilters: function() {
                                return selectedfieldFilters;
                            }
                        },
                        skipHide: true,
                        clickOutsideToClose: true,
                        fullscreen: true
                    });
                    promise.then(function(expression) {
                        tipoRouter.toTipoList(tipo_name, { filter: expression });
                    });
                }

                function getFiltersList() {
                    _.each(scope.tipoFilters, function(each) {
                        var filter = {};
                        each.fq_field_label = _.replace(each.fq_field_name, '.', '');
                        _.set(filter, "tipo_aggs", getElasticQuery(each));

                        tipoInstanceDataService.aggegrationData(scope.tipoName, filter).then(function(results) {
                            console.log("results");
                            console.log(results);
                            var buckets = _.get(results[0], each.fq_field_label + ".buckets");
                            var selectedfieldFilter = _.get(selectedfieldFilters, each.fq_field_label);
                            if (selectedfieldFilter) {
                                _.each(buckets, function(bucket) {
                                    var selected = _.includes(selectedfieldFilter, bucket.key);
                                    bucket.selected = selected;
                                })
                            };
                            scope.fieldFilters.push({
                                label: each.display_name,
                                key_: each.fq_field_label,
                                values: buckets
                            })
                        })
                    })
                }

                function getElasticQuery(filter) {
                    var query = {};
                    if (filter.field_type === 'integer') {
                      _.set(query, filter.fq_field_label + ".stats.field", filter.fq_field_name);
                    }else{
                      _.set(query, filter.fq_field_label + ".terms.field", filter.fq_field_name + ".keyword");
                    }
                    return query;
                }

            }
        };
    });

})();