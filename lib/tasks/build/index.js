import fs from 'fs';
import archiver from 'archiver';
import { normalize, dirname, resolve, relative, join, sep, extname, basename } from 'path';
import { performance } from 'perf_hooks';
import { platform, EOL } from 'os';
import DraftLog from 'draftlog';
import { exec as exec$1 } from 'child_process';
import uglifycss from 'uglifycss';
import { minify } from 'html-minifier';

var createDir = (directory) => {

   const directorys = [];
   if (typeof directory === 'string') directorys.push(directory);
   else if (typeof directory === 'object') Object.assign(directorys, directory);

   directorys.forEach(dir => {

      dir = normalize(dir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
   });
};

const isWindows = platform() === 'win32';

const __dirname = (() => {
   let x = dirname(decodeURI(new URL(import.meta.url).pathname));
   return resolve(isWindows ? x.substring(1) : x);
})();

const cwd = isWindows ? `file:\\${process.cwd()}` : relative(__dirname, process.cwd());

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

DraftLog(console);

const sh = {

   yellow: '\x1b[33m',
   green: '\x1b[32m',
   cyan: '\x1b[36m',
   white: '\x1b[37m',
   blue: '\x1b[34m',
   magenta: '\x1b[35m',
   red: '\x1b[31m',

   dim: '\x1b[2m',
   underscore: '\x1b[4m',
   bright: '\x1b[22m',
   reset: '\x1b[0m',
   bold: '\x1b[1m',
   italic: '\x1b[3m',

   clear: '\x1Bc'
};

class draft {

   constructor(string, style = 'dots', start = true) {

      this.string = string;
      this.loading = {

         dots: [ '⠋', '⠋', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏' ],
         circle: [ '◜', '◠', '◝', '◞', '◡', '◟' ]
      };
      this.style = style;
      this.color = sh.yellow;
      this.message = console.draft('');
      this.status = {

         0: `${sh.red}✖`,
         1: `${sh.green}✔`,
         2: `${sh.yellow}⚠`,
         3: `${sh.blue}ℹ`
      };
      this.start = () => {

         let i = 0;
         let interval = this.loading[this.style] === 'dots' ? 50 : 150;

         this.timer = setInterval(() => {

            if (i >= this.loading[this.style].length) i = 0;

            const current = this.loading[this.style][i++];

            this.message(`${sh.bold}${sh.bright}${this.color}${current} ${sh.reset}${this.string}`);
         }, interval);
      };
      this.stop = (status, string = false) => {

         clearInterval(this.timer);

         if (!!string) this.string = string;
         this.message(`${sh.bold}${sh.bright}${this.status[status]} ${sh.reset}${this.string}`);

         return;
      };

      start && this.start();
   }
}

function vReg(string, options = 'g') {

   const validate_string = string.
      replace(/\//g, '\\/').
      replace(/\./g, '\\.').
      replace(/\*/g, '\\*').
      replace(/\$/g, '\\$').
      replace(/\+/g, '\\+').
      replace(/\?/g, '\\?').
      replace(/\|/g, '\\|').
      replace(/\[/g, '\\[').
      replace(/\]/g, '\\]').
      replace(/\(/g, '\\(').
      replace(/\)/g, '\\)').
      replace(/\{/g, '\\{').
      replace(/\}/g, '\\}');

   return new RegExp(validate_string, options);
}

var watchClose = async () => {

   fs.writeFileSync(`${source}${sep}exit`, '');
   if (fs.existsSync(`${source}${sep}exit`)) fs.unlinkSync(`${source}${sep}exit`);
};

class ListFiles {

   constructor() {

      this.files = [];
      this.excludeDir = [];

      this.isTypeExpected = (file, expected) => {

         if (expected === false) return true;

         let isValid = false;

         const types = [];
         const currentFileType = file.split('.').pop();

         if (typeof expected === 'string') types.push(expected);
         else if (typeof expected === 'object') Object.assign(types, expected);

         for (const type in types) {

            if (currentFileType.includes(types[type])) {

               isValid = true;
               break;
            }
         }

         return isValid;
      };

      this.getFiles = async (directory, type, excludeDir = false, excludeType = false) => {

         if (excludeDir) this.excludeDir.push(excludeDir.replace('./', ''));

         const filesList = fs.readdirSync(directory);

         for (const file in filesList) {

            const stat = fs.statSync(`${directory}${sep}${filesList[file]}`);
            if (this.excludeDir.includes(directory)) return false;
            else if (stat.isDirectory()) await this.getFiles(`${directory}${sep}${filesList[file]}`, type);
            else if (this.isTypeExpected(filesList[file], type)) this.files.push(`${directory}${sep}${filesList[file]}`);
         }

         return this.files;
      };
   }
}

const listFiles = async (directory, type = false, excludeDir = false, excludeType = false) => {

   const files = new ListFiles;
   const list = await files.getFiles(directory, type, excludeDir);

   files.files = []; // 🤡

   return list;
};

var exec = cmd => new Promise((resolve) => exec$1(cmd, (error) => resolve(!!error ? false : true)));

var deleteDS_Store = async () => {

   if (process.platform !== 'darwin') return;

   await exec('find . -name ".DS_Store" -type f -delete');
};

function path(file) {

   const path = file.split(sep);
   path.pop();

   return path.join(sep);
}

function no_process(file) {

   const exclude_files = process_files?.exclude || false;
   let result = false;

   if (exclude_files) {

      for (const exclude of exclude_files) {

         if (vReg(exclude).test(file)) {

            result = true;
            break;
         }
      }
   }

   return result;
}

const get_post_replace = () => {

   const post_replaces = {

      config: true,
      strings: false
   };

   if (!plugins?.stringReplace) return post_replaces;

   const set_post_replaces = plugins.stringReplace;

   if (set_post_replaces?.strings) if (Object.keys(set_post_replaces.strings).length > 0) post_replaces.strings = set_post_replaces.strings;
   if (set_post_replaces?.config) post_replaces.config = set_post_replaces?.config;

   return post_replaces;
};

var empty = str => str?.trim().length === 0 ? true : false;

var resourceReplace = (file, local) => {

   if (!plugins) return false;

   const resources = plugins?.resourceReplace || false;

   if (!resources?.replace?.[local]) return false;

   const src =  resources?.src || '.resources';
   const dest = file.replace(source, src);

   if (!fs.existsSync(dest)) return false;

   return dest;
};

const post_process = async (options = { }) => {

   const rejectTypes = [

      // Images
      /\.tiff$/i,
      /\.tif$/i,
      /\.bmp$/i,
      /\.jpg$/i,
      /\.jpeg$/i,
      /\.jpe$/i,
      /\.jfif$/i,
      /\.png$/i,
      /\.gif$/i,
      /\.webp$/i,
      /\.avif$/i,
      /\.psd$/i,
      /\.psb$/i,
      /\.exif$/i,
      /\.raw$/i,
      /\.ai$/i,
      /\.crd$/i,
      /\.eps$/i,

      // Fonts
      /\.woff$/i,
      /\.woff2$/i,
      /\.eot$/i,
      /\.otd$/i,
      /\.otf$/i,
      /\.ttf$/i,
      /\.ttc$/i,

      // Videos
      /\.avi$/i,
      /\.wmv$/i,
      /\.mov$/i,
      /\.flv$/i,
      /\.rm$/i,
      /\.mp4$/i,
      /\.mkv$/i,
      /\.mks$/i,

      // Audio
      /\.3gpp$/i,
      /\.aac$/i,
      /\.ac3$/i,
      /\.ac4$/i,
      /\.mp3$/i,
      /\.m4a$/i,
      /\.aiff$/i,
      /\.wav$/i,
      /\.ogg$/i,
      /\.alac$/i,
      /\.flac$/i,
      /\.pcm$/i,

      // Documents
      /\.pdf$/i,
      /\.xlsx$/i,
      /\.xltx$/i,
      /\.xlsm$/i,
      /\.xltm$/i,
      /\.xlsb$/i,
      /\.xls$/i,
      /\.xlt$/i,
      /\.xlam$/i,
      /\.xla$/i,
      /\.xlw$/i,
      /\.xla$/i,
      /\.xlr$/i,
      /\.ods$/i,
      /\.doc$/i,
      /\.docx$/i,
      /\.odt$/i,
      /\.dot$/i,
      /\.dotm$/i,
      /\.xps$/i,
      /\.wps$/i,
      /\.pptx$/i,
      /\.pptm$/i,
      /\.ppt$/i,
      /\.potx$/i,
      /\.potm$/i,
      /\.pot$/i,
      /\.ppsx$/i,
      /\.ppsm$/i,
      /\.pps$/i,
      /\.ppam$/i,
      /\.ppa$/i,
      /\.wmf$/i,
      /\.emf$/i,
      /\.rtf$/i,
      /\.odp$/i,

      // Compressed Files
      /\.zip(\.[0-9]{1,})?$/i,
      /\.rar(\.[0-9]{1,})?$/i,
      /\.7z$/i,
      /\.z[0-9]{1,}?$/i,
      /\.gz$/i,
      /\.z$/i,
      /\.tar$/i,
      /\.tgz$/i,
      /\.bz2$/i,
      /\.(z|gz|tar|tgz|bz2)\.part/i,
   ];

   const config = {

      src: options.src || false,
      to: options.to || false,
      local: options.local || 'start',
      response: options.response || false
   };
   const { src, to, local, response } = config;

   if (!response) {

      if (!src || !to) return false;
      if (!fs.existsSync(src)) return false;
   }

   const get_replaces = get_post_replace();
   const isValid = !rejectTypes.some(regex => regex.test(extname(src)));
   const fileType = src.split('.').pop().toLowerCase();
   const isReplaceable = () => {

      try {

         if (get_replaces.config === true) return true;
         if (get_replaces.config[fileType] === true) return true;
         if (get_replaces.config.others === true) return true;
         return false;
      }
      catch(e) {

         return false;
      }
   };

   const sampleContent = resourceReplace(src, local) || src;

   if (!isValid) {

      await exec(`mkdir -p ${dirname(to)} && cp ${sampleContent} ${to}`);

      return 'skip-this-file';
   }

   let content = fs.readFileSync(sampleContent, 'utf8');

   try {

      if (isReplaceable()) {

         let new_content = content;

         for (const string in get_replaces.strings) {

            if (string.split('*').length === 3 && string.substring(0, 1) === '*' && string.substring(string.length, string.length - 1) === '*') {

               const regex = RegExp(string.replace(/\*/gim, '\\\*'), 'gim');
               let stringToReplace = get_replaces?.strings[string][local];

               if (!stringToReplace || empty(stringToReplace)) {

                  if (local === 'start' && !empty(get_replaces.strings[string]['build'])) stringToReplace = get_replaces.strings[string]['build'];
                  else if (local === 'build' && !empty(get_replaces.strings[string]['start'])) stringToReplace = get_replaces.strings[string]['start'];
                  else stringToReplace = '';
               }

               if (stringToReplace || empty(stringToReplace)) new_content = new_content.replace(regex, stringToReplace);
            }
         }

         if (!!new_content) content = new_content;
      }
   }
   catch(e) { }
   finally {

      if (response === true) return content
      else fs.writeFileSync(to, content);
   }
};

async function processCSS(file, local = false, replace = 'start') {

   const _ = file.split(sep).pop().substr(0, 1) === '_' ? true : false;
   const fileType = file.split('.').pop().toLowerCase();
   const tempDIR = `temp_${(new Date()).valueOf().toString()}`;

   if (fileType === 'scss' && process_files.hasOwnProperty('scss') && process_files.scss === false) {

      createDir([ path(file.replace(source, to)) ]);

      fs.copyFileSync(file, file.replace(source, to));
      return true;
   }

   if (_ && fileType === 'scss') {

      const files = await listFiles(source, 'scss');
      const filename =  file.split(sep).pop().replace(/_/, '').replace(/.scss/, '');

      for (const file in files) {

         const regex = RegExp(`(@import).*?("|')((\\.\\/|\\.\\.\\/){1,})?((.*?\\/){1,})?(_)?(${filename})(\\.scss)?("|')`, 'g');
         const content = fs.readFileSync(files[file], 'utf8');
         const isValid = !!content.match(regex);

         if (isValid) processCSS(files[file], local, replace);
      }

      return true;
   }

   const localTo = !local ? to : local;
   const tempCSS = file.replace(source, tempDIR).replace('.scss', '.css');
   const tempPath = path(file.replace(source, tempDIR));
   const final = tempCSS.replace(tempDIR, localTo);
   const process = !no_process(fileType === 'scss' ? tempCSS.replace('.css', '.scss') : tempCSS);

   createDir([ tempPath, tempPath.replace(tempDIR, localTo) ]);

   let request;

   if (fileType === 'scss') {

      request = await exec(`npx sass --quiet "${file}":"${tempCSS}" --no-source-map${process_files.css.uglifycss && process ? ' --style compressed' : ''}`);
   }
   else if (fileType === 'css') {

      fs.copyFileSync(file, tempCSS);

      request = true;
   }

   let content = `/* autoprefixer grid: autoplace */ ${await post_process({ src: tempCSS, response: true, local: replace })}`;
   fs.writeFileSync(tempCSS, content);

   if (process && process_files.css.autoprefixer) await exec(`npx postcss "${tempCSS}" --use autoprefixer -o "${tempCSS}" --no-map`);

   const uglified = process_files.css.uglifycss && process ? uglifycss.processFiles([tempCSS], { uglyComments: true }) : fs.readFileSync(tempCSS, 'utf8');
   fs.writeFileSync(final, uglified);

   if (fs.existsSync(tempDIR)) await exec(`rm -rf ./${tempDIR}`);

   return request;
}

const requiredResources = process_files.js.require;
const packageName = JSON.parse(fs.readFileSync('.library/package.json', 'utf8'));

function getLine$1(search, content) {

   const index = content.indexOf(search);
   const tempString = content.substring(0, index);

   return tempString.split(EOL).length;
}

async function recursive_require(file, replace) {

   const backup = await post_process({ src: file, response: true, local: replace });
   const requireds = backup.match(/((const|let|var).*?{?(.*)}?.*)?require\((.*?)\)(.\w+)?;?/gim);

   let content = backup;

   for (const required in requireds) {

      try {

         let fixPath = requireds[required].replace(/\.\.\//gim, '').replace('./', '');
         const origins = requiredResources.split(sep);
         if (origins.length > 1) origins.forEach(folder => fixPath = fixPath.replace(folder, ''));
         else fixPath = fixPath.replace(requiredResources, '');

         const regex = /(require\([''`])(.+?)([''`]\);?)/;
         const requiredName = regex.exec(fixPath)[2].replace(RegExp(packageName.name.replace(/\//, '\\/'), 'gim'), '');
         const exist_require = () => {

            const required_path = normalize(`${requiredResources}${sep}${requiredName}`);

            if (fs.existsSync(`${required_path}${sep}index.js`)) return `${required_path}${sep}index.js`;

            throw(`The file "${sh.yellow}${required_path}${sep}index.js${sh.reset}" was not found in the library. Line ${getLine$1(requireds[required], backup)} from "${sh.yellow}${file}${sh.reset}"`);
         };

         const require = exist_require();

         // Check module
         let current = fs.readFileSync(require, 'utf-8');
         let outputContent = '';

         const outputModule = /module|exports/;
         const isModule = outputModule.test(current) ? outputModule.exec(current)[2] : false;

         if (typeof isModule !== 'boolean') {

            const evalResources = eval(current);

            if (typeof evalResources === 'object') {

               const pipeModules = [ ];
               const isPipe = /require.*\.(?<getModules>\w+)/gim.exec(requireds[required].replace(/\s/gm, ''))?.groups?.getModules || false;
               const nameVarPipe = /(const|let|var).*?(?<getPipeModule>\w+).*?require/.exec(requireds[required])?.groups?.getPipeModule || false;

               if (isPipe) pipeModules.push(isPipe);

               const requiredModules = isPipe ? pipeModules : /{\s?(?<getModules>.*)\s?}.*?=.*?require/gim.exec(requireds[required].replace(/\s/gm, ''))?.groups?.getModules.split(',') || [ ];

               for (const key in evalResources) {

                  const typeVAR = requireds[required].match(/const|let|var/gim);

                  if (requiredModules.includes(key)) {

                     if (typeof evalResources[key] !== 'function') {

                        current = current.replace(/([^:\/\/])(\/{2}.*?)|((\/\*[\s\S]*?\*\/|^\s*$)|(module|exports).+;?)/gim, '').trim();
                        outputContent += `// Imported from '${require}'${EOL}${current}${EOL}`;

                        continue;
                     }

                     if (!!typeVAR) outputContent += `// Imported from '${require}'${EOL}${typeVAR} ${isPipe ? nameVarPipe : key} = ${evalResources[key]};${EOL}`;
                     else console.log(`${sh.red}⚠${sh.reset} Bad module call in "${sh.yellow}${file}${sh.reset}": ${getLine$1(requireds[required], backup)}`);
                  } else if (!typeVAR) {

                     console.log(`${sh.red}⚠${sh.reset} No variable type defined for the module in "${sh.yellow}${file}${sh.reset}": ${getLine$1(requireds[required], backup)}`);
                  }
               }

               requiredModules.forEach(wrongModule => {

                  if (evalResources[wrongModule]) return;

                  console.log(`${sh.red}⚠${sh.reset} "${wrongModule}" not found in "${sh.yellow}${require}${sh.reset}". Line: ${getLine$1(wrongModule, backup)} from "${sh.yellow}${file}${sh.reset}"`);
               });

            } else if (typeof evalResources === 'function') {

               const typeVAR = requireds[required].match(/const|let|var/gim) || false;
               const nameVAR = /(const|let|var).*?(?<nameVAR>\w+)/.exec(requireds[required])?.groups?.nameVAR || false;

               if (!!typeVAR && !!nameVAR) outputContent += `// Imported from '${require}'${EOL}${typeVAR} ${nameVAR} = ${evalResources};`;
               else {

                  outputContent += `// Imported from '${require}'${EOL}${evalResources.toString()}${EOL}`;
               }
            }
         } else {

            current = current.replace(/([^:\/\/])(\/{2}.*?)|((\/\*[\s\S]*?\*\/|^\s*$))/gim, '').trim();
            outputContent += `// Imported from '${require}'${EOL}${current}${EOL}`;
         }

         /* Recursive Library */
         if (regex.test(outputContent)) outputContent = await recursive_require(require, replace);

         content = content.replace(requireds[required], outputContent);
      }
      catch (e) {

         console.log(`${sh.red}⚠${sh.reset} ${e}`);
      }
   }

   return content;
}

async function processJS(file, local = false, replace = 'start') {

   const _ = /\.library/.test(file) ? true : false;

   if (_) {

      const filename =  file.split(sep).pop().replace(/.js/, '');
      const regex = RegExp(`require.*?${filename}`);
      const files = await listFiles(source, 'js', requiredResources);

      for (const file in files) {

         const content = fs.readFileSync(files[file], 'utf8');
         if (regex.test(content)) processJS(files[file], local);
      }

      return;
   }

   /* ------------------------------------------------------------- */

   const localTo = !local ? to : local;
   const tempDIR = `temp_${(new Date()).valueOf().toString()}`;
   const pre = file.replace(source, tempDIR);
   const tempJS = path(pre);
   const final = file.replace(source, localTo);

   createDir([ tempDIR, tempJS, tempJS.replace(tempDIR, localTo) ]);

   async function pre_process() {

      const exclude_files = process_files?.js?.exclude?.requireBrowser || false;
      let result = false;

      if (exclude_files) {

         for (const exclude of exclude_files) {

            if (vReg(exclude).test(file)) {

               result = true;
               break;
            }
         }
      }

      const content = !result ? await recursive_require(file, replace) : await post_process({ src: file, response: true, local: replace });

      /* Final Build File */
      fs.writeFileSync(pre, content);
   }

   async function process() {

      let error = false;

      if (no_process(pre)) return;

      if (process_files?.js?.babel) {

         const request = await exec(`npx --quiet babel "${pre}" -o "${pre}"`); // Babel
         if (!request) error = true;
      }

      if (process_files?.js?.uglify) {

         const request = await exec(`npx --quiet uglifyjs "${pre}" -o "${pre}" -c -m`); // Uglify
         if (!request) error = true;
      }

      return error;
   }

   async function post_process$1() {

      let content = fs.readFileSync(pre, 'utf8');
      fs.writeFileSync(final, content);
   }

   /* ------------------------------------------------------------- */

   await pre_process();
   const request = await process();
   await post_process$1();

   if (fs.existsSync(tempDIR)) await exec(`rm -rf ./${tempDIR}`);

   return !request;
}

const processPHP = content => {

   if (!content || content?.trim().length === 0) return '';
   else if (!process_files?.php?.minify) return content;

   try {

      /* Gera uma cópia do conteúdo original a ser processado */
      let new_content = content;

      /* Guarda strings do conteúdo na memória */
      const strings_PHP = new_content.match(/(('.*?')|(".*?")|(`.*?`))/gim);
      const backup_strings_PHP = { };

      /* Gera e substitui cada string por um ID */
      for (const key in strings_PHP) {

         const id = `"${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}"`;

         backup_strings_PHP[id] = strings_PHP[key];
         new_content = new_content.replace(strings_PHP[key], id);
      }

      /* Compacta o conteúdo */
      new_content = new_content
         .replace(/(\/\*[\s\S]*?\*\/)|(\/{2}.*)|(\<!--[^\[][\w\W]*?-->)/gim, '') // remove comentários PHP e HTML
         .replace(/[\s]{2,}|[\n]{1,}|[\r]{1,}|[\t]{1,}/gim, ' ') // remove quebras de linhas
         .replace(/(<\?\s)|(<\?\n)|(<\?\r)|(<\?\t)/gim, '<?php ') // transcreve <? para <?php
         .replace(/\s{\s|\s{|{\s/gim, '{') // remove espaços entre {
         .replace(/\s}\s|\s}|}\s/gim, '}') // remove espaços entre }
         .replace(/\s\(\s|\s\(|\(\s/gim, '(') // remove espaços entre (
         .replace(/\s\)\s|\s\)|\)\s/gim, ')') // remove espaços entre )
         .replace(/\s\[\s|\s\[|\[\s/gim, '[') // remove espaços entre [
         .replace(/\s\]\s|\s\]|\]\s/gim, ']') // remove espaços entre ]
         .replace(/\s;\s|\s;|;\s/gim, ';') // remove espaços entre ;
         .replace(/\s:\s|\s:|:\s/gim, ':') // remove espaços entre :
         .replace(/\s-\s|\s-|-\s/gim, '-') // remove espaços entre -
         .replace(/\s\+\s|\s\+|\+\s/gim, '+') // remove espaços entre +
         .replace(/\s\*\s|\s\*|\*\s/gim, '*') // remove espaços entre *
         .replace(/\s\/\s|\s\/|\/\s/gim, '/') // remove espaços entre /
         .replace(/\s%\s|\s%|%\s/gim, '%') // remove espaços entre %
         .replace(/\s!\s|\s!|!\s/gim, '!') // remove espaços entre !
         .replace(/\s\?\s|\s\?|\?\s/gim, '?') // remove espaços entre ?
         .replace(/\s=\s|\s=|=\s/gim, '=') // remove espaços entre =
         .replace(/\s<\s|\s<|<\s/gim, '<') // remove espaços entre <
         .replace(/\s>\s|\s>|>\s/gim, '>') // remove espaços entre >
         .replace(/\s\^\s|\s\^|\^\s/gim, '^') // remove espaços entre ^
         .replace(/\sAND\s|\sAND|AND\s/gim, 'AND') // remove espaços entre AND, And ou and
         .replace(/\sOR\s|\sOR|OR\s/gim, 'OR') // remove espaços entre OR, Or ou or
         .replace(/\sXOR\s|\sXOR|XOR\s/gim, 'XOR') // remove espaços entre XOR, Xor ou xor
         .replace(/\s&\s|\s&|&\s/gim, '&') // remove espaços entre &
         .replace(/\s\|\s|\s\||\|\s/gim, '|') // remove espaços entre |
         .replace(/\s\.\s|\s\.|\.\s/gim, '.') // remove espaços entre .
         .replace(/\s,\s|\s,|,\s/gim, ',') // remove espaços entre ,
         .replace(/\s'\s|\s'|'\s/gim, '\'') // remove espaços entre '
         .replace(/\s"\s|\s"|"\s/gim, '"') // remove espaços entre "
         .replace(/\s`\s|\s`|`\s/gim, '`') // remove espaços entre `
         .replace(/<\?=\s/gim, '<?=') // remove espaço após <?=
         .replace(/ \?>/gim, '?>') // remove espaço antes de ?>
         .replace(/<\?php/gim, '<?php ') // corrige espaço após <?php
         .replace(/(?:\s)\s/gim, ' ') // remove espaços duplicados
         .replace(/^\s.?\s|[\s]{1,}$/gim, '') // regex similar à função trim()
      ;

      /* Recupera os dados das strings */
      for (const id in backup_strings_PHP) new_content = new_content.replace(id, backup_strings_PHP[id]);

      /* Recupera novo conteúdo se tudo ocorreu corretamente */
      if (!!new_content) content = new_content.trim();
   }
   catch(e) {

      /* Em caso de erro, será retornado o conteúdo original */
   }
   finally {

      return content;
   }
};

const processHTACCESS = content => {

   if (!content || content?.trim().length === 0) return '';
   else if (!process_files?.htaccess?.minify) return content;

   try {

      /* Gera uma cópia do conteúdo original a ser processado */
      let new_content = content;

      /* Compacta o conteúdo */
      new_content = content
         .replace(/#.*/gim, '') // remove comentários
         .replace(/^\s+|\s+$/gim, '\r\n') // remove espaços desnecessários
         .replace(/(\t{2,})|(\r{2,})|(\n{2,})/gim, '') // remove linhas e espaços vazios
         .replace(/^\s.?\s|[\s]{1,}$/gim, '') // regex similar à função trim()
      ;

      /* Recupera novo conteúdo se tudo ocorreu corretamente */
      if (!!new_content) content = new_content.trim();
   }
   catch(e) {

      /* Em caso de erro, será retornado o conteúdo original */
   }
   finally {

      return content;
   }

};

function getLine(search, content) {

   const index = content.indexOf(search);
   const tempString = content.substring(0, index);

   return tempString.split(EOL).length;
}

const putHTML = (content, file) => {

   const importRegex = /<!--.*?import\(("|')(.*)("|')\).*?-->/gim;
   const getImports = content.match(importRegex) || [ ];

   if (getImports.length > 0) {

      const backup = content;

      getImports.forEach(importHTML => {

         const extractPath = /<!--.*?import\(("|')(?<import>.*)("|')\).*?-->/gim.exec(importHTML)?.groups?.import || false;
         const finalPath = normalize(`${dirname(file)}/${extractPath.replace(/(^\.?\/)/gm, '')}`);
         const toReplace = vReg(importHTML, 'gim');

         if (!fs.existsSync(finalPath)) {

            console.log(`${sh.red}⚠${sh.reset} "${sh.cyan}${extractPath}${sh.reset}" not found. Line ${getLine(importHTML, backup)} from "${sh.cyan}${file}${sh.reset}"`);
            return;
         }

         let toImport = fs.readFileSync(finalPath, 'utf-8');

         if (importRegex.test(toImport)) toImport = putHTML(toImport, finalPath);

         content = content.replace(toReplace, toImport);
      });
   }

   return content;
};

const processHTML = async (content, file) => {

   const exclude_require = process_files?.html?.exclude?.htmlImport || false;

   let doImport = true;

   if (exclude_require) {

      for (const exclude of exclude_require) {

         if (RegExp(exclude, 'gm').test(basename(file))) {

            doImport = false;
            break;
         }
      }
   }

   /* Check if other files need this file */
   (async () => {

      if (!doImport) return;

      const dirs = dirname(file).split(sep);
      const srcFile = basename(file);
      const preRegex = dirs.map(dir => `(${dir}\/)?`);
      const finalRegex = new RegExp(`${preRegex.join('')}${srcFile}`, 'gim');
      const files = await listFiles(source, 'html');

      for (const searchFile of files) {

         if (searchFile === file) continue;

         const searchContent = fs.readFileSync(searchFile, 'utf-8');

         if (searchContent.match(finalRegex)) fs.writeFileSync(searchFile.replace(source, to), await processHTML(searchContent, searchFile));
      }
   })();

   if (doImport) content = putHTML(content, file);

   if (!process_files?.html?.minify) return content;

   try {

      const new_content = minify(content, {

         removeAttributeQuotes: false,
         removeComments: true,
         minifyCSS: true,
         minifyJS: true,
         preserveLineBreaks: false,
         collapseWhitespace: true,
         // conservativeCollapse: true
      });

      if (!!new_content) content = new_content.trim();
   }
   catch(e) {

      /* In case of error, the original content will be returned */
   }
   finally {

      const import_like_scss = process_files?.html?.htmlImportLikeSass || false;

      if (import_like_scss && /^_(.*).html$/.test(basename(file))) return 'skip-this-file';

      if (!content || content?.trim().length === 0) return '';

      return content;
   }
};

const rmTemp = async () => {
   const currentDir = fs.readdirSync('./');

   for (const dir of currentDir) {
      if (!/^temp_/.test(dir)) continue;

      await exec(`rm -rf ./${dir}`);
   }
};

(async () => {

   const loading = new draft(`${sh.bold}Building`, 'circle');

   await deleteDS_Store();

   const to = build.output;
   const final = to.replace(/^\./, '');

   await watchClose();

   try {

      async function buildFiles() {

         const files = await listFiles(source);
         const types = [];
         const typesOver = [];

         let count = 0;
         let blacklistCount = 0;

         for (const file of files) {

            const type = `.${file.split('.').pop()}`;

            if (type.length >= 10 || types.length >= 10) {

               if (!typesOver.includes(type)) typesOver.push(type);
               continue;
            }

            if (!types.includes(type)) types.push(type);
         }

         const moreTypes = typesOver.length > 0 ? ` and ${typesOver.length} more` : '';
         const loading = new draft('', `dots`, false);
         const prefix = () => `Compiling ${sh.bold}${sh.blue}${count}${sh.reset}${sh.dim}${sh.white} of ${sh.reset}${sh.bold}${sh.blue}${files.length}${sh.reset} files: `;

         loading.start();

         if (files.length === 0) {

            loading.stop(1, 'Nothing to compile');
            return;
         }

         for (const file of files) {

            const inBlacklist = blacklist.some(item => !!file.match(vReg(item, 'gi')));
            if (inBlacklist) {

               blacklistCount++;

               continue;
            }

            loading.string = `${prefix()}${sh.blue}${file}`;

            const fileType = file.split('.').pop().toLowerCase();
            const finalFile = file.replace(source, to);

            let pathFile = file.split(sep); pathFile.pop(); pathFile = pathFile.join(sep);

            /* pre processed files */
            if (fileType === 'js') await processJS(file, to, 'build', false);
            else if (fileType === 'scss' || fileType === 'css') await processCSS(file, to, 'build');
            else {

               /* post process */
               const original = await post_process({ src: file, response: true, local: 'build', to: finalFile });
               let minified = false;

               if (original !== 'skip-this-file') {

                  /* specials */
                  if (!no_process(file)) {

                     if (fileType === 'php' || fileType === 'phtml') minified = await processPHP(original);
                     else if (fileType === 'html')  minified = await processHTML(original, file);
                     else if (fileType === 'htaccess')  minified = await processHTACCESS(original);
                  }

                  if (minified !== 'skip-this-file') {

                     createDir(pathFile.replace(source, to));
                     fs.writeFileSync(finalFile, !minified ? original : minified);
                  }
               }
            }

            count++;
         }

         loading.stop(1, `${prefix()}${sh.blue}${types.join(', ')}${moreTypes}`);
         if (blacklistCount > 0) console.log(`${sh.blue}ℹ ${sh.reset}${sh.bold}${blacklistCount}${sh.reset} file(s) in Blacklist`);
      }

      async function resolveConflicts() {

         const loading = new draft(`Resolving possible conflicts`);

         if (fs.existsSync(`${final}.zip`)) fs.unlinkSync(`${final}.zip`);
         if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });

         loading.stop(1);
      }

      async function gerarDeploy() {

         const loading = new draft(`Compressing built files`);

         try {

            const files = await listFiles(to) || [];
            const output = fs.createWriteStream(`${final}.zip`);
            const archive = archiver('zip', { zlib: { level: build?.level || 0 } });

            archive.pipe(output);
            for (const file of files) archive.file(file, { name: file });
            await archive.finalize();

            loading.stop(1, `Successfully compressed into: ${sh.underscore}${sh.blue}${sh.bold}./${final}.zip`);
         }
         catch (error) {

            loading.stop(1, `Nothing to compress`);
         }
      }

      async function clearTemp() {

         const loading = new draft(`Deleting temporary files`);

         await rmTemp();

         if (fs.existsSync(`${source}${sep}exit`)) fs.unlinkSync(`${source}${sep}exit`);
         if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });

         loading.stop(1);
      }

      function msToTime(s) {

         function pad(n, z) {

            z = z || 2;

            return ('00' + n).slice(-z);
         }

         const ms = s % 1000;
         s = (s - ms) / 1000;
         const secs = s % 60;
         s = (s - secs) / 60;
         const mins = s % 60;
         const hrs = (s - mins) / 60;

         return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
      }

      /* Início */
      console.log();
      const startTime = performance.now();

      await resolveConflicts();
      await buildFiles();
      await gerarDeploy();
      await clearTemp();

      console.log();
      loading.stop(1, `Finished in ${sh.green}${msToTime(performance.now() - startTime)}`);
   }
   catch(e) {

      loading.stop(0, `${sh.red}Error: ${sh.reset}${e}`);
      process.exit(1);
   }
})();
