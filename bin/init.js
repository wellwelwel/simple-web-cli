#! /usr/bin/env node

var isNodeCompatible = require('../bin/is-node-compatible.js');
var isNPMCompatible = require('../bin/is-npm-compatible.js');

if (isNodeCompatible() !== true) {

   console.log("> The minimum required Node.js version is 14.15. Please upgrade to continue.");
   console.log();
} else if (isNPMCompatible() !== true) {

   console.log("> The minimum required NPM version is 7.0.2. Please upgrade to continue.");
   console.log();
} else require("../bin/process-resources");