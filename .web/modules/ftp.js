"use strict";

const { sh } = require('./sh');
const { to } = require('./config');
const { Client } = require("basic-ftp");
const isConnected = require('./check-connection');
const serverOSNormalize = require('./server-os-normalize');
const { normalize, sep } = require('path');

const client = new Client();
const privateCachedAccess = { };
const publicCachedAccess = { };

async function reconnect() {
   
   await connect();
}

async function connect(access = false) {

   client.error = false;

   if (access !== false) {

      Object.assign(privateCachedAccess, access);
      publicCachedAccess.root = access.root;
   }

   try {

      if (await isConnected()) {

         await client.access({
      
            host: privateCachedAccess.host,
            user: privateCachedAccess.user,
            password: privateCachedAccess.pass,
            root: privateCachedAccess.root,
            secure: privateCachedAccess.secure,
            secureOptions: { rejectUnauthorized: false },
            passvTimeout: 20000,
            keepAlive: 20000
         });
      }

      return true;
   }
   catch(err) {
   
      client.error = `${sh.reset}${sh.red}${err}`;
      return false;
   }
}

async function send(file, waiting) {

   try {

      client.error = false;
      
      const receiver = file.replace(`${to}${sep}`, '');

      if (client.closed) await reconnect(file);

      await client.uploadFrom(file, serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`));
      await new Promise(async resolve => {

         const timer = setInterval(resolve);

         if (!waiting?.scheduling?.started) {
            
            clearInterval(timer);
            resolve();
         }
      });

      return true;
   }
   catch(err) {

      try {

         /* Tenta criar diretório antes de enviar os arquivos */
         const receiver = file.replace(`${to}${sep}`, '');
   
         if (client.closed) await reconnect(file);

         const arrDir = receiver.split(sep); arrDir.pop();
         const dir = arrDir.join(sep);

         await client.uploadFromDir(normalize(`${to}${sep}${dir}`), serverOSNormalize(`${privateCachedAccess.root}${sep}${dir}`));
         await new Promise(async resolve => {

            const timer = setInterval(resolve);
   
            if (!waiting?.scheduling?.started) {
               
               clearInterval(timer);
               resolve();
            }
         });
   
         return true;
      }
      catch(err) {

         client.error = `${sh.dim}${sh.red}${err}`;
         return false;
      }
   }
}

async function remove(file, isDir = false) {

   try {

      client.error = false;

      const receiver = file.replace(`${to}${sep}`, '');

      if (client.closed) await reconnect(file);

      (!isDir) ? await client.remove(normalize(`${privateCachedAccess.root}${sep}${receiver}`)) : await client.removeDir(serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`));
      return true;
   }
   catch(err) {

      client.error = `${sh.dim}${sh.red}${err}`;
      return false;
   }
}

module.exports = {

   client,
   publicCachedAccess,
   connect,
   send,
   remove
};