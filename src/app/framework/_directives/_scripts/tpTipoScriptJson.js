(function() {

    'use strict';

    var module = angular.module('tipo.framework');

    return module.directive('tpTipoScriptJson', function(tipoHandle, tipoManipulationService, tipoClientJavascript, tipoCustomJavascript) {
        return {
            scope: {
                fqfieldname: '@',
                type: '@',
                defcontext: '@',
                root: '='
            },
            restrict: 'EA',
            require: '?ngModel',
            compile: function compile() {
                // Omit checking "Require MonacoEditor"
                return postLink;
            }
        };

        function postLink(scope, element, iAttrs, ngModel) {
            var function_name = (scope.root.tipo_name + "_" + scope.fqfieldname + "_OnChange").replace(".", "_").replace(/\[\w+\]/g, "");
            if (typeof tipoCustomJavascript[function_name] === 'function' || typeof tipoClientJavascript[function_name] === 'function') {
                ngModel.$viewChangeListeners.push(function() {
                    if (scope.changeModel) {
                        scope.data_handle.tipo = scope.root.tipo;
                        scope.data_handle.context = scope.defcontext;
                        scope.data_handle.new_value = ngModel.$viewValue;
                        if (typeof tipoCustomJavascript[function_name] === 'function') {
                            tipoCustomJavascript[function_name](scope.data_handle);
                            scope.changeModel = true;
                            ngModel.$setViewValue(scope.data_handle.new_value);
                        };
                        if (typeof tipoClientJavascript[function_name] === 'function') {
                            tipoClientJavascript[function_name](scope.data_handle);
                            scope.changeModel = true;
                            ngModel.$setViewValue(scope.data_handle.new_value);
                        };
                    } else {
                        scope.changeModel = false;
                    }
                });
            }
            var unbind = scope.$watch(function() { return element[0].offsetHeight; }, function(n, o) {
                if (element[0].offsetHeight > 0) {
                    unbind();
                    var test = require.config({ paths: { 'vs': '/_scripts/non-bower-managed/monaco-editor/min/vs' } });
                    require(['vs/editor/editor.main'], function() {

                        monaco.scope = scope;
                        var editor = monaco.editor.create(element[0], {
                            language: 'json'
                        });
                        editor.updateOptions({
                            formatOnPaste: true,
                            codeLens: false

                        })
                        editor.onDidFocusEditor(function() {
                            monaco.scope = scope;
                        });
                        configNgModelLink(editor, ngModel, scope);
                    });
                };
            });
            ngModel.$viewChangeListeners.push(function() {
                scope.$eval(iAttrs.ngChange);
            });
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
                monacoeditor.setValue(JSON.stringify(safeViewValue));
                setTimeout(function(){
                    monacoeditor.getAction('editor.action.formatDocument').run();
                },300);
            };

            ngModel.$render();
            // Keep the ngModel in sync with changes from MonacoEditor
            monacoeditor.onDidChangeModelContent(function(e) {
                var newValue = monacoeditor.getValue();
                console.log("onDidChangeModelContent " + newValue)
                if (S(newValue).contains("/n")) {
                    newValue = newValue.replace("/n", "");
                };
                if (newValue !== ngModel.$viewValue) {
                    scope.$evalAsync(function() {
                        ngModel.$setViewValue(newValue);
                    })
                }
            })
        }

    });

})();