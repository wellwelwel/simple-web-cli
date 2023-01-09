import fs from 'fs';
import { normalize, dirname, resolve, sep, join, win32, extname, basename } from 'path';
import DraftLog from 'draftlog';
import { platform, EOL } from 'os';
import watch from 'node-watch';
import { Client } from 'basic-ftp';
import http2 from 'http2';
import { exec as exec$1 } from 'child_process';
import uglifycss from 'uglifycss';
import { minify } from 'html-minifier';

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
const colorByType = {
  html: sh.cyan,
  php: sh.magenta,
  css: sh.blue,
  scss: sh.blue,
  js: sh.yellow
};
function type(file, ext = false) {
  let type;
  if (file.includes('.html')) type = 'html';else if (file.includes('.php')) type = 'php';else if (file.includes('.css')) type = 'css';else if (file.includes('.scss')) type = 'scss';else if (file.includes('.js')) type = 'js';
  if (ext) return `${colorByType[type] || sh.cyan}${type?.toUpperCase() ? type.toUpperCase() : file.split('.').pop().toUpperCase() || '??'}`;else return colorByType[type] || sh.white;
}
class draft {
  constructor(string, style = 'dots', start = true) {
    this.string = string;
    this.loading = {
      dots: ['⠋', '⠋', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
      circle: ['◜', '◠', '◝', '◞', '◡', '◟']
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

var createDir = (directory => {
  const directorys = [];
  if (typeof directory === 'string') directorys.push(directory);else if (typeof directory === 'object') Object.assign(directorys, directory);
  directorys.forEach(dir => {
    dir = normalize(dir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
      recursive: true
    });
  });
});

const isWindows = platform() === 'win32';
(() => {
  const meta = dirname(decodeURI(new URL(import.meta.url).pathname));
  const currentPath = isWindows ? meta.substring(1) : meta;
  const paths = currentPath.split('/');
  const rootIndex = paths.lastIndexOf('simple-web-cli');
  return resolve(paths.splice(0, rootIndex + 1).join(sep));
})();
const cwd = normalize(`file:///${process.cwd()}`);

const setConfig = async () => {
  const [,, ...args] = process.argv;
  const arg = args[0]?.replace(/-/g, '') || 'start';
  const config = await import(join(`./${cwd}`, '.swrc.js'));
  const output = {
    ...{},
    ...config.default
  };
  const isValid = arr => !arr.some(validation => validation === false);
  const validations = {
    ftp: [!!output?.ftp, !!output?.ftp?.start, typeof output?.ftp?.start?.root === 'string', typeof output?.ftp?.start?.host === 'string' && output?.ftp?.start?.host?.trim().length > 0, typeof output?.ftp?.start?.user === 'string' && output?.ftp?.start?.user?.trim().length > 0, typeof output?.ftp?.start?.pass === 'string' && output?.ftp?.start?.pass?.trim().length > 0, output?.ftp?.start?.secure === 'explict' || output?.ftp?.start?.secure === true]
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
  if (source.substring(source.length - 1, source.length) === sep) source = source.substring(0, source.length - 1);
  if (to.substring(to.length - 1, to.length) === sep) to = to.substring(0, to.length - 1);
  const dev = {
    ftp: output.ftp.start
  };
  const dist = {
    ftp: output.ftp.build
  };
  const process_files = arg === 'build' && output?.build?.compile ? output.build.compile : output.start.compile;
  const build = output?.build || false;
  const plugins = output?.plugins || false;
  const options = output?.options || false;
  const blacklist = output.hasOwnProperty('blacklist') ? output.blacklist : [] || [];
  createDir([source, to]);
  return {
    source,
    to,
    dev,
    dist,
    process_files,
    build,
    options,
    plugins,
    blacklist
  };
};
const {
  source,
  to,
  dev,
  dist,
  process_files,
  build,
  options,
  plugins,
  blacklist
} = await setConfig();

var watchClose = (async () => {
  fs.writeFileSync(`${source}${sep}exit`, '');
  if (fs.existsSync(`${source}${sep}exit`)) fs.unlinkSync(`${source}${sep}exit`);
});

var isConnected = (async (url = 'https://www.google.com/') => {
  function isConnected() {
    try {
      return new Promise(resolve => {
        const client = http2.connect(url);
        client.on('connect', () => {
          resolve(true);
          client.destroy();
        });
        client.on('error', () => {
          resolve(false);
          client.destroy();
        });
      });
    } catch {}
  }
  return await isConnected();
});

var serverOSNormalize = (path => {
  if (dev['is-windows-server']) return win32.normalize(path);
  path = path.replace(/\\\\/g, '/');
  path = path.replace(/\\/g, '/');
  return path;
});

const client = new Client();
const publicCachedAccess = {};
const privateCachedAccess = {};
async function reconnect() {
  await connect();
}
async function connect(access = false) {
  client.error = false;
  if (access !== false) {
    Object.assign(privateCachedAccess, access);
    publicCachedAccess.root = access.root;
  }
  try {
    if (await isConnected()) {
      await client.access({
        host: privateCachedAccess.host,
        port: privateCachedAccess?.port || 21,
        user: privateCachedAccess.user,
        password: privateCachedAccess.pass,
        root: privateCachedAccess.root,
        secure: privateCachedAccess.secure,
        secureOptions: {
          rejectUnauthorized: false
        },
        passvTimeout: 10000,
        keepalive: 30000
      });
    }
    return true;
  } catch (err) {
    client.error = `${sh.reset}${sh.red}${err}`;
    return false;
  }
}
async function send(file, waiting) {
  const receiver = file.replace(`${to}${sep}`, '');
  try {
    client.error = false;
    if (client.closed) await reconnect();
    const dir = serverOSNormalize(dirname(`${privateCachedAccess.root}${sep}${receiver}`));
    const exists = async () => {
      try {
        return (await client?.list(dir))?.length > 0 || false;
      } catch (e) {
        return false;
      }
    };
    if (!(await exists())) await client.ensureDir(dir);
    await client.uploadFrom(file, serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`));
    await new Promise(resolve => {
      const timer = setInterval(() => {
        if (!waiting?.scheduling?.started) {
          clearInterval(timer);
          resolve();
        }
      });
    });
    return true;
  } catch (err) {
    client.error = `${sh.dim}${sh.red}${err} > ` + serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`);
    return false;
  }
}
async function remove(file, isDir = false) {
  try {
    client.error = false;
    const receiver = file.replace(`${to}${sep}`, '');
    if (client.closed) await reconnect(file);
    !isDir ? await client.remove(normalize(`${privateCachedAccess.root}${sep}${receiver}`)) : await client.removeDir(serverOSNormalize(`${privateCachedAccess.root}${sep}${receiver}`));
    return true;
  } catch (err) {
    client.error = `${sh.dim}${sh.red}${err}`;
    return false;
  }
}
var FTP = {
  client,
  publicCachedAccess,
  connect,
  send,
  remove
};

var empty = (str => str?.trim().length === 0 ? true : false);

var exec = (cmd => new Promise(resolve => exec$1(cmd, error => resolve(!!error ? false : true))));

var deleteDS_Store = (async () => {
  if (process.platform !== 'darwin') return;
  await exec('find . -name ".DS_Store" -type f -delete');
});

function vReg(string, options = 'g') {
  const validate_string = string.replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\$/g, '\\$').replace(/\+/g, '\\+').replace(/\?/g, '\\?').replace(/\|/g, '\\|').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\{/g, '\\{').replace(/\}/g, '\\}');
  return new RegExp(validate_string, options);
}

function path(file) {
  const path = file.split(sep);
  path.pop();
  return path.join(sep);
}

class ListFiles {
  constructor() {
    this.files = [];
    this.excludeDir = [];
    this.isTypeExpected = (file, expected) => {
      if (expected === false) return true;
      let isValid = false;
      const types = [];
      const currentFileType = file.split('.').pop();
      if (typeof expected === 'string') types.push(expected);else if (typeof expected === 'object') Object.assign(types, expected);
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
        if (this.excludeDir.includes(directory)) return false;else if (stat.isDirectory()) await this.getFiles(`${directory}${sep}${filesList[file]}`, type);else if (this.isTypeExpected(filesList[file], type)) this.files.push(`${directory}${sep}${filesList[file]}`);
      }
      return this.files;
    };
  }
}
const listFiles = async (directory, type = false, excludeDir = false, excludeType = false) => {
  const files = new ListFiles();
  const list = await files.getFiles(directory, type, excludeDir);
  files.files = [];
  return list;
};

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

var resourceReplace = ((file, local) => {
  if (!plugins) return false;
  const resources = plugins?.resourceReplace || false;
  if (!resources?.replace?.[local]) return false;
  const src = resources?.src || '.resources';
  const dest = file.replace(source, src);
  if (!fs.existsSync(dest)) return false;
  return dest;
});

const post_process = async (options = {}) => {
  const rejectTypes = [/\.tiff$/i, /\.tif$/i, /\.bmp$/i, /\.jpg$/i, /\.jpeg$/i, /\.jpe$/i, /\.jfif$/i, /\.png$/i, /\.gif$/i, /\.webp$/i, /\.avif$/i, /\.psd$/i, /\.psb$/i, /\.exif$/i, /\.raw$/i, /\.ai$/i, /\.crd$/i, /\.eps$/i, /\.woff$/i, /\.woff2$/i, /\.eot$/i, /\.otd$/i, /\.otf$/i, /\.ttf$/i, /\.ttc$/i, /\.avi$/i, /\.wmv$/i, /\.mov$/i, /\.flv$/i, /\.rm$/i, /\.mp4$/i, /\.mkv$/i, /\.mks$/i, /\.3gpp$/i, /\.aac$/i, /\.ac3$/i, /\.ac4$/i, /\.mp3$/i, /\.m4a$/i, /\.aiff$/i, /\.wav$/i, /\.ogg$/i, /\.alac$/i, /\.flac$/i, /\.pcm$/i, /\.pdf$/i, /\.xlsx$/i, /\.xltx$/i, /\.xlsm$/i, /\.xltm$/i, /\.xlsb$/i, /\.xls$/i, /\.xlt$/i, /\.xlam$/i, /\.xla$/i, /\.xlw$/i, /\.xla$/i, /\.xlr$/i, /\.ods$/i, /\.doc$/i, /\.docx$/i, /\.odt$/i, /\.dot$/i, /\.dotm$/i, /\.xps$/i, /\.wps$/i, /\.pptx$/i, /\.pptm$/i, /\.ppt$/i, /\.potx$/i, /\.potm$/i, /\.pot$/i, /\.ppsx$/i, /\.ppsm$/i, /\.pps$/i, /\.ppam$/i, /\.ppa$/i, /\.wmf$/i, /\.emf$/i, /\.rtf$/i, /\.odp$/i, /\.zip(\.[0-9]{1,})?$/i, /\.rar(\.[0-9]{1,})?$/i, /\.7z$/i, /\.z[0-9]{1,}?$/i, /\.gz$/i, /\.z$/i, /\.tar$/i, /\.tgz$/i, /\.bz2$/i, /\.(z|gz|tar|tgz|bz2)\.part/i];
  const config = {
    src: options.src || false,
    to: options.to || false,
    local: options.local || 'start',
    response: options.response || false
  };
  const {
    src,
    to,
    local,
    response
  } = config;
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
    } catch (e) {
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
          const regex = RegExp(string.replace(/\*/gim, '\\*'), 'gim');
          let stringToReplace = get_replaces?.strings[string][local];
          if (!stringToReplace || empty(stringToReplace)) {
            if (local === 'start' && !empty(get_replaces.strings[string]['build'])) stringToReplace = get_replaces.strings[string]['build'];else if (local === 'build' && !empty(get_replaces.strings[string]['start'])) stringToReplace = get_replaces.strings[string]['start'];else stringToReplace = '';
          }
          if (stringToReplace || empty(stringToReplace)) new_content = new_content.replace(regex, stringToReplace);
        }
      }
      if (!!new_content) content = new_content;
    }
  } catch (e) {} finally {
    if (response === true) return content;else fs.writeFileSync(to, content);
  }
};

