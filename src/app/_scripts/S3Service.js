(function() {

  'use strict';  

  function S3Service($q) {

    var s3 = new AWS.S3();
    var scope = {
        params: {}, stop: false, completecb: null
    };

    function cb(err, data) {
        if (err) { 
            console.log('Error: ' + JSON.stringify(err));
            console.log('Error: ' + err.stack);
        } else {
            console.log(data);
        }
        // Filter the folders out of the listed S3 objects
        // (could probably be done more efficiently)
        console.log("Filter: remove folders");
        data.Contents = data.Contents.filter(function(el) {
            return el.Key !== scope.params.Prefix;
        });

        console.log('Bucket ' + scope.params.Bucket + ' has ' + data.Contents.length + ' objects, including ' + data.CommonPrefixes.length + ' prefixes');
        
        if (scope.completecb) {
            var cbScope = {
                Contents: data.Contents.slice(),
                CommonPrefixes: data.CommonPrefixes.slice(),
                params: { Bucket: scope.Bucket, Prefix: scope.Prefix, Delimiter: scope.Delimiter }
            };
            
            scope.completecb(cbScope, true);
        }
    }

    function go(config, completecb) {
      scope.completecb = completecb;
      scope.params = { Bucket: config.Bucket, Prefix: config.Prefix, Delimiter: config.Delimiter };
      //$('#bucket-loader').addClass('fa-spin');
      //$('#tb-s3objects').DataTable().clear();
      s3.makeUnauthenticatedRequest('listObjects', scope.params, cb);
    }

    function stop() {
    
    }

    return {
      go: go,
      stop: stop
    };
  }

  angular.module('tipo.main')
    .service('s3Service', S3Service);

})();