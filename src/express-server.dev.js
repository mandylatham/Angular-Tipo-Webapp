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
    path: '/api',
    //url: 'http://localhost:9001'
    //url: 'https://k2lajprh2f.execute-api.us-east-1.amazonaws.com'
    url: 'https://tipo.tipotapp.com/dev'
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
