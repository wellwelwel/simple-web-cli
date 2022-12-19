import { dirname, resolve, relative } from 'path';
import { platform } from 'os';

const isWindows = platform() === 'win32';

export const __dirname = (() => {
   let x = dirname(decodeURI(new URL(import.meta.url).pathname));
   return resolve(isWindows ? x.substring(1) : x);
})();

export const cwd = isWindows ? `file:\\${process.cwd()}` : relative(__dirname, process.cwd());