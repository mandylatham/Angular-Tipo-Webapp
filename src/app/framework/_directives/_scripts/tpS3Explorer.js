(function () {

  'use strict';

  var s3exp_config = { Region: '', Bucket: '', Prefix: '', Delimiter: '/' };
  var s3exp_lister = null;
  var s3exp_columns = { key:1, folder:2, date:3, size:4 };

  AWS.config.region = 'us-east-1';
  console.log('Region: ' + AWS.config.region);
  
  s3exp_config.Bucket = 'fadeev.yegor';

  var module = angular.module('tipo.framework');
  return module.directive('tpS3Explorer', function () {
      return {
        restrict: 'E',
        templateUrl: 'framework/_directives/_views/tp-s3-explorer.tpl.html',
        replace : true,
        transclude : false,
        controller: controller
      };
      
      function controller($scope, s3Service) {
        $scope.gridOptions = {};
        $scope.gridOptions.data = [];
        s3Service.go(s3exp_config, function s3draw(data, complete) {
            var rows = data.CommonPrefixes.map(function(prefix) {
                return {
                    Key: prefix.Prefix,
                    LastModified: null,
                    Size: null
                };
            });
            // rows = rows.concat(data.Contents);
            // $scope.rows = rows;

            var myData = [{name: "Moroni", age: 50},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34}];
            
            $scope.$apply(function () {
                $scope.gridOptions.data = myData;    
            });                
            console.log($scope.rows);
        });
      }
  });
})();
