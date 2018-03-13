(function() {

    'use strict';

    function setupCache($http, CacheFactory) {
        var memoryCache = CacheFactory('memoryCache', {
            maxAge: 30 * 60 * 1000,
            cacheFlushInterval: 120 * 60 * 1000,
            deleteOnExpire: 'passive'
        });

        var persistentCache = CacheFactory('persistentCache', {
            maxAge: 24 * 60 * 60 * 1000,
            cacheFlushInterval: 24 * 60 * 60 * 1000,
            deleteOnExpire: 'aggressive',
            storageMode: 'localStorage'
        });
        $http.defaults.cache = memoryCache;
    }

    function TipoCache(CacheFactory) {

        var _instance = this;

        _instance.getMemory = function() {
            return CacheFactory.get('memoryCache');
        };

        _instance.getPersistent = function() {
            return CacheFactory.get('persistentCache');
        };

        _instance.evict = function(tipo, id) {
            id = id || 'not_set';
            var cache;
            if (tipo === 'TipoDefinition') {
                cache = _instance.getMemory();
            } else {
                cache = _instance.getMemory();
            }
            var keys = cache.keys();
            var keysToEvict = _.filter(keys, function(each) {
                each = S(each);
                var predicate = each.contains(tipo + '?') || each.contains(tipo + '/' + id) || each.contains(tipo + '/default');
                if (tipo !== 'TipoDefinition') {
                    if (each.contains('TipoDefinition')) {
                        return false;
                    }
                } else {
                    // handle tipo lookup eviction
                }

                return predicate;
            });
            _.each(keysToEvict, function(each) {
                cache.remove(each);
            });
        };

        _instance.clearMemoryCache = function() {
            _instance.getMemory().removeAll();
        };

        _instance.clearAll = function() {
            CacheFactory.clearAll();
            _instance.getMemory().removeAll();
            _instance.getPersistent().removeAll();
        };
    }

    angular.module('tipo.framework').run(setupCache);
    angular.module('tipo.framework')
        .service('tipoCache', TipoCache);

})();