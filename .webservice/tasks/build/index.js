"use strict";

const { source, to, dev, process_files } = require('../../modules/config');
const fs = require('fs-extra').promises;
const _fs = require('fs-extra');
const { sh } = require('../../modules/sh');
const FTP = require('../../modules/ftp');
const exec = require('../../modules/execShellCommand');
const watchClose = require('../../modules/watch-close');
const now = require('../../modules/now');
const listFiles = require('../../modules/listFiles');
const Schedule = require('../../modules/schedule');
const archiver = require('archiver');
const processCSS = require('../../modules/process-files/process-scss');
const processJS = require('../../modules/process-files/process-js');


(async () => {
   
   await watchClose();
   
   try {
      
      const final = 'build';
      const requiredResources = process_files.js['to-browser'].require;
      const conn = await FTP.connect({
         
         host: dev.ftp.host,
         user: dev.ftp.user,
         pass: dev.ftp.pass,
         root: dev.ftp.root,
         secure: dev.ftp.secure
      });
      
      if (!conn) {
         
         FTP.client.close();  
         return false;
      }

      async function buildFiles() {

         const js = await listFiles(source, 'js', requiredResources);
         const scss = await listFiles(source, 'scss');

         console.log(`${sh.dim}${sh.white}➕ Criando arquivos ${sh.reset}${sh.yellow}JS${sh.white}${sh.dim}`);
         
         for (const file in js) await processJS(js[file]);
         
         console.log(`${sh.dim}${sh.white}➕ Criando arquivos ${sh.reset}${sh.blue}CSS${sh.white}${sh.dim}`);

         for (const file in scss) {

            const isValid = scss[file].split('/').pop().substr(0, 1) === '_' ? false : true;

            if (isValid) await processCSS(scss[file]);
         }
      }
      
      async function resolveConflicts() {
      
         console.log(sh.reset);
         console.log(`✖️  ${sh.dim}Resolvendo conflitos`);
      
         if (_fs.existsSync(`${final}.zip`)) await fs.unlink(`${final}.zip`);
         if (_fs.existsSync(final)) await fs.rm(final, { recursive: true, force: true });
      }
      
      async function gerarBuild() {
      
         console.log('➕ Criando arquivos de distribuição');

         await _fs.copy(to, final);
      }
      
      async function gerarDeploy() {
      
         console.log(`${sh.reset}${sh.yellow}➕ Compactando arquivos de distruibuição: ${sh.dim}${sh.underscore}${sh.white}./${final}.zip${sh.reset}`);
      
         const files = await listFiles(final);
         const output = _fs.createWriteStream(`${final}.zip`);
         const archive = archiver('zip', { zlib: { level: 9 } });

         archive.pipe(output);
         for (const file in files) archive.file(files[file], { name: files[file] });
         await archive.finalize();
      }
      
      async function clearTemp() {
      
         console.log(`${sh.yellow}➖ Excluindo arquivos temporários`);
      
         if (_fs.existsSync(`${source}/exit`)) await fs.unlink(`${source}/exit`);
         if (_fs.existsSync(final)) await fs.rm(final, { recursive: true, force: true });
      }

      async function deploy() {

         console.log(`${sh.dim}⏱️${sh.reset} ${sh.yellow} Enviando arquivos para o servidor${sh.reset}${sh.magenta} ...\n`);
         
         await FTP.deploy();
         FTP.client.close();

         console.log(`🚀 ${sh.green}Concluído: ${sh.dim}${now()}${sh.reset}\n\n`);
      }

      /* Início */

      console.clear();
      console.log(`${sh.green}⏱️  Início: ${sh.dim}${now()}${sh.reset}`);
      
      const build = new Schedule();

      const queue = [

         resolveConflicts,
         buildFiles,
         gerarBuild,
         gerarDeploy,
         clearTemp,
         deploy
      ];

      for (const key in queue) build.queue(queue[key]);

      build.start({

         type: 'Interval',
         timeInterval: 3000
      });
   }
   catch(e) {

      console.log(e);
   }
})();