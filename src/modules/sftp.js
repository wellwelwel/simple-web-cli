import { sep } from 'path';
import { Client } from 'basic-sftp';
import { to } from './config.js';
import serverOSNormalize from './server-os-normalize.js';
import { sh } from './sh.js';

const client = new Client();
const publicCachedAccess = {};
const privateCachedAccess = {};

client.error = false;
client.close = client.end;

const connect = async (access) => {
  Object.assign(privateCachedAccess, access);

  publicCachedAccess.root = access.root;

  await client.connect(access);

  return true;
};

const send = async (file) => {
  const receiver = file.replace(`${to}${sep}`, '');

  try {
    client.error = false;

    await client.uploadFile(
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
};

const remove = async (file) => {
  try {
    client.error = false;

    const receiver = file.replace(`${to}${sep}`, '');

    await client.unlink(
      serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`)
    );

    return true;
  } catch (err) {
    client.error = `${sh.dim}${sh.red}${err}`;

    return false;
  }
};

export default {
  client,
  publicCachedAccess,
  connect,
  send,
  remove,
};
