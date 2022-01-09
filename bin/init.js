#! /usr/bin/env node

var process = require('process');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_asyncToGenerator(function* () {
  var isNodeCompatible = require('../bin/is-node-compatible.js');

  var isNPMCompatible = require('../bin/is-npm-compatible.js');

  if (isNodeCompatible() !== true) {
    console.log("> The minimum required Node.js version is 14.15.0. Please upgrade to continue.");
    console.log();
    process.exit(1);
  } else if ((yield isNPMCompatible()) !== true) {
    console.log("> The minimum required NPM version is 7.0.2. Please upgrade to continue.");
    console.log();
    process.exit(1);
  } else require("../bin/process-resources");
})();