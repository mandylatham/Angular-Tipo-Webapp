(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpQuill', function () {
      return {
        scope: {
          fieldValue: "=",
          mode: "="
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-quill.tpl.html',
        link: function(scope, element, attrs, ctrl){
          var Clipboard = Quill.import('modules/clipboard');
          var Delta = Quill.import('delta');

          class PlainClipboard extends Clipboard {
            convert(html = null) {
              if (typeof html === 'string') {
                this.container.innerHTML = html;
              }
              let text = this.container.innerText;
              this.container.innerHTML = '';
              if (S(text).contains('<iframe')) {
                let doc = new DOMParser().parseFromString(text,'text/html');
                let iframe = doc.body.firstChild;
                return new Delta([{insert: { video: iframe.src },
                                  attributes: {
                                    width: iframe.width,
                                    height: iframe.height
                                  }}]);
              };
              return new Delta().insert(text);
            }
          }

          Quill.register('modules/clipboard', PlainClipboard, true);
          if (scope.mode !== "view") {
              var toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'align': [] }],
                ['formula', 'image', 'video'],

                ['clean']                                        // remove formatting button

              ];

              
              var options = {
                debug: 'info',
                modules: {
                  toolbar: toolbarOptions,
                  imageResize: {
                  },
                  imageDrop: true
                },
                placeholder: 'Compose an epic...',
                theme: 'snow'
              };

            }else{
              var options = {
                debug: 'info',
                modules: {
                  toolbar: false
                },
                readOnly: true,
                placeholder: 'Compose an epic...',
                theme: 'snow'
              };
            }
          var editor = new Quill(element[0], options);
          var toolbar = editor.getModule('toolbar');
          if (scope.fieldValue) {
            editor.setContents(JSON.parse(scope.fieldValue));
          };
          let pasteDelta = null;
          editor.on('editor-change', function(eventName) {
            var quill_content = editor.getContents();
            scope.fieldValue = JSON.stringify(quill_content);
          });

        }
      };
    }
  );

})();