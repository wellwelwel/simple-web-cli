import fs from 'fs';
import { source, to, process_files } from '../config.js';
import createDir from '../create-dir.js';
import exec from '../execShellCommand.js';
import path from '../get-path.js';
import no_process from './no-process.js';
import postProcess from './post-process-replace.js';
import vReg from '../vReg.js';

async function recursive_require(file, replace) {
   return await postProcess({ src: file, response: true, local: replace });
}

async function processJS(file, local = false, replace = 'start') {
   const localTo = !local ? to : local;
   const tempDIR = `temp_${new Date().valueOf().toString()}`;
   const pre = file.replace(source, tempDIR);
   const tempJS = path(pre);
   const final = file.replace(source, localTo).replace(/\.ts$/, '.js');

   createDir([tempDIR, tempJS, tempJS.replace(tempDIR, localTo)]);

   async function pre_process() {
      const exclude_files = process_files?.js?.exclude?.requireBrowser || false;
      let result = false;

      if (exclude_files) {
         for (const exclude of exclude_files) {
            if (vReg(exclude).test(file)) {
               result = true;
               break;
            }
         }
      }

      const content = !result
         ? await recursive_require(file, replace)
         : await postProcess({ src: file, response: true, local: replace });

      /* Final Build File */
      fs.writeFileSync(pre, content);
   }

   async function process() {
      let error = false;

      if (no_process(pre)) return;

      if (process_files?.js?.babel) {
         const request = await exec(`npx --quiet rollup -i "${pre}" -o "${pre}" -f "iife" -c`); // Rollup
         if (!request) error = true;
      }

      if (process_files?.js?.uglify) {
         const request = await exec(`npx --quiet uglifyjs "${pre}" -o "${pre}" -c -m`); // Uglify
         if (!request) error = true;
      }

      return error;
   }

   async function post_process() {
      let content = fs.readFileSync(pre, 'utf8');
      fs.writeFileSync(final, content);
   }

   /* ------------------------------------------------------------- */

   await pre_process();
   const request = await process();
   await post_process();

   if (fs.existsSync(tempDIR)) await exec(`rm -rf ./${tempDIR}`);

   return !request;
}

export default processJS;
