"use strict";

const fs = require('fs');

module.exports = (content, to) => {

   fs.writeFileSync(to, content, (err) => {

      if (err) throw err;
   });
};