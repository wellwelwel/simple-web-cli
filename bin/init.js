#! /usr/bin/env node

import fs from 'fs';
import { platform, EOL } from 'os';
import { dirname, resolve, relative, normalize } from 'path';
import { exec as exec$1 } from 'child_process';
import DraftLog from 'draftlog';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var exec = (function(cmd){return new Promise(function(resolve){return exec$1(cmd,function(error){return resolve(!!error?false:true)})})});

DraftLog(console);var sh$1={yellow:"\x1B[33m",green:"\x1B[32m",cyan:"\x1B[36m",white:"\x1B[37m",blue:"\x1B[34m",magenta:"\x1B[35m",red:"\x1B[31m",dim:"\x1B[2m",underscore:"\x1B[4m",bright:"\x1B[22m",reset:"\x1B[0m",bold:"\x1B[1m",italic:"\x1B[3m",clear:"\x1Bc"};var draft=_createClass(function draft(string){var _this=this;var style=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"dots";var start=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;_classCallCheck(this,draft);this.string=string;this.loading={dots:["\u280B","\u280B","\u2839","\u2838","\u283C","\u2834","\u2826","\u2827","\u2807","\u280F"],circle:["\u25DC","\u25E0","\u25DD","\u25DE","\u25E1","\u25DF"]};this.style=style;this.color=sh$1.yellow;this.message=console.draft("");this.status={0:"".concat(sh$1.red,"\u2716"),1:"".concat(sh$1.green,"\u2714"),2:"".concat(sh$1.yellow,"\u26A0"),3:"".concat(sh$1.blue,"\u2139")};this.start=function(){var i=0;var interval=_this.loading[_this.style]==="dots"?50:150;_this.timer=setInterval(function(){if(i>=_this.loading[_this.style].length)i=0;var current=_this.loading[_this.style][i++];_this.message("".concat(sh$1.bold).concat(sh$1.bright).concat(_this.color).concat(current," ").concat(sh$1.reset).concat(_this.string));},interval);};this.stop=function(status){var string=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;clearInterval(_this.timer);if(!!string)_this.string=string;_this.message("".concat(sh$1.bold).concat(sh$1.bright).concat(_this.status[status]," ").concat(sh$1.reset).concat(_this.string));return};start&&this.start();});

var sh=function sh(command){return new Promise(function(resolve,reject){return exec$1(command,function(error,stdout){return !!error?reject(error):resolve(stdout)})})};var latestVersion=function(){var _ref=_asyncToGenerator(function*(packageName){var _yield$sh,_packageName$trim;return (_yield$sh=yield sh("npm view ".concat(packageName===null||packageName===void 0?void 0:(_packageName$trim=packageName.trim())===null||_packageName$trim===void 0?void 0:_packageName$trim.toLowerCase()," version")))===null||_yield$sh===void 0?void 0:_yield$sh.trim()});return function latestVersion(_x){return _ref.apply(this,arguments)}}();

