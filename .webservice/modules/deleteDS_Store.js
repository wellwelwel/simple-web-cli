"use strict";

const glob = require('glob');
const rimraf = require('rimraf');

module.exports = () => glob('*.DS_Store', { }, (err, files) => {
      
   if (files.length > 0) rimraf('.DS_Store', () => { });
});