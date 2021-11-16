#! /usr/bin/env node
(() => {

   const fse = require('fs-extra');
   const { EOL } = require('os');
   const [ ,, ...args ] = process.argv;
   const arg = args[0]?.replace(/-/g, '') || 'init';
   const normalize = require('path').normalize;
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
   const alloweds = {

      init: true,
      start: '../.web/tasks/start',
      build: '../.web/tasks/build'
   };

   if (!alloweds[arg]) {

      console.error(`Command "${arg}" not found.${EOL}Use "init", "start" or "build".${EOL}`);
      return;
   }

   if (args.length > 1) {

      console.error(`Only use one command per time.${EOL}`);
      return;
   }

   requires.dirs.forEach(require => fse.copySync(normalize(`${__dirname}/../${require}`), normalize(`./${require}`), { overwrite: false }));
   requires.files.forEach(require => {

      if (!fse.existsSync(normalize(`./${require}`))) fse.copyFileSync(normalize(`${__dirname}/../${require}`), normalize(`./${require}`));
   });

   if (!fse.existsSync(normalize('./.gitignore'))) fse.copyFileSync(normalize(`${__dirname}/../.gitignore`), normalize('./.gitignore'));
   else {

      let gitignore = fse.readFileSync(normalize('./.gitignore'), 'utf-8');
      const toIgnore = [

         '.main',
         '.release',
         'src/exit',
         '.web-config.json'
      ];

      toIgnore.forEach(ignore => {

         const regex = RegExp(ignore, 'gm');
         
         if (!regex.test(gitignore)) gitignore += `${EOL}${ignore}`;
      });

      fse.writeFileSync(normalize('./.gitignore'), gitignore);
   }

   require('../bin/rebuild-files.js');

   /* Call to script */
   if (typeof alloweds[arg] === 'string') require(alloweds[arg]);
})();