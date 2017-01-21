(function () {

  'use strict';

  var accountId = '2000000001';
  var userPrefix = accountId + '/';
  var s3exp_config = { Region: '', Bucket: '', Prefix: userPrefix, Delimiter: '/' };
  s3exp_config.Bucket = 'user.tipotapp.com';
  s3exp_config.TempBucket = 'temp.tipotapp.com';

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

  function isfolder(path) {
      return path.endsWith('/');
  }

  // Convert cars/vw/ to vw/
  function prefix2folder(prefix) {
      var parts = prefix.split('/');
      return parts[parts.length-2] + '/';
  }

  function bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Bytes';
      var ii = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, ii), 2) + ' ' + sizes[ii];
  }
  
  var module = angular.module('tipo.framework');
  return module.directive('tpFileUpload', function () {
      var editMode = false;
      
      return {
        templateUrl: 'framework/_directives/_views/tp-file-upload.tpl.html',
        controller: controller
      };
      
      function controller($scope, $mdDialog, s3Service, s3SelectionModel, metadataService) {

        var appMetadata = metadataService.applicationMetadata;

        $scope.$on('refresh', function(args) {
            saveContextAndDraw();
        });

        function s3draw(data, complete) {
            var prefixes = data.CommonPrefixes.map(function(prefix) {
                return {
                    Key: prefix2folder(prefix.Prefix),
                    LastModified: null,
                    Size: null,
                    s3: 'folder',
                    prefix: prefix.Prefix,
                    href: object2hrefvirt(s3exp_config.Bucket, prefix.Prefix) 
                };
            });
            var objects = data.Contents.map(function(object) {
                return {
                    Key: fullpath2filename(object.Key),
                    LastModified: moment(object.LastModified).fromNow(),
                    Size: bytesToSize(object.Size),
                    s3: 'object',
                    prefix: null,
                    href: object2hrefvirt(s3exp_config.Bucket, object.Key)
                };
            });
            var rows = prefixes.concat(objects);
            $scope.$apply(function () {
                $scope.rows = rows;
            });
            return rows;

        }

        function saveContextAndDraw() {
            s3SelectionModel.setContext(s3exp_config);
            $scope.promise = s3Service.go(s3exp_config, s3draw).catch(function(err) {
                $scope.rows = [];
            });
        }

        $scope.searchTextChange = function(searchText) {
            console.log('searchTextChange: ' + searchText);
        }

        $scope.selectedItemChange = function(item) {
            // Selection canceled by clicking on cross item
            if (!item) {
                s3exp_config.Prefix = userPrefix;
                saveContextAndDraw(); 
                return;
            }
            if (item.s3 === 'folder') {
                s3exp_config.Prefix = item.prefix;
                saveContextAndDraw();
            }
            // Cut account prefix ouf of item's prefix
            $scope.searchText = item.prefix.substring(userPrefix.length);
        }

        var items = [];
        $scope.querySearch = function(searchText) {
            console.log(searchText);
            if (searchText === '' || searchText.lastIndexOf('/') === searchText.length - 1) {
                s3exp_config.Prefix = userPrefix + searchText;
                var promise = s3Service.go(s3exp_config, s3draw).then(function(result) {
                    return result.filter(function(item){
                        return item && item.s3 === 'folder';
                    });
                });
                promise.then(function(result) {
                    items = result;
                });
                return promise;
            } else {
                return items;
            }
        }
        
        $scope.selected = [];
        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };
        saveContextAndDraw();
      }
  });
})();
