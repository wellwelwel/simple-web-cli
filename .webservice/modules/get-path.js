"use strict";

function path(file) {
         
   const path = file.split('/');
   path.pop();

   return path.join('/');
}

module.exports = path;