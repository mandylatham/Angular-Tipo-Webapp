(function() {

  'use strict';

  var TIPO_INSTANCE_RESOURCE = 'tipo';

  function TipoInstanceDataService(
    tipoResource,
    $q) {

    var _instance = this;

    function unwrapAndSort(collection){
      collection = _.map(collection, function(each){
        return each.data;
      });
      collection = _.sortBy(collection, function(each){
        return each.created_dt;
      });
      return collection;
    }

    function getCollectionResource(tipo_name){
      return tipoResource.one(TIPO_INSTANCE_RESOURCE).all(tipo_name);
    }

    function getDocumentResource(tipo_name, id){
      return getCollectionResource(tipo_name).one(id);
    }

    _instance.search = function(tipo_name, criteria){
      return getCollectionResource(tipo_name).getList(criteria).then(unwrapAndSort);
    };

    _instance.upsertAll = function(tipo_name, tipos){
      tipos = _.map(tipos, function(each){
        return {
          tipo_name: tipo_name,
          data: each
        };
      });
      return getCollectionResource(tipo_name).doPUT(tipos).then(unwrapAndSort);
    };

    _instance.getOne = function(tipo_name, id){
      return getDocumentResource(tipo_name, id).get();
    };

    _instance.updateOne = function(tipo_name, tipo, id){
      tipo = {
        tipo_name: tipo_name,
        data: tipo
      };
      if(_.isUndefined(tipo.tipo_id)){
        console.log('Tipo ID not defined, setting it');
        tipo.tipo_id = id;
      }
      return getDocumentResource(tipo_name, id).doPUT(tipo);
    };

    _instance.deleteOne = function(tipo_name, id){
      return getDocumentResource(tipo_name, id).remove();
    };

  }

  angular.module('tipo.framework')
    .service('tipoInstanceDataService', TipoInstanceDataService);

})();