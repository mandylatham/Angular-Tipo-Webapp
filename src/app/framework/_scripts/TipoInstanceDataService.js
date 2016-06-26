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

    function getAll(tipo_name){
      return tipoDataService.getAll.call(this, collectionResourceFunction(tipo_name));
    }

    function getOne(tipo_name, id){
      return tipoDataService.getOne.call(this, documentResourceFunction(tipo_name), id);
    }

    return _.create(tipoDataService, {
      getAll: getAll,
      getOne: getOne
    });

  }

  angular.module('tipo.framework')
    .factory('tipoInstanceDataService', TipoInstanceDataService);

})();