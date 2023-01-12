import { win32 } from 'path';
import { dev } from './config.js';

export default (path) => {
   if (dev?.ftp?.isWindowsServer === true || dev?.sftp?.isWindowsServer === true) return win32.normalize(path);

   path = path.replace(/\\\\/g, '/');
   path = path.replace(/\\/g, '/');

   return path;
};
