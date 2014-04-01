'use strict';

module.exports = jsave;

var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

function jsave(object){
  assertIsArrayOrObject(object);

  return {
    to:function(file){
      ensureFile(file);
      Object.defineProperty(object, 'save', {
        value:function(){
          var stringified = JSON.stringify(object, preventCircular());
          fs.writeFileSync(file, stringified);
        }
      });
    }
  };
}

jsave.load = function(file){
  var data;
  ensureFile(file);
  data = ''+fs.readFileSync(file);

  if(data){
    data = JSON.parse(data);
  } else {
    data = {};
  }

  jsave(data).to(file);

  return data;
};

function assertIsArrayOrObject(subject){
  if(!(
    subject
    && (Array.isArray(subject) || typeof subject === 'object')

  )){
    throw new Error('Expected an object but saw: '+subject);
  }
}

function ensureFile(file){
  if(!fs.existsSync(file)){
    mkdirp.sync(path.dirname(file));
    fs.writeFileSync(file, '');
  } else {
    if(!fs.statSync(file).isFile()){
      throw new Error('Expected '+file+' to be a file.');
    }
  }
}

function preventCircular(){
  var cached = [];
  return function(key, value){
    if(~cached.indexOf(value))return null;
    else if(value && typeof value === 'object'){
      cached.push(value);
    }
    return value;
  };
}
