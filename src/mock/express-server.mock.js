'use strict';

/* jshint -W079 */
var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var json = require('jsonfile');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('json spaces', 2);

var router = express.Router();
app.use('/api/v1', router);
app.use('/dev', router);

var tipoDefinitions, tipoData;

function loadFromDisk(){
  tipoDefinitions = json.readFileSync('./mock/tipo-definitions.json');
  tipoData = json.readFileSync('./mock/tipo-seed-data.json');
}

loadFromDisk();

function flushToDisk(){
  json.writeFileSync('./mock/tipo-seed-data.json', tipoData, {spaces: 2});
  //json.writeFileSync('./mock/tipo-definitions.json', tipoDefinitions, {spaces: 2});
}

function wrap(data){
  return {
    tipo: data
  };
}

function unwrap(data){
  return data.tipo;
}

router.get('/admin/reload', function(request, response){
  loadFromDisk();
  response.json({status: 'SUCCESS'});
});

router.get('/admin/flush', function(request, response){
  flushToDisk();
  response.json({status: 'SUCCESS'});
});

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

router.get('/tipo/TipoDefinition', function(request, response) {
  var data = [];
  var definitions = _.cloneDeep(tipoDefinitions);
  _.forOwn(definitions, function(value, key){
    value.TipoID = key;
    data.push(value);
  });
  data = _.map(data, wrap);
  response.json(data);
});

router.get('/tipo/TipoDefinition/:id', function(request, response) {
  var tipoDefinitionId = request.params.id;
  var data = _.cloneDeep(tipoDefinitions[tipoDefinitionId]);
  data.TipoID = tipoDefinitionId;
  data = wrap(data);
  response.json(data);
});

// WIP
router.put('/tipo/TipoDefinition', function(request, response) {
  var tipoName = request.params.name;
  tipoData[tipoName] = tipoData[tipoName] || {};
  var data = request.body[0];
  data = unwrap(data);
  data.TipoID = data.TipoID || uuid.v4();
  var dataMap = tipoData[tipoName];
  dataMap[data.TipoID] = data;
  response.json([data]);
});

// WIP
router.put('/tipo/TipoDefinition/:id', function(request, response) {
  var tipoName = request.params.name;
  var tipoId = request.params.id;
  var dataMap = tipoData[tipoName] || {};
  if(dataMap[tipoId]){
    var data = request.body;
    data = unwrap(data);
    dataMap[tipoId] = data;
    response.json(data);
  }
});

router.get('/tipo/:name', function(request, response) {
  var tipoName = request.params.name;
  var dataMap = tipoData[tipoName] || {};
  var data = _.values(dataMap);
  var query = request.query;
  if(!_.isEmpty(query)){
    data = _.filter(data, function(each){
      return _.reduce(query, function(matched, queryValue, queryKey){
        var value = _.get(each, queryKey);
        if(!_.isUndefined(value)){
          return _.startsWith(value.toString().toLowerCase(), queryValue.toLowerCase()) && matched;
        }
        return false;
      }, true);
    });
  }
  data = _.map(data, wrap);
  response.json(data);
});

router.get('/tipo/:name/:id', function(request, response) {
  var tipoName = request.params.name;
  var tipoId = request.params.id;
  var dataMap = tipoData[tipoName] || {};
  var data = dataMap[tipoId];
  data = wrap(data);
  response.json(data);
});

router.put('/tipo/:name', function(request, response) {
  var tipoName = request.params.name;
  tipoData[tipoName] = tipoData[tipoName] || {};
  var data = request.body[0];
  data = unwrap(data);
  data.TipoID = data.TipoID || uuid.v4();
  var dataMap = tipoData[tipoName];
  dataMap[data.TipoID] = data;
  response.json([data]);
});

router.put('/tipo/:name/:id', function(request, response) {
  var tipoName = request.params.name;
  var tipoId = request.params.id;
  var dataMap = tipoData[tipoName] || {};
  if(dataMap[tipoId]){
    var data = request.body;
    data = unwrap(data);
    dataMap[tipoId] = data;
    response.json(data);
  }
});

router.delete('/tipo/:name/:id', function(request, response) {
  var tipoName = request.params.name;
  var tipoId = request.params.id;
  var dataMap = tipoData[tipoName] || {};
  delete dataMap[tipoId];
  response.json({});
});

module.exports = app;