#! /usr/bin/env node
(() => {

   const fse = require('fs-extra');
   const { EOL } = require('os');
   const normalize = require('path').normalize;
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

   requires.dirs.forEach(require => fse.copySync(normalize(`${__dirname}/../${require}`), normalize(`./${require}`), { overwrite: false }));
   requires.files.forEach(require => {

      if (!fse.existsSync(normalize(`./${require}`))) fse.copyFileSync(normalize(`${__dirname}/../${require}`), normalize(`./${require}`));
   });

   if (!fse.existsSync(normalize('./.gitignore'))) fse.copyFileSync(normalize(`${__dirname}/../.gitignore`), normalize('./.gitignore'));
   else {

      const toIgnore = [

         '.main',
         '.release',
         'src/exit',
         '.web-config.json'
      ];

      fse.appendFileSync(normalize('./.gitignore'), `${EOL}${toIgnore.join(EOL)}`);
   }
})();