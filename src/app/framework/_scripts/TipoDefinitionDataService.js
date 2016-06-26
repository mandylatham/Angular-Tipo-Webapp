(function() {

  'use strict';

  /* jshint validthis:true */

  var TIPO_DEFINITION_RESOURCE = 'tipo_def';

  function TipoDefinitionDataService(
    tipoResource,
    tipoDataService,
    tipoManipulationService,
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
      var promise;
      var definition = cache[id];
      if(definition && definition.detailsLoaded){
        promise = $q.when(definition);
      }else{
        console.info('Loading detailed metadata for the tipo - ' + id);
        promise = tipoDataService.getOne.call(this, id);
        promise = promise.then(tipoManipulationService.mapDefinitionToUI).then(function(definition){
          console.info('Caching the detailed definition for network optimization');
          definition.detailsLoaded = true;
          cache[id] = definition;
          return definition;
        });
      }
      return promise;
    }

    function mapList(definitions){
      var mappedDefinitions = {};
      _.each(definitions, function(definition){
        mappedDefinitions[definition.tipo_name] = tipoManipulationService.mapDefinitionToUI(definition);
      });
      return mappedDefinitions;
    }

    return _.create(tipoDataService, {
      getCollectionResource: getCollectionResource,
      getDocumentResource: getDocumentResource,
      getAll: getAll,
      getOne: getOne
    });

  }

  angular.module('tipo.framework')
    .factory('tipoDefinitionDataService', TipoDefinitionDataService);

})();