const fs = require('fs');
const { source, plugins } = require('./config');

module.exports = (file, local) => {

   if (!plugins) return false;

   const webReplace = plugins?.resourceReplace || false;
   const resources = webReplace?.resources || false;

   if (!resources?.replace[local]) return false;

   const src =  resources?.src || '.resources';
   const dest = file.replace(source, src);

   if (!fs.existsSync(dest)) return false;

   return dest;
};