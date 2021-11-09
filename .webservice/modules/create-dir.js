const fs = require('fs-extra');
const path = require('path').normalize;

module.exports = (directory) => {
   
   const directorys = [];
   if (typeof directory === 'string') directorys.push(directory);
   else if (typeof directory === 'object') Object.assign(directorys, directory);
   
   directorys.forEach(dir => {

      dir = path(dir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
   });
}