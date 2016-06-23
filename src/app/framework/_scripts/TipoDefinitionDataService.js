(function() {

  'use strict';

  /* jshint validthis:true */

  var TIPO_DEFINITION_RESOURCE = 'tipo_def';

  function TipoDefinitionDataService(
    tipoResource,
    tipoDataService,
    $q) {

    var cache = {};

    function getCollectionResource(){
      return tipoResource.all(TIPO_DEFINITION_RESOURCE);
    }

    function getDocumentResource(id){
      return tipoResource.one(TIPO_DEFINITION_RESOURCE, id);
    }

    function getAll(){
      var promise;
      if(_.isEmpty(cache)){
        console.info('Loading the tipo definitions');
        promise = tipoDataService.getAll.call(this);
        promise = promise.then(mapList).then(function(definitions){
          console.info('Caching the tipo definitions for network optimization');
          cache = definitions;
          return cache;
        });
      }else{
        promise = $q.when(cache);
      }
      return promise;
    }

    function getOne(id){
      return cache[id];
    }

    function mapList(definitions){
      return definitions;
    }

    function mapOne(definition){

    }

    return _.create(tipoDataService, {
      getCollectionResource: getCollectionResource,
      getDocumentResource: getDocumentResource,
      getAll: getAll,
      getOne: getOne
    });

  }

  angular.module('tipo.framework.data')
    .factory('tipoDefinitionDataService', TipoDefinitionDataService);

})();