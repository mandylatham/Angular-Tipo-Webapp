(function() {

  'use strict';

  // Tipo base data service containing reusable methods for most common CRUDish operations. One may override these if required in specific implementations
  function TipoDataService(){

    /* jshint validthis: true, unused: false */

    function stripRestangularFields(payload){
      return payload.plain();
    }

    // Retrieves a single resource
    function getOne(resourceId, queryParameters, headers, documentResourceFunction){
      if(_.isUndefined(documentResourceFunction)){
        documentResourceFunction = this.getDocumentResource;
      }

      return documentResourceFunction(resourceId).get(queryParameters, headers).then(stripRestangularFields);
    }
    
    // Retrieves a list of all resources optionally matching some search criteria
    function getAll(queryParameters, headers, collectionResourceFunction){
      if(_.isUndefined(collectionResourceFunction)){
        collectionResourceFunction = this.getCollectionResource;
      }
      if(_.isUndefined(queryParameters)){
        queryParameters = {};
      }
      return collectionResourceFunction().getList(queryParameters, headers).then(stripRestangularFields);
    }

    // Upserts resources
    function upsertAll(resources, collectionResourceFunction){
      if(_.isUndefined(collectionResourceFunction)){
        collectionResourceFunction = this.getCollectionResource;
      }
      return collectionResourceFunction().doPUT(resources).then(stripRestangularFields);
    }

    // Creates a new resource
    function createOne(resource, collectionResourceFunction){
      if(_.isUndefined(collectionResourceFunction)){
        collectionResourceFunction = this.getCollectionResource;
      }
      return collectionResourceFunction().post(resource).then(stripRestangularFields);
    }

    // Updates an existing resource. Assumes a field 'id' for the URL path parameter substitution but can accept an id override as well
    function updateOne(resource, id, documentResourceFunction){
      if(_.isUndefined(documentResourceFunction)){
        documentResourceFunction = this.getDocumentResource;
      }
      return documentResourceFunction(id).doPUT(resource).then(stripRestangularFields);
    }

    // Patches an existing resource. Assumes a field 'id' for the URL path parameter substitution but can accept an id override as well
    function patchOne(resource, idOverride, documentResourceFunction){
      if(_.isUndefined(documentResourceFunction)){
        documentResourceFunction = this.getDocumentResource;
      }
      if(_.isUndefined(idOverride)){
        idOverride = resource.id;
        resource = angular.copy(resource);
        delete resource.id;
      }
      return documentResourceFunction().customOperation('patch', idOverride, undefined, undefined, resource).then(stripRestangularFields);
    }
    
    // Deletes a resource
    function deleteOne(resourceId, hardDelete, documentResourceFunction){
      if(_.isUndefined(documentResourceFunction)){
        documentResourceFunction = this.getDocumentResource;
      }
      var queryParameters = {};
      if(hardDelete){
        queryParameters.hardDelete = true;
      }
      return documentResourceFunction(resourceId).remove(queryParameters).then(stripRestangularFields);
    }

    function getCollectionResource(){
      console.warn('Method getCollectionResource() must be implemented by the child service');
    }
    function getDocumentResource(){
      console.warn('Method getDocumentResource() must be implemented by the child service');
    }

    
    return {
      getOne: getOne,
      getAll: getAll,
      upsertAll: upsertAll,
      createOne: createOne,
      updateOne: updateOne,
      patchOne: patchOne,
      deleteOne: deleteOne
    };
  }

  angular.module('tipo.common')
    .factory('tipoDataService', TipoDataService);

})();