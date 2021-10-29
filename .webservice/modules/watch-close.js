"use strict";

const fs = require('fs-extra').promises;
const { source } = require('./config');

module.exports = async () => {

   await fs.writeFile(`${source}/exit`, '');
   await fs.unlink(`${source}/exit`);
};