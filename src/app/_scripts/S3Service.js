(function() {

  'use strict';  

  function S3Service($q) {
    var items = [];
    
    function go(config, completecb) {
        var s3 = new AWS.S3();
        items = [];
        var params = { Bucket: config.Bucket, Prefix: config.Prefix, Delimiter: config.Delimiter };
        var deferred = $q.defer();
        s3.makeRequest('listObjects', params, function cb(err, data) {
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
                return;
            }
            deferred.reject();
        });
        return deferred.promise;
    }

    function addItem(obj) {
        items.push(obj);
    }

    function removeItem(obj) {
        items = items.filter(function(el) {
            return el.href !== obj.href;
        });
    }

    function listItems() {
        return items.slice();
    }

    return {
      addItem: addItem,
      removeItem: removeItem,
      listItems: listItems,
      go: go
    };
  }

  angular.module('tipo.main')
    .service('s3Service', S3Service);

})();