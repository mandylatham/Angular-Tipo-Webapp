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
      scope: {
        field: '=',
        mode: '@?'
      },
      restrict: 'EA',
      replace: true,
      templateUrl: 'framework/_directives/_views/tp-file.tpl.html',
      link: function (scope, element, attrs) {
        var mode = scope.mode || 'view';
        scope.isEdit = mode === 'edit';
        var field = scope.field;
        scope.hasValue = !_.isUndefined(field._value);
        scope.isArray = Boolean(field._ui.isArray);
        scope.isSingle = !scope.isArray;
        scope.tempPath = {
          
        };
        var fileTarget = tipoManipulationService.getFieldMeta(field, 'file.target');
        if (fileTarget) {
          scope.isTargetSet = true;
          var parts = fileTarget.split('/');
          scope.isTargetFile = S(_.last(parts)).contains('.');
          if (scope.isTargetFile) {
            // cannot be an array if an exact file name is specified, hence treating as a single file
            scope.isSingle = true;
            field._value = {
              key: fileTarget
            };
          }
          if (!scope.isTargetFile && !S(fileTarget).endsWith('/')) {
            fileTarget += '/';
          }
        }
        scope.fileTarget = fileTarget || '';

        if(!scope.isTargetFile){
          if (scope.isSingle) {
            var path;
            if (field._value) {
              path = field._value.key;
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
            if(!_.isEmpty(field._value)){
              scope.multiplePaths = _.map(field._value, function(each){
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
            delete field._value;
            return;
          }
          if (scope.isTargetSet) {
            field._value = {
              key: scope.fileTarget + scope.singlePath.value
            };
          } else {
            field._value = {
              key: scope.singlePath.value
            };
          }
        };

        scope.onMultiPathChange = function (index, path) {
          scope.multiplePaths[index].value = path;
          field._value[index].key = scope.fileTarget + path;
        };

        scope.addMultiPathEntry = function(){
            var path = scope.tempPath.value || '';
            scope.multiplePaths.push({
              value: path
            });
            field._value = field._value || [];
            field._value.push({
              key: scope.fileTarget + path
            });
            delete scope.tempPath.value;
            scope.openContentDialog(field._value.length - 1);
        };

        scope.removeMultiPathEntry = function(index){
          scope.multiplePaths.splice(index, 1);
          field._value.splice(index, 1);
        };

        scope.openContentDialog = function (index) {
          var initialPath;
          if(!_.isUndefined(index)){
            initialPath = field._value[index].key || scope.fileTarget;
          }else{
            initialPath = _.get(field, '_value.key') || scope.fileTarget;
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
                  $scope.uploadStatus = 'in_progress';
                   var reader = new FileReader();
                   reader.onload = function(readerEvt) {
                    var binaryString = readerEvt.target.result;
                    var base64Encoded = btoa(binaryString);
                    var data = {
                      'File-Content': base64Encoded
                    };

                    tipoResource
                    .oneUrl('content', $scope.finalPath)
                    .customPUT(data, '', undefined)
                    .then(function(result){
                      $scope.uploadStatus = 'completed';
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