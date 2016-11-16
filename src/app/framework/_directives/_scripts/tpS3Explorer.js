(function () {

  'use strict';

  var s3exp_config = { Region: '', Bucket: '', Prefix: '', Delimiter: '/' };
  s3exp_config.Bucket = '<bucket>';

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

  // The parts array will contain the bucket name followed by all the
  // segments of the prefix, exploded out as separate strings.
  function folder2breadcrumbs(data) {
      var parts = [];
      if (data.params.Prefix) {
          parts = data.params.Prefix.endsWith('/') ?
              data.params.Prefix.slice(0, -1).split('/') :
              data.params.Prefix.split('/');
      }

      var buildprefix = '';
      var breadcrumbs = [{
          name: data.params.Bucket + '/',
          prefix: buildprefix
      }];

      parts.forEach(function(part) {
          buildprefix += part + '/';
          breadcrumbs.push({
              name: part + ' /',
              prefix: buildprefix
          });
      });
      return breadcrumbs;
  }

  function bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Bytes';
      var ii = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, ii), 2) + ' ' + sizes[ii];
  }
  
  var module = angular.module('tipo.framework');
  return module.directive('tpS3Explorer', function () {
      return {
        templateUrl: 'framework/_directives/_views/tp-s3-explorer.tpl.html',
        controller: controller
      };
      
      function controller($scope, $mdDialog, s3Service) {

        function retryFailure(promise) {
            promise.then(function(result){
            }, function(err) {
                $scope.chooseBucket();
            });
        }

        function s3draw(data, complete) {
            var breadcrumbs = folder2breadcrumbs(data);
            
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
                $scope.breadcrumbs = breadcrumbs;
            });
            return rows;
        }
        
        $scope.selectObject = function(obj) {
            if (obj.s3 === 'folder') {
                s3exp_config.Prefix = obj.prefix;
                $scope.promise = s3Service.go(s3exp_config, s3draw);
                retryFailure($scope.promise);
            } else {
                // Else user has clicked on an object
                s3Service.select(obj.href);
                console.log('Selected object: ' + obj.href);
            }
        }

        $scope.selectBreakcrumb = function(breakcrumb) {
            var config = { Bucket: s3exp_config.Bucket, Prefix: breakcrumb.prefix, Delimiter: s3exp_config.Delimiter };
            $scope.promise = s3Service.go(config, s3draw);
            retryFailure($scope.promise);
        }

        $scope.chooseBucket = function() {
            var confirm = $mdDialog.prompt()
                .title('Please enter the S3 bucket name')
                .textContent('Example: fadeev.yegor')
                .initialValue('<bucket>')
                .targetEvent(null)
                .ok('OK')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function(result) {
                s3exp_config.Bucket = result;
                $scope.promise = s3Service.go(s3exp_config, s3draw);
                retryFailure($scope.promise);
            });
        }

        $scope.selected = [];
        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };
        $scope.promise = s3Service.go(s3exp_config, s3draw);
        retryFailure($scope.promise);
      }
  });
})();
