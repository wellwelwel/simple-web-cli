"use strict";

const { source } = require('../../modules/config');
const fs = require('fs-extra').promises;
const _fs = require('fs-extra');
const { sh, draft } = require('../../modules/sh');
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
const { build } = require('../../modules/receive-args');
const glob = require('glob');
const rimraf = require('rimraf');
const sep = require('path').sep;

(async () => {

   console.log(sh.clear);
   const loading = new draft(`${sh.bold}Building`, 'circle');

   await deleteDS_Store();

   const [ ,, ...args ] = process.argv;

   build(args);

   const to = process.env.output;
   const final = to.replace(/^\./, '');

   await watchClose();
   
   try {
      
      async function buildFiles() {

         const files = await listFiles(source);
         const types = [];
         
         for (const file of files) {
            
            const type = `.${file.split('.').pop()}`;
            if (!types.includes(type)) types.push(type);
         }
         
         const loading = new draft(`Compiling ${sh.bold}${sh.blue}${files.length}${sh.reset} files ${sh.italic}${sh.cyan}[ ${types.join(', ')} ]`);
         
         if (files.length === 0) {
            
            loading.stop(1, 'Nothing to compile');
            return;
         }

         for (const file of files) {

            const fileType = file.split('.').pop().toLowerCase();
            const finalFile = file.replace(source, to);
      
            let pathFile = file.split(sep); pathFile.pop(); pathFile = pathFile.join(sep);
               
            /* pre processed files */   
            if (fileType === 'js') await processJS(file, to, 'build', false);
            else if (fileType === 'scss' || fileType === 'css') await processCSS(file, to, 'build');
            else {
            
               /* post process */
               createDir(pathFile.replace(source, to));
      
               const original = await postProcess({src: file, response: true, local: 'build'});
               let minified = false;
               
               /* specials */
               if (!no_process(file)) {
   
                  if (fileType === 'php' || fileType === 'phtml') minified = await processPHP(original);
                  else if (fileType === 'html')  minified = await processHTML(original);
                  else if (fileType === 'htaccess')  minified = await processHTACCESS(original);
               }
      
               await fs.writeFile(finalFile, !minified ? original : minified);
            }
         }
         
         loading.stop(1);
      }
      
      async function resolveConflicts() {
      
         const loading = new draft(`Resolving possible conflicts`);
      
         if (_fs.existsSync(`${final}.zip`)) await fs.unlink(`${final}.zip`);
         if (_fs.existsSync(to)) await fs.rm(to, { recursive: true, force: true });

         loading.stop(1);
      }
      
      async function gerarDeploy() {

         const loading = new draft(`Compressing built files`);

         try {
            
            const files = await listFiles(to) || [];   
            const output = _fs.createWriteStream(`${final}.zip`);
            const archive = archiver('zip', { zlib: { level: process.env.level } });
   
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
      
         glob('temp_*', { }, (err, files) => {
      
            if (files.length > 0) rimraf('temp_*', () => { });
         });
         
         if (_fs.existsSync(`${source}${sep}exit`)) await fs.unlink(`${source}${sep}exit`);
         if (_fs.existsSync(to)) await fs.rm(to, { recursive: true, force: true });

         loading.stop(1);
         console.log();
      }

      /* Início */
      console.log();
      
      await resolveConflicts();
      await buildFiles();
      await gerarDeploy();
      await clearTemp();
      
      loading.stop(1, 'Finished');
   }
   catch(e) {

      loading.stop(0, `${sh.red}Error: ${sh.reset}${e}`);
   }
})();