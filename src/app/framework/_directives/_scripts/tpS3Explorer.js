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
        function renderObject(data) {
            if (isfolder(data)) {
                console.log("is folder: " + data);
                return '<a data-s3="folder" data-prefix="' + data + '" href="' + object2hrefvirt(s3exp_config.Bucket, data) + '">' + prefix2folder(data) + '</a>';
            } else {
                console.log("not folder/this document: " + data);
                return '<a data-s3="object" href="' + object2hrefvirt(s3exp_config.Bucket, data) + '">' + fullpath2filename(data) + '</a>';
            }
        }

        $scope.gridOptions = {
            enableRowSelection: true,
            columnDefs: [
                { 
                    field: 'Key',
                    cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.getCellValue(row, col)}}</div>'
                },
                { 
                    field: 'LastModified'
                    //cellTemplate: ''
                },
                { 
                    field: 'Size',
                    //cellTemplate: ''
                }
            ]
        };
        $scope.gridOptions.data = [];
        s3Service.go(s3exp_config, function s3draw(data, complete) {
            var rows = data.CommonPrefixes.map(function(prefix) {
                return {
                    Key: prefix.Prefix,
                    LastModified: null,
                    Size: null
                };
            });
            rows = rows.concat(data.Contents);
            $scope.$apply(function () {
                $scope.gridOptions.data = rows;    
            });                
            console.log($scope.rows);
        });
      }
  });
})();
