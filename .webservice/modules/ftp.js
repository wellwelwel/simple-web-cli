"use strict";

const { sh, type } = require('./sh');
const { to } = require('./config');
const { Client } = require("basic-ftp");
const isConnected = require('./check-connection');

const client = new Client();
const privateCachedAccess = { };
const publicCachedAccess = { };

async function reconnect(file) {
   
   await connect();
}

async function connect(access = false) {

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

   let timer;

   try {
      
      const receiver = file.replace(`${to}/`, '');

      if (client.closed) await reconnect(file);

      await client.uploadFrom(file, `${privateCachedAccess.root}/${receiver}`);
      await new Promise(async resolve => {

         const timer = setInterval(resolve);

         if (!waiting.scheduling.started) {
            
            clearInterval(timer);
            resolve();
         }
      });

      return true;
   }
   catch(err) {

      try {

         /* Tenta criar diretório antes de enviar os arquivos */
         const receiver = file.replace(`${to}/`, '');
   
         if (client.closed) await reconnect(file);

         const arrDir = receiver.split('/'); arrDir.pop();
         const dir = arrDir.join('/');

         await client.uploadFromDir(`${to}/${dir}`, `${privateCachedAccess.root}/${dir}`);
         await new Promise(async resolve => {

            const timer = setInterval(resolve);
   
            if (!waiting.scheduling.started) {
               
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

      const receiver = file.replace(`${to}/`, '');

      if (client.closed) await reconnect(file);

      (!isDir) ? await client.remove(`${privateCachedAccess.root}/${receiver}`) : await client.removeDir(`${privateCachedAccess.root}/${receiver}`);
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