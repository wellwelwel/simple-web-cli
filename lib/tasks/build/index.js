import fs from 'fs';
import { normalize, dirname, resolve, sep, join, extname, basename } from 'path';
import { performance } from 'perf_hooks';
import archiver from 'archiver';
import { platform, EOL } from 'os';
import { exec as exec$1 } from 'child_process';
import { minify } from 'html-minifier-next';
import DraftLog from 'draftlog';
import uglifycss from 'uglifycss';

var createDir = directory => {
  const directorys = [];
  if (typeof directory === 'string') directorys.push(directory);else if (typeof directory === 'object') Object.assign(directorys, directory);
  directorys.forEach(dir => {
    dir = normalize(dir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
      recursive: true
    });
  });
};

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
    ftp: [!!output?.ftp, !!output?.ftp?.start],
    sftp: [!!output?.sftp, !!output?.sftp?.start]
  };
  if (!isValid(validations.ftp)) output.ftp = false;
  if (!isValid(validations.sftp)) output.sftp = false;
  let source = normalize(output.workspaces.src.replace('./', ''));
  let to = normalize(output.workspaces.dist.replace('./', ''));
  if (source.substring(source.length - 1, source.length) === sep) source = source.substring(0, source.length - 1);
  if (to.substring(to.length - 1, to.length) === sep) to = to.substring(0, to.length - 1);
  const dev = {
    ftp: output?.ftp?.start || false,
    sftp: output?.sftp?.start || false
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
  process_files,
  build,
  options,
  plugins,
  blacklist
} = await setConfig();

var exec = cmd => new Promise(resolve => exec$1(cmd, error => resolve(!!error ? false : true)));

var deleteDS_Store = async () => {
  if (process.platform !== 'darwin') return;
  await exec('find . -name ".DS_Store" -type f -delete');
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

function vReg(string, options = 'g') {
  const validate_string = string.replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\$/g, '\\$').replace(/\+/g, '\\+').replace(/\?/g, '\\?').replace(/\|/g, '\\|').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\{/g, '\\{').replace(/\}/g, '\\}');
  return new RegExp(validate_string, options);
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

var empty = str => str?.trim().length === 0 ? true : false;

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

var resourceReplace = (file, local) => {
  if (!plugins) return false;
  const resources = plugins?.resourceReplace || false;
  if (!resources?.replace?.[local]) return false;
  const src = resources?.src || '.resources';
  const dest = file.replace(source, src);
  if (!fs.existsSync(dest)) return false;
  return dest;
};

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
    const new_content = await minify(content, {
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

function path(file) {
  const path = file.split(sep);
  path.pop();
  return path.join(sep);
}

const generateRandomHexadecimal = () => Math.floor(Math.random() * 16).toString(16);
const tokenGenerate = (tokenSize = 32) => {
  const token = [];
  for (let size = 0; size < tokenSize; size++) token.push(generateRandomHexadecimal());
  return token.join('');
};

async function recursive_require(file, replace) {
  return await post_process({
    src: file,
    response: true,
    local: replace
  });
}
async function processJS(file, local = false, replace = 'start') {
  const localTo = !local ? to : local;
  const tempDIR = `temp_${new Date().valueOf().toString()}_${tokenGenerate(8)}_${tokenGenerate(4)}`;
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
  let processedToFinal = false;
  async function process() {
    let error = false;
    if (no_process(pre)) return;
    if (process_files?.js?.babel) {
      const request = await exec(`npx --quiet rollup -i "${pre}" -o "${final}" -c`);
      if (!request) error = true;else processedToFinal = true;
    }
    if (process_files?.js?.uglify) {
      const input = processedToFinal ? final : pre;
      const request = await exec(`npx --quiet uglifyjs "${input}" -o "${final}" -c -m`);
      if (!request) error = true;else processedToFinal = true;
    }
    return error;
  }
  async function post_process$1() {
    if (!processedToFinal) {
      let content = fs.readFileSync(pre, 'utf8');
      fs.writeFileSync(final, content);
    }
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

async function processCSS(file, local = false, replace = 'start') {
  const _ = file.split(sep).pop().substr(0, 1) === '_' ? true : false;
  const fileType = file.split('.').pop().toLowerCase();
  const tempDIR = `temp_${new Date().valueOf().toString()}_${tokenGenerate(8)}_${tokenGenerate(4)}`;
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

const rmTemp = async () => {
  const currentDir = fs.readdirSync('./');
  for (const dir of currentDir) {
    if (!/^temp_/.test(dir)) continue;
    await exec(`rm -rf ./${dir}`);
  }
};

var watchClose = async () => {
  fs.writeFileSync(`${source}${sep}exit`, '');
  if (fs.existsSync(`${source}${sep}exit`)) fs.unlinkSync(`${source}${sep}exit`);
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
        let pathFile = file.split(sep);
        pathFile.pop();
        pathFile = pathFile.join(sep);
        if (fileType === 'js' || fileType === 'ts') await processJS(file, to, 'build', false);else if (fileType === 'scss' || fileType === 'css') await processCSS(file, to, 'build');else {
          const original = await post_process({
            src: file,
            response: true,
            local: 'build',
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
        count++;
      }
      loading.stop(1, `${prefix()}${sh.blue}${types.join(', ')}${moreTypes}`);
      if (blacklistCount > 0) console.log(`${sh.blue}ℹ ${sh.reset}${sh.bold}${blacklistCount}${sh.reset} file(s) in Blacklist`);
    }
    async function resolveConflicts() {
      const loading = new draft(`Resolving possible conflicts`);
      if (fs.existsSync(`${final}.zip`)) fs.unlinkSync(`${final}.zip`);
      if (fs.existsSync(to)) fs.rmSync(to, {
        recursive: true,
        force: true
      });
      loading.stop(1);
    }
    async function gerarDeploy() {
      const loading = new draft(`Compressing built files`);
      try {
        const files = (await listFiles(to)) || [];
        const output = fs.createWriteStream(`${final}.zip`);
        const archive = archiver('zip', {
          zlib: {
            level: build?.level || 0
          }
        });
        new Promise((resolve, reject) => {
          output.on('close', resolve);
          archive.on('error', reject);
        });
        archive.pipe(output);
        for (const file of files) archive.file(file, {
          name: file
        });
        await archive.finalize();
        loading.stop(1, `Successfully compressed into: ${sh.underscore}${sh.blue}${sh.bold}./${final}.zip`);
      } catch (error) {
        loading.stop(1, `Nothing to compress`);
      }
    }
    async function clearTemp() {
      const loading = new draft(`Deleting temporary files`);
      await rmTemp();
      if (fs.existsSync(`${source}${sep}exit`)) fs.unlinkSync(`${source}${sep}exit`);
      if (fs.existsSync(to)) fs.rmSync(to, {
        recursive: true,
        force: true
      });
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
    console.log();
    const startTime = performance.now();
    await resolveConflicts();
    await buildFiles();
    await gerarDeploy();
    await clearTemp();
    console.log();
    loading.stop(1, `Finished in ${sh.green}${msToTime(performance.now() - startTime)}`);
  } catch (e) {
    loading.stop(0, `${sh.red}Error: ${sh.reset}${e}`);
    process.exit(1);
  }
})();
