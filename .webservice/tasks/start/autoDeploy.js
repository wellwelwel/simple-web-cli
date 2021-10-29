"use strict";

const fs = require('fs-extra');
const { sh, type } = require('../../modules/sh');
const FTP = require('../../modules/ftp');
const { dev, source, to, process_files } = require('../../modules/config');
const createDir = require('../../modules/create-dir');
const empty = require('../../modules/empty');
const isConnected = require('../../modules/check-connection');
const listFiles = require('../../modules/listFiles');
const watch = require('node-watch').default;
const processCSS = require('../../modules/process-files/process-scss');
const processJS = require('../../modules/process-files/process-js');
const processPHP = require('../../modules/process-files/process-php-phtml');
const processHTML = require('../../modules/process-files/process-html');
const processHTACCESS = require('../../modules/process-files/process-htaccess');
const postProcess = require('../../modules/process-files/post-process-replace');
const no_process = require('../../modules/process-files/no-process');
const Schedule = require('../../modules/schedule');

module.exports = async () => {

   const { host, user, pass, root, secure } = dev.ftp;
   const pre_connect = !empty(host) || !empty(user) || !empty(pass) ? true : false;
   const conn = pre_connect ? await FTP.connect({ host: host, user: user, pass: pass, root: root, secure: secure }) : false;
   if (!conn) FTP.client.close();

   const deploy = new Schedule();
   const watcherSource = watch(source, { recursive: true });
   const watcherMain = watch(to, { recursive: true });
   const watcherModules = watch('.library', { recursive: true });

   const onSrc = async (event, file) => {

      if (fs.existsSync(`${source}/exit`)) {
         
         fs.unlinkSync(`${source}/exit`);

         FTP.client.close();
         watcherSource.close();
         watcherMain.close();
         watcherModules.close();

         return;
      }

      const isDir = file.split('/').pop().includes('.') ? false : true;
      if (event == 'update' && isDir) return;
      
      const fileType = file.split('.').pop().toLowerCase();
      const finalFile = file.replace(source, to);

      let pathFile = file.split('/'); pathFile.pop(); pathFile = pathFile.join('/');
      
      if (event === 'update') {
         
         /* pre processed files */
         const logBuilding = () => console.log(`${sh.reset}${sh.dim}↗️   Building from "${sh.bold}${type(file)}${file}${sh.reset}${sh.dim}" ...`);
         deploy.queue(logBuilding);
         deploy.start();

         if (fileType === 'js') processJS(file);
         else if (fileType === 'scss' || fileType === 'css') processCSS(file);
         else {
         
            /* post process */
            createDir(pathFile.replace(source, to));
   
            const original = await postProcess({src: file, response: true});
            let minified = false;
            
            /* specials */
            if (!no_process(file)) {

               if (fileType === 'php' || fileType === 'phtml') minified = processPHP(original);
               else if (fileType === 'html')  minified = processHTML(original);
               else if (fileType === 'htaccess')  minified = processHTACCESS(original);
            }
   
            fs.writeFile(finalFile, !minified ? original : minified);
         }
      }
      else if (event === 'remove') {

         const logBuilding = () => console.log(`${sh.reset}${sh.dim}↖️   Removed from "${sh.bold}${type(file)}${file}${sh.reset}${sh.dim}" ...`);
         deploy.queue(logBuilding); 
         deploy.start();

         if (isDir) fs.rmSync(finalFile, { recursive: true, force: true });
         else {

            if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
            if (fileType === 'scss') {

               if (fs.existsSync(finalFile.replace('.scss', '.css'))) fs.unlinkSync(finalFile.replace('.scss', '.css'));
            }
         }
      }
   }
   
   watcherSource.on('change', (event, file) => onSrc(event, file));
  
   watcherMain.on('change', async (event, file) => {
      
      const connected = await isConnected();

      async function deployFile() {

         /* shows file or directory that is in attendance */
         if (event == 'update') {

            console.log(`${sh.reset}${sh.dim}↗️   Copied to "${type(deploy.scheduling.current)}${sh.bold}${deploy.scheduling.current}${sh.reset}${sh.dim}"`);
            if (connected && conn) console.log(`${sh.reset}${sh.dim}↗️   Deploying to "${type(deploy.scheduling.current)}${sh.bold}${deploy.scheduling.current.replace(to, FTP.publicCachedAccess.root)}${sh.reset}${sh.dim}" ...`);
         }
         else {
            
            console.log(`${sh.reset}${sh.dim}↖️   Removed from "${type(deploy.scheduling.current)}${sh.bold}${deploy.scheduling.current}${sh.reset}${sh.dim}"`);
            if (connected && conn) console.log(`${sh.reset}${sh.dim}↖️   Removing from "${type(deploy.scheduling.current)}${sh.bold}${deploy.scheduling.current.replace(to, FTP.publicCachedAccess.root)}${sh.reset}${sh.dim}" ...`);
         }
         
         if (connected && conn) event == 'update' ? await FTP.send(file, deploy) : await FTP.remove(file, isDir);
         else if (!conn) console.log();
         else if (!connected) console.log(`${sh.reset}${sh.dim}${sh.red}❕  No connection\n`);
      }

      const isDir = file.split('/').pop().includes('.') ? false : true;
      if (event == 'update' && isDir) return;

      deploy.queue(deployFile, file);
      deploy.start();
   });

   watcherModules.on('change', async (event, file) => {

      const isDir = file.split('/').pop().includes('.') ? false : true;
      if (event == 'update' && isDir) return;

      const library = file.replace(/(\.library\/)|(\/index.js)/gim, '', file);
      const required = RegExp(`require.*?${library}`, 'gim');
      const requiredResources = process_files.js['to-browser'].require;
      const js = await listFiles(source, 'js', requiredResources);

      for (const dependence of js) {
         
         const file_dependence = fs.readFileSync(dependence, 'utf8');
         const to_process = !!file_dependence.match(required);

         to_process && onSrc('update', dependence);
      }
   });

   return true;
};