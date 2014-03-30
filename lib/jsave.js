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
          fs.writeFileSync(file, JSON.stringify(object));
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

function assertIsArrayOrObject(subject){
  if(!(
    subject
    && (Array.isArray(subject) || typeof subject === 'object')

  )){
    throw new Error('Expected an object but saw: '+subject);
  }
}
