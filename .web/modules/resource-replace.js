const fse = require('fs-extra');
const { source } = require('./config');

module.exports = (file, local) => {

   if (!fse.existsSync('.web-replace.json')) return false;
   
   const webReplace = JSON.parse(fse.readFileSync('.web-replace.json', 'utf8'));
   const resources = webReplace.resources;
   
   if (!resources?.replace[local]) return false;
   
   const src =  resources?.src || '.resources';
   const dest = file.replace(source, src);
   
   if (!fse.existsSync(dest)) return false;
   
   return dest;
}