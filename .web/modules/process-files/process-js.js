'use strict';

const fs = require('fs-extra').promises;
const _fs = require('fs-extra');
const rimraf = require('rimraf');
const { source, to, process_files } = require('../config');
const createDir = require('../create-dir');
const exec = require('../execShellCommand');
const listFiles = require('../listFiles');
const path = require('../get-path');
const { normalize, sep } = require('path');
const { EOL } = require('os');
const no_process = require('./no-process');
const postProcess = require('./post-process-replace');
const vReg = require('../vReg');
const { sh } = require('../sh');

const requiredResources = process_files.js.require;
const packageName = JSON.parse(_fs.readFileSync('.library/package.json', 'utf8'));

function getLine(search, content) {

   const index = content.indexOf(search);
   const tempString = content.substring(0, index);

   return tempString.split(EOL).length;
}

async function recursive_require(file, replace) {

   const backup = await postProcess({ src: file, response: true, local: replace });
   const requireds = backup.match(/((const|let|var).*?{?(.*)}?.*)?require\((.*?)\)(.\w+)?;?/gim);

   let content = backup;

   for (const required in requireds) {

      try {

         let fixPath = requireds[required].replace(/\.\.\//gim, '').replace('./', '');
         const origins = requiredResources.split(sep);
         if (origins.length > 1) origins.forEach(folder => fixPath = fixPath.replace(folder, ''));
         else fixPath = fixPath.replace(requiredResources, '');

         const regex = /(require\([''`])(.+?)([''`]\);?)/;
         const requiredName = regex.exec(fixPath)[2].replace(RegExp(packageName.name.replace(/\//, '\\/'), 'gim'), '');
         const exist_require = () => {

            const required_path = normalize(`${requiredResources}${sep}${requiredName}`);

            if (_fs.existsSync(`${required_path}${sep}index.js`)) return `${required_path}${sep}index.js`;

            throw(`The file "${sh.yellow}${required_path}${sep}index.js${sh.reset}" was not found in the library. Line ${getLine(requireds[required], backup)} from "${sh.yellow}${file}${sh.reset}"`);
         };

         const require = exist_require();

         // Check module
         let current = await fs.readFile(require, 'utf-8');
         let outputContent = '';

         const outputModule = /module|exports/;
         const isModule = outputModule.test(current) ? outputModule.exec(current)[2] : false;

         if (typeof isModule !== 'boolean') {

            const evalResources = eval(current);

            if (typeof evalResources === 'object') {

               const pipeModules = [ ];
               const isPipe = /require.*\.(?<getModules>\w+)/gim.exec(requireds[required].replace(/\s/gm, ''))?.groups?.getModules || false;
               const nameVarPipe = /(const|let|var).*?(?<getPipeModule>\w+).*?require/.exec(requireds[required])?.groups?.getPipeModule || false;

               if (isPipe) pipeModules.push(isPipe);

               const requiredModules = isPipe ? pipeModules : /{\s?(?<getModules>.*)\s?}.*?=.*?require/gim.exec(requireds[required].replace(/\s/gm, ''))?.groups?.getModules.split(',') || [ ];

               for (const key in evalResources) {

                  const typeVAR = requireds[required].match(/const|let|var/gim);

                  if (requiredModules.includes(key)) {

                     if (typeof evalResources[key] !== 'function') {

                        current = current.replace(/([^:\/\/])(\/{2}.*?)|((\/\*[\s\S]*?\*\/|^\s*$)|(module|exports).+;?)/gim, '').trim();
                        outputContent += `// Imported from '${require}'${EOL}${current}${EOL}`;

                        continue;
                     }

                     if (!!typeVAR) outputContent += `// Imported from '${require}'${EOL}${typeVAR} ${isPipe ? nameVarPipe : key} = ${evalResources[key]};${EOL}`;
                     else console.log(`${sh.red}⚠${sh.reset} Bad module call in "${sh.yellow}${file}${sh.reset}": ${getLine(requireds[required], backup)}`);
                  } else if (!typeVAR) {

                     console.log(`${sh.red}⚠${sh.reset} No variable type defined for the module in "${sh.yellow}${file}${sh.reset}": ${getLine(requireds[required], backup)}`);
                  }
               }

               requiredModules.forEach(wrongModule => {

                  if (evalResources[wrongModule]) return;

                  console.log(`${sh.red}⚠${sh.reset} "${wrongModule}" not found in "${sh.yellow}${require}${sh.reset}". Line: ${getLine(wrongModule, backup)} from "${sh.yellow}${file}${sh.reset}"`);
               });

            } else if (typeof evalResources === 'function') {

               const typeVAR = requireds[required].match(/const|let|var/gim) || false;
               const nameVAR = /(const|let|var).*?(?<nameVAR>\w+)/.exec(requireds[required])?.groups?.nameVAR || false;

               if (!!typeVAR && !!nameVAR) outputContent += `// Imported from '${require}'${EOL}${typeVAR} ${nameVAR} = ${evalResources};`;
               else {

                  outputContent += `// Imported from '${require}'${EOL}${evalResources.toString()}${EOL}`;
               }
            }
         } else {

            current = current.replace(/([^:\/\/])(\/{2}.*?)|((\/\*[\s\S]*?\*\/|^\s*$))/gim, '').trim();
            outputContent += `// Imported from '${require}'${EOL}${current}${EOL}`;
         }

         /* Recursive Library */
         if (regex.test(outputContent)) outputContent = await recursive_require(require, replace);

         content = content.replace(requireds[required], outputContent);
      }
      catch (e) {

         console.log(`${sh.red}⚠${sh.reset} ${e}`);
      }
   }

   return content;
}

async function processJS(file, local = false, replace = 'start') {

   const _ = /\.library/.test(file) ? true : false;

   if (_) {

      const filename =  file.split(sep).pop().replace(/.js/, '');
      const regex = RegExp(`require.*?${filename}`);
      const files = await listFiles(source, 'js', requiredResources);

      for (const file in files) {

         const content = await fs.readFile(files[file], 'utf8');
         if (regex.test(content)) processJS(files[file], local);
      }

      return;
   }

   /* ------------------------------------------------------------- */

   const localTo = !local ? to : local;
   const tempDIR = `temp_${(new Date()).valueOf().toString()}`;
   const pre = file.replace(source, tempDIR);
   const tempJS = path(pre);
   const final = file.replace(source, localTo);

   createDir([ tempDIR, tempJS, tempJS.replace(tempDIR, localTo) ]);

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

      const content = !result ? await recursive_require(file, replace) : await postProcess({ src: file, response: true, local: replace });

      /* Final Build File */
      await fs.writeFile(pre, content);
   }

   async function process() {

      let error = false;

      if (no_process(pre)) return;

      if (process_files?.js?.babel) {

         const request = await exec(`npx --quiet babel "${pre}" -o "${pre}"`); // Babel
         if (!request) error = true;
      }

      if (process_files?.js?.uglify) {

         const request = await exec(`npx --quiet uglifyjs "${pre}" -o "${pre}" -c -m`); // Uglify
         if (!request) error = true;
      }

      return error;
   }

   async function post_process() {

      let content = await fs.readFile(pre, 'utf8');
      await fs.writeFile(final, content);
   }

   /* ------------------------------------------------------------- */

   await pre_process();
   const request = await process();
   await post_process();

   if (_fs.existsSync(tempDIR)) rimraf(tempDIR, () => { });

   return !request;
}

module.exports = processJS;