"use strict";

const fs = require('fs-extra').promises;
const _fs = require('fs-extra');
const { source } = require('./config');
const sep = require('path').sep;

module.exports = async () => {

   await fs.writeFile(`${source}${sep}exit`, '');
   if (_fs.existsSync(`${source}${sep}exit`)) await fs.unlink(`${source}${sep}exit`);
};