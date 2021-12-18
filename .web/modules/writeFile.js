"use strict";

const fs = require('fs-extra');

module.exports = (content, to) => {

   fs.writeFileSync(to, content, (err) => {

      if (err) throw err;
   });
};