const fs = require('fs-extra');

module.exports = (directory) => {
   
   const directorys = [];
   if (typeof directory === 'string') directorys.push(directory);
   else if (typeof directory === 'object') Object.assign(directorys, directory);
   
   directorys.forEach(dir => {

      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
   });
}