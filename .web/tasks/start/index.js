"use strict";

const { sh, draft } = require('../../modules/sh');
const watchClose = require('../../modules/watch-close');
const autoDeploy = require('./autoDeploy');
const exec = require('../../modules/execShellCommand');
const { source } = require('../../modules/config');
const rmTemp = require('../../modules/rmTemp');
const fs = require('fs');
const deleteDS_Store = require('../../modules/deleteDS_Store');
const sep = require('path').sep;

(async () => {

   const link = new draft(`Linking the local package: ${sh.green}${sh.dim}[ .library: web ]`);

   await exec(`npm link .library`); /* link local packages */
   link.stop(1);
   await watchClose();

   const starting = new draft(`Starting${sh.dim}${sh.yellow} ... ${sh.reset}${sh.bright}`, 'circle');

   await rmTemp();
   await deleteDS_Store();

   if (fs.existsSync('temp')) fs.rmSync('temp', { recursive: true, force: true });
   if (fs.existsSync(`${source}/exit`)) fs.unlinkSync(`${source}${sep}exit`);

   const success = await autoDeploy();

   if (!success) {

      await watchClose();

      starting.stop(0, `Falha ao iniciar processos`);
      process.exit(1);
   }

   starting.stop(1, `Watching${sh.reset} ${sh.green}${sh.bold}YOU${sh.reset}${sh.dim}${sh.green} ... ${sh.reset}${sh.bright}🧟`);
})();