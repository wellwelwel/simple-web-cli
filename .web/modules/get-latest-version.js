const packageJson = require('package-json');
const latestVersion = async packageName => {

   const package = await packageJson(packageName.toLowerCase());
   return package.version;
};

module.exports = latestVersion;