(function() {

  'use strict';

  var TIPO_DEFINITION_RESOURCE = 'TipoDefinition';

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

    _instance.search = function(filter){
      var queryParams = {
        short_display: 'Y'
      };
      if(filter){
        queryParams.tipo_filter = filter;
      }
      return tipoResource.one(TIPO_DEFINITION_RESOURCE).get(queryParams).then(function(definitions){
        return _.map(definitions, function(each){
          return each.data;
        });
      });
    };

    _instance.getAll = function(){
      return _instance.search();
    };

    _instance.getOne = function(id){
      var promise;
      var definition = tipoRegistry.get(id);
      if(definition){
        promise = $q.when(definition);
      }else{
        console.info('Loading detailed metadata for the tipo - ' + id);
        promise = tipoResource.one(TIPO_DEFINITION_RESOURCE, id).get({expand_def: 'Y'});
        promise = promise.then(function(definition){
          console.info('Caching the detailed definition for network optimization');
          definition.detailsLoaded = true;
          tipoRegistry.push(definition);
          return tipoRegistry.get(id);
        });
      }
      return promise;
    };

  }

  angular.module('tipo.framework')
    .service('tipoDefinitionDataService', TipoDefinitionDataService);

})();