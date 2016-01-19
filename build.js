#!/usr/bin/env node

'use strict';

//var AdmZip = require('adm-zip');
var Promise = require('bluebird');
var copy = Promise.promisifyAll(require('copy'));
var copyAsync = Promise.promisify(require('copy'));
var mkdirp = require('mkdirp');
var rmrf = require('rimraf');

var path = require('path');


var OUTPUT_DIR = '_output/';

rmrf.sync(path.join(OUTPUT_DIR, '*'));
rmrf.sync(path.join(OUTPUT_DIR, '.*'));

function common(dir){
  var outdir = path.join(OUTPUT_DIR, dir);
  mkdirp(outdir);
  return copyAsync('src/*.js', outdir)
    .then(copyAsync('lib/*.js', outdir))
    .then(function(){
      console.log('Done ' + dir);
    });
}
common('chrome')
  .then(copy.oneAsync('src/manifest.base.json', path.join(OUTPUT_DIR, 'chrome/manifest.json')));
common('firefox');

//
