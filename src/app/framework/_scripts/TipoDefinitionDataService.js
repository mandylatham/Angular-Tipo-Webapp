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
        promise = tipoResource.one(TIPO_DEFINITION_RESOURCE).get();
        promise = promise.then(function(definitions){
          definitions = _.sortBy(definitions, function(each){
            return each.data.created_dt;
          });
          var childPromise = $q.when({});
          _.each(definitions, function(definition){
            definition = definition.data;
            childPromise = childPromise.then(function(){
              return _instance.getOne(definition.tipo_id);
            })
          });
          return childPromise;
        });

        promise = promise.then(function(childPromise){
          return $q.all(childPromise);
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
        promise = tipoResource.one(TIPO_DEFINITION_RESOURCE, id).get();
        promise = promise.then(tipoManipulationService.mapDefinitionToUI).then(function(definition){
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