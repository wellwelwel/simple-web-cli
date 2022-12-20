import { dirname, sep, resolve, normalize } from 'path';
import { platform } from 'os';

const isWindows = platform() === 'win32';

export const __dirname = (() => {
   const x = dirname(decodeURI(new URL(import.meta.url).pathname));
   const currentPath = isWindows ? x.substring(1) : x;
   const paths = currentPath.split(sep);
   const rootIndex = paths.lastIndexOf('simple-web-cli');

   return resolve(paths.splice(0, rootIndex + 1).join(sep));
})();

export const cwd = normalize(`file:///${process.cwd()}`);
