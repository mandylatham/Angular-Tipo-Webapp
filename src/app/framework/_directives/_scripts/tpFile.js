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
        fieldpath: '=',
        fileTargetVel: '=',
        privateFile: '=',
        rootFolder: '='
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
        var fileTarget = scope.fileTargetVel;
        if (scope.privateFile) {
        	scope.rootFolder = 'private/' + uuid4() ;
        } else {
        	scope.rootFolder = "public";
      	}
        if (fileTarget) {
          scope.isTargetSet = true;
          var parts = fileTarget.split('/');
          scope.isTargetFile = S(_.last(parts)).contains('.');
          if (scope.isTargetFile) {
            // cannot be an array if an exact file name is specified, hence treating as a single file
            scope.isSingle = true;
            scope.field = {
              key: fileTarget,
              rootFolder: scope.rootFolder
            };
          }
          if (!scope.isTargetFile && !S(fileTarget).endsWith('/')) {
            fileTarget += '/';
          }
        }
        scope.prependTarget = fileTarget || '';
    	scope.fileTarget = '/tipo_upload/' + scope.rootFolder + '/' + scope.prependTarget;

        if(!scope.isTargetFile){
          if (scope.isSingle) {
            var path;
            if (scope.field) {
              path = scope.field.key;
              if (fileTarget) {
                path = path.replace(scope.fileTarget, '');
              }
              scope.singlePath = {
                value: path,
                tagType: scope.field.type,
                fileType: scope.field.fileType
              };
            }else{
              scope.singlePath = {
                value: path
              };
            }
          }else{
            // for arrays
            scope.multiplePaths = [];
            if(!_.isEmpty(scope.field)){
              scope.multiplePaths = _.map(scope.field, function(each){
                var eachPath = each.key;
                if(scope.fileTarget){
                  eachPath = eachPath.replace(scope.fileTarget, '');
                }
                return {
                  value: eachPath,
                  type: each.type,
                  fileType: each.fileType
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
              key: scope.fileTarget + (scope.isTargetFile ? '' :scope.singlePath.value),
              type: scope.singlePath.tagType,
              fileType: scope.singlePath.fileType,
              rootFolder: scope.rootFolder
            };
          } else {
            scope.field = {
              key: scope.singlePath.value,
              type: scope.singlePath.tagType,
              fileType: scope.singlePath.fileType,
              rootFolder: scope.rootFolder
            };
          }
        };

        scope.onMultiPathChange = function (index, path, type, fileType) {
          scope.multiplePaths.push({value: path});
          scope.field.push({
              key: scope.fileTarget + path,
              type: type,
              fileType: fileType,
              rootFolder: scope.rootFolder
          });
        };

        scope.addMultiPathEntry = function(){
            var path = scope.tempPath.value || '';
            // scope.multiplePaths.push({
            //   value: path
            // });
            scope.field = scope.field || [];
            // scope.field.push({
            //   key: scope.fileTarget + path
            // });
            delete scope.tempPath.value;
            scope.openContentDialog(scope.field.length - 1);
        };

        scope.removeMultiPathEntry = function(index){
          scope.multiplePaths[index].deleted = true;
          scope.field[index]._ARRAY_META._STATUS = 'DELETED';
        };
        
        function uuid4() {
            //// return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            var uuid = '', ii;
            for (ii = 0; ii < 32; ii += 1) {
              switch (ii) {
              case 8:
              case 20:
                uuid += '_';
                uuid += (Math.random() * 16 | 0).toString(16);
                break;
              case 12:
                uuid += '_';
                uuid += '4';
                break;
              case 16:
                uuid += '_';
                uuid += (Math.random() * 4 | 8).toString(16);
                break;
              default:
                uuid += (Math.random() * 16 | 0).toString(16);
              }
            }
            return uuid;
          }

        function completeUpload(initialPath,finalPath,tagType,fileType,index){
          if(!_.isUndefined(finalPath)){
            var parts = finalPath.split('/');
            if(S(_.last(parts)).contains('.')){
              if(finalPath !== initialPath){
                // indicates that a file path is there and is not the original one
                if(_.isUndefined(index)){
                  scope.singlePath.tagType = tagType;
                  scope.singlePath.fileType = fileType;
                  if(_.isEmpty(scope.fileTarget)){
                    scope.singlePath.value = finalPath;
                    scope.onSinglePathChange();
                  }else{
                    scope.singlePath.value = finalPath.replace(scope.fileTarget, '');
                    scope.onSinglePathChange();
                  }
                }else{
                  var path = finalPath.replace(scope.fileTarget, '');
                  scope.onMultiPathChange(index, path, tagType, fileType);
                }
              }
            }
          }
        }

        scope.openViewFile = function(filePath){
          // tipoResource.oneUrl('content',"g/" + scope.fileTarget + filePath).withHttpConfig({responseType: 'blob'}).get().then(function(data){
          //   console.log("data");
          // })
          var template;
          var type = filePath.tagType || filePath.type || "text/plain";
          var src =  "g/" + scope.fileTarget + filePath.value;
          switch(type){
              case 'image': {
                  template = '<md-dialog><div><img class="fullwidth" src="' + src + '" /> <div></md-dialog>';
                  break;
              }
              case 'video': {
                  template =
                      '<md-dialog class="fullwidth fullheight"><div class="fullwidth fullheight"><video class="fullwidth fullheight" controls>' +
                          '<source src="' + src + '"">' +
                      '</video><div></md-dialog>'
                  break;
              }
              case 'audio': {
                  template =
                      '<md-dialog class="fullwidth fullheight"><div class="fullwidth fullheight"><audio class="fullwidth fullheight" controls>' +
                          '<source src="' + src + '"">' +
                      '</audio><div></md-dialog>'
                  break;
              }
              default : {
                  template =
                      '<md-dialog class="fullwidth fullheight"><div class="fullwidth fullheight"><object class="fullwidth fullheight"  type="' + filePath.fileType + '" data="' + src + '">' +
                          '<div class="lf-ng-md-file-input-preview-default">' +
                              '<md-icon class="lf-ng-md-file-input-preview-icon "></md-icon>' +
                          '</div>' +
                      '</object><div></md-dialog>';
              }
          }
          var promise = $mdDialog.show({
            template: template,
            parent: angular.element(document.body),
            targetEvent: event,
            escapeToClose: true,
            skipHide: true,
            clickOutsideToClose: true,
            fullscreen: true})
        }

        scope.openContentDialog = function (index) {
          var initialPath;
          if(!_.isUndefined(index)){
            initialPath = (scope.fileTarget + (scope.tempPath.value || '')) || scope.fileTarget;
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
              $scope.fileSize = "1MB";
              $scope.content = [];
              var finalPath;
              if(initialPath){
                var parts = initialPath.split('/');
                if(S(_.last(parts)).contains('.')){
                  $scope.fixedPrefix = scope.fileTarget;
                  finalPath = scope.fileTarget;
                }else {
                  if(!S(initialPath).endsWith('/')){
                    initialPath += '/';
                  }
                  $scope.fixedPrefix = initialPath;
                  finalPath = initialPath;
                }
              }
              $scope.finalPath = finalPath;

              function uploadEachFile(fileContent,last){
                var file = fileContent.lfFile;
                var type = fileContent.lfFileType;
                $scope.uploadStatus = 'in_progress';
                 var reader = new FileReader();
                 reader.onload = function(readerEvt) {
                  var binaryString = readerEvt.target.result;
                  var base64Encoded = btoa(binaryString);
                  var data = {
                    'File-Content': base64Encoded,
                    'Content-Type': type
                  };
                  fileContent.lfFileName = _.replace(fileContent.lfFileName, ' ', '');

                  tipoResource
                  .oneUrl('content', scope.fileTarget + (scope.isTargetFile ? '' :  fileContent.lfFileName))
                  .customPUT(data, '', undefined)
                  .then(function(result){
                    if (last) {
                      $scope.uploadStatus = 'completed';
                      $scope.complete();
                    };
                  });
                 }
                  
                 reader.readAsBinaryString(file);
              }
              $scope.upload = function () {
                if (scope.isArray) {
                  _.each($scope.content,function(fileContent){
                    uploadEachFile(fileContent,true);
                  });
                }else{
                  if($scope.content.length > 0){
                    uploadEachFile($scope.content[0],true);
                  }
                }
              }

              $scope.cancel = function () {
                $mdDialog.cancel();
              }

              $scope.complete = function() {
                $mdDialog.hide($scope.finalPath);
              };

              if(!$scope.isInitialPathFinal){
                if (scope.isArray) {
                  $scope.$watch('content.length',function(){
                    $scope.finalPath = {path: "", fileType: "",tagType: "" };
                    _.each($scope.content,function(fileContent){
                      if(_.isUndefined(fileContent.lfFileName)){
                        delete $scope.finalPath;
                      }else{
                        fileContent.lfFileName = _.replace(fileContent.lfFileName, ' ', '');
                        if($scope.fixedPrefix){
                          $scope.finalPath.path = $scope.fixedPrefix + fileContent.lfFileName  + "," + $scope.finalPath.path;
                        }else{
                          $scope.finalPath.path = fileContent.lfFileName + "," + $scope.finalPath.path;
                        }
                        $scope.finalPath.tagType = fileContent.lfTagType + "," + $scope.finalPath.tagType;
                        $scope.finalPath.fileType = fileContent.lfFileType + "," + $scope.finalPath.fileType;
                      }
                    })
                  });
                }else{
                  $scope.finalPath = {};
                  $scope.$watch('content[0].lfFileName',function(newName){
                    $scope.finalPath = {path: "", fileType: "",tagType: "" };
                      if(_.isUndefined(newName)){
                        delete $scope.finalPath;
                      }else{
                        newName = _.replace(newName, ' ', '');
                        if($scope.fixedPrefix){
                          $scope.finalPath.path = $scope.fixedPrefix + (scope.isTargetFile ? '' : newName);
                        }else{
                          $scope.finalPath.path = newName;
                        }
                        $scope.finalPath.tagType = $scope.content[0].lfTagType;
                        $scope.finalPath.fileType = $scope.content[0].lfFileType;
                      }
                  });
                }                
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
        	  var replaceStr = '/tipo_upload/' + scope.rootFolder;
    	  scope.fileTarget = _.replace(scope.fileTarget,replaceStr,'');
    	  initialPath = _.replace(initialPath,replaceStr,'');
    	  finalPath.path = _.replace(finalPath.path, new RegExp(replaceStr,'g'),'');
            if (scope.isArray) {
              var paths = finalPath.path.split(",");
              var types = finalPath.tagType.split(",");
              var fileTypes = finalPath.fileType.split(",");
              angular.forEach(paths,function(each,key){
                if (!_.isEmpty(each)) {
                  completeUpload(initialPath,each,types[key],fileTypes[key],key);
                };
              })
            }else{
              completeUpload(initialPath,finalPath.path,finalPath.tagType,finalPath.fileType);
            }
          });
        }
      }
    };
  });

})();