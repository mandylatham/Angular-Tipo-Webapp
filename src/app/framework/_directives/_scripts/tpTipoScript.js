(function() {

    'use strict';

    var module = angular.module('tipo.framework');

    return module.directive('tpTipoScript', function(tipoHandle, tipoManipulationService tipoClientJavascript,
        tipoCustomJavascript, ) {
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
                    }else{
                        scope.changeModel = false;
                    }
                });
            }
            var unbind = scope.$watch(function() { return element[0].offsetHeight; }, function(n, o) {
                if (element[0].offsetHeight > 0) {
                    unbind();
                    var test = require.config({ paths: { 'vs': '/_scripts/non-bower-managed/monaco-editor/min/vs' } });
                    require(['vs/editor/editor.main'], function() {
                        var languages = monaco.languages.getLanguages();
                        scope.tipoDefinitions = {};
                        scope.fqfieldname = scope.fqfieldname.replace("tipoRootController.tipo.", "").replace("tipoRootController.tipo", "");
                        if (scope.type === "filterScript") {
                            var defcontext = scope.defcontext.replace("tipoRootController.tipo.", "").replace("tipoRootController.tipo", "");
                            defcontext = _.get(scope.root, defcontext);
                            if (defcontext) {
                                scope.defaultObj = _.startsWith(defcontext.field_type, "Tipo.") ? defcontext.field_type.split(".")[1] : undefined;
                            } else {
                                scope.defaultObj = undefined;
                            }
                            var triggerCharacters = [".", "$", " "];
                            tipoHandle.getTipoDefinition(scope.defaultObj).then(function(definition) {
                                scope.tipoDefinitions[scope.defaultObj] = definition;
                            });
                        } else {
                            var triggerCharacters = [".", "$"];
                        }
                        monaco.scope = scope;
                        if (_.findIndex(languages, function(lang) { return lang.id === "tipoScript" }) === -1) {
                            monaco.languages.register({ id: 'tipoScript' });
                            // Register a tokens provider for the language
                            monaco.languages.setMonarchTokensProvider('tipoScript', {
                                tokenizer: {
                                    root: [
                                        [/\$.*\./, "custom-keyword"]
                                    ]
                                }
                            });
                            monaco.editor.defineTheme('tipoTheme', {
                                base: 'vs',
                                inherit: false,
                                rules: [
                                    { token: 'custom-keyword', foreground: '008800' }
                                ]
                            });
                            monaco.languages.registerCompletionItemProvider('tipoScript', {
                                triggerCharacters: triggerCharacters,
                                provideCompletionItems: function(model, position) {
                                    var wordInfo = model.getWordUntilPosition(position);
                                    var fullValue = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
                                    var monacoscope = monaco.scope;
                                    return getIntellisenseItems(wordInfo, fullValue, monacoscope);
                                    // if (wordInfo.word === "sim") {
                                    return [{
                                        label: 'simpleText',
                                        kind: monaco.languages.CompletionItemKind.Field
                                    }, {
                                        label: 'simpleTextscope',
                                        kind: monaco.languages.CompletionItemKind.Field,
                                        insertText: {
                                            value: 'testing(${1:condition})'
                                        }
                                    }]
                                    // } else {
                                    //     return [];
                                    // }
                                }
                            });
                        };
                        var editor = monaco.editor.create(element[0], {
                            theme: 'tipoTheme',
                            language: 'tipoScript',
                            minimap: { enabled: false },
                            wordWrap: "on"
                        });
                        editor.addCommand(monaco.KeyCode.Enter, function(accessor) {
                            editor.trigger('bla', 'type', { text: '' });
                        }, '!suggestWidgetVisible && !renameInputVisible && !inSnippetMode && !quickFixWidgetVisible')
                        editor.onDidFocusEditor(function() {
                            monaco.scope = scope;
                        });
                        configNgModelLink(editor, ngModel, scope);
                    });
                };
            });
        }

        function getIntellisenseItems(wordInfo, fullValue, scope) {
            var beforestring = fullValue.substring(0, wordInfo.startColumn - 1);
            if (_.endsWith(beforestring, ".")) {
                var lastdollar = beforestring.lastIndexOf("$");
                if (lastdollar > -1) {
                    var keystring = beforestring.substring(lastdollar);
                    if (!S(keystring).contains(" ")) { // Replace contains with expression [a-zA-Z0-9.]
                        var firstdot = keystring.indexOf(".");
                        var keyword = keystring.substring(1, firstdot);
                        var fq_field_name = keystring.substring(firstdot + 1).replace(/.$/, "");
                        var field_names = fq_field_name.split(".");
                        var items = [];
                        switch (keyword) {
                            case "tipo":
                                {
                                    items = [];
                                    if (scope.fqfieldname !== "") {
                                        var contextScope = { root: _.get(scope.root, scope.fqfieldname), tipoDefinitions: scope.tipoDefinitions };
                                    } else {
                                        var contextScope = scope;
                                    }
                                    return tipoManipulationService.getItemsfromTipodefintion(field_names, fq_field_name, contextScope, keyword);
                                    break;
                                }
                            case "tipo_root":
                                {
                                    items = [];
                                    return tipoManipulationService.getItemsfromTipodefintion(field_names, fq_field_name, scope, keyword);
                                    break;
                                }
                            case "tipo_handle":
                                {
                                    items = [];
                                    return tipoManipulationService.getItemsFromObject(field_names, fq_field_name, tipoHandle, scope, keyword);
                                    break;
                                }
                            case "tipo_context":
                                {
                                    items = [];
                                    return tipoManipulationService.getItemsFromObject(field_names, fq_field_name, getTipoContext(), scope, keyword);
                                    break;
                                }
                            default:
                                {
                                    items = [];
                                }
                        }
                        // return items;
                    } else if (scope.type = "filterScript") {
                        return getItemsFromDefObject(beforestring, scope);
                    }
                } else if (scope.type = "filterScript") {
                    return getItemsFromDefObject(beforestring, scope);
                }
            } else if (_.endsWith(beforestring, "$")) {
                return [{
                        label: 'tipo',
                        kind: monaco.languages.CompletionItemKind.Keyword
                    },
                    {
                        label: 'tipo_root',
                        kind: monaco.languages.CompletionItemKind.Keyword
                    },
                    {
                        label: 'tipo_handle',
                        kind: monaco.languages.CompletionItemKind.Keyword
                    },
                    {
                        label: 'tipo_context',
                        kind: monaco.languages.CompletionItemKind.Keyword
                    },
                ];
            } else if (scope.type === "filterScript") {
                if (_.endsWith(beforestring, "") || _.endsWith(beforestring, " ")) {
                    return getItemsFromDefObject(beforestring, scope);
                }
                return [];
            }
        }

        function getItemsFromDefObject(beforestring, scope) {
            if (scope.defaultObj) {
                var contextScope = { root: scope.tipoDefinitions[scope.defaultObj], tipoDefinitions: scope.tipoDefinitions };
            } else {
                var contextScope = scope;
            }
            var lastspace = beforestring.lastIndexOf(" ");
            if (lastspace > -1) {
                var fq_field_name = beforestring.substring(lastspace).replace(/.$/, "").replace(" ", "");
            } else {
                var fq_field_name = beforestring.replace(/.$/, "").replace(" ", "");
            }
            var field_names = fq_field_name.split(".");
            return tipoManipulationService.getItemsfromTipodefintion(field_names, fq_field_name, contextScope);
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

        function getTipoContext() {
            return {
                "user": "",
                "user_role": "",
                "account": "",
                "account_name": "",
                "application": "",
                "application_name": "",
                "application_owner_account": "",
                "application_owner_account_name": "",
                "gateway_request": {
                    "tipo_name": "",
                    "tipo_id": "",
                    "tipo_action": "",
                    "http_method": "",
                    "page": "",
                    "per_page": "",
                    "tipo_filter": "",
                    "params": ""
                },
                "current_tipo": {

                },
                "user_attributes": {
                    "user_tipo": "",
                    "user_tipo_id": "",
                    "org_tipo": "",
                    "org_tipo_id": ""
                }

            }
        }
    });

})();