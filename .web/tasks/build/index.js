"use strict";

const { source, build, blacklist } = require('../../modules/config');
const fs = require('fs');
const { sh, draft } = require('../../modules/sh');
const vReg = require('../../modules/vReg');
const watchClose = require('../../modules/watch-close');
const listFiles = require('../../modules/listFiles');
const archiver = require('archiver');
const deleteDS_Store = require('../../modules/deleteDS_Store');
const processCSS = require('../../modules/process-files/process-scss');
const processJS = require('../../modules/process-files/process-js');
const processPHP = require('../../modules/process-files/process-php-phtml');
const processHTACCESS = require('../../modules/process-files/process-htaccess');
const processHTML = require('../../modules/process-files/process-html');
const no_process = require('../../modules/process-files/no-process');
const createDir = require('../../modules/create-dir');
const postProcess = require('../../modules/process-files/post-process-replace');
const rmTemp = require('../../modules/rmTemp');
const { sep } = require('path');
const { performance } = require('perf_hooks');

(async () => {

   const loading = new draft(`${sh.bold}Building`, 'circle');

   await deleteDS_Store();

   const to = build.output;
   const final = to.replace(/^\./, '');

   await watchClose();

   try {

      async function buildFiles() {

         const files = await listFiles(source);
         const types = [];
         const typesOver = [];

         let count = 0;
         let blacklistCount = 0;

         for (const file of files) {

            const type = `.${file.split('.').pop()}`;

            if (type.length >= 10 || types.length >= 10) {

               if (!typesOver.includes(type)) typesOver.push(type);
               continue;
            }

            if (!types.includes(type)) types.push(type);
         }

         const moreTypes = typesOver.length > 0 ? ` and ${typesOver.length} more` : '';
         const loading = new draft('', `dots`, false);
         const prefix = () => `Compiling ${sh.bold}${sh.blue}${count}${sh.reset}${sh.dim}${sh.white} of ${sh.reset}${sh.bold}${sh.blue}${files.length}${sh.reset} files: `;

         loading.start();

         if (files.length === 0) {

            loading.stop(1, 'Nothing to compile');
            return;
         }

         for (const file of files) {

            const inBlacklist = blacklist.some(item => !!file.match(vReg(item, 'gi')));
            if (inBlacklist) {

               blacklistCount++;

               continue;
            }

            loading.string = `${prefix()}${sh.blue}${file}`;

            const fileType = file.split('.').pop().toLowerCase();
            const finalFile = file.replace(source, to);

            let pathFile = file.split(sep); pathFile.pop(); pathFile = pathFile.join(sep);

            /* pre processed files */
            if (fileType === 'js') await processJS(file, to, 'build', false);
            else if (fileType === 'scss' || fileType === 'css') await processCSS(file, to, 'build');
            else {

               /* post process */
               const original = await postProcess({ src: file, response: true, local: 'build', to: finalFile });
               let minified = false;

               if (original !== 'skip-this-file') {

                  /* specials */
                  if (!no_process(file)) {

                     if (fileType === 'php' || fileType === 'phtml') minified = await processPHP(original);
                     else if (fileType === 'html')  minified = await processHTML(original, file);
                     else if (fileType === 'htaccess')  minified = await processHTACCESS(original);
                  }

                  if (minified !== 'skip-this-file') {

                     createDir(pathFile.replace(source, to));
                     fs.writeFileSync(finalFile, !minified ? original : minified);
                  }
               }
            }

            count++;
         }

         loading.stop(1, `${prefix()}${sh.blue}${types.join(', ')}${moreTypes}`);
         if (blacklistCount > 0) console.log(`${sh.blue}ℹ ${sh.reset}${sh.bold}${blacklistCount}${sh.reset} file(s) in Blacklist`);
      }

      async function resolveConflicts() {

         const loading = new draft(`Resolving possible conflicts`);

         if (fs.existsSync(`${final}.zip`)) fs.unlinkSync(`${final}.zip`);
         if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });

         loading.stop(1);
      }

      async function gerarDeploy() {

         const loading = new draft(`Compressing built files`);

         try {

            const files = await listFiles(to) || [];
            const output = fs.createWriteStream(`${final}.zip`);
            const archive = archiver('zip', { zlib: { level: build?.level || 0 } });

            archive.pipe(output);
            for (const file of files) archive.file(file, { name: file });
            await archive.finalize();

            loading.stop(1, `Successfully compressed into: ${sh.underscore}${sh.blue}${sh.bold}./${final}.zip`);
         }
         catch (error) {

            loading.stop(1, `Nothing to compress`);
         }
      }

      async function clearTemp() {

         const loading = new draft(`Deleting temporary files`);

         await rmTemp();

         if (fs.existsSync(`${source}${sep}exit`)) fs.unlinkSync(`${source}${sep}exit`);
         if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });

         loading.stop(1);
      }

      function msToTime(s) {

         function pad(n, z) {

            z = z || 2;

            return ('00' + n).slice(-z);
         }

         const ms = s % 1000;
         s = (s - ms) / 1000;
         const secs = s % 60;
         s = (s - secs) / 60;
         const mins = s % 60;
         const hrs = (s - mins) / 60;

         return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
      }

      /* Início */
      console.log();
      const startTime = performance.now();

      await resolveConflicts();
      await buildFiles();
      await gerarDeploy();
      await clearTemp();

      console.log();
      loading.stop(1, `Finished in ${sh.green}${msToTime(performance.now() - startTime)}`);
   }
   catch(e) {

      loading.stop(0, `${sh.red}Error: ${sh.reset}${e}`);
      process.exit(1);
   }
})();