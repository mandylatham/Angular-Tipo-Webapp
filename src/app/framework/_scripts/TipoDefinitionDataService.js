(function() {

  'use strict';

  /* jshint validthis:true */

  var TIPO_DEFINITION_RESOURCE = 'tipo_def';

  function TipoDefinitionDataService(
    tipoResource,
    tipoDataService,
    tipoManipulationService,
    tipoRegistry,
    $q) {

    /*jshint latedef: nofunc */
    var _instance = _.create(tipoDataService, {
      getCollectionResource: getCollectionResource,
      getDocumentResource: getDocumentResource,
      getAll: getAll,
      getOne: getOne
    });

    function getCollectionResource(){
      return tipoResource.all(TIPO_DEFINITION_RESOURCE);
    }

    function getDocumentResource(id){
      return tipoResource.one(TIPO_DEFINITION_RESOURCE, id);
    }

    function getAll(){
      var promise;
      var cache = tipoRegistry.get();
      if(_.isEmpty(cache)){
        console.info('Loading the tipo definitions');
        promise = tipoDataService.getAll.call(_instance);
        promise = promise.then(function(definitions){
          var childPromises = [];
          _.each(definitions, function(definition){
            childPromises.push(getOne(definition.tipo_name));
          });
          return childPromises;
        });

        promise = promise.then(function(childPromises){
          return $q.all(childPromises);
        });

      }else{
        promise = $q.when(cache);
      }
      return promise;
    }

    function getOne(id){
      var promise;
      var definition = tipoRegistry.get(id);
      if(definition && definition.detailsLoaded){
        promise = $q.when(definition);
      }else{
        console.info('Loading detailed metadata for the tipo - ' + id);
        promise = tipoDataService.getOne.call(_instance, id);
        promise = promise.then(tipoManipulationService.mapDefinitionToUI).then(function(definition){
          console.info('Caching the detailed definition for network optimization');
          definition.detailsLoaded = true;
          tipoRegistry.push(definition);
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

    return _instance;

  }

  angular.module('tipo.framework')
    .factory('tipoDefinitionDataService', TipoDefinitionDataService);

})();