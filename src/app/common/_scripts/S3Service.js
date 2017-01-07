(function() {

  'use strict';  

  function S3Service($q) {
    function go(config, completecb) {
        var s3 = new AWS.S3();
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

    function uploadFile(bucketName, file) {
        var deferred = $q.defer();
        var s3 = new AWS.S3({apiVersion: '2006-03-01'});
        var params = { 
            Bucket: bucketName,
            Key: file.name,
            ContentType: file.type,
            Body: file
        };
        s3.upload(params, function (err, data) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    return {
      go: go,
      uploadFile: uploadFile
    };
  }

  angular.module('tipo.common')
    .service('s3Service', S3Service);

})();