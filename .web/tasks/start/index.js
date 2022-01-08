"use strict";

const { sh, draft } = require('../../modules/sh');
const watchClose = require('../../modules/watch-close');
const autoDeploy = require('./autoDeploy');
const exec = require('../../modules/execShellCommand');
const { source } = require('../../modules/config');
const glob = require('glob');
const fs = require('fs-extra').promises;
const _fs = require('fs');
const rimraf = require('rimraf');
const deleteDS_Store = require('../../modules/deleteDS_Store');
const sep = require('path').sep;

(async () => {

   // console.log(sh.clear);
   const link = new draft(`Linking the local package: ${sh.green}${sh.dim}[ .library: web ]`);

   await exec(`npm link .library`); /* link local packages */
   link.stop(1);
   await watchClose();
   console.log(sh.clear);

   const starting = new draft(`Starting${sh.dim}${sh.yellow} ... ${sh.reset}${sh.bright}`, 'circle');

   glob('temp_*', { }, (err, files) => {

      if (files.length > 0) rimraf('temp_*', () => { });
   });

   await deleteDS_Store();

   if (_fs.existsSync('temp')) await fs.rm('temp', { recursive: true, force: true });
   if (_fs.existsSync(`${source}/exit`)) await fs.unlink(`${source}${sep}exit`);

   const success = await autoDeploy();

   if (!success) {

      await watchClose();

      starting.stop(0, `Falha ao iniciar processos`);
      process.exit(1);
   }

   starting.stop(1, `Watching${sh.reset} ${sh.green}${sh.bold}YOU${sh.reset}${sh.dim}${sh.green} ... ${sh.reset}${sh.bright}🧟`);
})();