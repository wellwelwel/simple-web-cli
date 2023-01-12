#! /usr/bin/env node

import fs from 'fs';
import { platform, EOL } from 'os';
import { dirname, resolve, sep, normalize } from 'path';
import { exec as exec$1 } from 'child_process';
import DraftLog from 'draftlog';

var exec = (cmd => new Promise(resolve => exec$1(cmd, error => resolve(!!error ? false : true))));

DraftLog(console);
const sh$1 = {
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
    this.color = sh$1.yellow;
    this.message = console.draft('');
    this.status = {
      0: `${sh$1.red}✖`,
      1: `${sh$1.green}✔`,
      2: `${sh$1.yellow}⚠`,
      3: `${sh$1.blue}ℹ`
    };
    this.start = () => {
      let i = 0;
      let interval = this.loading[this.style] === 'dots' ? 50 : 150;
      this.timer = setInterval(() => {
        if (i >= this.loading[this.style].length) i = 0;
        const current = this.loading[this.style][i++];
        this.message(`${sh$1.bold}${sh$1.bright}${this.color}${current} ${sh$1.reset}${this.string}`);
      }, interval);
    };
    this.stop = (status, string = false) => {
      clearInterval(this.timer);
      if (!!string) this.string = string;
      this.message(`${sh$1.bold}${sh$1.bright}${this.status[status]} ${sh$1.reset}${this.string}`);
      return;
    };
    start && this.start();
  }
}

const sh = command => new Promise((resolve, reject) => exec$1(command, (error, stdout) => !!error ? reject(error) : resolve(stdout)));
const latestVersion = async packageName => (await sh(`npm view ${packageName?.trim()?.toLowerCase()} version`))?.trim();

const rebuildFiles = async arg => {
  const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf-8'));
  const buildJSON = obj => orderJSON(obj, 3);
  const packageFile = readJSON('package.json') || {};
  const stage = {
    package: false,
    babelrc: false,
    error: false,
    npm_i: false
  };
  const orderJSON = (obj, space) => {
    const allKeys = [];
    const seen = {};
    JSON.stringify(obj, (key, value) => {
      if (!(key in seen)) {
        allKeys.push(key);
        seen[key] = null;
      }
      return value;
    });
    allKeys.sort();
    return JSON.stringify(obj, allKeys, space);
  };
  const dependencies = ['@babel/preset-env', '@rollup/plugin-alias', '@rollup/plugin-babel', '@rollup/plugin-commonjs', '@rollup/plugin-node-resolve', '@types/ssh2', 'autoprefixer', 'node-and-vite-helpers', 'packages-update', 'postcss-cli', 'rollup', 'sass', 'uglify-js'];
  const compatibility = {
    node: +process.version.split('.').shift().replace(/[^0-9]/, '') <= 14,
    dependencies: {
      'postcss-cli': '^8.3.1'
    }
  };
  try {
    if (!packageFile?.devDependencies) packageFile.devDependencies = {};
    if (!packageFile?.scripts) packageFile.scripts = {};
    if (packageFile?.type !== 'module') packageFile.type = 'module';
    if (!packageFile.scripts?.update) packageFile.scripts.update = 'npx npu; npm i --ignore-scripts';
    for (const dependence of dependencies) {
      if (!packageFile?.devDependencies?.[dependence] && !packageFile?.dependencies?.[dependence] && !packageFile?.bundleDependencies?.[dependence]) {
        if (compatibility.node && compatibility.dependencies?.[dependence]) {
          packageFile.devDependencies[dependence] = compatibility.dependencies[dependence];
        } else packageFile.devDependencies[dependence] = `^${await latestVersion(dependence)}`;
        if (!stage.package) stage.package = true;
        if (!stage.npm_i) stage.npm_i = true;
      }
    }
    if (!packageFile?.browserslist) {
      packageFile.browserslist = '> 0%';
      if (!stage.package) stage.package = true;
    }
    if (!packageFile?.devDependencies) packageFile.devDependencies = {};
    if (stage.package) fs.writeFileSync('package.json', buildJSON(packageFile));
    if (stage.npm_i) await exec('npm i');
  } catch (error) {
    console.warn('Unable to get the needed resources into package.json.\nPlease, look at: https://github.com/wellwelwel/simple-web-cli/blob/main/package.json and insert "browserslist" and local dependence "web" manually\n');
    console.error(`Error: ${error.message}\n`);
    if (!stage.error) stage.error = true;
  }
  return !stage.error;
};

const isWindows = platform() === 'win32';
const __dirname = (() => {
  const meta = dirname(decodeURI(new URL(import.meta.url).pathname));
  const currentPath = isWindows ? meta.substring(1) : meta;
  const paths = currentPath.split('/');
  const rootIndex = paths.lastIndexOf('simple-web-cli');
  return resolve(paths.splice(0, rootIndex + 1).join(sep));
})();
const cwd = normalize(`file:///${process.cwd()}`);

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

(async () => {
  const [,, ...args] = process.argv;
  const arg = args[0]?.replace(/-/g, '') || 'start';
  const requires = {
    dirs: ['.vscode'],
    files: (await listFiles(`${__dirname}/resources`)).map(file => file.split('resources/').pop())
  };
  const filesCallback = {
    'package.json': async () => await exec('npm i')
  };
  const alloweds = {
    create: true,
    start: '../lib/tasks/start/index.js',
    build: '../lib/tasks/build/index.js',
    TEST: '../lib/tasks/start/index.js'
  };
  if (arg !== 'TEST' && !alloweds[arg]) {
    console.error(`Command "${arg}" not found.${EOL}Use "create", "start" or "build".${EOL}`);
    return;
  }
  const importing = new draft(`Importing dependencies: ${sh$1.green}${sh$1.dim}[ ${sh$1.italic}autoprefixer, postcss, rollup, sass, uglifyjs, ... ]${sh$1.reset}`);
  for (const dir of requires.dirs) fs.mkdirSync(dir, {
    recursive: true
  });
  requires.files.forEach(require => {
    if (!fs.existsSync(normalize(`./${require}`))) {
      fs.copyFileSync(normalize(`${__dirname}/resources/${require}`), normalize(`./${require}`));
      if (filesCallback?.[require]) filesCallback[require]();
    }
  });
  if (!fs.existsSync(normalize('./.gitignore'))) {
    const gitignore = ['temp_*', 'dist', 'release', '*.zip', 'src/exit', 'node_modules'].join(EOL);
    fs.writeFileSync(normalize('./.gitignore'), gitignore);
  }
  const rebuilded = await rebuildFiles();
  importing.stop(1);
  if (!rebuilded) return;
  try {
    if (fs.existsSync(normalize('./.swrc.js'))) {
      const {
        options
      } = await import('./config-9bd41bac.js');
      if (arg === 'start' && options?.initalCommit && !fs.existsSync(normalize('./.git'))) await exec(`git init && git add . && git commit -m "Initial Commit"`);
    }
  } catch (quiet) {}
  if (typeof alloweds[arg] === 'string') await import(alloweds[arg]);
  args.includes('--TEST') && console.log('PASSED');
})();

export { cwd as c };
