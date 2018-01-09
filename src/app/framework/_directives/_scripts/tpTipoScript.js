(function() {

    'use strict';

    var module = angular.module('tipo.framework');

    return module.directive('tpTipoScript', function(monacoeditorConfig, $http, tipoHandle, tipoManipulationService) {
        return {
            scope: {
                fqfieldname: '@',
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
            var unbind = scope.$watch(function() { return element[0].offsetHeight; }, function(n, o) {
                if (element[0].offsetHeight > 0) {
                    unbind();
                    var test = require.config({ paths: { 'vs': '/_scripts/non-bower-managed/monaco-editor/min/vs' } });
                    require(['vs/editor/editor.main'], function() {
                        var languages = monaco.languages.getLanguages();
                        scope.tipoDefinitions = {};
                        scope.fqfieldname = scope.fqfieldname.replace("tipoRootController.tipo.", "").replace("tipoRootController.tipo", "");
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
                                triggerCharacters: [".", "$"],
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
                            language: 'tipoScript'
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
                                    return getItemsfromTipodefintion(field_names, fq_field_name, contextScope, keyword);
                                    break;
                                }
                            case "tipo_root":
                                {
                                    items = [];
                                    return getItemsfromTipodefintion(field_names, fq_field_name, scope, keyword);
                                    break;
                                }
                            case "tipo_handle":
                                {
                                    items = [];
                                    return getItemsFromObject(field_names, fq_field_name, tipoHandle, scope, keyword);
                                    break;
                                }
                            case "tipo_context":
                                {
                                    items = [];
                                    return getItemsFromObject(field_names, fq_field_name, getTipoContext(), scope, keyword);
                                    break;
                                }
                            default:
                                {
                                    items = [];
                                }
                        }
                        // return items;
                    } else {
                        return [];
                    }
                } else {
                    return [];
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
            } else {
                return [];
            }
        }

        function getItemsFromObject(field_names, fq_field_name, object, scope, keyword) {
            var items = [];
            if (field_names[0] === "current_tipo") {
                fq_field_name = fq_field_name.replace("current_tipo.","").replace("current_tipo","");
                return getItemsfromTipodefintion(field_names.slice(1), fq_field_name, scope)
            } else {
                if (fq_field_name !== "") {
                    var obj = _.get(object, fq_field_name);
                } else {
                    var obj = object;
                }
                if (_.isObject(obj)) {
                    var keys = _.keys(obj);
                    _.each(obj, function(value, key) {
                        if (_.isArray(value)) {
                            items.push({
                                label: key,
                                kind: monaco.languages.CompletionItemKind.Field,
                                insertText: {
                                    value: key + '[${1:index}]'
                                }
                            })
                        } else if (typeof value === "function") {
                            console.log(value);
                            items.push({
                                label: key,
                                kind: monaco.languages.CompletionItemKind.Function,
                                insertText: {
                                    value: key + '(${1})'
                                }
                            })
                        } else {
                            items.push({
                                label: key,
                                kind: monaco.languages.CompletionItemKind.Field
                            })
                        }
                    })
                } else {
                    items = [];
                }
                return items;
            }
        }

        function getItemsfromTipodefintion(field_names, fq_field_name, scope, keyword) {
            var service = angular.copy(scope.root);
            scope.context = service.tipo_fields;
            if (fq_field_name !== "") {
                _.each(field_names, function(field) {
                    var field_name = field.replace(/\[index\]/g, "").replace(/\[\d\]/g, "");
                    var field_def = _.filter(scope.context, function(fld) { return fld.field_name === field_name })[0];
                    if (field_def.tipo_fields) {
                        scope.context = field_def.tipo_fields;
                    } else if (S(field_def.field_type).contains("FieldGroup")) {
                        var field_group = field_def.field_type.split(".")[1];
                        scope.context = _.filter(service.tipo_field_groups, function(fld_group) { return fld_group.tipo_group_name === field_group })[0].tipo_fields;
                    } else if (S(field_def.field_type).contains("Tipo") && field_def.relationship_type == "embed") {
                        var field_tipo = field_def.field_type.split(".")[1];
                        if (scope.tipoDefinitions[field_tipo]) {
                            service = scope.tipoDefinitions[field_tipo];
                            scope.context = scope.tipoDefinitions[field_tipo].tipo_fields;
                        } else {
                            scope.context = [];
                            tipoHandle.getTipoDefinition(field_tipo).then(function(definition) {
                                scope.tipoDefinitions[field_tipo] = definition;
                                service = scope.tipoDefinitions[field_tipo];
                                scope.context = scope.tipoDefinitions[field_tipo].tipo_fields;
                            });
                        }
                    } else {
                        scope.context = [];
                    }
                });
            }
            return tipoManipulationService.getKeysFromTipodefinition(scope.context);
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