var rebuildFiles=function(){var _ref=_asyncToGenerator(function*(arg){var readJSON=function readJSON(file){return JSON.parse(fs.readFileSync(file,"utf-8"))};var buildJSON=function buildJSON(obj){return orderJSON(obj,2)};var packageFile=readJSON("package.json")||{};var babelrc=readJSON(".babelrc")||{};var stage={"package":false,babelrc:false,error:false,npm_i:false};var orderJSON=function orderJSON(obj,space){var allKeys=[];var seen={};JSON.stringify(obj,function(key,value){if(!(key in seen)){allKeys.push(key);seen[key]=null;}return value});allKeys.sort();return JSON.stringify(obj,allKeys,space)};var dependencies=["@babel/cli","@babel/core","@babel/preset-env","autoprefixer","postcss-cli","sass","uglify-js"];var compatibility={node:+process.version.split(".").shift().replace(/[^0-9]/,"")<=14,dependencies:{"postcss-cli":"^8.3.1"}};try{var _packageFile$devDepen2;if(!(packageFile!==null&&packageFile!==void 0&&packageFile.devDependencies))packageFile.devDependencies={};for(var _i=0,_dependencies=dependencies;_i<_dependencies.length;_i++){var _packageFile$devDepen,_packageFile$dependen,_packageFile$bundleDe;var dependence=_dependencies[_i];if(!(packageFile!==null&&packageFile!==void 0&&(_packageFile$devDepen=packageFile.devDependencies)!==null&&_packageFile$devDepen!==void 0&&_packageFile$devDepen[dependence])&&!(packageFile!==null&&packageFile!==void 0&&(_packageFile$dependen=packageFile.dependencies)!==null&&_packageFile$dependen!==void 0&&_packageFile$dependen[dependence])&&!(packageFile!==null&&packageFile!==void 0&&(_packageFile$bundleDe=packageFile.bundleDependencies)!==null&&_packageFile$bundleDe!==void 0&&_packageFile$bundleDe[dependence])){var _compatibility$depend;if(compatibility.node&&(_compatibility$depend=compatibility.dependencies)!==null&&_compatibility$depend!==void 0&&_compatibility$depend[dependence]){packageFile.devDependencies[dependence]=compatibility.dependencies[dependence];}else packageFile.devDependencies[dependence]="^".concat(yield latestVersion(dependence));if(!stage["package"])stage["package"]=true;if(!stage.npm_i)stage.npm_i=true;}}if(!(packageFile!==null&&packageFile!==void 0&&packageFile.browserslist)){packageFile.browserslist="> 0%";if(!stage["package"])stage["package"]=true;}if(!(packageFile!==null&&packageFile!==void 0&&packageFile.devDependencies))packageFile.devDependencies={};if(!(packageFile!==null&&packageFile!==void 0&&(_packageFile$devDepen2=packageFile.devDependencies)!==null&&_packageFile$devDepen2!==void 0&&_packageFile$devDepen2.web)){packageFile.devDependencies.web="file:.library";if(!stage["package"])stage["package"]=true;if(!stage.npm_i)stage.npm_i=true;}if(stage["package"])fs.writeFileSync("package.json",buildJSON(packageFile));if(stage.npm_i)yield exec("npm i");}catch(error){console.warn("Unable to get the needed resources into package.json.\nPlease, look at: https://github.com/wellwelwel/simple-web-cli/blob/main/package.json and insert \"browserslist\" and local dependence \"web\" manually\n");console.error("Error: ".concat(error.message,"\n"));if(!stage.error)stage.error=true;}try{if(!(babelrc!==null&&babelrc!==void 0&&babelrc.minified)){babelrc.minified=true;if(!stage.babelrc)stage.babelrc=true;}if(!(babelrc!==null&&babelrc!==void 0&&babelrc.comments)){babelrc.comments=false;if(!stage.babelrc)stage.babelrc=true;}if(!Array.isArray(babelrc===null||babelrc===void 0?void 0:babelrc.presets)){babelrc.presets=[];if(!stage.babelrc)stage.babelrc=true;}if(!Array.isArray(babelrc===null||babelrc===void 0?void 0:babelrc.presets[0])){babelrc.presets[0]=[];if(!stage.babelrc)stage.babelrc=true;}var arrays={presetEnv:false,exclude:false,transformRegenerator:false};babelrc.presets.forEach(function(item){if(item.includes("@babel/preset-env"))arrays.presetEnv=true;if(!Array.isArray(item))return;item.forEach(function(subitem){if(subitem!==null&&subitem!==void 0&&subitem.exclude){if(subitem.exclude.includes("transform-regenerator"))arrays.transformRegenerator=true;arrays.exclude=true;}});});if(!arrays.presetEnv){babelrc.presets[0].push("@babel/preset-env");if(!stage.babelrc)stage.babelrc=true;}if(!arrays.exclude&&!arrays.transformRegenerator){babelrc.presets[0].push({exclude:["transform-regenerator"]});if(!stage.babelrc)stage.babelrc=true;}else if(arrays.exclude&&!arrays.transformRegenerator){var excludeIndex=babelrc.presets[0].findIndex(function(item){return item.exclude});babelrc.presets[0][excludeIndex].exclude.push("transform-regenerator");if(!stage.babelrc)stage.babelrc=true;}if(stage.babelrc)fs.writeFileSync(".babelrc",buildJSON(babelrc));}catch(error){console.warn("Unable to get the needed resources into .babelrc.\nPlease, look at: https://github.com/wellwelwel/simple-web-cli/blob/main/.babelrc and insert missing JSON values manually\n");console.error("Error: ".concat(error.message,"\n"));if(!stage.error)stage.error=true;}return !stage.error});return function rebuildFiles(_x){return _ref.apply(this,arguments)}}();

