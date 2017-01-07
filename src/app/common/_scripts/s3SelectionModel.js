(function() {

  'use strict';  

  /**
   * Return list of unique by href items
   */
  function unique(a) {
      var present = [], res = [];
      for (var i = 0; i < a.length; i++) {
          if (present[a[i].href]) {
              continue;
          }
          present[a[i].href] = true;
          res.push(a[i]);
      }
      return res;
  }
  
  function S3SelectionModel() {
    
    var SelectionModel = {
        items: [],
        addItem: function(obj) {
            this.items.push(obj);
            return this.items;
        },
        removeItem: function(obj) {
            this.items = this.items.filter(function(el) {
                return el.href !== obj.href;
            });
            return items;
        },
        removeByIndex: function(index) {
            this.items.splice(index, 1);
            return this.items;
        },
        listItems: function() {
            return this.items;
        },
        clear: function() {
            this.items = [];
        }
    }

    var current = Object.create(SelectionModel);
    var total = Object.create(SelectionModel);
    var context;

    /**
     * Add current to total
     * @return new total
     */
    function addCurrent() {
        total.items = unique(total.items.concat(current.items));
        return total;
    }

    function setContext(context) {
        this.context = context;
    }

    function getContext() {
        return this.context;
    }

    return {
        current: current,
        total: total,
        addCurrent: addCurrent,
        setContext: setContext,
        getContext: getContext
    };
  }

  angular.module('tipo.common')
    .service('s3SelectionModel', S3SelectionModel);

})();