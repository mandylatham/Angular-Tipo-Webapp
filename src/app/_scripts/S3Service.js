(function() {

  'use strict';  

  function S3Service($q) {

    var s3 = new AWS.S3();
    var scope = {
        params: {}, stop: false, completecb: null
    };

    function go(config, completecb) {
        scope.params = { Bucket: config.Bucket, Prefix: config.Prefix, Delimiter: config.Delimiter };
        var deferred = $q.defer();
        s3.makeUnauthenticatedRequest('listObjects', scope.params, function cb(err, data) {
            if (err) { 
                console.log('Error: ' + JSON.stringify(err));
                console.log('Error: ' + err.stack);
                deferred.reject(err);
                return;
            } 

            // Filter the folders out of the listed S3 objects
            // (could probably be done more efficiently)
            data.Contents = data.Contents.filter(function(el) {
                return el.Key !== scope.params.Prefix;
            });

            if (completecb) {
                var cbScope = {
                    Contents: data.Contents.slice(),
                    CommonPrefixes: data.CommonPrefixes.slice(),
                    params: { Bucket: scope.params.Bucket, Prefix: scope.params.Prefix, Delimiter: scope.params.Delimiter }
                };
                var result = completecb(cbScope, deferred);
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }

    return {
      go: go
    };
  }

  angular.module('tipo.main')
    .service('s3Service', S3Service);

})();