#! /usr/bin/env node
(() => {

   const fs = require('fs');
   const { EOL } = require('os');
   const requires = {

      dirs: [

         '.library'
      ],
      files: [

         '.library/package.json',
         '.web-config.json',
         '.web-replace.json',
         '.babelrc',
         '.eslintrc.js'
      ]
   };

   requires.dirs.forEach(require => fs.copySync(`${__dirname}/../${require}`, `./${require}`, { overwrite: false }));
   requires.files.forEach(require => {

      if (!fs.existsSync(`./${require}`)) fs.copyFileSync(`${__dirname}/../${require}`, `./${require}`);
   });

   if (!fs.existsSync('./.gitignore')) fs.copyFileSync(`${__dirname}/../.gitignore`, './.gitignore');
   else {

      const toIgnore = [

         '.main',
         '.release',
         'src/exit',
         '.web-config.json'
      ];

      fs.appendFileSync('./.gitignore', `${EOL}${toIgnore.join(EOL)}`);
   }
   
   require('../.web/tasks/start');
})();