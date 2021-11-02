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
const postProcess = require('./post-process-replace');

async function processCSS(file, local = false, replace = 'dev') {

   const _ = file.split('/').pop().substr(0, 1) === '_' ? true : false;
   const fileType = file.split('.').pop().toLowerCase();
   const tempDIR = `temp_${(new Date()).valueOf().toString()}`;

   if (_ && fileType === 'scss') {
      
      const files = await listFiles(source, 'scss');
      const filename =  file.split('/').pop().replace(/_/, '').replace(/.scss/, '');
      
      for (const file in files) {
      
         const regex = RegExp(`@import.*?${filename}`, 'gim');
         const content = await fs.readFile(files[file], 'utf8');
         const isValid = !!content.match(regex);

         if (isValid) processCSS(files[file], local, replace);
      }

      return;
   }

   try {

      const localTo = !local ? to : local;
      const tempCSS = file.replace(source, tempDIR).replace('.scss', '.css');
      const tempPath = path(file.replace(source, tempDIR));
      const final = tempCSS.replace(tempDIR, localTo);
      const process = !no_process(fileType === 'scss' ? tempCSS.replace('.css', '.scss') : tempCSS);

      createDir([ tempPath, tempPath.replace(tempDIR, localTo) ]);

      if (fileType === 'scss') await exec(`npx sass "${file}":"${tempCSS}" --no-source-map${process_files.css.uglifycss && process ? ' --style compressed' : ''}`);
      else if (fileType === 'css') await fs.copyFile(file, tempCSS);

      let content = await postProcess({ src: tempCSS, response: true, local: replace });
      await fs.writeFile(tempCSS, content);

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

module.exports = processCSS;