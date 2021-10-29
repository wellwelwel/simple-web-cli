"use strict";

const fs = require('fs-extra').promises;
const _fs = require('fs');
const rimraf = require('rimraf');
const uglifycss = require('uglifycss');
const exec = require('../execShellCommand');
const { sh } = require('../sh');
const { source, to, process_files } = require('../config');
const createDir = require('../create-dir');
const path = require('../get-path');
const listFiles = require('../listFiles');
const no_process = require('./no-process');

async function processCSS(file) {

   const _ = file.split('/').pop().substr(0, 1) === '_' ? true : false;
   const fileType = file.split('.').pop().toLowerCase();

   if (_ && fileType === 'scss') {
      
      const files = await listFiles(source, 'scss');
      const filename =  file.split('/').pop().replace(/_/, '').replace(/.scss/, '');
      
      for (const file in files) {
         
         if (files[file].split('/').pop().substr(0, 1) !== '_') {
            
            const regex = RegExp(`@import.*?${filename}`, 'gim');
            const content = await fs.readFile(files[file], 'utf8');
            const isValid = regex.exec(content);

            if (isValid) processCSS(files[file]);
         }
      }
   }
   else {

      const tempDIR = `temp_${(new Date()).valueOf().toString()}`;

      try {
   
         const tempCSS = file.replace(source, tempDIR).replace('.scss', '.css');
         const tempPath = path(file.replace(source, tempDIR));
         const final = tempCSS.replace(tempDIR, to);
         const process = !no_process(fileType === 'scss' ? tempCSS.replace('.css', '.scss') : tempCSS);

         createDir([ tempPath, tempPath.replace(tempDIR, to) ]);
   
         if (fileType === 'scss') await exec(`npx sass "${file}":"${tempCSS}" --no-source-map${process_files.css.uglifycss && process ? ' --style compressed' : ''}`);
         else if (fileType === 'css') await fs.copyFile(file, tempCSS);

         if (process && process_files.css.autoprefixer) await exec(`AUTOPREFIXER_GRID=autoplace npx postcss "${tempCSS}" --use autoprefixer -o "${tempCSS}" --no-map`);
   
         const uglified = process_files.css.uglifycss && process ? uglifycss.processFiles([tempCSS], { uglyComments: true }) : await fs.readFile(tempCSS, 'utf8');
         await fs.writeFile(final, uglified);
      }
      catch(e) {
         
         console.log(`${sh.reset}${sh.red}${e}`);
      }
      finally {
   
         if (_fs.existsSync(tempDIR)) rimraf(tempDIR, () => { });
      }
   }
}

module.exports = processCSS;