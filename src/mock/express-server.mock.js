'use strict';

/* jshint -W079 */
var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('json spaces', 2);

var router = express.Router();
app.use('/api/v1', router);

var tipoDefinitions = require('./tipo-definitions.json');
var tipoData = require('./tipo-seed-data.json');

router.get('/tipo_def', function(request, response) {
  var data = [];
  _.forOwn(tipoDefinitions, function(value, key){
    value.tipo_meta.tipo_name = key;
    data.push(value.tipo_meta);
  });
  response.json(data);
});

router.get('/tipo_def/:name', function(request, response) {
  var tipoName = request.params.name;
  var data = tipoDefinitions[tipoName];
  response.json(data);
});

router.get('/tipo/:name', function(request, response) {
  var tipoName = request.params.name;
  var dataMap = tipoData[tipoName] || {};
  var data = _.values(dataMap);
  response.json(data);
});

router.get('/tipo/:name/:id', function(request, response) {
  var tipoName = request.params.name;
  var tipoId = request.params.id;
  var dataMap = tipoData[tipoName] || {};
  var data = dataMap[tipoId];
  response.json(data);
});

module.exports = app;