var isWindows=platform()==="win32";var __dirname=function(){var x=dirname(decodeURI(new URL(import.meta.url).pathname));return resolve(isWindows?x.substring(1):x)}();var cwd=isWindows?"file:\\".concat(process.cwd()):relative(__dirname,process.cwd());

_asyncToGenerator(function*(){var _args$;var _process$argv=_toArray(process.argv),args=_process$argv.slice(2);var arg=((_args$=args[0])===null||_args$===void 0?void 0:_args$.replace(/-/g,""))||"start";var isWindows=platform()==="win32";var requires={dirs:[".library"],files:[".babelrc"]};var alloweds={init:true,start:"../lib/tasks/start/index.js",build:"../lib/tasks/build/index.js",TEST:"../lib/tasks/start/index.js"};if(arg!=="TEST"&&!alloweds[arg]){console.error("Command \"".concat(arg,"\" not found.").concat(EOL,"Use \"init\", \"start\" or \"build\".").concat(EOL));return}var importing=new draft("Importing required local modules: ".concat(sh$1.green).concat(sh$1.dim,"[ ").concat(sh$1.italic,"autoprefixer, babel, postcss, sass and uglifyjs").concat(sh$1.reset).concat(sh$1.green).concat(sh$1.dim," ]"));var _iterator=_createForOfIteratorHelper(requires.dirs),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var require=_step.value;isWindows?yield exec("xcopy "+normalize("".concat(__dirname,"/../").concat(require,"\\"))+" "+normalize("./".concat(require,"\\"))+" /s /e"):yield exec("cp -r "+normalize("".concat(__dirname,"/../").concat(require))+" "+normalize("./".concat(require)));}}catch(err){_iterator.e(err);}finally{_iterator.f();}requires.files.forEach(function(require){if(!fs.existsSync(normalize("./".concat(require))))fs.copyFileSync(normalize("".concat(__dirname,"/../").concat(require)),normalize("./".concat(require)));});if(!fs.existsSync(normalize("./package.json"))){fs.copyFileSync(normalize("".concat(__dirname,"/../.github/workflows/resources/_package.json")),normalize("./package.json"));yield exec("npm i");}if(!fs.existsSync(normalize("./.swrc.js")))fs.copyFileSync(normalize("".concat(__dirname,"/../.github/workflows/resources/_swrc.js")),normalize("./.swrc.js"));if(!fs.existsSync(normalize("./.gitignore")))fs.copyFileSync(normalize("".concat(__dirname,"/../.github/workflows/resources/_gitignore")),normalize("./.gitignore"));else {var gitignore=fs.readFileSync(normalize("./.gitignore"),"utf-8");var toIgnore=["dist","release","src/exit",".library/addEventListener",".library/selector",".library/package.json","node_modules","package-lock.json","yarn.lock"];toIgnore.forEach(function(ignore){var regex=RegExp(ignore,"gm");if(!regex.test(gitignore))gitignore+="".concat(EOL).concat(ignore);});fs.writeFileSync(normalize("./.gitignore"),gitignore);}var rebuilded=yield rebuildFiles(arg);importing.stop(1);if(!rebuilded)return;try{if(fs.existsSync("./.swrc.js")){var _yield$import=yield import('./config-7b41b2cd.js'),options=_yield$import.options;if(arg==="start"&&options!==null&&options!==void 0&&options.initalCommit&&!fs.existsSync("./.git"))yield exec("git init && git add . && git commit -m \"Initial Commit\"");}}catch(quiet){}if(typeof alloweds[arg]==="string")yield import(alloweds[arg]);args.includes("--TEST")&&console.log("PASSED");})();

export { _typeof as _, _asyncToGenerator as a, _toArray as b, cwd as c, _objectSpread2 as d };
