"use strict";

const exec = require('./execShellCommand');

module.exports = async () => {

   if (process.platform !== 'darwin') return;

   await exec('find . -name ".DS_Store" -type f -delete');
};