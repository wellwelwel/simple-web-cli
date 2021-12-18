const fs = require('fs-extra');
const normalize = require('path').normalize;

module.exports = (directory) => {

   const directorys = [];
   if (typeof directory === 'string') directorys.push(directory);
   else if (typeof directory === 'object') Object.assign(directorys, directory);

   directorys.forEach(dir => {

      dir = normalize(dir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
   });
}