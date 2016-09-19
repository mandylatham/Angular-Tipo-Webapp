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

var tipoData;

function loadFromDisk(){
  tipoData = json.readFileSync('./mock/tipo-data.json');
}

loadFromDisk();

function flushToDisk(){
  console.log('Flushing the content to disk');
  json.writeFileSync('./mock/tipo-data.json', tipoData, {spaces: 2});
}

router.get('/admin/reload', function(request, response){
  loadFromDisk();
  response.json({status: 'SUCCESS'});
});

router.get('/admin/flush', function(request, response){
  flushToDisk();
  response.json(tipoData);
});

function getOne(tipoName, tipoId){
  var dataMap = tipoData[tipoName] || {};
  var data = _.find(dataMap.response, function(each){
    return each.data.tipo_id === tipoId;
  });
  return data;
}

function enrichWithArrayMeta(object){
  _.forOwn(object, function(value){
    if(_.isArray(value)){
      _.each(value, function(each){
        if(_.isObject(each)){
          var existingMeta = _.get(each, '_ARRAY_META._HASH');
          if(_.isUndefined(existingMeta)){
            each.ARRAY_META = {
              _HASH: uuid.v4()
            };
          }
          enrichWithArrayMeta(each);
        }
      });
    }else if(_.isObject(value)){
      enrichWithArrayMeta(value);
    }
  });
}

router.get('/tipo/:name', function(request, response) {
  var tipoName = request.params.name;
  var dataMap = tipoData[tipoName] || { response: [] };
  var query = request.query;
  if(!_.isEmpty(query)){
    dataMap.response = _.filter(dataMap.response, function(each){
      return _.reduce(query, function(matched, queryValue, queryKey){
        var value = _.get(each.data, queryKey);
        if(!_.isUndefined(value)){
          return _.startsWith(value.toString().toLowerCase(), queryValue.toLowerCase()) && matched;
        }
        return false;
      }, true);
    });
  }
  response.json(dataMap);
});

router.get('/tipo/:name/:id', function(request, response) {
  var tipoName = request.params.name;
  var tipoId = request.params.id;
  var data = getOne(tipoName, tipoId);
  response.json(data);
});

router.put('/tipo/:name', function(request, response) {
  var tipoName = request.params.name;
  var payload = request.body[0];
  var data = payload.data;
  enrichWithArrayMeta(data);
  var tipoId = data.tipo_id;
  if(_.isUndefined(tipoId)){
    if(tipoName === 'TipoDefinition'){
      tipoId = data.tipo_meta.tipo_name;
    }else{
      tipoId = uuid.v4();
    }
  }
  data.tipo_id = tipoId;
  tipoData[tipoName] = tipoData[tipoName] || { response: [] };
  var tipoList = tipoData[tipoName].response;
  var existingTipo = getOne(tipoName, tipoId);
  if(existingTipo){
    existingTipo.data = data;
  }else{
    tipoList.push(payload);
  }
  data = getOne(tipoName, tipoId);
  data = {
    response: [data]
  };
  response.json(data);
});

router.put('/tipo/:name/:id', function(request, response) {
  var tipoName = request.params.name;
  var tipoId = request.params.id;
  var data = request.body.data;
  enrichWithArrayMeta(data);
  tipoData[tipoName] = tipoData[tipoName] || { response: [] };
  var existingTipo = getOne(tipoName, tipoId);
  existingTipo.data = data;
  data = getOne(tipoName, tipoId);
  response.json(data);
});

router.delete('/tipo/:name/:id', function(request, response) {
  var tipoName = request.params.name;
  var tipoId = request.params.id;
  tipoData[tipoName] = tipoData[tipoName] || { response: [] };
  var tipoList = tipoData[tipoName].response;
  _.remove(tipoList, function(each){
    return each.data.tipo_id === tipoId;
  });
  response.json({});
});

module.exports = app;