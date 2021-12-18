const sep = require('path').sep;

function path(file) {

   const path = file.split(sep);
   path.pop();

   return path.join(sep);
}

module.exports = path;