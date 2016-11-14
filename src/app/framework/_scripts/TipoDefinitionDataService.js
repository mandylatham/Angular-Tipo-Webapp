(function() {

  'use strict';

  var TIPO_DEFINITION_RESOURCE = 'tipo/TipoDefinition';

  function TipoDefinitionDataService(
    tipoResource,
    tipoManipulationService,
    tipoRegistry,
    $q) {

    var _instance = this;

    function mapList(definitions){
      var mappedDefinitions = {};
      _.each(definitions, function(definition){
        mappedDefinitions[definition.tipo_name] = tipoManipulationService.mapDefinitionToUI(definition);
      });
      return mappedDefinitions;
    }

    _instance.getAll = function(){
      var promise;
      var cache = tipoRegistry.get();
      if(_.isEmpty(cache)){
        console.info('Loading the tipo definitions');
        promise = tipoResource.one(TIPO_DEFINITION_RESOURCE).get({short_display: 'Y'});
        promise = promise.then(function(definitions){
          var childPromises = [];
          _.each(definitions, function(definition){
            definition = definition.data;
            childPromises.push(_instance.getOne(definition.tipo_meta.tipo_name));
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
    };

    _instance.getOne = function(id){
      var promise;
      var definition = tipoRegistry.get(id);
      if(definition && definition.detailsLoaded){
        promise = $q.when(definition);
      }else{
        console.info('Loading detailed metadata for the tipo - ' + id);
        promise = tipoResource.one(TIPO_DEFINITION_RESOURCE, id).get({expand_def: 'Y'});
        promise = promise.then(function(definition){
          console.info('Caching the detailed definition for network optimization');
          definition.detailsLoaded = true;
          tipoRegistry.push(definition);
          return definition;
        });
      }
      return promise;
    };

  }

  angular.module('tipo.framework')
    .service('tipoDefinitionDataService', TipoDefinitionDataService);

})();