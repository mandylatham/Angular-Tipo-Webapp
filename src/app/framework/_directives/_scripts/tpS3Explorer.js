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
  function folder2breadcrumbs(params) {
      var parts = [];
      if (params.Prefix) {
          parts = params.Prefix.endsWith('/') ?
              params.Prefix.slice(0, -1).split('/') :
              params.Prefix.split('/');
      }

      var buildprefix = '';
      var breadcrumbs = [{
          name: params.Bucket,
          prefix: buildprefix
      }];

      parts.forEach(function(part) {
          buildprefix += part + '/';
          breadcrumbs.push({
              name: part,
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
      var editMode = false;
      
      return {
        templateUrl: 'framework/_directives/_views/tp-s3-explorer.tpl.html',
        controller: controller
      };
      
      function controller($scope, $mdDialog, s3Service, s3SelectionModel) {

        if ($scope.field._value && $scope.field._value.key) {
            $scope.field._value.key.forEach(function(item) {
                s3SelectionModel.current().addItem(item);
            });
        } else {
            $scope.field._value = {
                key: []
            };
        }

        function handleFailure(promise) {
            promise.then(function(result) {
            }, function(err) {
                $scope.rows = [];
                $scope.breadcrumbs = folder2breadcrumbs(s3exp_config);
            });
        }

        function s3draw(data, complete) {
            var breadcrumbs = folder2breadcrumbs(data.params);
            
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
        
        $scope.onSelect = function(obj) {
            if (obj.s3 === 'folder') {
                s3exp_config.Prefix = obj.prefix;
                $scope.promise = s3Service.go(s3exp_config, s3draw);
                handleFailure($scope.promise);
            } else {
                // Else user has clicked on an object
                s3SelectionModel.current.addItem({ Key: obj.Key, href: obj.href, prefix: obj.prefix });
                $scope.field._value = {
                    key: s3SelectionModel.current.listItems()
                };
            }
        }

        $scope.onDeselect = function(obj) {
            s3SelectionModel.current.removeItem(obj);
            $scope.field._value = {
                key: s3SelectionModel.current.listItems()
            };
        }

        $scope.selectBreakcrumb = function(breakcrumb) {
            s3exp_config.Prefix = breakcrumb.prefix;
            $scope.promise = s3Service.go(s3exp_config, s3draw);
            handleFailure($scope.promise);
        }

        $scope.isEditMode = function() {
            return editMode;    
        }

        $scope.chooseBucket = function(_editMode) {
            editMode = typeof _editMode !== 'undefined' ? _editMode : true;
        }

        $scope.submit = function(bucketName) {
            editMode = false;
            s3exp_config.Bucket = bucketName;
            s3exp_config.Prefix = '';
            $scope.promise = s3Service.go(s3exp_config, s3draw);
            handleFailure($scope.promise);  
        }

        $scope.selected = [];
        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };
        $scope.promise = s3Service.go(s3exp_config, s3draw);
        handleFailure($scope.promise);
      }
  });
})();