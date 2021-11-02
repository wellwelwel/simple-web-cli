"use strict";

const exec = require('./execShellCommand');

module.exports = async () => await exec('find . -name ".DS_Store" -type f -delete');