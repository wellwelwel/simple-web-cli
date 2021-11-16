#! /usr/bin/env node
(async () => {

   const fs = require('fs');
   const { EOL } = require('os');
   const requires = {

      dirs: [

         '.library'
      ],
      files: [

         '.web-config.json',
         '.web-replace.json',
         '.babelrc',
         '.eslintrc.js'
      ]
   };

   requires.dirs.forEach(require => {

      if (!fs.existsSync(`./${require}`)) fs.mkdirSync(`./${require}`);
   });

   requires.files.forEach(async require => {

      if (!fs.existsSync(`./${require}`)) await fs.copyFile(`../${require}`, `./${require}`);
   });

   if (!fs.existsSync('./.gitignore')) await fs.copyFile('../.gitignore', './.gitignore');
   else {

      const toIgnore = [

         '.main',
         '.release',
         'src/exit'
      ];

      fs.appendFileSync('./.gitignore', `${EOL}${toIgnore.join(EOL)}`);
   }
   
   require('../.web/tasks/start');
})();