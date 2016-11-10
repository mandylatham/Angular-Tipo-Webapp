(function () {

  'use strict';

  AWS.config.region = 'us-east-1';
  var s3exp_config = { Region: '', Bucket: '', Prefix: '', Delimiter: '/' };
  
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

  function isfolder(path) {
      return path.endsWith('/');
  }

  // Convert cars/vw/ to vw/
  function prefix2folder(prefix) {
      var parts = prefix.split('/');
      return parts[parts.length-2] + '/';
  }
  
  var module = angular.module('tipo.framework');
  return module.directive('tpS3Explorer', function () {
      return {
        templateUrl: 'framework/_directives/_views/tp-s3-explorer.tpl.html',
        controller: controller
      };
      
      function controller($scope, s3Service) {
        function folder2breadcrumbs(data) {
            console.log('Prefix: ' + data.params.Prefix);
            // The parts array will contain the bucket name followed by all the
            // segments of the prefix, exploded out as separate strings.
            var parts = [];
            if (data.params.Prefix) {
                parts = data.params.Prefix.endsWith('/') ?
                            data.params.Prefix.slice(0, -1).split('/') :
                            data.params.Prefix.split('/');
            }

            var buildprefix = '';
            var breadcrumbs = [{
                name: data.params.Bucket,
                prefix: buildprefix
            }];
           
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                buildprefix += part + '/';
                breadcrumbs.push({
                    name: part,
                    prefix: buildprefix
                });
            }

            return breadcrumbs;
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
                    LastModified: object.LastModified,
                    Size: object.Size,
                    s3: 'object',
                    prefix: null,
                    href: object2hrefvirt(s3exp_config.Bucket, object.Key)
                };
            });
            var rows = prefixes.concat(objects);
            console.log(rows);
            $scope.$apply(function () {
                $scope.rows = rows; 
                $scope.breadcrumbs = breadcrumbs;
            });
        }
        
        $scope.selectObject = function(target) {
            console.log('Selected target ' + target.Key);
            if (target.s3 === "folder") {
                //delete s3exp_config.Marker;
                s3exp_config.Prefix = target.prefix;
                //s3exp_config.Delimiter = $("input[name='optionsdepth']:checked").val() == "folder" ? "/" : "";
                s3Service.go(s3exp_config, s3draw);
            // Else user has clicked on an object so download it in new window/tab
            } else {
                window.open(target.href, '_blank');
            }
        }

        $scope.selectBreakcrumb = function(breakcrumb) {
            var config = {Bucket: s3exp_config.Bucket, Prefix: breakcrumb.prefix, Delimiter: s3exp_config.Delimiter};
            s3Service.go(config, s3draw);
        }

        $scope.selected = [];
        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        s3Service.go(s3exp_config, s3draw);
      }
  });
})();
