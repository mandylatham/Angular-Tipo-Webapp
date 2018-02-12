(function(){var exports={};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlockEmbed = Quill.import('blots/block/embed');
var Parchment = Quill.import('parchment');
var ATTRIBUTES = ['height', 'width'];

var nubStyles = {
  tLeft: {
    top: '-5px',
    left: '-5px'
  },
  tRight: {
    top: '-5px',
    right: '-5px'
  },
  bLeft: {
    bottom: '-5px',
    left: '-5px'
  },
  bRight: {
    bottom: '-5px',
    right: '-5px'
  }
};

var getClosest = function getClosest(el, sel) {
  while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel)) {}
  return el;
};

var VideoBuilder = function () {
  function VideoBuilder() {
    _classCallCheck(this, VideoBuilder);
  }

  _createClass(VideoBuilder, [{
    key: 'buildIFrame',
    value: function buildIFrame(src, node) {
      var iframe = document.createElement('iframe');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', true);
      iframe.className = 'td-quill-video-editing';
      iframe.setAttribute('width', node.getAttribute('width') || 300);
      iframe.setAttribute('height', node.getAttribute('height') || 150);
      iframe.setAttribute('src', src);
      return iframe;
    }
  }, {
    key: 'buildNode',
    value: function buildNode(node, wrapper) {
      node.appendChild(wrapper);
      setTimeout(function () {
        var afterVid = document.createElement('div');
        afterVid.appendChild(document.createElement('br'));
        node.parentElement.appendChild(afterVid);
        var width = node.getAttribute('width');
        var height = node.getAttribute('height');
        var iframe = node.getElementsByTagName('iframe')[0];
        iframe.setAttribute('width', node.getAttribute('width') || 300);
        iframe.setAttribute('height', node.getAttribute('height') || 150);
      }, 0);
      return node;
    }
  }, {
    key: 'buildOverlay',
    value: function buildOverlay() {
      var overlay = document.createElement('div');
      overlay.setAttribute('class', "td-quill-video-overlay");
      overlay.setAttribute('contenteditable', 'false');
      overlay.addEventListener('click', function (event) {
        var rootElement = getClosest(overlay, ".ql-editor");
        if (rootElement && rootElement.quill) {
          var node = Parchment.find(overlay.parentElement.parentElement);
          if (node instanceof Video) {
            node.domNode.builder.select(overlay, rootElement.quill, node);
          }
        }
      });

      return overlay;
    }
  }, {
    key: 'select',
    value: function select(overlay, quill, node) {
      this.selectedElement = overlay;
      if (this.selectedElement.className.indexOf('active') === -1 && !quill.options.readOnly) {
        this.quill = quill;
        this.quill.setSelection(null);
        this.parentElement = this.selectedElement.parentElement;
        this.node = node;
        this.iframe = this.parentElement.getElementsByTagName('iframe')[0];
        this.selectedElement.setAttribute('class', 'td-quill-video-overlay active');
        var toolBar = this.buildToolBar();
        this.selectedElement.appendChild(toolBar);
        this.buildResize();
        this.handelDeselect = this.deselect.bind(this);
        this.quill.root.addEventListener('click', this.handelDeselect, false);
      }else{
        this.selectedElement.setAttribute('class', 'td-quill-video-overlay readonly');
      }
    }
  }, {
    key: 'deselect',
    value: function deselect(event) {
      if (event.target !== this.selectedElement) {
        this.selectedElement.setAttribute('class', 'td-quill-video-overlay');
        this.clearNubEvents(true);
        while (this.selectedElement.firstChild) {
          this.selectedElement.removeChild(this.selectedElement.firstChild);
        }
        this.selectedElement = null;
        this.quill.root.removeEventListener('click', this.handelDeselect, false);
      }
    }
  }, {
    key: 'buildToolBar',
    value: function buildToolBar() {
      var toolbarWrapper = document.createElement('div');
      toolbarWrapper.className = "td-quill-video-toolbar-wrapper";
      var toolbar = document.createElement('div');
      toolbar.className = "td-quill-video-toolbar";
      toolbar = this.addToolBarActions(toolbar);
      toolbarWrapper.appendChild(toolbar);
      return toolbarWrapper;
    }
  }, {
    key: 'addToolBarActions',
    value: function addToolBarActions(toolbar) {
      toolbar.appendChild(this.buildAction('left'));
      toolbar.appendChild(this.buildAction('center'));
      toolbar.appendChild(this.buildAction('right'));
      return toolbar;
    }
  }, {
    key: 'buildAction',
    value: function buildAction(type) {
      var _this = this;

      var button = document.createElement('span');
      button.className = 'td-quill-video-align-action td-quill-video-' + type;
      button.innerHTML = '<i class="fa td-align-' + type + '" aria-hidden="true"></i>';
      button.addEventListener('click', function () {
        _this.quill.setSelection(_this.node.offset(_this.quill.scroll), 1, 'user');
        if (type === 'left') {
          return _this.quill.format('align', null);
        }
        _this.quill.format('align', type);
        _this.quill.setSelection(null);
      });
      return button;
    }
  }, {
    key: 'buildResize',
    value: function buildResize() {
      var _this2 = this;

      this.boxes = [];
      this.dragHandeler = this.handleDrag.bind(this);
      this.mouseUp = this.handelMouseUp.bind(this);
      this.mouseDown = this.handleMousedown.bind(this);
      Object.keys(nubStyles).map(function (key) {
        var nub = _this2.buildNub(key);
        _this2.boxes.push(nub);
        _this2.selectedElement.appendChild(nub);
      });
      return this.selectedElement;
    }
  }, {
    key: 'buildNub',
    value: function buildNub(pos) {
      var nub = document.createElement('span');
      nub.className = 'td-quill-resize-nub';
      Object.assign(nub.style, nubStyles[pos]);
      nub.addEventListener('mousedown', this.mouseDown, false);
      return nub;
    }
  }, {
    key: 'handleMousedown',
    value: function handleMousedown(event) {
      this.dragBox = event.target;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.preDragWidth = parseInt(this.iframe.width) || 300;
      this.preDragHeight = parseInt(this.iframe.height) || 150;
      document.addEventListener('mousemove', this.dragHandeler, false);
      document.addEventListener('mouseup', this.mouseUp, false);
    }
  }, {
    key: 'handleDrag',
    value: function handleDrag(event) {
      if (!this.iframe) {
        return;
      }
      var deltaX = event.clientX - this.dragStartX;
      var deltaY = event.clientY - this.dragStartY;
      if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[2]) {
        this.iframe.width = Math.round(this.preDragWidth - deltaX);
        this.iframe.height = Math.round(this.preDragHeight + deltaY);
      } else {
        this.iframe.width = Math.round(this.preDragWidth + deltaX);
        this.iframe.height = Math.round(this.preDragHeight + deltaY);
      }
    }
  }, {
    key: 'handelMouseUp',
    value: function handelMouseUp(event) {
      this.clearNubEvents();
    }
  }, {
    key: 'clearNubEvents',
    value: function clearNubEvents(include_nub) {
      var _this3 = this;

      this.boxes.map(function (nub) {
        document.removeEventListener('mousemove', _this3.dragHandeler, false);
        document.removeEventListener('mouseup', _this3.mouseUp, false);
        if (include_nub) {
          nub.removeEventListener('mousedown', _this3.handleMousedown, false);
        }
      });
    }
  }]);

  return VideoBuilder;
}();

