(function() {

    'use strict';

    var module = angular.module('tipo.framework');

    return module.directive('tpJavascript', function(tipoManipulationService, tipoHandle) {
        return {
            scope: {
                datahandle: '=',
                fqfieldname: '@',
                type: '@',
                defcontext: '=',
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
                    var test = require.config({ paths: { 'vs': '/_scripts/non-bower-managed/monaco-editor/min/vs' } });
                    require(['vs/editor/editor.main'], function() {
                        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                            noSemanticValidation: false,
                            noSyntaxValidation: false
                        });
                        scope.tipoDefinitions = {};
                        var defcontext = scope.defcontext.replace("tipoRootController.tipo.", "").replace("tipoRootController.tipo", "");
                        scope.defcontextObj = _.get(scope.root, defcontext);
                        monaco.scope = scope;
                        if (_.isEmpty(monaco.languages.typescript.javascriptDefaults._extraLibs)) {
                            monaco.languages.typescript.javascriptDefaults.addExtraLib(tipoHandleString());
                            monaco.languages.registerCompletionItemProvider('javascript', {
                                triggerCharacters: ["."],
                                provideCompletionItems: function(model, position) {
                                    var wordInfo = model.getWordUntilPosition(position);
                                    var wordInfo1 = model.getWordAtPosition(position);
                                    var fullValue = model.getValueInRange({ startLineNumber: position.lineNumber, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
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
                            language: 'javascript'
                        });
                        editor.onDidFocusEditor(function() {
                            // monaco.languages.typescript.javascriptDefaults.addExtraLib(scope.datahandle);
                        });
                        configNgModelLink(editor, ngModel, scope);
                    });
                    unbind();
                };
            })
        }

        function getIntellisenseItems(wordInfo, fullValue, scope) {
            var beforestring = fullValue.substring(0, wordInfo.startColumn - 1);
            if (_.endsWith(beforestring, ".")) {
                var lastspace = beforestring.lastIndexOf(" ");
                if (lastspace > -1 || _.startsWith(beforestring, "data_handle.")) {
                    var keystring = beforestring.substring(lastspace + 1);
                    var firstdot = keystring.indexOf(".");
                    var keyword = keystring.substring(0, firstdot);
                    var fq_field_name = keystring.substring(firstdot + 1).replace(/.$/, "");
                    var seconddot = fq_field_name.indexOf(".");
                    if (seconddot === -1) {
                        var secondkeyword = fq_field_name;
                    } else {
                        var secondkeyword = fq_field_name.substring(0, seconddot);
                    }
                    var secondRkeyword = secondkeyword.replace(/\[index\]/g, "").replace(/\[\d\]/g, "");
                    var field_names = fq_field_name.split(".");
                    var items = [];
                    var secondkeyObj = _.find(scope.datahandle, function(prop) { return prop.name === secondRkeyword && prop.is_object })
                    if (keyword === "data_handle" && _.isObject(secondkeyObj)) {
                        if (secondkeyObj.default_object_path) {
                            if (_.startsWith(secondkeyObj.default_object_path, "this.")) {
                                scope.defaultObj = _.get(scope.defcontextObj, secondkeyObj.default_object_path.replace("this.", ""));
                            } else {
                                scope.defaultObj = _.get(scope.root, secondkeyObj.default_object_path);
                            }
                        };
                        beforestring = beforestring.replace(keyword + "." + secondkeyword + ".", "");
                        return getItemsFromDefObject(beforestring, scope);
                    };
                    if (keyword === "data_handle") {
                        _.each(scope.datahandle, function(prop) {
                            var defaultLoop = true;
                            if (prop.event_specific && !S(_.get(scope.defcontextObj, "event_name")).contains(prop.event_specific)) {
                                defaultLoop = false;
                            };
                            if (defaultLoop) {
                                if (prop.default_object_path) {
                                    if (_.startsWith(prop.default_object_path, "this.")) {
                                        var obj = _.get(scope.defcontextObj, prop.default_object_path.replace("this.", ""));
                                        tipoHandle.getTipoDefinition(obj).then(function(definition) {
                                            scope.tipoDefinitions[obj] = definition;
                                        });
                                    } else {
                                        var obj = _.get(scope.root, prop.default_object_path);
                                        tipoHandle.getTipoDefinition(obj).then(function(definition) {
                                            scope.tipoDefinitions[obj] = definition;
                                        });
                                    }
                                };
                                if (prop.is_array && prop.is_object) {
                                    items.push({
                                        label: prop.name,
                                        kind: monaco.languages.CompletionItemKind.Reference,
                                        insertText: {
                                            value: prop.name + '[${1:index}]'
                                        }
                                    });
                                } else if (prop.is_array) {
                                    items.push({
                                        label: prop.name,
                                        kind: monaco.languages.CompletionItemKind.Field,
                                        insertText: {
                                            value: prop.name + '[${1:index}]'
                                        }
                                    });
                                } else if (prop.is_object) {
                                    items.push({
                                        label: prop.name,
                                        kind: monaco.languages.CompletionItemKind.Interface
                                    });
                                } else {
                                    items.push({
                                        label: prop.name,
                                        kind: monaco.languages.CompletionItemKind.Property
                                    });
                                }
                            };
                        });
                        return items;
                    };
                } else if (scope.type = "filterScript") {
                    return getItemsFromDefObject(beforestring, scope);
                }
            } else {
                if (_.endsWith(beforestring, "") || _.endsWith(beforestring, " ")) {
                    return [{
                        label: 'data_handle',
                        kind: monaco.languages.CompletionItemKind.Class
                    }];
                }
                return [];
            }
        }

        function tipoHandleString() {
            return ("declare class tipo_handle\nstatic getConfirmation(title: string, user_message: string): boolean\nstatic application_meta(title: string, user_message: string): boolean\nstatic hideElement(element_class: string): boolean\nstatic showElement(element_class: string): boolean\nstatic getTipoDefinition(tipo_name: string, disableExpansion: boolean): boolean\nstatic routeTo(title: string, user_message: string): boolean\nstatic saveTipo(title: string, user_message: string): boolean\nstatic saveTipos(title: string, user_message: string): boolean\nstatic createTipo(title: string, user_message: string): boolean\nstatic createTipos(title: string, user_message: string): boolean\nstatic deleteTipo(title: string, user_message: string): boolean\nstatic getTipo(title: string, user_message: string): boolean\nstatic purgeTipo(title: string, user_message: string): boolean\nstatic getTipos(title: string, user_message: string): boolean\nstatic presentForm(title: string, user_message: string): boolean\nstatic showMessage(title: string, user_message: string): boolean\nstatic callAction(title: string, user_message: string): boolean\nstatic toTipo(title: string, user_message: string): boolean\nstatic setPerspective(title: string, user_message: string): boolean\nstatic setMenuItem(title: string, user_message: string): boolean\nstatic getMenuItem(title: string, user_message: string): boolean\nstatic getTourItem(title: string, user_message: string): boolean\nstatic setTourObject(title: string, user_message: string): boolean\nstatic getISODate(title: string, user_message: string): boolean\nstatic listUrl(title: string, user_message: string): boolean\nstatic updateUrl(title: string, user_message: string): boolean\nstatic createUrl(title: string, user_message: string): boolean\nstatic detailUrl(title: string, user_message: string): boolean\nstatic setUserMeta(title: string, user_message: string): boolean\n}");
        }

        function getItemsFromDefObject(beforestring, scope) {
            if (scope.defaultObj) {
                var contextScope = { root: scope.tipoDefinitions[scope.defaultObj], tipoDefinitions: scope.tipoDefinitions };
            }else{
                var contextScope = { root: scope.root, tipoDefinitions: scope.tipoDefinitions };
            }
            var lastspace = beforestring.lastIndexOf(" ");
            if (lastspace > -1) {
                var fq_field_name = beforestring.substring(lastspace).replace(/.$/, "").replace(" ", "");
            } else {
                var fq_field_name = beforestring.replace(/.$/, "").replace(" ", "");
            }
            var field_names = fq_field_name.split(".");
            var data = getItemsfromTipodefintion(field_names, fq_field_name, contextScope);
            return data;
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
    });

})();