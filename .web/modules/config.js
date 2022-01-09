const [ ,, ...args ] = process.argv;
const arg = args[0]?.replace(/-/g, '') || 'start';
const config = require(`${process.cwd()}/.swrc.js`);
const createDir = require('./create-dir.js');
const { normalize, sep } = require('path');

const isValid = arr => !arr.some(validation => validation === false);
const validations = {

   ftp: [

      !!config?.ftp,
      !!config?.ftp?.start,
      typeof config?.ftp?.start?.root === 'string',
      typeof config?.ftp?.start?.host === 'string' && config?.ftp?.start?.host?.trim().length > 0,
      typeof config?.ftp?.start?.user === 'string' && config?.ftp?.start?.user?.trim().length > 0,
      typeof config?.ftp?.start?.pass === 'string' && config?.ftp?.start?.pass?.trim().length > 0,
      config?.ftp?.start?.secure === 'explict' || config?.ftp?.start?.secure === true,
   ],
};

if (!isValid(validations.ftp)) {

   config.ftp = {

      start: {

         root: '',
         host: '',
         user: '',
         pass: '',
         secure: ''
      }
   };
}

let source = normalize(config.workspaces.src.replace('./', ''));
let to = normalize(config.workspaces.dist.replace('./', ''));
let required = normalize('.library/');

if (source.substring(source.length - 1, source.length) === sep) source = source.substring(0, source.length - 1);
if (to.substring(to.length - 1, to.length) === sep) to = to.substring(0, to.length - 1);
if (required.substring(required.length - 1, required.length) === sep) required = required.substring(0, required.length - 1);

const dev = { ftp: config.ftp.start };
const dist = { ftp: config.ftp.build };
const process_files = arg === 'build' && config?.build?.compile ? config.build.compile : config.start.compile;
const build = config?.build || false;
const plugins = config?.plugins || false;
const options = config?.options || false;
const port = config?.start?.localhost?.enabled ? config?.start?.localhost?.port || 3000 : false;

process_files.js.require = required;

createDir([ source, to, required ]);

module.exports = { source, to, dev, dist, process_files, build, options, plugins, port };