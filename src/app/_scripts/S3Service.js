(function() {

  'use strict';  

  function S3Service($q) {

    var s3 = new AWS.S3();
    var selectedObj;
    
    function go(config, completecb) {
        var params = { Bucket: config.Bucket, Prefix: config.Prefix, Delimiter: config.Delimiter };
        var deferred = $q.defer();
        s3.makeUnauthenticatedRequest('listObjects', params, function cb(err, data) {
            if (err) { 
                console.log('Error: ' + JSON.stringify(err));
                console.log('Error: ' + err.stack);
                deferred.reject(err);
                return;
            } 

            // Filter the folders out of the listed S3 objects
            // (could probably be done more efficiently)
            data.Contents = data.Contents.filter(function(el) {
                return el.Key !== params.Prefix;
            });

            if (completecb) {
                var scope = {
                    Contents: data.Contents.slice(),
                    CommonPrefixes: data.CommonPrefixes.slice(),
                    params: { Bucket: params.Bucket, Prefix: params.Prefix, Delimiter: params.Delimiter }
                };
                var result = completecb(scope, deferred);
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }

    function select(obj){
        selectedObj = obj;
    }

    function selected(){
        return selectedObj;
    }

    return {
      go: go,
      select: select
    };
  }

  angular.module('tipo.main')
    .service('s3Service', S3Service);

})();