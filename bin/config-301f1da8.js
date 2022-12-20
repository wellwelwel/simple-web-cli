import { normalize, join, sep } from 'path';
import fs from 'fs';
import { c as cwd } from './init.js';
import 'os';
import 'child_process';
import 'draftlog';

var createDir = (directory) => {

   const directorys = [];
   if (typeof directory === 'string') directorys.push(directory);
   else if (typeof directory === 'object') Object.assign(directorys, directory);

   directorys.forEach(dir => {

      dir = normalize(dir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
   });
};

const setConfig = async () => {
   const [ ,, ...args ] = process.argv;
   const arg = args[0]?.replace(/-/g, '') || 'start';

   const config = await import(join(`./${cwd}`, '.swrc.js'));
   const output = { ...{}, ...config.default };

   const isValid = arr => !arr.some(validation => validation === false);
   const validations = {

      ftp: [

         !!output?.ftp,
         !!output?.ftp?.start,
         typeof output?.ftp?.start?.root === 'string',
         typeof output?.ftp?.start?.host === 'string' && output?.ftp?.start?.host?.trim().length > 0,
         typeof output?.ftp?.start?.user === 'string' && output?.ftp?.start?.user?.trim().length > 0,
         typeof output?.ftp?.start?.pass === 'string' && output?.ftp?.start?.pass?.trim().length > 0,
         output?.ftp?.start?.secure === 'explict' || output?.ftp?.start?.secure === true,
      ],
   };

   if (!isValid(validations.ftp)) {

      output.ftp = {

         start: {

            root: '',
            host: '',
            user: '',
            pass: '',
            secure: ''
         }
      };
   }

   let source = normalize(output.workspaces.src.replace('./', ''));
   let to = normalize(output.workspaces.dist.replace('./', ''));
   let required = normalize('.library/');

   if (source.substring(source.length - 1, source.length) === sep) source = source.substring(0, source.length - 1);
   if (to.substring(to.length - 1, to.length) === sep) to = to.substring(0, to.length - 1);
   if (required.substring(required.length - 1, required.length) === sep) required = required.substring(0, required.length - 1);

   const dev = { ftp: output.ftp.start };
   const dist = { ftp: output.ftp.build };
   const process_files = arg === 'build' && output?.build?.compile ? output.build.compile : output.start.compile;
   const build = output?.build || false;
   const plugins = output?.plugins || false;
   const options = output?.options || false;
   const blacklist = output.hasOwnProperty('blacklist') ? output.blacklist : [] || [];

   process_files.js.require = required;

   createDir([ source, to, required ]);

   return { source, to, dev, dist, process_files, build, options, plugins, blacklist };
};

const { source, to, dev, dist, process_files, build, options, plugins, blacklist } = await setConfig();

export { blacklist, build, dev, dist, options, plugins, process_files, source, to };
