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
      build: '../.web/tasks/build',
      TEST: '../.web/tasks/start',
   };

   if (arg !== 'TEST' && !alloweds[arg]) {

      console.error(`Command "${arg}" not found.${EOL}Use "init", "start" or "build".${EOL}`);
      return;
   }

   console.log(sh.clear);
   const importing = new draft(`Importing required local modules: ${sh.green}${sh.dim}[ ${sh.italic}autoprefixer, babel, eslint, postcss, sass and uglifyjs${sh.reset}${sh.green}${sh.dim} ]`);

   requires.dirs.forEach(require => fse.copySync(normalize(`${__dirname}/../${require}`), normalize(`./${require}`), { overwrite: false }));
   requires.files.forEach(require => {

      if (!fse.existsSync(normalize(`./${require}`))) fse.copyFileSync(normalize(`${__dirname}/../${require}`), normalize(`./${require}`));
   });

   if (!fse.existsSync(normalize('./package.json'))) {


      fse.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_package.json`), normalize('./package.json'));
      await exec('npm i');
   }
   if (!fse.existsSync(normalize('./.swrc.js'))) fse.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_swrc.js`), normalize('./.swrc.js'));
   if (!fse.existsSync(normalize('./.eslintignore'))) fse.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_eslintignore`), normalize('./.eslintignore'));
   if (!fse.existsSync(normalize('./.gitignore'))) fse.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_gitignore`), normalize('./.gitignore'));
   else {

      let gitignore = fse.readFileSync(normalize('./.gitignore'), 'utf-8');
      const toIgnore = [

         'dist',
         'release',
         'src/exit',
         '.library/@process-css',
         '.library/addEventListener',
         '.library/blacklist',
         '.library/empty',
         '.library/first-char',
         '.library/force-array',
         '.library/last-char',
         '.library/selector',
         '.library/package.json',
         'node_modules',
         'package-lock.json',
         'yarn.lock'
      ];

      toIgnore.forEach(ignore => {

         const regex = RegExp(ignore, 'gm');

         if (!regex.test(gitignore)) gitignore += `${EOL}${ignore}`;
      });

      fse.writeFileSync(normalize('./.gitignore'), gitignore);
   }

   const rebuilded = await rebuildFiles(arg);

   importing.stop(1);

   if (!rebuilded) return;

   try {

      if (!fse.existsSync('./.git')) await exec(`git init && git add . && git commit -m "Initial Commit"`);
   }
   catch (error) { /* Just ignores when no "git" installed */ }

   if (typeof alloweds[arg] === 'string') await require(alloweds[arg]); /* Calls to script */

   /* Reserved to tests */
   args.includes('--TEST') && console.log('PASSED');
})();