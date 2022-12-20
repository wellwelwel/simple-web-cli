#! /usr/bin/env node

import fs from 'fs';
import { platform, EOL } from 'os';
import { dirname, resolve, relative, normalize } from 'path';
import { exec as exec$1 } from 'child_process';
import DraftLog from 'draftlog';

var exec = cmd => new Promise((resolve) => exec$1(cmd, (error) => resolve(!!error ? false : true)));

DraftLog(console);

const sh$1 = {

   yellow: '\x1b[33m',
   green: '\x1b[32m',
   cyan: '\x1b[36m',
   white: '\x1b[37m',
   blue: '\x1b[34m',
   magenta: '\x1b[35m',
   red: '\x1b[31m',

   dim: '\x1b[2m',
   underscore: '\x1b[4m',
   bright: '\x1b[22m',
   reset: '\x1b[0m',
   bold: '\x1b[1m',
   italic: '\x1b[3m',

   clear: '\x1Bc'
};

class draft {

   constructor(string, style = 'dots', start = true) {

      this.string = string;
      this.loading = {

         dots: [ '⠋', '⠋', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏' ],
         circle: [ '◜', '◠', '◝', '◞', '◡', '◟' ]
      };
      this.style = style;
      this.color = sh$1.yellow;
      this.message = console.draft('');
      this.status = {

         0: `${sh$1.red}✖`,
         1: `${sh$1.green}✔`,
         2: `${sh$1.yellow}⚠`,
         3: `${sh$1.blue}ℹ`
      };
      this.start = () => {

         let i = 0;
         let interval = this.loading[this.style] === 'dots' ? 50 : 150;

         this.timer = setInterval(() => {

            if (i >= this.loading[this.style].length) i = 0;

            const current = this.loading[this.style][i++];

            this.message(`${sh$1.bold}${sh$1.bright}${this.color}${current} ${sh$1.reset}${this.string}`);
         }, interval);
      };
      this.stop = (status, string = false) => {

         clearInterval(this.timer);

         if (!!string) this.string = string;
         this.message(`${sh$1.bold}${sh$1.bright}${this.status[status]} ${sh$1.reset}${this.string}`);

         return;
      };

      start && this.start();
   }
}

const sh = command => new Promise((resolve, reject) => exec$1(command, (error, stdout) => !!error ? reject(error) : resolve(stdout)));
const latestVersion = async packageName => (await sh(`npm view ${packageName?.trim()?.toLowerCase()} version`))?.trim();

const rebuildFiles = async (arg) => {
   const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
   const buildJSON = (obj) => orderJSON(obj, 2);
   const packageFile = readJSON('package.json') || {};
   const babelrc = readJSON('.babelrc') || {};

   const stage = {
      package: false,
      babelrc: false,
      error: false,
      npm_i: false,
   };
   const orderJSON = (obj, space) => {
      const allKeys = [];
      const seen = {};

      JSON.stringify(obj, (key, value) => {
         if (!(key in seen)) {
            allKeys.push(key);
            seen[key] = null;
         }

         return value;
      });

      allKeys.sort();

      return JSON.stringify(obj, allKeys, space);
   };
   const dependencies = [
      '@babel/cli',
      '@babel/core',
      '@babel/preset-env',
      'autoprefixer',
      'postcss-cli',
      'sass',
      'uglify-js',
   ];

   const compatibility = {
      node:
         +process.version
            .split('.')
            .shift()
            .replace(/[^0-9]/, '') <= 14,
      dependencies: { 'postcss-cli': '^8.3.1' },
   };

   /* package.json */
   try {
      if (!packageFile?.devDependencies) packageFile.devDependencies = {};

      for (const dependence of dependencies) {
         if (
            !packageFile?.devDependencies?.[dependence] &&
            !packageFile?.dependencies?.[dependence] &&
            !packageFile?.bundleDependencies?.[dependence]
         ) {
            if (compatibility.node && compatibility.dependencies?.[dependence]) {
               packageFile.devDependencies[dependence] = compatibility.dependencies[dependence];
            } else packageFile.devDependencies[dependence] = `^${await latestVersion(dependence)}`;

            if (!stage.package) stage.package = true;
            if (!stage.npm_i) stage.npm_i = true;
         }
      }

      /* autoprefixer requires */
      if (!packageFile?.browserslist) {
         packageFile.browserslist = '> 0%';
         if (!stage.package) stage.package = true;
      }

      /* Dev */
      if (!packageFile?.devDependencies) packageFile.devDependencies = {};
      if (!packageFile?.devDependencies?.web) {
         packageFile.devDependencies.web = 'file:.library';

         if (!stage.package) stage.package = true;
         if (!stage.npm_i) stage.npm_i = true;
      }

      if (stage.package) fs.writeFileSync('package.json', buildJSON(packageFile));
      if (stage.npm_i) await exec('npm i');
   } catch (error) {
      console.warn(
         'Unable to get the needed resources into package.json.\nPlease, look at: https://github.com/wellwelwel/simple-web-cli/blob/main/package.json and insert "browserslist" and local dependence "web" manually\n'
      );
      console.error(`Error: ${error.message}\n`);

      if (!stage.error) stage.error = true;
   }

   /* .babelrc */
   try {
      if (!babelrc?.minified) {
         babelrc.minified = true;
         if (!stage.babelrc) stage.babelrc = true;
      }
      if (!babelrc?.comments) {
         babelrc.comments = false;
         if (!stage.babelrc) stage.babelrc = true;
      }
      if (!Array.isArray(babelrc?.presets)) {
         babelrc.presets = [];
         if (!stage.babelrc) stage.babelrc = true;
      }
      if (!Array.isArray(babelrc?.presets[0])) {
         babelrc.presets[0] = [];
         if (!stage.babelrc) stage.babelrc = true;
      }

      const arrays = {
         presetEnv: false,
         exclude: false,
         transformRegenerator: false,
      };

      babelrc.presets.forEach((item) => {
         if (item.includes('@babel/preset-env')) arrays.presetEnv = true;
         if (!Array.isArray(item)) return;

         item.forEach((subitem) => {
            if (subitem?.exclude) {
               if (subitem.exclude.includes('transform-regenerator')) arrays.transformRegenerator = true;
               arrays.exclude = true;
            }
         });
      });

      if (!arrays.presetEnv) {
         babelrc.presets[0].push('@babel/preset-env');
         if (!stage.babelrc) stage.babelrc = true;
      }
      if (!arrays.exclude && !arrays.transformRegenerator) {
         babelrc.presets[0].push({ exclude: ['transform-regenerator'] });
         if (!stage.babelrc) stage.babelrc = true;
      } else if (arrays.exclude && !arrays.transformRegenerator) {
         const excludeIndex = babelrc.presets[0].findIndex((item) => item.exclude);

         babelrc.presets[0][excludeIndex].exclude.push('transform-regenerator');
         if (!stage.babelrc) stage.babelrc = true;
      }

      if (stage.babelrc) fs.writeFileSync('.babelrc', buildJSON(babelrc));
   } catch (error) {
      console.warn(
         'Unable to get the needed resources into .babelrc.\nPlease, look at: https://github.com/wellwelwel/simple-web-cli/blob/main/.babelrc and insert missing JSON values manually\n'
      );
      console.error(`Error: ${error.message}\n`);

      if (!stage.error) stage.error = true;
   }

   return !stage.error;
};

const isWindows = platform() === 'win32';

const __dirname = (() => {
   let x = dirname(decodeURI(new URL(import.meta.url).pathname));
   return resolve(isWindows ? x.substring(1) : x);
})();

const cwd = isWindows ? `file:\\${process.cwd()}` : relative(__dirname, process.cwd());

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
      start: '../lib/tasks/start/index.js',
      build: '../lib/tasks/build/index.js',
      TEST: '../lib/tasks/start/index.js',
   };

   if (arg !== 'TEST' && !alloweds[arg]) {
      console.error(`Command "${arg}" not found.${EOL}Use "init", "start" or "build".${EOL}`);
      return;
   }

   const importing = new draft(
      `Importing required local modules: ${sh$1.green}${sh$1.dim}[ ${sh$1.italic}autoprefixer, babel, postcss, sass and uglifyjs${sh$1.reset}${sh$1.green}${sh$1.dim} ]`
   );

   for (const require of requires.dirs)
      isWindows
         ? await exec(
              'xcopy ' + normalize(`${__dirname}/../${require}\\`) + ' ' + normalize(`./${require}\\`) + ' /s /e'
           )
         : await exec('cp -r ' + normalize(`${__dirname}/../${require}`) + ' ' + normalize(`./${require}`));

   requires.files.forEach((require) => {
      if (!fs.existsSync(normalize(`./${require}`)))
         fs.copyFileSync(normalize(`${__dirname}/../${require}`), normalize(`./${require}`));
   });

   if (!fs.existsSync(normalize('./package.json'))) {
      fs.copyFileSync(
         normalize(`${__dirname}/../.github/workflows/resources/_package.json`),
         normalize('./package.json')
      );
      await exec('npm i');
   }
   if (!fs.existsSync(normalize('./.swrc.js')))
      fs.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_swrc.js`), normalize('./.swrc.js'));
   if (!fs.existsSync(normalize('./.gitignore')))
      fs.copyFileSync(normalize(`${__dirname}/../.github/workflows/resources/_gitignore`), normalize('./.gitignore'));
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

   const rebuilded = await rebuildFiles();

   importing.stop(1);

   if (!rebuilded) return;

   try {
      if (fs.existsSync('./.swrc.js')) {
         const { options } = await import('./config-301f1da8.js');

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

export { cwd as c };
