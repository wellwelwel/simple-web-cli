"use strict";

import fs from 'fs';
import uglifycss from 'uglifycss';
import { sep } from 'path';
import exec from '../execShellCommand.js';
import { source, to, process_files } from '../config.js';
import createDir from '../create-dir.js';
import path from '../get-path.js';
import listFiles from '../listFiles.js';
import no_process from './no-process.js';
import postProcess from './post-process-replace.js';

async function processCSS(file, local = false, replace = 'start') {

   const _ = file.split(sep).pop().substr(0, 1) === '_' ? true : false;
   const fileType = file.split('.').pop().toLowerCase();
   const tempDIR = `temp_${(new Date()).valueOf().toString()}`;

   if (fileType === 'scss' && process_files.hasOwnProperty('scss') && process_files.scss === false) {

      createDir([ path(file.replace(source, to)) ]);

      fs.copyFileSync(file, file.replace(source, to));
      return true;
   }

   if (_ && fileType === 'scss') {

      const files = await listFiles(source, 'scss');
      const filename =  file.split(sep).pop().replace(/_/, '').replace(/.scss/, '');

      for (const file in files) {

         const regex = RegExp(`(@import).*?("|')((\\.\\/|\\.\\.\\/){1,})?((.*?\\/){1,})?(_)?(${filename})(\\.scss)?("|')`, 'g');
         const content = fs.readFileSync(files[file], 'utf8');
         const isValid = !!content.match(regex);

         if (isValid) processCSS(files[file], local, replace);
      }

      return true;
   }

   const localTo = !local ? to : local;
   const tempCSS = file.replace(source, tempDIR).replace('.scss', '.css');
   const tempPath = path(file.replace(source, tempDIR));
   const final = tempCSS.replace(tempDIR, localTo);
   const process = !no_process(fileType === 'scss' ? tempCSS.replace('.css', '.scss') : tempCSS);

   createDir([ tempPath, tempPath.replace(tempDIR, localTo) ]);

   let request;

   if (fileType === 'scss') {

      request = await exec(`npx sass --quiet "${file}":"${tempCSS}" --no-source-map${process_files.css.uglifycss && process ? ' --style compressed' : ''}`);
   }
   else if (fileType === 'css') {

      fs.copyFileSync(file, tempCSS);

      request = true;
   }

   let content = `/* autoprefixer grid: autoplace */ ${await postProcess({ src: tempCSS, response: true, local: replace })}`;
   fs.writeFileSync(tempCSS, content);

   if (process && process_files.css.autoprefixer) await exec(`npx postcss "${tempCSS}" --use autoprefixer -o "${tempCSS}" --no-map`);

   const uglified = process_files.css.uglifycss && process ? uglifycss.processFiles([tempCSS], { uglyComments: true }) : fs.readFileSync(tempCSS, 'utf8');
   fs.writeFileSync(final, uglified);

   if (fs.existsSync(tempDIR)) await exec(`rm -rf ./${tempDIR}`);

   return request;
}

export default processCSS;