import { join, normalize, sep } from 'path';
import createDir from './create-dir.js';
import { cwd } from './root.js';

const setConfig = async () => {
  const [, , ...args] = process.argv;
  const arg = args[0]?.replace(/-/g, '') || 'start';

  const config = await import(join(`./${cwd}`, '.swrc.js'));
  const output = { ...{}, ...config.default };

  const isValid = (arr) => !arr.some((validation) => validation === false);
  const validations = {
    ftp: [!!output?.ftp, !!output?.ftp?.start],
    sftp: [!!output?.sftp, !!output?.sftp?.start],
  };

  if (!isValid(validations.ftp)) output.ftp = false;
  if (!isValid(validations.sftp)) output.sftp = false;

  let source = normalize(output.workspaces.src.replace('./', ''));
  let to = normalize(output.workspaces.dist.replace('./', ''));

  if (source.substring(source.length - 1, source.length) === sep)
    source = source.substring(0, source.length - 1);
  if (to.substring(to.length - 1, to.length) === sep)
    to = to.substring(0, to.length - 1);

  const dev = {
    ftp: output?.ftp?.start || false,
    sftp: output?.sftp?.start || false,
  };
  const process_files =
    arg === 'build' && output?.build?.compile
      ? output.build.compile
      : output.start.compile;
  const build = output?.build || false;
  const plugins = output?.plugins || false;
  const options = output?.options || false;
  const blacklist = output.hasOwnProperty('blacklist')
    ? output.blacklist
    : [] || [];

  createDir([source, to]);

  return { source, to, dev, process_files, build, options, plugins, blacklist };
};

export const {
  source,
  to,
  dev,
  process_files,
  build,
  options,
  plugins,
  blacklist,
} = await setConfig();
