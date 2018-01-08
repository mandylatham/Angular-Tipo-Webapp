(function() {

    'use strict';

    function TipoInstanceDataService(
        tipoResource,
        tipoCache,
        tipoDefinitionDataService,
        tipoManipulationService,
        metadataService,
        tipoRegistry,
        $rootScope,
        $templateCache,
        $http,
        $q) {

        var _instance = this;

        function unwrapAndSort(collection) {
            if (!_.isUndefined(collection.perm)) {
                tipoRegistry.push({ tipo_name: collection.tipo_name + '_resdata', perm: collection.perm, return_url: collection.return_url, tab_url: collection.tab_url, message: collection.user_message, restricted_actions: collection.restricted_actions, count: collection.count });
            };
            collection = _.filter(collection, function(each) {
                if (!_.isNull(each.data)) {
                    // return !_.isUndefined(each.data.tipo_id);
                    return !_.isUndefined(each.data);
                }
            });
            collection = _.map(collection, function(each) {
                return each.data;
            });
            collection = _.sortBy(collection, function(each) {
                if (_.get(each, 'tipo_meta.tipo_sequence')) {
                    return parseFloat(each.tipo_meta.tipo_sequence, 10);
                } else {
                    return 999;
                }
            });
            return collection;
        }

        function populateGeolocation(tipo) {
            if (metadataService.geoLocation) {
                if (!tipo.data) {
                    tipo.data = {};
                };
                tipo.data.tipo_location = {};
                tipo.data.tipo_location.lat = metadataService.geoLocation.latitude;
                tipo.data.tipo_location.lon = metadataService.geoLocation.longitude;
            }
        }

        function getCollectionResource(tipo_name) {
            return tipoResource.all(tipo_name);
        }

        function getDocumentResource(tipo_name, id) {
            var data = getCollectionResource(tipo_name).one(id)
            return getCollectionResource(tipo_name).one(id);
        }

        _instance.search = function(tipo_name, criteria, reload) {
            criteria = criteria || {};
            if (!criteria.list_display) {
                criteria.list_display = 'Y';
            };
            criteria.cckey = metadataService.cckey;
            var headers = {};
            if (reload) {
                headers['Cache-Control'] = 'max-age=0';
            }
            return getCollectionResource(tipo_name).getList(criteria, headers).then(unwrapAndSort);
        };

        // TODO: Not used as of now but something like this might be required in future for the header menu which is now hard-coded
        _instance.getTopPerspectives = function() {
            var promise = _instance.search('TopPerspective').then(function(perspectives) {
                var childPromises = [];
                perspectives = _.sortBy(perspectives, function(each) {
                    if (each.sequence) {
                        return parseFloat(each.sequence, 10);
                    } else {
                        return 999;
                    }
                });
                _.each(perspectives, function(each) {
                    each.menu_items = _.sortBy(each.menu_items, function(item) {
                        if (item.sequence) {
                            return parseFloat(item.sequence, 10);
                        } else {
                            return 999;
                        }
                    });
                    _.each(each.menu_items, function(item) {
                        if (item.tipo) {
                            var childPromise = tipoDefinitionDataService.getOne(item.tipo, true).then(function(definition) {
                                item.tipoDefinition = definition;
                            });
                            childPromises.push(childPromise);
                        }
                    });
                });
                return $q.all(childPromises).then(function() {
                    return perspectives;
                })
            });

            return promise.then(tipoManipulationService.prepareTopPerspectives);

        }

        _instance.upsertAll = function(tipo_name, tipos, criteria) {
            tipoCache.evict(tipo_name);
            criteria = criteria || {};
            tipos = _.map(tipos, function(each) {
                var tipo = {
                    tipo_name: tipo_name,
                    data: angular.copy(each)
                };
                populateGeolocation(tipo);
                return tipo;
            });
            var promise = getCollectionResource(tipo_name).post(tipos, criteria).then(unwrapAndSort);
            // load list again in background
            promise.then(function() {
                _instance.search(tipo_name, undefined, true);
            });

            return promise;
        };

        _instance.getOne = function(tipo_name, id, criteria, reload) {
            criteria = criteria || {};
            criteria.cckey = metadataService.cckey;
            var headers = {};
            if (reload) {
                headers['Cache-Control'] = 'max-age=0';
            }
            // var result = tipoRegistry.getData(tipo_name,id);
            // if (result && !reload) {
            // var defer = $q.defer();
            // defer.resolve(result);
            // return defer.promise; 
            // }else{
            var promise = getDocumentResource(tipo_name, id).get(criteria, headers);
            promise.then(function(response) {
                tipoRegistry.pushData(tipo_name, id, response);
            });
            return promise;
            // }
        };

        _instance.purgeOne = function(tipo_name, id) {
            tipoCache.evict(tipo_name, id);
            return tipoResource.one('TipoSpecial.Cache.Purge/' + tipo_name + "_" + id).doPUT({});
        };

        _instance.purgeTemplate = function(template_url) {
            var attach_version_stamp = "?version_stamp=" + $rootScope.version_stamp;
            $templateCache.remove(template_url + attach_version_stamp);
            $templateCache.remove(template_url);
            var config = {
                headers: {
                    'X-bypass-cdn': 'true'
                },
                cache: false
            };
            return $http({
                method: "PURGE",
                url: template_url,
                headers: { "Content-Type": "text/plain" }
            }).then(function() {
                setTimeout(function() {
                    $http.get(template_url, config).then(function(tpl) {
                        $templateCache.put(template_url, tpl.data);
                        $templateCache.put(template_url + attach_version_stamp, tpl.data);
                    });
                }, 2000);
            });
        }

        _instance.purgeAll = function(tipo_name) {
            return tipoResource.one('TipoSpecial.Cache.Purge/' + tipo_name).doPUT({});
        };

        _instance.updateOne = function(tipo_name, tipo, id) {
            tipoCache.evict(tipo_name, id);
            tipo = {
                tipo_name: tipo_name,
                data: angular.copy(tipo)
            };
            if (_.isUndefined(tipo.data.tipo_id)) {
                console.log('Tipo ID not defined, setting it');
                tipo.data.tipo_id = id;
            }
            populateGeolocation(tipo);
            return getDocumentResource(tipo_name, id).doPUT(tipo).then(function() {
                return _instance.getOne(tipo_name, id, undefined, true);
            });
        };

        _instance.updateAll = function(tipo_name, tipos) {
            tipoCache.evict(tipo_name);
            tipos = _.map(tipos, function(each) {
                var tipo = {
                    tipo_name: tipo_name,
                    data: angular.copy(each)
                };
                populateGeolocation(tipo);
                return tipo;
            });
            var promise = getCollectionResource(tipo_name).doPUT(tipos).then(unwrapAndSort);
            // load list again in background
            promise.then(function() {
                _instance.search(tipo_name, undefined, true);
            });

            return promise;
        };

        _instance.performSingleAction = function(tipo_name, tipo_id, action, additional_tipo_name, additional_tipo) {
            tipoCache.evict(tipo_name, tipo_id);
            var tipo = {};
            if (!_.isUndefined(additional_tipo_name)) {
                tipo = {
                    tipo_name: additional_tipo_name,
                    data: additional_tipo
                };
            }
            return getDocumentResource(tipo_name, tipo_id).doPUT(tipo, undefined, { tipo_action: action });
        };

        _instance.performBulkAction = function(tipo_name, action, selected_tipo_ids, additional_tipo_name, additional_tipo) {
            var tipos = _.map(selected_tipo_ids, function(each) {
                return {
                    tipo_name: tipo_name,
                    data: {
                        tipo_id: each
                    }
                };
            });
            if (!_.isUndefined(additional_tipo_name)) {
                tipos.push({
                    tipo_name: additional_tipo_name,
                    data: additional_tipo
                });
            }
            return getCollectionResource(tipo_name).doPUT(tipos, undefined, { tipo_action: action });
        };

        _instance.deleteOne = function(tipo_name, id, queryParams) {
            //Clientside Javascript for OnDelete
            tipoCache.evict(tipo_name, id);
            tipoCache.evict(tipo_name);
            var promise = getDocumentResource(tipo_name, id).remove(queryParams);
            // load list again in background
            promise.then(function() {
                _instance.search(tipo_name, undefined, true);
            });
            return promise;
        };

        _instance.xAndYAxisData = function(report_config) {
            var criteria = {};
            criteria.list_display = 'N';
            criteria.per_page = '1000';
            return report_config.reduce(function(promise, config) {
                return promise.then(function() {
                    return _instance.search(config.tipo_name, criteria)
                })
            }, $q.when())
        };

        _instance.aggegrationData = function(report_config) {
            var criteria = {};
            criteria.list_display = 'N';
            criteria.per_page = '1000';
            criteria.aggs = {
                "count_category": {
                    "terms": {
                        "field": "category"
                    }
                }
            };
            return report_config.reduce(function(promise, config) {
                return promise.then(function() {
                    criteria.tipo_name = config.tipo_name;
                    return getCollectionResource(config.tipo_name).post(criteria).then(unwrapAndSort);
                })
            }, $q.when())
        }

        _instance.gettpObjectOptions = function(baseFilter, tipo_name, label_field, context, searchText, page_size, index, tipo_data) {
            var searchCriteria = {};
            var filter;
            var perspectiveMetadata = tipoManipulationService.resolvePerspectiveMetadata();
            /*if(tipo_name !== perspectiveMetadata.tipoName){
              filter = perspectiveMetadata.tipoFilter;
            }*/
            if (_.isUndefined(tipo_data)) {
                tipo_data = context;
            };
            if (!_.isUndefined(baseFilter)) {
                var baseFilterExpanded = tipoManipulationService.expandFilterExpression(baseFilter, tipo_data, context, index);
                filter = baseFilterExpanded;
            }
            if (!_.isUndefined(filter)) {
                searchCriteria.tipo_filter = filter;
            }
            if (!_.isUndefined(searchCriteria.tipo_filter) && !_.isEmpty(searchCriteria.tipo_filter) && !_.isUndefined(searchText)) {
                searchCriteria.tipo_filter += " AND (tipo_id:(" + searchText + "*) OR " + label_field + ":(" + searchText + "*))";
            } else {
                if (!_.isUndefined(searchText)) {
                    searchCriteria.tipo_filter = "(tipo_id:(" + searchText + "*) OR " + label_field + ":(" + searchText + "*))";
                }
            }
            searchCriteria.page = 1;
            // If for the dropdown we require custom page size then we can get from the page_size parameter
            searchCriteria.per_page = 500;
            var options = [];
            return _instance.search(tipo_name, searchCriteria).then(function(results) {
                options = _.map(results, function(each) {
                    return {
                        key: each.tipo_id,
                        label: each[label_field]
                    };
                });
                return { options: options, tipos: results };
            });
        };

    }

    angular.module('tipo.framework')
        .service('tipoInstanceDataService', TipoInstanceDataService);

})();