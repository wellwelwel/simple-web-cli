import fs from 'fs';
import { EOL, platform } from 'os';
import { normalize } from 'path';
import exec from '../.web/modules/execShellCommand.js';
import { sh, draft } from '../.web/modules/sh.js';
import rebuildFiles from './rebuild-files.js';
import { __dirname } from '../.web/modules/root.js';

(async () => {
   const [, , ...args] = process.argv;
   const arg = args[0]?.replace(/-/g, '') || 'start';

   const isWindows = platform() === 'win32';

   const requires = {
      dirs: ['.library'],
      files: ['.babelrc'],
   };

   const alloweds = {
      init: true,
      start: '../.web/tasks/start/index.js',
      build: '../.web/tasks/build/index.js',
      TEST: '../.web/tasks/start/index.js',
   };

   if (arg !== 'TEST' && !alloweds[arg]) {
      console.error(`Command "${arg}" not found.${EOL}Use "init", "start" or "build".${EOL}`);
      return;
   }

   const importing = new draft(
      `Importing required local modules: ${sh.green}${sh.dim}[ ${sh.italic}autoprefixer, babel, postcss, sass and uglifyjs${sh.reset}${sh.green}${sh.dim} ]`
   );

   for (const require of requires.dirs)
      isWindows
         ? await exec(
              'xcopy ' + normalize(`${__dirname}/${require}\\`) + ' ' + normalize(`./${require}\\`) + ' /s /e'
           )
         : await exec('cp -r ' + normalize(`${__dirname}/${require}`) + ' ' + normalize(`./${require}`));

   requires.files.forEach((require) => {
      if (!fs.existsSync(normalize(`./${require}`)))
         fs.copyFileSync(normalize(`${__dirname}/${require}`), normalize(`./${require}`));
   });

   if (!fs.existsSync(normalize('./package.json'))) {
      fs.copyFileSync(
         normalize(`${__dirname}/.github/workflows/resources/_package.json`),
         normalize('./package.json')
      );
      await exec('npm i');
   }
   if (!fs.existsSync(normalize('./.swrc.js')))
      fs.copyFileSync(normalize(`${__dirname}/.github/workflows/resources/_swrc.js`), normalize('./.swrc.js'));
   if (!fs.existsSync(normalize('./.gitignore')))
      fs.copyFileSync(normalize(`${__dirname}/.github/workflows/resources/_gitignore`), normalize('./.gitignore'));
   else {
      let gitignore = fs.readFileSync(normalize('./.gitignore'), 'utf-8');
      const toIgnore = [
         'dist',
         'release',
         'src/exit',
         '.library/addEventListener',
         '.library/selector',
         '.library/package.json',
         'node_modules',
         'package-lock.json',
         'yarn.lock',
      ];

      toIgnore.forEach((ignore) => {
         const regex = RegExp(ignore, 'gm');

         if (!regex.test(gitignore)) gitignore += `${EOL}${ignore}`;
      });

      fs.writeFileSync(normalize('./.gitignore'), gitignore);
   }

   const rebuilded = await rebuildFiles(arg);

   importing.stop(1);

   if (!rebuilded) return;

   try {
      if (fs.existsSync('./.swrc.js')) {
         const { options } = await import('../.web/modules/config.js');

         if (arg === 'start' && options?.initalCommit && !fs.existsSync('./.git'))
            await exec(`git init && git add . && git commit -m "Initial Commit"`);
      }
   } catch (quiet) {
      /* Just ignores when no "git" installed */
   }

   if (typeof alloweds[arg] === 'string') await import(alloweds[arg]); /* Calls to script */

   /* Reserved to tests */
   args.includes('--TEST') && console.log('PASSED');
})();
