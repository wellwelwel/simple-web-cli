import { platform } from 'os';
import { dirname, normalize, resolve, sep } from 'path';

const isWindows = platform() === 'win32';

export const __dirname = (() => {
  const meta = dirname(decodeURI(new URL(import.meta.url).pathname));
  const currentPath = isWindows ? meta.substring(1) : meta;
  const paths = currentPath.split('/');
  const rootIndex = paths.lastIndexOf('simple-web-cli');

  return resolve(paths.splice(0, rootIndex + 1).join(sep));
})();

export const cwd = normalize(`file:///${process.cwd()}`);
