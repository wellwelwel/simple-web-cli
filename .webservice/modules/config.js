const fs = require('fs-extra');
const createDir = require('./create-dir.js');

const config = JSON.parse(fs.readFileSync('.webserviceconfig.json', 'utf8'));

if (!config?.dev || !config?.dev?.ftp || typeof config?.dev?.ftp?.root !== 'string' || typeof config?.dev?.ftp?.host  !== 'string'|| typeof config?.dev?.ftp?.user  !== 'string'|| typeof config?.dev?.ftp?.pass  !== 'string'|| !config?.dev?.ftp?.secure) {

   config.dev = {

      ftp: {
   
         root: "",
         host: "",
         user: "",
         pass: "",
         secure: ""
      }
   };
}

const { dev } = config;
const process_files = config['process-files'];

let source = config.source.replace('./', '');
let to = config.to.replace('./', '');
let required = process_files.js['to-browser'].require.replace('./', '');

if (source.substring(source.length - 1, source.length) === '/') source = source.substring(0, source.length - 1);
if (to.substring(to.length - 1, to.length) === '/') to = to.substring(0, to.length - 1);
if (required.substring(required.length - 1, required.length) === '/') required = required.substring(0, required.length - 1);

process_files.js['to-browser'].require = required;

createDir([ source, to, required ]);

module.exports = { source, to, dev, process_files };