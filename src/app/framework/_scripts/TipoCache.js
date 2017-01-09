(function() {

  'use strict';

  function setupCache($http, CacheFactory){
    $http.defaults.cache = CacheFactory('defaultCache', {
      maxAge: 30 * 60 * 1000,
      cacheFlushInterval: 120 * 60 * 1000,
      deleteOnExpire: 'passive' // Items will be deleted from this cache when they expire
    });
  }

  function TipoCache(CacheFactory){

    var _instance = this;

    _instance.getDefault = function(){
      return CacheFactory.get('defaultCache');
    };

    _instance.evict = function(tipo, id){
      id = id || 'not_set';
      var cache = _instance.getDefault();
      var keys = cache.keys();
      var keysToEvict = _.filter(keys, function(each){
        each = S(each);
        if(tipo !== 'TipoDefinition'){
          if(each.contains('TipoDefinition')){
            return false;
          }
        }
        return each.contains(tipo + '?') || each.contains(tipo + '/' + id) || each.contains(tipo + '/default');
      });
      _.each(keysToEvict, cache.remove);
    };

    _instance.clearAll = function(){
      CacheFactory.clearAll();
    };
  }

  angular.module('tipo.framework').run(setupCache);
  angular.module('tipo.framework')
    .service('tipoCache', TipoCache);

})();