(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpFile', function (
    tipoManipulationService,
    tipoResource,
    $mdDialog,
    $http,
    $timeout
  ) {
    return {
      require: 'ngModel',
      scope: {
        field: '=',
        mode: '@?',
        isarray: "=",
        metaData: "=",
        fieldpath: '='
      },
      restrict: 'EA',
      replace: true,
      templateUrl: 'framework/_directives/_views/tp-file.tpl.html',
      link: function (scope, element, attrs) {
        var mode = scope.mode || 'view';
        scope.isEdit = mode === 'edit';

        // function getFieldDefiniton(){

        // };
        // if (!_.isUndefined(scope.fieldpath)) {
        //   _.each(scope.field.tipo_fields,function(tpField){
        //     if (tpField.field_name === scope.fieldpath) {
        //       scope.field = tpField;
        //       return;
        //     };
        //   });
        // };
        scope.hasValue = !_.isUndefined(scope.field);
        scope.isArray = Boolean(scope.isarray);
        scope.isSingle = !scope.isArray;
        scope.tempPath = {
          
        };
        var fileTarget = scope.metaData;
        if (fileTarget) {
          scope.isTargetSet = true;
          var parts = fileTarget.split('/');
          scope.isTargetFile = S(_.last(parts)).contains('.');
          if (scope.isTargetFile) {
            // cannot be an array if an exact file name is specified, hence treating as a single file
            scope.isSingle = true;
            scope.field = {
              key: fileTarget
            };
          }
          if (!scope.isTargetFile && !S(fileTarget).endsWith('/')) {
            fileTarget += '/';
          }
        }
        scope.prependTarget = fileTarget || '';
        scope.fileTarget = 'public/' + scope.prependTarget;

        if(!scope.isTargetFile){
          if (scope.isSingle) {
            var path;
            if (scope.field) {
              path = scope.field.key;
              if (fileTarget) {
                path = path.replace(fileTarget, '');
              }
            }
            scope.singlePath = {
              value: path
            };
          }else{
            // for arrays
            scope.multiplePaths = [];
            if(!_.isEmpty(scope.field)){
              scope.multiplePaths = _.map(scope.field, function(each){
                var eachPath = each.key;
                if(fileTarget){
                  eachPath = eachPath.replace(fileTarget, '');
                }
                return {
                  value: eachPath
                };
              });
            }
          }
        }

        scope.onSinglePathChange = function () {
          if (_.isEmpty(scope.singlePath.value)) {
            scope.field = {};
            return;
          }
          if (scope.isTargetSet) {
            scope.field = {
              key: scope.fileTarget + scope.singlePath.value
            };
          } else {
            scope.field = {
              key: scope.singlePath.value
            };
          }
        };

        scope.onMultiPathChange = function (index, path) {
          scope.multiplePaths[index].value = path;
          scope.field[index].key = scope.fileTarget + path;
        };

        scope.addMultiPathEntry = function(){
            var path = scope.tempPath.value || '';
            scope.multiplePaths.push({
              value: path
            });
            scope.field = scope.field || [];
            scope.field.push({
              key: scope.fileTarget + path
            });
            delete scope.tempPath.value;
            scope.openContentDialog(scope.field.length - 1);
        };

        scope.removeMultiPathEntry = function(index){
          scope.multiplePaths.splice(index, 1);
          scope.field.splice(index, 1);
        };

        scope.openContentDialog = function (index) {
          var initialPath;
          if(!_.isUndefined(index)){
            initialPath = scope.field[index].key || scope.fileTarget;
          }else{
            initialPath = _.get(scope.field, 'key') || scope.fileTarget;
          }
          var promise = $mdDialog.show({
            controller: function FileContentController($scope) {
              $scope.delay = 0;
              $scope.minDuration = 0;
              $scope.message = 'Please Wait...';
              $scope.backdrop = true;

              $scope.uploadStatus = 'not_started';

              $scope.parent = scope; 
              $scope.fileSize = "10MB";
              $scope.content = [];
              var finalPath;
              if(initialPath){
                var parts = initialPath.split('/');
                if(S(_.last(parts)).contains('.')){
                  $scope.isInitialPathFinal = true;
                  $scope.fixedPrefix = initialPath;
                  finalPath = initialPath;
                }else {
                  if(!S(initialPath).endsWith('/')){
                    initialPath += '/';
                  }
                  $scope.fixedPrefix = initialPath;
                  finalPath = initialPath;
                }
              }
              $scope.finalPath = finalPath;

              $scope.upload = function () {
                if($scope.content.length > 0){
                  var file = $scope.content[0].lfFile;
                  var type = $scope.content[0].lfFileType;
                  $scope.uploadStatus = 'in_progress';
                   var reader = new FileReader();
                   reader.onload = function(readerEvt) {
                    var binaryString = readerEvt.target.result;
                    var base64Encoded = btoa(binaryString);
                    var data = {
                      'File-Content': base64Encoded,
                      'Content-Type': type
                    };

                    tipoResource
                    .oneUrl('content', $scope.finalPath)
                    .customPUT(data, '', undefined)
                    .then(function(result){
                      $scope.uploadStatus = 'completed';
                      $scope.complete();
                    });
                   }
                    
                   reader.readAsBinaryString(file);
                }
              }

              $scope.cancel = function () {
                $mdDialog.cancel();
              }

              $scope.complete = function() {
                $mdDialog.hide($scope.finalPath);
              };

              if(!$scope.isInitialPathFinal){
                $scope.$watch('content[0].lfFileName',function(newName){
                  if(_.isUndefined(newName)){
                    if($scope.fixedPrefix){
                      $scope.finalPath = $scope.fixedPrefix;
                    }else{
                      delete $scope.finalPath;
                    }
                  }else{
                    if($scope.fixedPrefix){
                      $scope.finalPath = $scope.fixedPrefix + newName;
                    }else{
                      $scope.finalPath = newName;
                    }
                  }
                });
              }

              function raiseError(err) {
                console.error(err);
                if (err && err.errorMessage) {
                  $scope.lastError = err.errorMessage;
                } else if (err && err.data && err.data.errorMessage) {
                  $scope.lastError = err.data.errorMessage;
                } else if (err && err.message) {
                  $scope.lastError = err.message;
                }
              }
            },
            templateUrl: 'framework/_directives/_views/tp-file-content.tpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            escapeToClose: true,
            skipHide: true,
            clickOutsideToClose: true,
            fullscreen: true
          });
          promise.then(function(finalPath){
            if(!_.isUndefined(finalPath)){
              var parts = finalPath.split('/');
              if(S(_.last(parts)).contains('.')){
                if(finalPath !== initialPath){
                  // indicates that a file path is there and is not the original one
                  if(_.isUndefined(index)){
                    if(_.isEmpty(scope.fileTarget)){
                      scope.singlePath.value = finalPath;
                      scope.onSinglePathChange();
                    }else{
                      scope.singlePath.value = finalPath.replace(scope.fileTarget, '');
                      scope.onSinglePathChange();
                    }
                  }else{
                    var path = finalPath.replace(scope.fileTarget, '');
                    scope.onMultiPathChange(index, path);
                  }
                }
              }
            }
          })
        }
      }
    };
  });

})();