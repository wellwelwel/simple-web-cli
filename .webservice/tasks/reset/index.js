"use strict";

const { source, to, process_files } = require('../../modules/config');
const glob = require('glob');
const { sh } = require('../../modules/sh');
const fs = require('fs-extra').promises;
const _fs = require('fs');
const rimraf = require('rimraf');
const exec = require('../../modules/execShellCommand');
const watchClose = require('../../modules/watch-close');
const now = require('../../modules/now');
const deleteDS_Store = require('../../modules/deleteDS_Store');
const processCSS = require('../../modules/process-files/process-scss');
const processJS = require('../../modules/process-files/process-js');
const listFiles = require('../../modules/listFiles');

(async () => {

   await watchClose();
   await exec('npm prune --production=false'); /* remove unused packages */
   await exec('npm link ./.library'); /* link local packages */
   
   console.clear();
   console.log(`🔧 ${sh.dim}Restaurando configurações padrões...${sh.reset}`);
   
   deleteDS_Store();

   const excludeFiles = [

      'temp_*',
      'build.zip',
      `${source}/exit`,
      `${to}/**/*.css`,
      `${to}/**/**/*.css`,
      `${to}/**/*.map`,
      `${to}/**/**/*.map`,
      `${to}/**/*.js`,
      `${to}/**/**/*.js`
   ];

   for (const file in excludeFiles) glob(excludeFiles[file], { }, (err, files) => {
      
      if (files.length > 0) rimraf(excludeFiles[file], () => { });
   });

   // const requiredResources = process_files.js['to-browser'].require;
   // const js = await listFiles(source, 'js', requiredResources);
   // const scss = await listFiles(source, ['scss', 'css']);

   // console.log(`${sh.dim}${sh.white}➕ Criando arquivos ${sh.reset}${sh.yellow}JS${sh.white}${sh.dim}`);
   
   // for (const file in js) await processJS(js[file]);
   
   // console.log(`${sh.dim}${sh.white}➕ Criando arquivos ${sh.reset}${sh.blue}CSS${sh.white}${sh.dim}`);

   // for (const file in scss) {

   //    const isValid = scss[file].split('/').pop().substr(0, 1) === '_' ? false : true;

   //    if (isValid) await processCSS(scss[file]);
   // }
      
   if (_fs.existsSync('temp')) await fs.rm('temp', { recursive: true, force: true });
   if (_fs.existsSync(`${source}/exit`)) await fs.unlink(`${source}/exit`);

   console.log(`\n${sh.green}♻️  Concluído: ${sh.dim}${now()}${sh.reset}`);
   console.log('\n\n\n\n\n\n\n\n\n\n\n\n');
})();