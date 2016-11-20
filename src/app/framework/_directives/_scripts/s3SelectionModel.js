(function() {

  'use strict';  

  function S3SelectionModel() {
    var items = [];
    
    function addItem(obj) {
        items.push(obj);
    }

    function removeItem(obj) {
        items = items.filter(function(el) {
            return el.href !== obj.href;
        });
    }

    function listItems() {
        return items.slice();
    }

    function clear() {
        items = [];
    }

    return {
      addItem: addItem,
      removeItem: removeItem,
      listItems: listItems,
      clear: clear
    };
  }

  angular.module('tipo.framework')
    .service('s3SelectionModel', S3SelectionModel);

})();