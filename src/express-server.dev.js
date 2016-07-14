'use strict';

var path = require('path');
var express = require('express');
var lodash = require('lodash');
var proxy = require('http-proxy-middleware');

var pathMappings = [
  {
    path: '/',
    dir: 'app'
  },
  {
    path: '/bower_components',
    dir: 'bower_components'
  },
  {
    path: '/dev',
    url: 'https://74oj0xr2l2.execute-api.us-east-1.amazonaws.com'
  }
];

var proxyConfig = {
  forward: {}
};

var app = express();

lodash.each(pathMappings, function(mapping){
  if(mapping.dir){
    app.use(mapping.path, express.static(path.resolve(__dirname, mapping.dir)));
  }else if(mapping.url){
    app.use(mapping.path, proxy({target: mapping.url, changeOrigin: true}));
  }
});

module.exports = app;