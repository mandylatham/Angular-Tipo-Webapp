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

function handleArrayMeta(object){
  _.forOwn(object, function(value){
    if(_.isArray(value)){
      var itemsToDiscard = [];
      _.each(value, function(each){
        if(_.isObject(each)){
          var existingMeta = _.get(each, '_ARRAY_META._HASH');
          if(_.isUndefined(existingMeta)){
            each._ARRAY_META = {
              _HASH: uuid.v4()
            };
          }else{
            if(each._ARRAY_META._STATUS === 'DELETED'){
              itemsToDiscard.push(each._ARRAY_META._HASH);
              return;
            }
          }
          handleArrayMeta(each);
        }
      });
      if(!_.isEmpty(itemsToDiscard)){
        _.remove(value, function(each){
          return _.includes(itemsToDiscard, each._ARRAY_META._HASH);
        });
      }
    }else if(_.isObject(value)){
      handleArrayMeta(value);
    }
  });
}

function deleteNullFields(object){
  _.forOwn(object, function(value, key){
    if(value === null){
      delete object[key];
    }else {
      if(_.isObject(value)){
        deleteNullFields(value);
        if(_.isEmpty(value)){
          delete object[key];
        }
      }else if(_.isArray(value)){
        _.each(value, function(each, index){
          if(_.isObject(each)){
            deleteNullFields(each);
            if(_.isEmpty(each)){
              delete value[index];
            }
          }
        });
      }
    }
  });
}

router.get('/tipo/:name', function(request, response) {
  var tipoName = request.params.name;
  var dataMap = tipoData[tipoName] || { response: [] };
  dataMap = _.cloneDeep(dataMap);
  var query = request.query;
  if(_.get(query, 'tipo_filter')){
    var filterRegex = /^(.*?)\s.*<<(.*?)>>.*/g;
    var matches = filterRegex.exec(query.tipo_filter);
    var fieldName = matches[1];
    var fieldValue = matches[2];
    dataMap.response = _.filter(dataMap.response, function(each){
      var value = _.get(each.data, fieldName);
      if(!_.isUndefined(value)){
        return _.startsWith(value, fieldValue);
      }
      return false;
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
  handleArrayMeta(data);
  deleteNullFields(data);
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
    data.created_dt = existingTipo.data.created_dt;
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
  handleArrayMeta(data);
  deleteNullFields(data);
  tipoData[tipoName] = tipoData[tipoName] || { response: [] };
  var existingTipo = getOne(tipoName, tipoId);
  data.created_dt = existingTipo.data.created_dt;
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