import { dirname, join } from 'path';
import { platform } from 'os';

const isWindows = platform() === 'win32';

export const __dirname = (() => {
   const x = dirname(decodeURI(new URL(import.meta.url).pathname));
   const currentPath = isWindows ? x.substring(1) : x;

   return join(currentPath.split('simple-web-cli').shift(), './simple-web-cli');
})();

export const cwd = `file:///${process.cwd()}`;