async function processCSS(file, local = false, replace = 'start') {
  const _ = file.split(sep).pop().substr(0, 1) === '_' ? true : false;
  const fileType = file.split('.').pop().toLowerCase();
  const tempDIR = `temp_${new Date().valueOf().toString()}`;
  if (fileType === 'scss' && process_files.hasOwnProperty('scss') && process_files.scss === false) {
    createDir([path(file.replace(source, to))]);
    fs.copyFileSync(file, file.replace(source, to));
    return true;
  }
  if (_ && fileType === 'scss') {
    const files = await listFiles(source, 'scss');
    const filename = file.split(sep).pop().replace(/_/, '').replace(/.scss/, '');
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
  createDir([tempPath, tempPath.replace(tempDIR, localTo)]);
  let request;
  if (fileType === 'scss') {
    request = await exec(`npx sass --quiet "${file}":"${tempCSS}" --no-source-map${process_files.css.uglifycss && process ? ' --style compressed' : ''}`);
  } else if (fileType === 'css') {
    fs.copyFileSync(file, tempCSS);
    request = true;
  }
  let content = `/* autoprefixer grid: autoplace */ ${await post_process({
    src: tempCSS,
    response: true,
    local: replace
  })}`;
  fs.writeFileSync(tempCSS, content);
  if (process && process_files.css.autoprefixer) await exec(`npx postcss "${tempCSS}" --use autoprefixer -o "${tempCSS}" --no-map`);
  const uglified = process_files.css.uglifycss && process ? uglifycss.processFiles([tempCSS], {
    uglyComments: true
  }) : fs.readFileSync(tempCSS, 'utf8');
  fs.writeFileSync(final, uglified);
  if (fs.existsSync(tempDIR)) await exec(`rm -rf ./${tempDIR}`);
  return request;
}

async function recursive_require(file, replace) {
  return await post_process({
    src: file,
    response: true,
    local: replace
  });
}
async function processJS(file, local = false, replace = 'start') {
  const localTo = !local ? to : local;
  const tempDIR = `temp_${new Date().valueOf().toString()}`;
  const pre = file.replace(source, tempDIR);
  const tempJS = path(pre);
  const final = file.replace(source, localTo).replace(/\.ts$/, '.js');
  createDir([tempDIR, tempJS, tempJS.replace(tempDIR, localTo)]);
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
    const content = !result ? await recursive_require(file, replace) : await post_process({
      src: file,
      response: true,
      local: replace
    });
    fs.writeFileSync(pre, content);
  }
  async function process() {
    let error = false;
    if (no_process(pre)) return;
    if (process_files?.js?.babel) {
      const request = await exec(`npx --quiet rollup -i "${pre}" -o "${pre}" -f "iife" -c`);
      if (!request) error = true;
    }
    if (process_files?.js?.uglify) {
      const request = await exec(`npx --quiet uglifyjs "${pre}" -o "${pre}" -c -m`);
      if (!request) error = true;
    }
    return error;
  }
  async function post_process$1() {
    let content = fs.readFileSync(pre, 'utf8');
    fs.writeFileSync(final, content);
  }
  await pre_process();
  const request = await process();
  await post_process$1();
  if (fs.existsSync(tempDIR)) await exec(`rm -rf ./${tempDIR}`);
  return !request;
}

