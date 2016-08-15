(function() {

  'use strict';

  var TIPO_INSTANCE_RESOURCE = 'tipo';

  function TipoInstanceDataService(
    tipoResource,
    $q) {

    var _instance = this;

    function wrap(data){
      return {
        tipo: data
      };
    }

    function unwrap(data){
      return data.tipo;
    }

    function getCollectionResource(tipo_name){
      return tipoResource.one(TIPO_INSTANCE_RESOURCE).all(tipo_name);
    }

    function getDocumentResource(tipo_name, id){
      return getCollectionResource(tipo_name).one(id);
    }

    _instance.search = function(tipo_name, criteria){
      return getCollectionResource(tipo_name).getList(criteria).then(function(tipos){
        return _.map(tipos, unwrap);
      });
    };

    _instance.upsertAll = function(tipo_name, tipos){
      tipos = _.map(tipos, wrap);
      return getCollectionResource(tipo_name).doPUT(tipos);
    };

    _instance.getOne = function(tipo_name, id){
      return getDocumentResource(tipo_name, id).get().then(unwrap);
    };

    _instance.updateOne = function(tipo_name, tipo, id){
      tipo = wrap(tipo);
      return getDocumentResource(tipo_name, id).doPUT(tipo);
    };

    _instance.deleteOne = function(tipo_name, id){
      return getDocumentResource(tipo_name, id).remove();
    };

  }

  angular.module('tipo.framework')
    .service('tipoInstanceDataService', TipoInstanceDataService);

})();