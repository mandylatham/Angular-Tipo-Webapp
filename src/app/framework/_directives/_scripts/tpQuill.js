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
          function customizeQuillVideo(){
            var Video = Quill.import('formats/video');
            var AddHeight = function(node, val){
              Video.call(this,node,val);
            };
            AddHeight.prototype = Object.create(Video.prototype);
            $.extend(AddHeight, Object.create(Video));
            AddHeight.prototype.constructor = AddHeight;
            AddHeight.create = function create(value){
              var node;
              if (S(value).contains(",")) {
                var inpVal = value.split(",");
                node = Video.create(inpVal[1]);
                node.setAttribute('height', inpVal[0]);
              }else{
                node = Video.create(value);
                var height = (element[0].offsetWidth)/1.77;
                node.setAttribute('height', height);
              }
              return node;
            }
            Quill.register('formats/video', AddHeight, true);
          }
          customizeQuillVideo();
          if (scope.mode !== "view") {
              var toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block','link'],

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
          if (scope.fieldValue) {
            editor.setContents(JSON.parse(scope.fieldValue));
          };
          editor.on('editor-change', function(eventName) {
            var quill_content = editor.getContents();
            scope.fieldValue = JSON.stringify(quill_content);
          });

        }
      };
    }
  );

})();