const processPHP = content => {
  if (!content || content?.trim().length === 0) return '';else if (!process_files?.php?.minify) return content;
  try {
    let new_content = content;
    const strings_PHP = new_content.match(/(('.*?')|(".*?")|(`.*?`))/gim);
    const backup_strings_PHP = {};
    for (const key in strings_PHP) {
      const id = `"${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}"`;
      backup_strings_PHP[id] = strings_PHP[key];
      new_content = new_content.replace(strings_PHP[key], id);
    }
    new_content = new_content.replace(/(\/\*[\s\S]*?\*\/)|(\/{2}.*)|(\<!--[^\[][\w\W]*?-->)/gim, '').replace(/[\s]{2,}|[\n]{1,}|[\r]{1,}|[\t]{1,}/gim, ' ').replace(/(<\?\s)|(<\?\n)|(<\?\r)|(<\?\t)/gim, '<?php ').replace(/\s{\s|\s{|{\s/gim, '{').replace(/\s}\s|\s}|}\s/gim, '}').replace(/\s\(\s|\s\(|\(\s/gim, '(').replace(/\s\)\s|\s\)|\)\s/gim, ')').replace(/\s\[\s|\s\[|\[\s/gim, '[').replace(/\s\]\s|\s\]|\]\s/gim, ']').replace(/\s;\s|\s;|;\s/gim, ';').replace(/\s:\s|\s:|:\s/gim, ':').replace(/\s-\s|\s-|-\s/gim, '-').replace(/\s\+\s|\s\+|\+\s/gim, '+').replace(/\s\*\s|\s\*|\*\s/gim, '*').replace(/\s\/\s|\s\/|\/\s/gim, '/').replace(/\s%\s|\s%|%\s/gim, '%').replace(/\s!\s|\s!|!\s/gim, '!').replace(/\s\?\s|\s\?|\?\s/gim, '?').replace(/\s=\s|\s=|=\s/gim, '=').replace(/\s<\s|\s<|<\s/gim, '<').replace(/\s>\s|\s>|>\s/gim, '>').replace(/\s\^\s|\s\^|\^\s/gim, '^').replace(/\sAND\s|\sAND|AND\s/gim, 'AND').replace(/\sOR\s|\sOR|OR\s/gim, 'OR').replace(/\sXOR\s|\sXOR|XOR\s/gim, 'XOR').replace(/\s&\s|\s&|&\s/gim, '&').replace(/\s\|\s|\s\||\|\s/gim, '|').replace(/\s\.\s|\s\.|\.\s/gim, '.').replace(/\s,\s|\s,|,\s/gim, ',').replace(/\s'\s|\s'|'\s/gim, "'").replace(/\s"\s|\s"|"\s/gim, '"').replace(/\s`\s|\s`|`\s/gim, '`').replace(/<\?=\s/gim, '<?=').replace(/ \?>/gim, '?>').replace(/<\?php/gim, '<?php ').replace(/(?:\s)\s/gim, ' ').replace(/^\s.?\s|[\s]{1,}$/gim, '');
    for (const id in backup_strings_PHP) new_content = new_content.replace(id, backup_strings_PHP[id]);
    if (!!new_content) content = new_content.trim();
  } catch (e) {} finally {
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
  const getImports = content.match(importRegex) || [];
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
      collapseWhitespace: true
    });
    if (!!new_content) content = new_content.trim();
  } catch (e) {} finally {
    const import_like_scss = process_files?.html?.htmlImportLikeSass || false;
    if (import_like_scss && /^_(.*).html$/.test(basename(file))) return 'skip-this-file';
    if (!content || content?.trim().length === 0) return '';
    return content;
  }
};

