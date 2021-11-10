'use strict';

const { dev } = require('./config');
const win32Normalize = require('path').win32.normalize;

module.exports = path => {

   if (dev['is-windows-server']) return win32Normalize(path);

   path = path.replace(/\\\\/g, '/');
   path = path.replace(/\\/g, '/');

   return path;
};