"use strict";

const { sh } = require('./sh');
const { to } = require('./config');
const { Client } = require("basic-ftp");
const isConnected = require('./check-connection');
const serverOSNormalize = require('./server-os-normalize');
const { normalize, sep, dirname } = require('path');

const client = new Client;
const privateCachedAccess = { };
const publicCachedAccess = { };

async function reconnect() {

   await connect();
}

function showCHMOD(path) {

   console.log(`${sh.red}${sh.dim}${sh.bold}⚠ ${sh.reset}${sh.dim}CHMOD no applied to "${sh.red}${sh.bold}${path}${sh.reset}${sh.dim}"`);
}

async function connect(access = false) {

   client.error = false;

   if (access !== false) {

      Object.assign(privateCachedAccess, access);
      publicCachedAccess.root = access.root;
      if (access?.chmod) publicCachedAccess.chmod = access.chmod;
   }

   try {

      if (await isConnected()) {

         await client.access({

            host: privateCachedAccess.host,
            port: privateCachedAccess?.port || 21,
            user: privateCachedAccess.user,
            password: privateCachedAccess.pass,
            root: privateCachedAccess.root,
            secure: privateCachedAccess.secure,
            secureOptions: { rejectUnauthorized: false },
            passvTimeout: 10000,
            keepalive: 30000
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

      if (client.closed) await reconnect();

      const receiver = file.replace(`${to}${sep}`, '');
      const dir = serverOSNormalize(dirname(`${privateCachedAccess.root}${sep}${receiver}`));
      const remoteFile = serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`);
      const exists = (await client.list(dir)).length > 0;

      if (!exists) {

         await client.ensureDir(dir);

         if (publicCachedAccess?.chmod?.dir) {

            try {

               await client.ftp.request(`SITE CHMOD ${publicCachedAccess?.chmod?.dir} ${dir}`);
            }
            catch(error) {

               showCHMOD(dir);
            }
         }
      }

      if (publicCachedAccess?.chmod?.recursive) {

         const dirs = dirname(receiver).split(sep);
         const dirsLenght = dirs.length;

         let path = privateCachedAccess.root;

         for (let i = 0; i < dirsLenght; i++) {

            path += `/${dirs[i]}`;

            try {

               await client.ftp.request(`SITE CHMOD ${publicCachedAccess?.chmod?.dir} ${path}`);
            }
            catch(error) {

               showCHMOD(path);
            }
         }
      }

      await client.uploadFrom(file, serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`));

      if (publicCachedAccess?.chmod?.file) {

         try {

            await client.ftp.request(`SITE CHMOD ${publicCachedAccess?.chmod?.file} ${remoteFile}`);
         }
         catch(error) {

            showCHMOD(remoteFile);
         }
      }

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

async function remove(file, isDir = false) {

   try {

      client.error = false;

      const receiver = file.replace(`${to}${sep}`, '');

      if (client.closed) await reconnect(file);

      !isDir ? await client.remove(normalize(`${privateCachedAccess.root}${sep}${receiver}`)) : await client.removeDir(serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`));

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