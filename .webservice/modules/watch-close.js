"use strict";

const fs = require('fs-extra').promises;
const _fs = require('fs-extra');
const { source } = require('./config');

module.exports = async () => {

   await fs.writeFile(`${source}/exit`, '');
   if (_fs.existsSync(`${source}/exit`)) await fs.unlink(`${source}/exit`);
};