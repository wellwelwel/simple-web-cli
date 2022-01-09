"use strict";

const fs = require('fs-extra');
const { sh, type, draft } = require('../../modules/sh');
const FTP = require('../../modules/ftp');
const { dev, source, to, process_files, port } = require('../../modules/config');
const createDir = require('../../modules/create-dir');
const empty = require('../../modules/empty');
const isConnected = require('../../modules/check-connection');
const listFiles = require('../../modules/listFiles');
const deleteDS_Store = require('../../modules/deleteDS_Store');
const watch = require('node-watch').default;
const processCSS = require('../../modules/process-files/process-scss');
const processJS = require('../../modules/process-files/process-js');
const processPHP = require('../../modules/process-files/process-php-phtml');
const processHTML = require('../../modules/process-files/process-html');
const processHTACCESS = require('../../modules/process-files/process-htaccess');
const postProcess = require('../../modules/process-files/post-process-replace');
const no_process = require('../../modules/process-files/no-process');
const { sep } = require('path');
const Schedule = require('../../modules/schedule');
const serverOSNormalize = require('../../modules/server-os-normalize');
const { createServer, reload } = require('../../modules/localhost');

module.exports = async () => {

   const loading = {

      server: new draft('', `circle`, false),
      ftp: new draft('', `circle`, false)
   };

   console.log();

   loading.server.start();

   if (!!port) {

      loading.server.string = `Listening on: ${sh.green}${sh.bold}http://localhost:${port}/${sh.reset} 🏠`;
      loading.server.stop(createServer() === true ? 1 : 0);
   }
   else {

      loading.server.string = `${sh.dim}The listener was set off 🏠`;
      loading.server.stop(3);
   }

   loading.ftp.start();
   loading.ftp.string = `${sh.bold}FTP:${sh.reset} ${sh.dim}Connecting`;


   const { host, user, pass } = dev.ftp;
   const pre_connect = !empty(host) || !empty(user) || !empty(pass);
   const conn = pre_connect ? await FTP.connect(dev.ftp) : false;
   if (!conn) {

      FTP.client.close();
      loading.ftp.stop(3, `${sh.dim}${sh.bold}FTP:${sh.reset}${sh.dim} No connected`);
   }
   else loading.ftp.stop(1, `${sh.bold}FTP:${sh.reset} ${sh.dim}Connected`);

   const deploy = new Schedule();
   const watcherSource = watch(source, { recursive: true });
   const watcherMain = watch(to, { recursive: true });
   const watcherModules = watch('.library', { recursive: true });

   const onSrc = async (event, file) => {

      if (!!file.match(/DS_Store/)) {

         await deleteDS_Store();
         return;
      }

      if (file === `${source}${sep}exit`) {

         FTP.client.close();
         watcherSource.close();
         watcherMain.close();
         watcherModules.close();
         process.exit(0);
      }

      const isDir = file.split(sep).pop().includes('.') ? false : true;
      if (event == 'update' && isDir) return;

      /* Verificar se o item já está em processamento */
      if (!deploy.scheduling?.file) deploy.scheduling.file = file;
      else if (deploy.scheduling.file === file) return;

      const log = { building: new draft('', `dots`, false) };

      const fileType = file.split('.').pop().toLowerCase();
      const finalFile = file.replace(source, to);

      let pathFile = file.split(sep); pathFile.pop(); pathFile = pathFile.join(sep);

      if (event === 'update') {

         log.building.start();
         log.building.string = `Building ${sh.dim}from${sh.reset} "${sh.bold}${type(file)}${file}${sh.reset}"`;

         let status = 1;

         /* pre processed files */
         if (fileType === 'js') {

            const request = await processJS(file);

            if (!request) status = 0;
         }
         else if (fileType === 'scss' || fileType === 'css') {

            const request = await processCSS(file);

            if (!request) status = 0;
         }
         else {

            /* post process */
            const original = await postProcess({src: file, response: true});
            let minified = false;

            /* specials */
            if (!no_process(file)) {

               if (fileType === 'php' || fileType === 'phtml') minified = await processPHP(original);
               else if (fileType === 'html')  minified = await processHTML(original, file);
               else if (fileType === 'htaccess')  minified = await processHTACCESS(original);
            }

            if (minified !== 'skip-this-file') {

               createDir(pathFile.replace(source, to));
               await fs.writeFile(finalFile, !minified ? original : minified);
            }
         }

         log.building.stop(status);

      }
      else if (event === 'remove') {

         log.building.start();
         log.building.string = `Removed ${sh.dim}from${sh.reset} "${sh.bold}${type(file)}${file}${sh.reset}"`;

         if (isDir) fs.rmSync(finalFile, { recursive: true, force: true });
         else {

            if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
            if (fileType === 'scss') {

               if (fs.existsSync(finalFile.replace('.scss', '.css'))) fs.unlinkSync(finalFile.replace('.scss', '.css'));
            }
         }

         log.building.stop(1);
      }
   };

   watcherSource.on('change', (event, file) => onSrc(event, file));

   watcherMain.on('change', async (event, file) => {

      if (!!file.match(/DS_Store/)) {

         await deleteDS_Store();
         return;
      }

      { /* Auto reload */
         Object.keys(require.cache).forEach(key => delete require.cache[key]);
         if (!reload.status) reload.status = true;
      }

      const connected = await isConnected();

      async function deployFile() {

         const log = { status: new draft('', `dots`, false) };
         if (connected && conn) log.deploy = new draft('', `dots`, false);

         log.status.start();
         log?.deploy && log.deploy.start();

         /* shows file or directory that is in attendance */
         if (event == 'update') {

            log.status.stop(1, `Copied ${sh.dim}to${sh.reset} "${type(deploy.scheduling.current)}${sh.bold}${deploy.scheduling.current}${sh.reset}"`);
            if (connected && conn) log.deploy.string = `Deploying ${sh.dim}to${sh.reset} "${type(deploy.scheduling.current)}${sh.bold}${serverOSNormalize(deploy.scheduling.current.replace(to, FTP.publicCachedAccess.root))}${sh.reset}"`;
         }
         else {

            log.status.stop(1, `Removed ${sh.dim}from${sh.reset} "${type(deploy.scheduling.current)}${sh.bold}${deploy.scheduling.current}${sh.reset}"`);
            if (connected && conn) log.deploy.string = `Removing ${sh.dim}from${sh.reset} "${type(deploy.scheduling.current)}${sh.bold}${serverOSNormalize(deploy.scheduling.current.replace(to, FTP.publicCachedAccess.root))}${sh.reset}"`;
         }

         if (connected && conn) {

            const action = event == 'update' ? await FTP.send(file, deploy) : await FTP.remove(file, isDir);

            log.deploy.stop(!!action ? 1 : 0, FTP.client.error);
         }
      }

      const isDir = file.split(sep).pop().includes('.') ? false : true;
      if (event == 'update' && isDir) return;

      /* Verificar se o item já está em processamento */
      if (!deploy.scheduling?.copying) deploy.scheduling.copying = file;
      else if (deploy.scheduling.copying === file) return;

      deploy.queue(deployFile, file);
      await deploy.start();
   });

   watcherModules.on('change', async (event, file) => {

      if (!!file.match(/DS_Store/)) {

         await deleteDS_Store();
         return;
      }

      const isDir = file.split(sep).pop().includes('.') ? false : true;
      if (event == 'update' && isDir) return;

      const library = file.replace(/(\.library\/)|(\/index.js)/gim, '', file);
      const required = RegExp(`require.*?${library}`, 'gim');
      const requiredResources = process_files.js.require;
      const js = await listFiles(source, 'js', requiredResources);

      for (const dependence of js) {

         const file_dependence = fs.readFileSync(dependence, 'utf8');
         const to_process = !!file_dependence.match(required);

         to_process && await onSrc('update', dependence);
      }
   });

   return true;
};