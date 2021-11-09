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

let i = 0;
const timer = time => {
	
   const sec_num = parseInt(time, 10);
   const hours   = Math.floor(sec_num / 3600);
   const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
   const seconds = sec_num - (hours * 3600) - (minutes * 60);
   
   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

(async () => {

   console.log(sh.clear);
   const starting = new draft(` Starting${sh.dim}${sh.yellow} ... ${sh.reset}${sh.bright}`, 'circle');
   const time_elapsed = new draft(``, 'dots', false);

   console.log();

   await watchClose();
   await exec('npm link ./.library'); /* link local packages */
   
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
      return;
   }

   starting.stop(1, ` Watching${sh.reset} ${sh.green}${sh.bold}YOU${sh.reset}${sh.dim}${sh.green} ... ${sh.reset}${sh.bright}🧟`);
   time_elapsed.message(`   ${sh.dim}${sh.green}${timer(i++)}`);
   setInterval(() => time_elapsed.message(`   ${sh.dim}${sh.green}${timer(i++)}`), 1000);
})();