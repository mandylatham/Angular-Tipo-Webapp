(function() {

    'use strict';

    var module = angular.module('tipo.framework');
    module.constant('monacoeditorConfig', {})

    return module.directive('tpJavascript', function(monacoeditorConfig, $http, tipoHandleString) {
        return {
            scope: {},
            restrict: 'EA',
            require: '?ngModel',
            compile: function compile() {
                // Omit checking "Require MonacoEditor"
                return postLink;
            }
        };

        function postLink(scope, element, iAttrs, ngModel) {
            var unbind = scope.$watch(function() { return element[0].offsetHeight; }, function(n, o) {
                if (element[0].offsetHeight > 0) {
                    var test = require.config({ paths: { 'vs': '/_scripts/non-bower-managed/monaco-editor/min/vs' } });
                    require(['vs/editor/editor.main'], function() {
                        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                            noSemanticValidation: false,
                            noSyntaxValidation: false
                        });
                        $http.get('/_scripts/non-bower-managed/monaco-editor/min/vs/custom-ts/tipoHandle.d.ts').then(function(data) {
                            monaco.languages.typescript.javascriptDefaults.addExtraLib(data.data);
                            var editor = monaco.editor.create(element[0], {
                                language: 'javascript'
                            });
                            configNgModelLink(editor, ngModel, scope);
                        });
                    });
                    unbind();
                };
            })
        }

        function configNgModelLink(monacoeditor, ngModel, scope) {
            console.log("configNgModelLink")
            if (!ngModel) { return; }

            // Monaco Editor expects a string, so make sure it gets one.
            // This does not change the model.
            ngModel.$formatters.push(function(value) {
                console.log("ngModel.$formatters")
                if (angular.isUndefined(value) || value === null)
                    return '';
                else if (angular.isObject(value) || angular.isArray(value))
                    throw new Error('ui-monacoeditor cannot use an object or an array as a model');
                return value
            });

            // Override the ngModelController $render method, which is what gets called when the model is updated.
            // This takes care of the synchronizing the monacoEditor element with the underlying model, in the case that it is changed by something else.
            ngModel.$render = function() {
                console.log("ngModel.$render");
                // Monaco Editor expects a string so make sure it gets one
                // Although the formatter has already done this, it can be possible that another formatter returns undefined (for example the required directive)
                var safeViewValue = ngModel.$viewValue || '';
                monacoeditor.setValue(safeViewValue)
            };

            ngModel.$render();

            // Keep the ngModel in sync with changes from MonacoEditor
            monacoeditor.onDidChangeModelContent(function(e) {
                var newValue = monacoeditor.getValue();
                console.log("onDidChangeModelContent " + newValue)
                if (newValue !== ngModel.$viewValue) {
                    scope.$evalAsync(function() {
                        ngModel.$setViewValue(newValue)
                    })
                }
            })
        }
    });

})();