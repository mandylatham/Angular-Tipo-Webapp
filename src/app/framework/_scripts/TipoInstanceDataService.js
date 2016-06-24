(function() {

  'use strict';

  /* jshint validthis:true */

  var TIPO_INSTANCE_RESOURCE = 'tipo';

  function TipoInstanceDataService(
    tipoResource,
    tipoDataService,
    $q) {

    function getCollectionResource(){
      return tipoResource.all(TIPO_INSTANCE_RESOURCE);
    }

    function getDocumentResource(id){
      return tipoResource.one(TIPO_INSTANCE_RESOURCE, id);
    }

    return _.create(tipoDataService, {
      getCollectionResource: getCollectionResource,
      getDocumentResource: getDocumentResource
    });

  }

  angular.module('tipo.framework')
    .factory('tipoInstanceDataService', TipoInstanceDataService);

})();