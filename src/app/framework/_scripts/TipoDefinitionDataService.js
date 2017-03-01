(function() {

  'use strict';

  var TIPO_DEFINITION_RESOURCE = 'TipoDefinition';

  function TipoDefinitionDataService(
    tipoResource,
    tipoRegistry,
    tipoManipulationService,
    metadataService,
    $q) {

    var _instance = this;

    function isSingleton(definition){
      return _.findIndex(definition.tipo_meta.tipo_type, function(each){
        return _.startsWith(each, 'singleton');
      }) !== -1;
    }

    _instance.search = function(filter){
      var queryParams = {
        short_display: 'Y',
        cckey: metadataService.cckey
      };
      if(filter){
        queryParams.tipo_filter = filter;
      }
      return tipoResource.one(TIPO_DEFINITION_RESOURCE).get(queryParams).then(function(definitions){
        var data = _.map(definitions, function(each){
          each = each.data;
          each._ui = each._ui || {};
          each._ui.isSingleton = isSingleton(each);
          return each;
        });
        data = _.sortBy(data, function(each){
          if(each.tipo_meta.tipo_sequence){
            return parseFloat(each.tipo_meta.tipo_sequence, 10);
          }else{
            return 999;
          }
        });
        return data;
      });
    };

    _instance.getAll = function(){
      return _instance.search();
    };

    _instance.getOne = function(id){
      var promise = tipoResource.one(TIPO_DEFINITION_RESOURCE, id).get({expand_def: 'Y', cckey: metadataService.cckey});
      promise = promise.then(function(definition){
        tipoRegistry.push(definition);
        return tipoRegistry.get(id);
      });
      return promise;
    };

  }

  angular.module('tipo.framework')
    .service('tipoDefinitionDataService', TipoDefinitionDataService);

})();