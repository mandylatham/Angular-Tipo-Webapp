(function () {

  'use strict';

  var s3exp_config = { Region: '', Bucket: '', Prefix: '', Delimiter: '/' };
  var s3exp_lister = null;
  var s3exp_columns = { key:1, folder:2, date:3, size:4 };

  AWS.config.region = 'us-east-1';
  console.log('Region: ' + AWS.config.region);
  
  s3exp_config.Bucket = 'fadeev.yegor';

  function object2hrefvirt(bucket, object) {
      if (AWS.config.region === "us-east-1") {
          return document.location.protocol + '//' + bucket + '.s3.amazonaws.com/' + object;
      } else {
          return document.location.protocol + '//' + bucket + '.s3-' + AWS.config.region + '.amazonaws.com/' + object;
      }
  }

  // Convert cars/vw/golf.png to golf.png
  function fullpath2filename(path) {
      return path.replace(/^.*[\\\/]/, '');
  }

  var module = angular.module('tipo.framework');
  return module.directive('tpS3Explorer', function () {
      return {
        templateUrl: 'framework/_directives/_views/tp-s3-explorer.tpl.html',
        controller: controller
      };
      
      function controller($scope, s3Service) {
        function isfolder(path) {
            return path.endsWith('/');
        }

        $scope.selectObject = function(object) {
            console.log('Selected object ' + object.Key);
        }

        $scope.selected = [];

        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        s3Service.go(s3exp_config, function s3draw(data, complete) {
            var prefixes = data.CommonPrefixes.map(function(prefix) {
                return {
                    Key: prefix.Prefix,
                    LastModified: null,
                    Size: null,
                    s3: 'folder',
                    prefix: prefix.Prefix
                };
            });
            var objects = data.Contents.map(function(object) {
                return {
                    Key: object.Key,
                    LastModified: object.LastModified,
                    Size: object.Size,
                    s3: 'object',
                    prefix: null
                };
            });
            var rows = prefixes.concat(data.Contents);
            $scope.$apply(function () {
                // $scope.gridOptions.data = rows;
                $scope.rows = rows;    
            });                
            console.log($scope.rows);
        });
      }
  });
})();