var Video = function (_BlockEmbed) {
  _inherits(Video, _BlockEmbed);

  function Video() {
    _classCallCheck(this, Video);

    return _possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).apply(this, arguments));
  }

  _createClass(Video, [{
    key: 'format',
    value: function format(name, value) {
      if (ATTRIBUTES.indexOf(name) > -1) {
        if (value) {
          this.domNode.setAttribute(name, value);
        } else {
          this.domNode.removeAttribute(name);
        }
      } else {
        _get(Video.prototype.__proto__ || Object.getPrototypeOf(Video.prototype), 'format', this).call(this, name, value);
      }
    }
  }], [{
    key: 'create',
    value: function create(src) {
      var node = _get(Video.__proto__ || Object.getPrototypeOf(Video), 'create', this).call(this);
      node.builder = new VideoBuilder();
      var wrapper = document.createElement('div');
      wrapper.className = 'td-quill-video-wrapper';
      var iframe = node.builder.buildIFrame(src, node);
      var overlay = node.builder.buildOverlay();
      wrapper.appendChild(iframe);
      wrapper.appendChild(overlay);
      return node.builder.buildNode(node, wrapper);
    }
  }, {
    key: 'formats',
    value: function formats(domNode) {
      var iframe = domNode.getElementsByTagName('iframe')[0];
      return ATTRIBUTES.reduce(function (formats, attribute) {
        if (iframe.hasAttribute(attribute)) {
          formats[attribute] = iframe.getAttribute(attribute);
        }
        return formats;
      }, {});
    }
  }, {
    key: 'value',
    value: function value(domNode) {
      return domNode.getElementsByTagName('iframe')[0].getAttribute('src');
    }
  }]);

  return Video;
}(BlockEmbed);

Video.blotName = 'video';
Video.className = 'td-video';
Video.tagName = 'div';

exports.Video = Video;
window.Quill.register('formats/video',exports.Video)
})();