#! /usr/bin/env node

import fs from 'fs';
import { EOL, platform } from 'os';
import { normalize, basename } from 'path';
import exec from './modules/execShellCommand.js';
import { sh, draft } from './modules/sh.js';
import rebuildFiles from './rebuild-files.js';
import { __dirname } from './modules/root.js';
import listFiles from './modules/listFiles.js';

(async () => {
   const [, , ...args] = process.argv;
   const arg = args[0]?.replace(/-/g, '') || 'start';

   const isWindows = platform() === 'win32';

   const requires = {
      dirs: [],
      files: (await listFiles(`${__dirname}/resources`)).map((file) => basename(file)),
   };

   const filesCallback = {
      'package.json': async () => await exec('npm i'),
   };

   const alloweds = {
      create: true,
      start: '../lib/tasks/start/index.js',
      build: '../lib/tasks/build/index.js',
      TEST: '../lib/tasks/start/index.js',
   };

   if (arg !== 'TEST' && !alloweds[arg]) {
      console.error(`Command "${arg}" not found.${EOL}Use "create", "start" or "build".${EOL}`);
      return;
   }

   const importing = new draft(
      `Importing dependencies: ${sh.green}${sh.dim}[ ${sh.italic}autoprefixer, postcss, rollup, sass, uglifyjs, ... ]${sh.reset}`
   );

   for (const require of requires.dirs)
      isWindows
         ? await exec(
              'xcopy ' + normalize(`${__dirname}/${require}\\`) + ' ' + normalize(`./${require}\\`) + ' /s /e /y'
           )
         : await exec('cp -rnf ' + normalize(`${__dirname}/${require}/`) + ' ' + normalize(`./${require}`));

   requires.files.forEach((require) => {
      if (!fs.existsSync(normalize(`./${require}`))) {
         fs.copyFileSync(normalize(`${__dirname}/resources/${require}`), normalize(`./${require}`));

         if (filesCallback?.[require]) filesCallback[require]();
      }
   });

   if (!fs.existsSync(normalize('./.gitignore'))) {
      const gitignore = ['temp_*', 'dist', 'release', '*.zip', 'src/exit', 'node_modules'].join(EOL);

      fs.writeFileSync(normalize('./.gitignore'), gitignore);
   }

   const rebuilded = await rebuildFiles(arg);

   importing.stop(1);

   if (!rebuilded) return;

   try {
      if (fs.existsSync(normalize('./.swrc.js'))) {
         const { options } = await import('./modules/config.js');

         if (arg === 'start' && options?.initalCommit && !fs.existsSync(normalize('./.git')))
            await exec(`git init && git add . && git commit -m "Initial Commit"`);
      }
   } catch (quiet) {
      /* Just ignores when no "git" installed */
   }

   if (typeof alloweds[arg] === 'string') await import(alloweds[arg]); /* Calls to script */

   /* Reserved to tests */
   args.includes('--TEST') && console.log('PASSED');
})();
