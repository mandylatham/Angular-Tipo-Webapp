(function() {

  'use strict';

  function setupCache($http, CacheFactory){
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
  }

  function TipoCache(CacheFactory){

    var _instance = this;

    _instance.getMemory = function(){
      return CacheFactory.get('memoryCache');
    };

    _instance.getPersistent = function(){
      return CacheFactory.get('persistentCache');
    };

    _instance.evict = function(tipo, id, evictList){
      id = id || 'not_set';
      var cache;
      if(tipo === 'TipoDefinition'){
        cache = _instance.getPersistent();
      }else{
        cache = _instance.getMemory();
      }
      var keys = cache.keys();
      var keysToEvict = _.filter(keys, function(each){
        var predicate = false;
        each = S(each);
        if(tipo !== 'TipoDefinition'){
          if(each.contains('TipoDefinition')){
            return false;
          }
        }
        if(evictList){
          predicate = each.contains(tipo + '?');
        }
        return predicate || each.contains(tipo + '/' + id) || each.contains(tipo + '/default');
      });
      _.each(keysToEvict, function(each){
        cache.remove(each);
      });
    };

    _instance.clearMemoryCache = function(){
      _instance.getMemory().removeAll();
    };

    _instance.clearAll = function(){
      _instance.getMemory().removeAll();
      _instance.getPersistent().removeAll();
    };
  }

  angular.module('tipo.framework').run(setupCache);
  angular.module('tipo.framework')
    .service('tipoCache', TipoCache);

})();