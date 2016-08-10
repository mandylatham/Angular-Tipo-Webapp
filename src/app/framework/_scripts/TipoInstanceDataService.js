(function() {

  'use strict';

  /* jshint validthis:true */

  var TIPO_INSTANCE_RESOURCE = 'tipo';

  function TipoInstanceDataService(
    tipoResource,
    tipoDataService,
    $q) {

    function getCollectionResource(tipo_name){
      return tipoResource.one(TIPO_INSTANCE_RESOURCE).all(tipo_name);
    }

    function getDocumentResource(tipo_name, id){
      return getCollectionResource(tipo_name).one(id);
    }

    function collectionResourceFunction(tipo_name){
      return _.partial(getCollectionResource, tipo_name);
    }

    function documentResourceFunction(tipo_name){
      return _.partial(getDocumentResource, tipo_name);
    }

    function search(tipo_name, criteria){
      return tipoDataService.getAll.call(this, criteria, undefined, collectionResourceFunction(tipo_name));
    }

    function upsertAll(tipo_name, tipos){
      return tipoDataService.upsertAll.call(this, tipos, collectionResourceFunction(tipo_name));
    }

    function getOne(tipo_name, id){
      return tipoDataService.getOne.call(this, id, undefined, undefined, documentResourceFunction(tipo_name));
    }

    function updateOne(tipo_name, tipo, id){
      return tipoDataService.updateOne.call(this, tipo, id, documentResourceFunction(tipo_name));
    }

    function deleteOne(tipo_name, tipo, id){
      return tipoDataService.deleteOne.call(this, tipo, id, documentResourceFunction(tipo_name));
    }

    return _.create(tipoDataService, {
      search: search,
      upsertAll: upsertAll,
      getOne: getOne,
      updateOne: updateOne,
      deleteOne: deleteOne
    });

  }

  angular.module('tipo.framework')
    .factory('tipoInstanceDataService', TipoInstanceDataService);

})();