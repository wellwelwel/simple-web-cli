const exec = require('child_process').exec;

const sh = command => new Promise((resolve, reject) => exec(command, (error, stdout) => !!error ? reject(error) : resolve(stdout)));
const latestVersion = async packageName => await sh(`npm view ${packageName.toLowerCase()} version`);

module.exports = latestVersion;