const processHTACCESS = content => {
  if (!content || content?.trim().length === 0) return '';else if (!process_files?.htaccess?.minify) return content;
  try {
    let new_content = content;
    new_content = content.replace(/#.*/gim, '').replace(/^\s+|\s+$/gim, '\r\n').replace(/(\t{2,})|(\r{2,})|(\n{2,})/gim, '').replace(/^\s.?\s|[\s]{1,}$/gim, '');
    if (!!new_content) content = new_content.trim();
  } catch (e) {} finally {
    return content;
  }
};

class Schedule {
  constructor() {
    this.scheduling = {
      busy: false,
      queuing: [],
      started: false,
      current: '',
      exceed: []
    };
    this.queue = function (callback, name = '') {
      const {
        queuing,
        exceed
      } = this.scheduling;
      if (this.scheduling.started === false) {
        queuing.push({
          name: name,
          service: callback
        });
      } else {
        exceed.push({
          name: name,
          service: callback
        });
      }
    };
    this.start = async function (options) {
      const set_options = {
        type: options?.type || 'recursive',
        timeInterval: options?.timeInterval || 0,
        recursive: options?.recursive || true
      };
      this.scheduling.started = true;
      const {
        queuing,
        exceed
      } = this.scheduling;
      const recursive = async () => {
        const waiting = setInterval(async () => {
          for (const key in queuing) {
            if (this.scheduling.busy === true) return;
            this.scheduling.busy = true;
            this.scheduling.current = queuing[key].name;
            await queuing[key].service();
            queuing.splice(queuing[key], 1);
            this.scheduling.busy = false;
          }
          if (queuing.length === 0) {
            if (exceed.length > 0) queuing.push(exceed.shift());else if (exceed.length === 0) {
              this.scheduling.started = false;
              clearInterval(waiting);
              if (this.scheduling?.file) delete this.scheduling.file;
            }
          }
        }, set_options.timeInterval);
      };
      const timeInterval = () => {
        let timer = 0;
        for (const key in queuing) setTimeout(async () => await queuing[key].service(), timer += set_options.timeInterval);
      };
      set_options.type === 'recursive' === true ? await recursive() : timeInterval();
    };
  }
}

var autoDeploy = (async () => {
  const loading = {
    ftp: new draft('', `circle`, false)
  };
  console.log();
  loading.ftp.start();
  loading.ftp.string = `${sh.bold}FTP:${sh.reset} ${sh.dim}Connecting`;
  const {
    host,
    user,
    pass
  } = dev.ftp;
  const pre_connect = !empty(host) || !empty(user) || !empty(pass);
  const conn = pre_connect ? await FTP.connect(dev.ftp) : false;
  if (!conn) {
    FTP.client.close();
    loading.ftp.stop(3, `${sh.dim}${sh.bold}FTP:${sh.reset}${sh.dim} No connected`);
  } else loading.ftp.stop(1, `${sh.bold}FTP:${sh.reset} ${sh.dim}Connected`);
  const deploy = new Schedule();
  const watcherSource = watch(source, {
    recursive: true
  });
  const watcherMain = watch(to, {
    recursive: true
  });
  const onSrc = async (event, file) => {
    if (!!file.match(/DS_Store/)) {
      await deleteDS_Store();
      return;
    }
    if (file === `${source}${sep}exit`) {
      FTP.client.close();
      watcherSource.close();
      watcherMain.close();
      process.exit(0);
    }
    const inBlacklist = blacklist.some(item => !!file.match(vReg(item, 'gi')));
    if (inBlacklist) {
      console.log(`${sh.blue}ℹ${sh.reset} Ignoring file in blacklist: "${sh.bold}${file}${sh.reset}"`);
      return;
    }
    const isDir = file.split(sep).pop().includes('.') ? false : true;
    if (event == 'update' && isDir) return;
    if (!deploy.scheduling?.file) deploy.scheduling.file = file;else if (deploy.scheduling.file === file) return;
    const log = {
      building: new draft('', `dots`, false)
    };
    const fileType = file.split('.').pop().toLowerCase();
    const finalFile = file.replace(source, to);
    let pathFile = file.split(sep);
    pathFile.pop();
    pathFile = pathFile.join(sep);
    if (event === 'update') {
      log.building.start();
      log.building.string = `Building ${sh.dim}from${sh.reset} "${sh.bold}${type(file)}${file}${sh.reset}"`;
      let status = 1;
      if (fileType === 'js' || fileType === 'ts') {
        const request = await processJS(file);
        if (!request) status = 0;
      } else if (fileType === 'scss' || fileType === 'css') {
        const request = await processCSS(file);
        if (!request) status = 0;
      } else {
        const original = await post_process({
          src: file,
          response: true,
          to: finalFile
        });
        let minified = false;
        if (original !== 'skip-this-file') {
          if (!no_process(file)) {
            if (fileType === 'php' || fileType === 'phtml') minified = await processPHP(original);else if (fileType === 'html') minified = await processHTML(original, file);else if (fileType === 'htaccess') minified = await processHTACCESS(original);
          }
          if (minified !== 'skip-this-file') {
            createDir(pathFile.replace(source, to));
            fs.writeFileSync(finalFile, !minified ? original : minified);
          }
        }
      }
      log.building.stop(status);
    } else if (event === 'remove') {
      log.building.start();
      log.building.string = `Removed ${sh.dim}from${sh.reset} "${sh.bold}${type(file)}${file}${sh.reset}"`;
      if (isDir) fs.rmSync(finalFile, {
        recursive: true,
        force: true
      });else {
        if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
        if (fileType === 'scss') {
          if (fs.existsSync(finalFile.replace('.scss', '.css'))) fs.unlinkSync(finalFile.replace('.scss', '.css'));
        }
      }
      log.building.stop(1);
    }
  };
  watcherSource.on('change', (event, file) => onSrc(event, file));
  watcherMain.on('change', async (event, file) => {
    if (!!file.match(/DS_Store/)) {
      await deleteDS_Store();
      return;
    }
    const connected = await isConnected();
    async function deployFile() {
      const log = {
        status: new draft('', `dots`, false)
      };
      if (connected && conn) log.deploy = new draft('', `dots`, false);
      log.status.start();
      log?.deploy && log.deploy.start();
      if (event == 'update') {
        log.status.stop(1, `Copied ${sh.dim}to${sh.reset} "${type(deploy.scheduling.current)}${sh.bold}${deploy.scheduling.current}${sh.reset}"`);
        if (connected && conn) log.deploy.string = `Deploying ${sh.dim}to${sh.reset} "${type(deploy.scheduling.current)}${sh.bold}${serverOSNormalize(deploy.scheduling.current.replace(to, FTP.publicCachedAccess.root))}${sh.reset}"`;
      } else {
        log.status.stop(1, `Removed ${sh.dim}from${sh.reset} "${type(deploy.scheduling.current)}${sh.bold}${deploy.scheduling.current}${sh.reset}"`);
        if (connected && conn) log.deploy.string = `Removing ${sh.dim}from${sh.reset} "${type(deploy.scheduling.current)}${sh.bold}${serverOSNormalize(deploy.scheduling.current.replace(to, FTP.publicCachedAccess.root))}${sh.reset}"`;
      }
      if (connected && conn) {
        const action = event == 'update' ? await FTP.send(file, deploy) : await FTP.remove(file, isDir);
        log.deploy.stop(!!action ? 1 : 0, FTP.client.error);
      }
    }
    const isDir = file.split(sep).pop().includes('.') ? false : true;
    if (event == 'update' && isDir) return;
    deploy.queue(deployFile, file);
    await deploy.start();
  });
  return true;
});

const rmTemp = async () => {
  const currentDir = fs.readdirSync('./');
  for (const dir of currentDir) {
    if (!/^temp_/.test(dir)) continue;
    await exec(`rm -rf ./${dir}`);
  }
};

(async () => {
  await watchClose();
  const starting = new draft(`Starting${sh.dim}${sh.yellow} ... ${sh.reset}${sh.bright}`, 'circle');
  await rmTemp();
  await deleteDS_Store();
  if (fs.existsSync('temp')) fs.rmSync('temp', {
    recursive: true,
    force: true
  });
  if (fs.existsSync(`${source}/exit`)) fs.unlinkSync(`${source}${sep}exit`);
  const success = await autoDeploy();
  if (!success) {
    await watchClose();
    starting.stop(0, `Falha ao iniciar processos`);
    process.exit(1);
  }
  starting.stop(1, `Watching${sh.reset} ${sh.green}${sh.bold}YOU${sh.reset}${sh.dim}${sh.green} ... ${sh.reset}${sh.bright}🧟`);
})();
