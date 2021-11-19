(async () => {

   const fse = require('fs-extra');
   const exec = require('../.web/modules/execShellCommand');
   const { sh, draft } = require('../.web/modules/sh');
   const { EOL } = require('os');
   const rebuildFiles = require('../bin/rebuild-files.js');
   const [ ,, ...args ] = process.argv;
   const arg = args[0]?.replace(/-/g, '') || 'start';
   const normalize = require('path').normalize;
   const requires = {

      dirs: [

         '.library'
      ],
      files: [

         '.babelrc',
         '.eslintrc.js'
      ]
   };
   const alloweds = {

      init: true,
      start: '../.web/tasks/start',
      build: '../.web/tasks/build'
   };
   const runBefore = {

      init: () => { },
      start: () => { },
      build: () => {

         const extend = { };

         args.forEach(cli => {

            const splitCli = cli.split('=');

            extend[splitCli[0].replace(/-/g, '')] = splitCli[1];
         });

         if (extend?.level) {

            if (!isNaN(extend.level)) {

               if (extend.level < 0) extend.level = 0;
               else if (extend.level > 9) extend.level = 9;
            }
         }

         process.env.level = parseInt(extend?.level) || 0;
         process.env.output = extend?.output || '.release';
      }
   };

   if (!alloweds[arg]) {

      console.error(`Command "${arg}" not found.${EOL}Use "init", "start" or "build".${EOL}`);
      return;
   }

   requires.dirs.forEach(require => fse.copySync(normalize(`${__dirname}/../${require}`), normalize(`./${require}`), { overwrite: false }));
   requires.files.forEach(require => {

      if (!fse.existsSync(normalize(`./${require}`))) fse.copyFileSync(normalize(`${__dirname}/../${require}`), normalize(`./${require}`));
   });

   if (!fse.existsSync(normalize('./package.json'))) {
      
      console.log(sh.clear);

      const importing = new draft('Importing required local modules');

      fse.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_package.json`), normalize('./package.json'));         
      await exec('npm i');
      importing.stop(1);
   }
   if (!fse.existsSync(normalize('./.web-config.json'))) fse.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_web-config.json`), normalize('./.web-config.json'));
   if (!fse.existsSync(normalize('./.web-replace.json'))) fse.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_web-replace.json`), normalize('./.web-replace.json'));
   if (!fse.existsSync(normalize('./.eslintignore'))) fse.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_eslintignore`), normalize('./.eslintignore'));
   if (!fse.existsSync(normalize('./.gitignore'))) fse.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_gitignore`), normalize('./.gitignore'));
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

   if (!await rebuildFiles()) return;
   if (typeof alloweds[arg] === 'string') {
   
      if (args.length > 1) runBefore[arg]();

      require(alloweds[arg]); /* Calls to script */
   }
})();