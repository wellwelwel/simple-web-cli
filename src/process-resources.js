import fs from 'fs';
import { EOL, platform } from 'os';
import { normalize, basename } from 'path';
import exec from '../.web/modules/execShellCommand.js';
import { sh, draft } from '../.web/modules/sh.js';
import rebuildFiles from './rebuild-files.js';
import { __dirname } from '../.web/modules/root.js';
import listFiles from '../.web/modules/listFiles.js';

(async () => {
   const [, , ...args] = process.argv;
   const arg = args[0]?.replace(/-/g, '') || 'start';

   const isWindows = platform() === 'win32';

   const requires = {
      dirs: ['helpers'],
      files: (await listFiles(`${__dirname}/resources`)).map((file) => basename(file)),
   };

   const filesCallback = {
      'package.json': async () => await exec('npm i'),
   };

   const alloweds = {
      init: true,
      start: '../lib/tasks/start/index.js',
      build: '../lib/tasks/build/index.js',
      TEST: '../lib/tasks/start/index.js',
   };

   if (arg !== 'TEST' && !alloweds[arg]) {
      console.error(`Command "${arg}" not found.${EOL}Use "init", "start" or "build".${EOL}`);
      return;
   }

   const importing = new draft(
      `Importing required local modules: ${sh.green}${sh.dim}[ ${sh.italic}autoprefixer, rollup, postcss, sass and uglifyjs${sh.reset}${sh.green}${sh.dim} ]`
   );

   for (const require of requires.dirs)
      isWindows
         ? await exec(
              'xcopy ' + normalize(`${__dirname}/${require}\\`) + ' ' + normalize(`./${require}\\`) + ' /s /e /y'
           )
         : await exec('cp -rnf ' + normalize(`${__dirname}/${require}`) + ' ' + normalize(`./${require}`));

   requires.files.forEach((require) => {
      if (!fs.existsSync(normalize(`./${require}`))) {
         fs.copyFileSync(normalize(`${__dirname}/resources/${require}`), normalize(`./${require}`));

         if (filesCallback?.[require]) filesCallback[require]();
      }
   });

   let gitignore = fs.readFileSync(normalize('./.gitignore'), 'utf-8');
   const toIgnore = ['dist', 'release', 'src/exit', 'node_modules', 'package-lock.json', 'yarn.lock'];

   toIgnore.forEach((ignore) => {
      const regex = RegExp(ignore, 'gm');

      if (!regex.test(gitignore)) gitignore += `${EOL}${ignore}`;
   });

   fs.writeFileSync(normalize('./.gitignore'), gitignore);

   const rebuilded = await rebuildFiles(arg);

   importing.stop(1);

   if (!rebuilded) return;

   try {
      if (fs.existsSync(normalize('./.swrc.js'))) {
         const { options } = await import('../.web/modules/config.js');

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
