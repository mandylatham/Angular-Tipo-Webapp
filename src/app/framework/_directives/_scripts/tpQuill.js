(function () {

  'use strict';

  var module = angular.module('tipo.framework');

  return module.directive('tpQuill', function () {
      return {
        scope: {
          
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-quill.tpl.html',
        link: function(scope, element, attrs, ctrl){
          var toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['formula', 'image', 'video'],

            ['clean']                                         // remove formatting button
          ];

          var options = {
            debug: 'info',
            modules: {
              toolbar: toolbarOptions
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'
          };
          var editor = new Quill(element[0], options);
          var toolbar = editor.getModule('toolbar');

        }
      };
    }
  );

})();