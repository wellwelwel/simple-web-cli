const exec = require('child_process').exec;

module.exports = cmd => new Promise((resolve, reject) => exec(cmd, (error, stdout, stderr) => resolve(!!error ? false : true)));