import { dirname, normalize, sep } from 'path';
import { Client } from 'basic-ftp';
import isConnected from './check-connection.js';
import { to } from './config.js';
import serverOSNormalize from './server-os-normalize.js';
import { sh } from './sh.js';

const client = new Client();
const publicCachedAccess = {};
const privateCachedAccess = {};

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
        port: privateCachedAccess?.port || 21,
        user: privateCachedAccess.user,
        password: privateCachedAccess.pass,
        root: privateCachedAccess.root,
        secure: privateCachedAccess.secure,
        secureOptions: { rejectUnauthorized: false },
        passvTimeout: 10000,
        keepalive: 30000,
      });

      const exists = async () => {
        try {
          return (
            (await client?.list(privateCachedAccess.root))?.length > 0 || false
          );
        } catch (e) {
          return false;
        }
      };

      if (!(await exists(privateCachedAccess.root)))
        await client.ensureDir(privateCachedAccess.root);
    }

    return true;
  } catch (err) {
    client.error = `${sh.reset}${sh.red}${err}`;
    return false;
  }
}

async function send(file) {
  const receiver = file.replace(`${to}${sep}`, '');

  try {
    client.error = false;

    if (client.closed) await reconnect();

    const dir = serverOSNormalize(
      dirname(`${privateCachedAccess.root}${sep}${receiver}`)
    );
    const exists = async () => {
      try {
        return (await client?.list(dir))?.length > 0 || false;
      } catch (e) {
        return false;
      }
    };

    if (!(await exists())) await client.ensureDir(dir);

    await client.uploadFrom(
      file,
      serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`)
    );

    return true;
  } catch (err) {
    client.error =
      `${sh.dim}${sh.red}${err} > ` +
      serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`);
    return false;
  }
}

async function remove(file, isDir = false) {
  try {
    client.error = false;

    const receiver = file.replace(`${to}${sep}`, '');

    if (client.closed) await reconnect(file);

    !isDir
      ? await client.remove(
          normalize(`${privateCachedAccess.root}${sep}${receiver}`)
        )
      : await client.removeDir(
          serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`)
        );

    return true;
  } catch (err) {
    client.error = `${sh.dim}${sh.red}${err}`;

    return false;
  }
}

export default {
  client,
  publicCachedAccess,
  connect,
  send,
  remove,
};
