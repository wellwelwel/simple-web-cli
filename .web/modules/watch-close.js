"use strict";

const fs = require('fs');
const { source } = require('./config');
const sep = require('path').sep;

module.exports = async () => {

   fs.writeFileSync(`${source}${sep}exit`, '');
   if (fs.existsSync(`${source}${sep}exit`)) fs.unlinkSync(`${source}${sep}exit`);
};