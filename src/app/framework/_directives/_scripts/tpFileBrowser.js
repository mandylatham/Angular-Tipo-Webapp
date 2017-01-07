(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFileBrowser', function (s3Service, s3SelectionModel) {
      return {
        template:
            '<input class="ng-hide" id="input-file-id" multiple type="file" />' +
            '<label for="input-file-id" class="md-button md-raised md-primary">Choose Files</label>',
        link: function($scope, $element) {
            var input = $element.find('#input-file-id');
            input.on('change', function (e) {
                var files = e.target.files;
                if (files[0] && s3SelectionModel.getBucketName()) {
                    var fileName = files[0].name;
                    s3Service.uploadFile(s3SelectionModel.getBucketName(), fileName).then(function(result) {
                        console.log(result);
                    }, function(err) {
                        console.error(err);
                    });
                }
            });
        }
      };
  });
})();
