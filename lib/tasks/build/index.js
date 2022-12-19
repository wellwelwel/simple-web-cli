import fs from 'fs';
import archiver from 'archiver';
import { normalize, dirname, resolve, relative, join, sep, extname, basename } from 'path';
import { performance } from 'perf_hooks';
import { platform, EOL } from 'os';
import DraftLog from 'draftlog';
import { exec as exec$1 } from 'child_process';
import uglifycss from 'uglifycss';
import { minify } from 'html-minifier';

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
function _wrapRegExp() {
  _wrapRegExp = function (re, groups) {
    return new BabelRegExp(re, void 0, groups);
  };
  var _super = RegExp.prototype,
    _groups = new WeakMap();
  function BabelRegExp(re, flags, groups) {
    var _this = new RegExp(re, flags);
    return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype);
  }
  function buildGroups(result, re) {
    var g = _groups.get(re);
    return Object.keys(g).reduce(function (groups, name) {
      var i = g[name];
      if ("number" == typeof i) groups[name] = result[i];else {
        for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) k++;
        groups[name] = result[i[k]];
      }
      return groups;
    }, Object.create(null));
  }
  return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
    var result = _super.exec.call(this, str);
    if (result) {
      result.groups = buildGroups(result, this);
      var indices = result.indices;
      indices && (indices.groups = buildGroups(indices, this));
    }
    return result;
  }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
    if ("string" == typeof substitution) {
      var groups = _groups.get(this);
      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
        var group = groups[name];
        return "$" + (Array.isArray(group) ? group.join("$") : group);
      }));
    }
    if ("function" == typeof substitution) {
      var _this = this;
      return _super[Symbol.replace].call(this, str, function () {
        var args = arguments;
        return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args);
      });
    }
    return _super[Symbol.replace].call(this, str, substitution);
  }, _wrapRegExp.apply(this, arguments);
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
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
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

var createDir = (function(directory){var directorys=[];if(typeof directory==="string")directorys.push(directory);else if(_typeof(directory)==="object")Object.assign(directorys,directory);directorys.forEach(function(dir){dir=normalize(dir);if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});});});

var isWindows=platform()==="win32";var __dirname=function(){var x=dirname(decodeURI(new URL(import.meta.url).pathname));return resolve(isWindows?x.substring(1):x)}();var cwd=isWindows?"file:\\".concat(process.cwd()):relative(__dirname,process.cwd());

var setConfig=function(){var _ref=_asyncToGenerator(function*(){var _args$,_output$ftp,_output$ftp2,_output$ftp2$start,_output$ftp3,_output$ftp3$start,_output$ftp4,_output$ftp4$start,_output$ftp4$start$ho,_output$ftp5,_output$ftp5$start,_output$ftp6,_output$ftp6$start,_output$ftp6$start$us,_output$ftp7,_output$ftp7$start,_output$ftp8,_output$ftp8$start,_output$ftp8$start$pa,_output$ftp9,_output$ftp9$start,_output$ftp10,_output$ftp10$start,_output$build;var _process$argv=_toArray(process.argv),args=_process$argv.slice(2);var arg=((_args$=args[0])===null||_args$===void 0?void 0:_args$.replace(/-/g,""))||"start";var config=yield import(join("./".concat(cwd),".swrc.js"));var output=_objectSpread2(_objectSpread2({},{}),config["default"]);var isValid=function isValid(arr){return !arr.some(function(validation){return validation===false})};var validations={ftp:[!!(output!==null&&output!==void 0&&output.ftp),!!(output!==null&&output!==void 0&&(_output$ftp=output.ftp)!==null&&_output$ftp!==void 0&&_output$ftp.start),typeof(output===null||output===void 0?void 0:(_output$ftp2=output.ftp)===null||_output$ftp2===void 0?void 0:(_output$ftp2$start=_output$ftp2.start)===null||_output$ftp2$start===void 0?void 0:_output$ftp2$start.root)==="string",typeof(output===null||output===void 0?void 0:(_output$ftp3=output.ftp)===null||_output$ftp3===void 0?void 0:(_output$ftp3$start=_output$ftp3.start)===null||_output$ftp3$start===void 0?void 0:_output$ftp3$start.host)==="string"&&(output===null||output===void 0?void 0:(_output$ftp4=output.ftp)===null||_output$ftp4===void 0?void 0:(_output$ftp4$start=_output$ftp4.start)===null||_output$ftp4$start===void 0?void 0:(_output$ftp4$start$ho=_output$ftp4$start.host)===null||_output$ftp4$start$ho===void 0?void 0:_output$ftp4$start$ho.trim().length)>0,typeof(output===null||output===void 0?void 0:(_output$ftp5=output.ftp)===null||_output$ftp5===void 0?void 0:(_output$ftp5$start=_output$ftp5.start)===null||_output$ftp5$start===void 0?void 0:_output$ftp5$start.user)==="string"&&(output===null||output===void 0?void 0:(_output$ftp6=output.ftp)===null||_output$ftp6===void 0?void 0:(_output$ftp6$start=_output$ftp6.start)===null||_output$ftp6$start===void 0?void 0:(_output$ftp6$start$us=_output$ftp6$start.user)===null||_output$ftp6$start$us===void 0?void 0:_output$ftp6$start$us.trim().length)>0,typeof(output===null||output===void 0?void 0:(_output$ftp7=output.ftp)===null||_output$ftp7===void 0?void 0:(_output$ftp7$start=_output$ftp7.start)===null||_output$ftp7$start===void 0?void 0:_output$ftp7$start.pass)==="string"&&(output===null||output===void 0?void 0:(_output$ftp8=output.ftp)===null||_output$ftp8===void 0?void 0:(_output$ftp8$start=_output$ftp8.start)===null||_output$ftp8$start===void 0?void 0:(_output$ftp8$start$pa=_output$ftp8$start.pass)===null||_output$ftp8$start$pa===void 0?void 0:_output$ftp8$start$pa.trim().length)>0,(output===null||output===void 0?void 0:(_output$ftp9=output.ftp)===null||_output$ftp9===void 0?void 0:(_output$ftp9$start=_output$ftp9.start)===null||_output$ftp9$start===void 0?void 0:_output$ftp9$start.secure)==="explict"||(output===null||output===void 0?void 0:(_output$ftp10=output.ftp)===null||_output$ftp10===void 0?void 0:(_output$ftp10$start=_output$ftp10.start)===null||_output$ftp10$start===void 0?void 0:_output$ftp10$start.secure)===true]};if(!isValid(validations.ftp)){output.ftp={start:{root:"",host:"",user:"",pass:"",secure:""}};}var source=normalize(output.workspaces.src.replace("./",""));var to=normalize(output.workspaces.dist.replace("./",""));var required=normalize(".library/");if(source.substring(source.length-1,source.length)===sep)source=source.substring(0,source.length-1);if(to.substring(to.length-1,to.length)===sep)to=to.substring(0,to.length-1);if(required.substring(required.length-1,required.length)===sep)required=required.substring(0,required.length-1);var dev={ftp:output.ftp.start};var dist={ftp:output.ftp.build};var process_files=arg==="build"&&output!==null&&output!==void 0&&(_output$build=output.build)!==null&&_output$build!==void 0&&_output$build.compile?output.build.compile:output.start.compile;var build=(output===null||output===void 0?void 0:output.build)||false;var plugins=(output===null||output===void 0?void 0:output.plugins)||false;var options=(output===null||output===void 0?void 0:output.options)||false;var blacklist=output.hasOwnProperty("blacklist")?output.blacklist:[]||[];process_files.js.require=required;createDir([source,to,required]);return {source:source,to:to,dev:dev,dist:dist,process_files:process_files,build:build,options:options,plugins:plugins,blacklist:blacklist}});return function setConfig(){return _ref.apply(this,arguments)}}();var _await$setConfig=await setConfig(),source=_await$setConfig.source,to=_await$setConfig.to;_await$setConfig.dev;_await$setConfig.dist;var process_files=_await$setConfig.process_files,build=_await$setConfig.build;_await$setConfig.options;var plugins=_await$setConfig.plugins,blacklist=_await$setConfig.blacklist;

DraftLog(console);var sh={yellow:"\x1B[33m",green:"\x1B[32m",cyan:"\x1B[36m",white:"\x1B[37m",blue:"\x1B[34m",magenta:"\x1B[35m",red:"\x1B[31m",dim:"\x1B[2m",underscore:"\x1B[4m",bright:"\x1B[22m",reset:"\x1B[0m",bold:"\x1B[1m",italic:"\x1B[3m",clear:"\x1Bc"};var draft=_createClass(function draft(string){var _this=this;var style=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"dots";var start=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;_classCallCheck(this,draft);this.string=string;this.loading={dots:["\u280B","\u280B","\u2839","\u2838","\u283C","\u2834","\u2826","\u2827","\u2807","\u280F"],circle:["\u25DC","\u25E0","\u25DD","\u25DE","\u25E1","\u25DF"]};this.style=style;this.color=sh.yellow;this.message=console.draft("");this.status={0:"".concat(sh.red,"\u2716"),1:"".concat(sh.green,"\u2714"),2:"".concat(sh.yellow,"\u26A0"),3:"".concat(sh.blue,"\u2139")};this.start=function(){var i=0;var interval=_this.loading[_this.style]==="dots"?50:150;_this.timer=setInterval(function(){if(i>=_this.loading[_this.style].length)i=0;var current=_this.loading[_this.style][i++];_this.message("".concat(sh.bold).concat(sh.bright).concat(_this.color).concat(current," ").concat(sh.reset).concat(_this.string));},interval);};this.stop=function(status){var string=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;clearInterval(_this.timer);if(!!string)_this.string=string;_this.message("".concat(sh.bold).concat(sh.bright).concat(_this.status[status]," ").concat(sh.reset).concat(_this.string));return};start&&this.start();});

function vReg(string){var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"g";var validate_string=string.replace(/\//g,"\\/").replace(/\./g,"\\.").replace(/\*/g,"\\*").replace(/\$/g,"\\$").replace(/\+/g,"\\+").replace(/\?/g,"\\?").replace(/\|/g,"\\|").replace(/\[/g,"\\[").replace(/\]/g,"\\]").replace(/\(/g,"\\(").replace(/\)/g,"\\)").replace(/\{/g,"\\{").replace(/\}/g,"\\}");return new RegExp(validate_string,options)}

var watchClose = _asyncToGenerator(function*(){fs.writeFileSync("".concat(source).concat(sep,"exit"),"");if(fs.existsSync("".concat(source).concat(sep,"exit")))fs.unlinkSync("".concat(source).concat(sep,"exit"));});

var ListFiles=_createClass(function ListFiles(){var _this=this;_classCallCheck(this,ListFiles);this.files=[];this.excludeDir=[];this.isTypeExpected=function(file,expected){if(expected===false)return true;var isValid=false;var types=[];var currentFileType=file.split(".").pop();if(typeof expected==="string")types.push(expected);else if(_typeof(expected)==="object")Object.assign(types,expected);for(var type in types){if(currentFileType.includes(types[type])){isValid=true;break}}return isValid};this.getFiles=function(){var _ref=_asyncToGenerator(function*(directory,type){var excludeDir=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;if(excludeDir)_this.excludeDir.push(excludeDir.replace("./",""));var filesList=fs.readdirSync(directory);for(var file in filesList){var stat=fs.statSync("".concat(directory).concat(sep).concat(filesList[file]));if(_this.excludeDir.includes(directory))return false;else if(stat.isDirectory())yield _this.getFiles("".concat(directory).concat(sep).concat(filesList[file]),type);else if(_this.isTypeExpected(filesList[file],type))_this.files.push("".concat(directory).concat(sep).concat(filesList[file]));}return _this.files});return function(_x,_x2){return _ref.apply(this,arguments)}}();});var listFiles=function(){var _ref2=_asyncToGenerator(function*(directory){var type=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var excludeDir=arguments.length>2&&arguments[2]!==undefined?arguments[2]:false;var files=new ListFiles;var list=yield files.getFiles(directory,type,excludeDir);files.files=[];return list});return function listFiles(_x3){return _ref2.apply(this,arguments)}}();

var exec = (function(cmd){return new Promise(function(resolve){return exec$1(cmd,function(error){return resolve(!!error?false:true)})})});

var deleteDS_Store = _asyncToGenerator(function*(){if(process.platform!=="darwin")return;yield exec("find . -name \".DS_Store\" -type f -delete");});

function path(file){var path=file.split(sep);path.pop();return path.join(sep)}

function no_process(file){var exclude_files=(process_files===null||process_files===void 0?void 0:process_files.exclude)||false;var result=false;if(exclude_files){var _iterator=_createForOfIteratorHelper(exclude_files),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var exclude=_step.value;if(vReg(exclude).test(file)){result=true;break}}}catch(err){_iterator.e(err);}finally{_iterator.f();}}return result}

var get_post_replace=function get_post_replace(){var post_replaces={config:true,strings:false};if(!(plugins!==null&&plugins!==void 0&&plugins.stringReplace))return post_replaces;var set_post_replaces=plugins.stringReplace;if(set_post_replaces!==null&&set_post_replaces!==void 0&&set_post_replaces.strings)if(Object.keys(set_post_replaces.strings).length>0)post_replaces.strings=set_post_replaces.strings;if(set_post_replaces!==null&&set_post_replaces!==void 0&&set_post_replaces.config)post_replaces.config=set_post_replaces===null||set_post_replaces===void 0?void 0:set_post_replaces.config;return post_replaces};

var empty = (function(str){return (str===null||str===void 0?void 0:str.trim().length)===0?true:false});

var resourceReplace = (function(file,local){var _resources$replace;if(!plugins)return false;var resources=(plugins===null||plugins===void 0?void 0:plugins.resourceReplace)||false;if(!(resources!==null&&resources!==void 0&&(_resources$replace=resources.replace)!==null&&_resources$replace!==void 0&&_resources$replace[local]))return false;var src=(resources===null||resources===void 0?void 0:resources.src)||".resources";var dest=file.replace(source,src);if(!fs.existsSync(dest))return false;return dest});

var post_process=function(){var _ref=_asyncToGenerator(function*(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var rejectTypes=[/\.tiff$/i,/\.tif$/i,/\.bmp$/i,/\.jpg$/i,/\.jpeg$/i,/\.jpe$/i,/\.jfif$/i,/\.png$/i,/\.gif$/i,/\.webp$/i,/\.avif$/i,/\.psd$/i,/\.psb$/i,/\.exif$/i,/\.raw$/i,/\.ai$/i,/\.crd$/i,/\.eps$/i,/\.woff$/i,/\.woff2$/i,/\.eot$/i,/\.otd$/i,/\.otf$/i,/\.ttf$/i,/\.ttc$/i,/\.avi$/i,/\.wmv$/i,/\.mov$/i,/\.flv$/i,/\.rm$/i,/\.mp4$/i,/\.mkv$/i,/\.mks$/i,/\.3gpp$/i,/\.aac$/i,/\.ac3$/i,/\.ac4$/i,/\.mp3$/i,/\.m4a$/i,/\.aiff$/i,/\.wav$/i,/\.ogg$/i,/\.alac$/i,/\.flac$/i,/\.pcm$/i,/\.pdf$/i,/\.xlsx$/i,/\.xltx$/i,/\.xlsm$/i,/\.xltm$/i,/\.xlsb$/i,/\.xls$/i,/\.xlt$/i,/\.xlam$/i,/\.xla$/i,/\.xlw$/i,/\.xla$/i,/\.xlr$/i,/\.ods$/i,/\.doc$/i,/\.docx$/i,/\.odt$/i,/\.dot$/i,/\.dotm$/i,/\.xps$/i,/\.wps$/i,/\.pptx$/i,/\.pptm$/i,/\.ppt$/i,/\.potx$/i,/\.potm$/i,/\.pot$/i,/\.ppsx$/i,/\.ppsm$/i,/\.pps$/i,/\.ppam$/i,/\.ppa$/i,/\.wmf$/i,/\.emf$/i,/\.rtf$/i,/\.odp$/i,/\.zip(\.[0-9]{1,})?$/i,/\.rar(\.[0-9]{1,})?$/i,/\.7z$/i,/\.z[0-9]{1,}?$/i,/\.gz$/i,/\.z$/i,/\.tar$/i,/\.tgz$/i,/\.bz2$/i,/\.(z|gz|tar|tgz|bz2)\.part/i];var config={src:options.src||false,to:options.to||false,local:options.local||"start",response:options.response||false};var src=config.src,to=config.to,local=config.local,response=config.response;if(!response){if(!src||!to)return false;if(!fs.existsSync(src))return false}var get_replaces=get_post_replace();var isValid=!rejectTypes.some(function(regex){return regex.test(extname(src))});var fileType=src.split(".").pop().toLowerCase();var isReplaceable=function isReplaceable(){try{if(get_replaces.config===true)return true;if(get_replaces.config[fileType]===true)return true;if(get_replaces.config.others===true)return true;return false}catch(e){return false}};var sampleContent=resourceReplace(src,local)||src;if(!isValid){yield exec("mkdir -p ".concat(dirname(to)," && cp ").concat(sampleContent," ").concat(to));return "skip-this-file"}var content=fs.readFileSync(sampleContent,"utf8");try{if(isReplaceable()){var new_content=content;for(var string in get_replaces.strings){if(string.split("*").length===3&&string.substring(0,1)==="*"&&string.substring(string.length,string.length-1)==="*"){var regex=RegExp(string.replace(/\*/gim,"\\*"),"gim");var stringToReplace=get_replaces===null||get_replaces===void 0?void 0:get_replaces.strings[string][local];if(!stringToReplace||empty(stringToReplace)){if(local==="start"&&!empty(get_replaces.strings[string]["build"]))stringToReplace=get_replaces.strings[string]["build"];else if(local==="build"&&!empty(get_replaces.strings[string]["start"]))stringToReplace=get_replaces.strings[string]["start"];else stringToReplace="";}if(stringToReplace||empty(stringToReplace))new_content=new_content.replace(regex,stringToReplace);}}if(!!new_content)content=new_content;}}catch(e){}finally{if(response===true)return content;else fs.writeFileSync(to,content);}});return function post_process(){return _ref.apply(this,arguments)}}();

function processCSS(_x){return _processCSS.apply(this,arguments)}function _processCSS(){_processCSS=_asyncToGenerator(function*(file){var local=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var replace=arguments.length>2&&arguments[2]!==undefined?arguments[2]:"start";var _=file.split(sep).pop().substr(0,1)==="_"?true:false;var fileType=file.split(".").pop().toLowerCase();var tempDIR="temp_".concat(new Date().valueOf().toString());if(fileType==="scss"&&process_files.hasOwnProperty("scss")&&process_files.scss===false){createDir([path(file.replace(source,to))]);fs.copyFileSync(file,file.replace(source,to));return true}if(_&&fileType==="scss"){var files=yield listFiles(source,"scss");var filename=file.split(sep).pop().replace(/_/,"").replace(/.scss/,"");for(var _file in files){var regex=RegExp("(@import).*?(\"|')((\\.\\/|\\.\\.\\/){1,})?((.*?\\/){1,})?(_)?(".concat(filename,")(\\.scss)?(\"|')"),"g");var _content=fs.readFileSync(files[_file],"utf8");var isValid=!!_content.match(regex);if(isValid)processCSS(files[_file],local,replace);}return true}var localTo=!local?to:local;var tempCSS=file.replace(source,tempDIR).replace(".scss",".css");var tempPath=path(file.replace(source,tempDIR));var _final=tempCSS.replace(tempDIR,localTo);var process=!no_process(fileType==="scss"?tempCSS.replace(".css",".scss"):tempCSS);createDir([tempPath,tempPath.replace(tempDIR,localTo)]);var request;if(fileType==="scss"){request=yield exec("npx sass --quiet \"".concat(file,"\":\"").concat(tempCSS,"\" --no-source-map").concat(process_files.css.uglifycss&&process?" --style compressed":""));}else if(fileType==="css"){fs.copyFileSync(file,tempCSS);request=true;}var content="/* autoprefixer grid: autoplace */ ".concat(yield post_process({src:tempCSS,response:true,local:replace}));fs.writeFileSync(tempCSS,content);if(process&&process_files.css.autoprefixer)yield exec("npx postcss \"".concat(tempCSS,"\" --use autoprefixer -o \"").concat(tempCSS,"\" --no-map"));var uglified=process_files.css.uglifycss&&process?uglifycss.processFiles([tempCSS],{uglyComments:true}):fs.readFileSync(tempCSS,"utf8");fs.writeFileSync(_final,uglified);if(fs.existsSync(tempDIR))yield exec("rm -rf ./".concat(tempDIR));return request});return _processCSS.apply(this,arguments)}

var requiredResources=process_files.js.require;var packageName=JSON.parse(fs.readFileSync(".library/package.json","utf8"));function getLine$1(search,content){var index=content.indexOf(search);var tempString=content.substring(0,index);return tempString.split(EOL).length}function recursive_require(_x,_x2){return _recursive_require.apply(this,arguments)}function _recursive_require(){_recursive_require=_asyncToGenerator(function*(file,replace){var backup=yield post_process({src:file,response:true,local:replace});var requireds=backup.match(/((const|let|var).*?{?(.*)}?.*)?require\((.*?)\)(.\w+)?;?/gim);var content=backup;var _loop=function*_loop(required){try{var fixPath=requireds[required].replace(/\.\.\//gim,"").replace("./","");var origins=requiredResources.split(sep);if(origins.length>1)origins.forEach(function(folder){return fixPath=fixPath.replace(folder,"")});else fixPath=fixPath.replace(requiredResources,"");var regex=/(require\([''`])(.+?)([''`]\);?)/;var requiredName=regex.exec(fixPath)[2].replace(RegExp(packageName.name.replace(/\//,"\\/"),"gim"),"");var exist_require=function exist_require(){var required_path=normalize("".concat(requiredResources).concat(sep).concat(requiredName));if(fs.existsSync("".concat(required_path).concat(sep,"index.js")))return "".concat(required_path).concat(sep,"index.js");throw "The file \"".concat(sh.yellow).concat(required_path).concat(sep,"index.js").concat(sh.reset,"\" was not found in the library. Line ").concat(getLine$1(requireds[required],backup)," from \"").concat(sh.yellow).concat(file).concat(sh.reset,"\"")};var require=exist_require();var current=fs.readFileSync(require,"utf-8");var outputContent="";var outputModule=/module|exports/;var isModule=outputModule.test(current)?outputModule.exec(current)[2]:false;if(typeof isModule!=="boolean"){var evalResources=eval(current);if(_typeof(evalResources)==="object"){var _exec,_exec$groups,_exec2,_exec2$groups,_exec3,_exec3$groups;var pipeModules=[];var isPipe=((_exec=_wrapRegExp(/require.*\.(\w+)/gim,{getModules:1}).exec(requireds[required].replace(/\s/gm,"")))===null||_exec===void 0?void 0:(_exec$groups=_exec.groups)===null||_exec$groups===void 0?void 0:_exec$groups.getModules)||false;var nameVarPipe=((_exec2=_wrapRegExp(/(const|let|var).*?(\w+).*?require/,{getPipeModule:2}).exec(requireds[required]))===null||_exec2===void 0?void 0:(_exec2$groups=_exec2.groups)===null||_exec2$groups===void 0?void 0:_exec2$groups.getPipeModule)||false;if(isPipe)pipeModules.push(isPipe);var requiredModules=isPipe?pipeModules:((_exec3=_wrapRegExp(/\{\s?(.*)\s?\}.*?=.*?require/gim,{getModules:1}).exec(requireds[required].replace(/\s/gm,"")))===null||_exec3===void 0?void 0:(_exec3$groups=_exec3.groups)===null||_exec3$groups===void 0?void 0:_exec3$groups.getModules.split(","))||[];for(var key in evalResources){var typeVAR=requireds[required].match(/const|let|var/gim);if(requiredModules.includes(key)){if(typeof evalResources[key]!=="function"){current=current.replace(/([^:\/\/])(\/{2}.*?)|((\/\*[\s\S]*?\*\/|^\s*$)|(module|exports).+;?)/gim,"").trim();outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(current).concat(EOL);continue}if(!!typeVAR)outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(typeVAR," ").concat(isPipe?nameVarPipe:key," = ").concat(evalResources[key],";").concat(EOL);else console.log("".concat(sh.red,"\u26A0").concat(sh.reset," Bad module call in \"").concat(sh.yellow).concat(file).concat(sh.reset,"\": ").concat(getLine$1(requireds[required],backup)));}else if(!typeVAR){console.log("".concat(sh.red,"\u26A0").concat(sh.reset," No variable type defined for the module in \"").concat(sh.yellow).concat(file).concat(sh.reset,"\": ").concat(getLine$1(requireds[required],backup)));}}requiredModules.forEach(function(wrongModule){if(evalResources[wrongModule])return;console.log("".concat(sh.red,"\u26A0").concat(sh.reset," \"").concat(wrongModule,"\" not found in \"").concat(sh.yellow).concat(require).concat(sh.reset,"\". Line: ").concat(getLine$1(wrongModule,backup)," from \"").concat(sh.yellow).concat(file).concat(sh.reset,"\""));});}else if(typeof evalResources==="function"){var _exec4,_exec4$groups;var _typeVAR=requireds[required].match(/const|let|var/gim)||false;var nameVAR=((_exec4=_wrapRegExp(/(const|let|var).*?(\w+)/,{nameVAR:2}).exec(requireds[required]))===null||_exec4===void 0?void 0:(_exec4$groups=_exec4.groups)===null||_exec4$groups===void 0?void 0:_exec4$groups.nameVAR)||false;if(!!_typeVAR&&!!nameVAR)outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(_typeVAR," ").concat(nameVAR," = ").concat(evalResources,";");else {outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(evalResources.toString()).concat(EOL);}}}else {current=current.replace(/([^:\/\/])(\/{2}.*?)|((\/\*[\s\S]*?\*\/|^\s*$))/gim,"").trim();outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(current).concat(EOL);}if(regex.test(outputContent))outputContent=yield recursive_require(require,replace);content=content.replace(requireds[required],outputContent);}catch(e){console.log("".concat(sh.red,"\u26A0").concat(sh.reset," ").concat(e));}};for(var required in requireds){yield*_loop(required);}return content});return _recursive_require.apply(this,arguments)}function processJS(_x3){return _processJS.apply(this,arguments)}function _processJS(){_processJS=_asyncToGenerator(function*(file){var local=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var replace=arguments.length>2&&arguments[2]!==undefined?arguments[2]:"start";var _=/\.library/.test(file)?true:false;if(_){var filename=file.split(sep).pop().replace(/.js/,"");var regex=RegExp("require.*?".concat(filename));var files=yield listFiles(source,"js",requiredResources);for(var _file in files){var content=fs.readFileSync(files[_file],"utf8");if(regex.test(content))processJS(files[_file],local);}return}var localTo=!local?to:local;var tempDIR="temp_".concat(new Date().valueOf().toString());var pre=file.replace(source,tempDIR);var tempJS=path(pre);var _final=file.replace(source,localTo);createDir([tempDIR,tempJS,tempJS.replace(tempDIR,localTo)]);function pre_process(){return _pre_process.apply(this,arguments)}function _pre_process(){_pre_process=_asyncToGenerator(function*(){var _process_files$js,_process_files$js$exc;var exclude_files=(process_files===null||process_files===void 0?void 0:(_process_files$js=process_files.js)===null||_process_files$js===void 0?void 0:(_process_files$js$exc=_process_files$js.exclude)===null||_process_files$js$exc===void 0?void 0:_process_files$js$exc.requireBrowser)||false;var result=false;if(exclude_files){var _iterator=_createForOfIteratorHelper(exclude_files),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var exclude=_step.value;if(vReg(exclude).test(file)){result=true;break}}}catch(err){_iterator.e(err);}finally{_iterator.f();}}var content=!result?yield recursive_require(file,replace):yield post_process({src:file,response:true,local:replace});fs.writeFileSync(pre,content);});return _pre_process.apply(this,arguments)}function process(){return _process.apply(this,arguments)}function _process(){_process=_asyncToGenerator(function*(){var _process_files$js2,_process_files$js3;var error=false;if(no_process(pre))return;if(process_files!==null&&process_files!==void 0&&(_process_files$js2=process_files.js)!==null&&_process_files$js2!==void 0&&_process_files$js2.babel){var _request=yield exec("npx --quiet babel \"".concat(pre,"\" -o \"").concat(pre,"\""));if(!_request)error=true;}if(process_files!==null&&process_files!==void 0&&(_process_files$js3=process_files.js)!==null&&_process_files$js3!==void 0&&_process_files$js3.uglify){var _request2=yield exec("npx --quiet uglifyjs \"".concat(pre,"\" -o \"").concat(pre,"\" -c -m"));if(!_request2)error=true;}return error});return _process.apply(this,arguments)}function post_process$1(){return _post_process.apply(this,arguments)}function _post_process(){_post_process=_asyncToGenerator(function*(){var content=fs.readFileSync(pre,"utf8");fs.writeFileSync(_final,content);});return _post_process.apply(this,arguments)}yield pre_process();var request=yield process();yield post_process$1();if(fs.existsSync(tempDIR))yield exec("rm -rf ./".concat(tempDIR));return !request});return _processJS.apply(this,arguments)}

var processPHP=function processPHP(content){var _content,_process_files$php;if(!content||((_content=content)===null||_content===void 0?void 0:_content.trim().length)===0)return "";else if(!(process_files!==null&&process_files!==void 0&&(_process_files$php=process_files.php)!==null&&_process_files$php!==void 0&&_process_files$php.minify))return content;try{var new_content=content;var strings_PHP=new_content.match(/(('.*?')|(".*?")|(`.*?`))/gim);var backup_strings_PHP={};for(var key in strings_PHP){var id="\"".concat(Math.random().toString(36).substr(2,9)).concat(Math.random().toString(36).substr(2,9),"\"");backup_strings_PHP[id]=strings_PHP[key];new_content=new_content.replace(strings_PHP[key],id);}new_content=new_content.replace(/(\/\*[\s\S]*?\*\/)|(\/{2}.*)|(\<!--[^\[][\w\W]*?-->)/gim,"").replace(/[\s]{2,}|[\n]{1,}|[\r]{1,}|[\t]{1,}/gim," ").replace(/(<\?\s)|(<\?\n)|(<\?\r)|(<\?\t)/gim,"<?php ").replace(/\s{\s|\s{|{\s/gim,"{").replace(/\s}\s|\s}|}\s/gim,"}").replace(/\s\(\s|\s\(|\(\s/gim,"(").replace(/\s\)\s|\s\)|\)\s/gim,")").replace(/\s\[\s|\s\[|\[\s/gim,"[").replace(/\s\]\s|\s\]|\]\s/gim,"]").replace(/\s;\s|\s;|;\s/gim,";").replace(/\s:\s|\s:|:\s/gim,":").replace(/\s-\s|\s-|-\s/gim,"-").replace(/\s\+\s|\s\+|\+\s/gim,"+").replace(/\s\*\s|\s\*|\*\s/gim,"*").replace(/\s\/\s|\s\/|\/\s/gim,"/").replace(/\s%\s|\s%|%\s/gim,"%").replace(/\s!\s|\s!|!\s/gim,"!").replace(/\s\?\s|\s\?|\?\s/gim,"?").replace(/\s=\s|\s=|=\s/gim,"=").replace(/\s<\s|\s<|<\s/gim,"<").replace(/\s>\s|\s>|>\s/gim,">").replace(/\s\^\s|\s\^|\^\s/gim,"^").replace(/\sAND\s|\sAND|AND\s/gim,"AND").replace(/\sOR\s|\sOR|OR\s/gim,"OR").replace(/\sXOR\s|\sXOR|XOR\s/gim,"XOR").replace(/\s&\s|\s&|&\s/gim,"&").replace(/\s\|\s|\s\||\|\s/gim,"|").replace(/\s\.\s|\s\.|\.\s/gim,".").replace(/\s,\s|\s,|,\s/gim,",").replace(/\s'\s|\s'|'\s/gim,"'").replace(/\s"\s|\s"|"\s/gim,"\"").replace(/\s`\s|\s`|`\s/gim,"`").replace(/<\?=\s/gim,"<?=").replace(/ \?>/gim,"?>").replace(/<\?php/gim,"<?php ").replace(/(?:\s)\s/gim," ").replace(/^\s.?\s|[\s]{1,}$/gim,"");for(var _id in backup_strings_PHP){new_content=new_content.replace(_id,backup_strings_PHP[_id]);}if(!!new_content)content=new_content.trim();}catch(e){}finally{return content}};

var processHTACCESS=function processHTACCESS(content){var _content,_process_files$htacce;if(!content||((_content=content)===null||_content===void 0?void 0:_content.trim().length)===0)return "";else if(!(process_files!==null&&process_files!==void 0&&(_process_files$htacce=process_files.htaccess)!==null&&_process_files$htacce!==void 0&&_process_files$htacce.minify))return content;try{var new_content=content;new_content=content.replace(/#.*/gim,"").replace(/^\s+|\s+$/gim,"\r\n").replace(/(\t{2,})|(\r{2,})|(\n{2,})/gim,"").replace(/^\s.?\s|[\s]{1,}$/gim,"");if(!!new_content)content=new_content.trim();}catch(e){}finally{return content}};

function getLine(search,content){var index=content.indexOf(search);var tempString=content.substring(0,index);return tempString.split(EOL).length}var putHTML=function putHTML(content,file){var importRegex=/<!--.*?import\(("|')(.*)("|')\).*?-->/gim;var getImports=content.match(importRegex)||[];if(getImports.length>0){var backup=content;getImports.forEach(function(importHTML){var _exec,_exec$groups;var extractPath=((_exec=_wrapRegExp(/<!\x2D\x2D.*?import\(("|')(.*)("|')\).*?\x2D\x2D>/gim,{"import":2}).exec(importHTML))===null||_exec===void 0?void 0:(_exec$groups=_exec.groups)===null||_exec$groups===void 0?void 0:_exec$groups["import"])||false;var finalPath=normalize("".concat(dirname(file),"/").concat(extractPath.replace(/(^\.?\/)/gm,"")));var toReplace=vReg(importHTML,"gim");if(!fs.existsSync(finalPath)){console.log("".concat(sh.red,"\u26A0").concat(sh.reset," \"").concat(sh.cyan).concat(extractPath).concat(sh.reset,"\" not found. Line ").concat(getLine(importHTML,backup)," from \"").concat(sh.cyan).concat(file).concat(sh.reset,"\""));return}var toImport=fs.readFileSync(finalPath,"utf-8");if(importRegex.test(toImport))toImport=putHTML(toImport,finalPath);content=content.replace(toReplace,toImport);});}return content};var processHTML=function(){var _ref=_asyncToGenerator(function*(content,file){var _process_files$html,_process_files$html$e,_process_files$html2;var exclude_require=(process_files===null||process_files===void 0?void 0:(_process_files$html=process_files.html)===null||_process_files$html===void 0?void 0:(_process_files$html$e=_process_files$html.exclude)===null||_process_files$html$e===void 0?void 0:_process_files$html$e.htmlImport)||false;var doImport=true;if(exclude_require){var _iterator=_createForOfIteratorHelper(exclude_require),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var exclude=_step.value;if(RegExp(exclude,"gm").test(basename(file))){doImport=false;break}}}catch(err){_iterator.e(err);}finally{_iterator.f();}}_asyncToGenerator(function*(){if(!doImport)return;var dirs=dirname(file).split(sep);var srcFile=basename(file);var preRegex=dirs.map(function(dir){return "(".concat(dir,"/)?")});var finalRegex=new RegExp("".concat(preRegex.join("")).concat(srcFile),"gim");var files=yield listFiles(source,"html");var _iterator2=_createForOfIteratorHelper(files),_step2;try{for(_iterator2.s();!(_step2=_iterator2.n()).done;){var searchFile=_step2.value;if(searchFile===file)continue;var searchContent=fs.readFileSync(searchFile,"utf-8");if(searchContent.match(finalRegex))fs.writeFileSync(searchFile.replace(source,to),yield processHTML(searchContent,searchFile));}}catch(err){_iterator2.e(err);}finally{_iterator2.f();}})();if(doImport)content=putHTML(content,file);if(!(process_files!==null&&process_files!==void 0&&(_process_files$html2=process_files.html)!==null&&_process_files$html2!==void 0&&_process_files$html2.minify))return content;try{var new_content=minify(content,{removeAttributeQuotes:false,removeComments:true,minifyCSS:true,minifyJS:true,preserveLineBreaks:false,collapseWhitespace:true});if(!!new_content)content=new_content.trim();}catch(e){}finally{var _process_files$html3,_content;var import_like_scss=(process_files===null||process_files===void 0?void 0:(_process_files$html3=process_files.html)===null||_process_files$html3===void 0?void 0:_process_files$html3.htmlImportLikeSass)||false;if(import_like_scss&&/^_(.*).html$/.test(basename(file)))return "skip-this-file";if(!content||((_content=content)===null||_content===void 0?void 0:_content.trim().length)===0)return "";return content}});return function processHTML(_x,_x2){return _ref.apply(this,arguments)}}();

var rmTemp=function(){var _ref=_asyncToGenerator(function*(){var currentDir=fs.readdirSync("./");var _iterator=_createForOfIteratorHelper(currentDir),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var dir=_step.value;if(!/^temp_/.test(dir))continue;yield exec("rm -rf ./".concat(dir));}}catch(err){_iterator.e(err);}finally{_iterator.f();}});return function rmTemp(){return _ref.apply(this,arguments)}}();

_asyncToGenerator(function*(){var loading=new draft("".concat(sh.bold,"Building"),"circle");yield deleteDS_Store();var to=build.output;var _final=to.replace(/^\./,"");yield watchClose();try{var buildFiles=function(){var _ref2=_asyncToGenerator(function*(){var files=yield listFiles(source);var types=[];var typesOver=[];var count=0;var blacklistCount=0;var _iterator=_createForOfIteratorHelper(files),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var file=_step.value;var type=".".concat(file.split(".").pop());if(type.length>=10||types.length>=10){if(!typesOver.includes(type))typesOver.push(type);continue}if(!types.includes(type))types.push(type);}}catch(err){_iterator.e(err);}finally{_iterator.f();}var moreTypes=typesOver.length>0?" and ".concat(typesOver.length," more"):"";var loading=new draft("","dots",false);var prefix=function prefix(){return "Compiling ".concat(sh.bold).concat(sh.blue).concat(count).concat(sh.reset).concat(sh.dim).concat(sh.white," of ").concat(sh.reset).concat(sh.bold).concat(sh.blue).concat(files.length).concat(sh.reset," files: ")};loading.start();if(files.length===0){loading.stop(1,"Nothing to compile");return}var _iterator2=_createForOfIteratorHelper(files),_step2;try{var _loop=function*_loop(){var file=_step2.value;var inBlacklist=blacklist.some(function(item){return !!file.match(vReg(item,"gi"))});if(inBlacklist){blacklistCount++;return "continue"}loading.string="".concat(prefix()).concat(sh.blue).concat(file);var fileType=file.split(".").pop().toLowerCase();var finalFile=file.replace(source,to);var pathFile=file.split(sep);pathFile.pop();pathFile=pathFile.join(sep);if(fileType==="js")yield processJS(file,to,"build",false);else if(fileType==="scss"||fileType==="css")yield processCSS(file,to,"build");else {var original=yield post_process({src:file,response:true,local:"build",to:finalFile});var minified=false;if(original!=="skip-this-file"){if(!no_process(file)){if(fileType==="php"||fileType==="phtml")minified=yield processPHP(original);else if(fileType==="html")minified=yield processHTML(original,file);else if(fileType==="htaccess")minified=yield processHTACCESS(original);}if(minified!=="skip-this-file"){createDir(pathFile.replace(source,to));fs.writeFileSync(finalFile,!minified?original:minified);}}}count++;};for(_iterator2.s();!(_step2=_iterator2.n()).done;){var _ret=yield*_loop();if(_ret==="continue")continue}}catch(err){_iterator2.e(err);}finally{_iterator2.f();}loading.stop(1,"".concat(prefix()).concat(sh.blue).concat(types.join(", ")).concat(moreTypes));if(blacklistCount>0)console.log("".concat(sh.blue,"\u2139 ").concat(sh.reset).concat(sh.bold).concat(blacklistCount).concat(sh.reset," file(s) in Blacklist"));});return function buildFiles(){return _ref2.apply(this,arguments)}}();var resolveConflicts=function(){var _ref3=_asyncToGenerator(function*(){var loading=new draft("Resolving possible conflicts");if(fs.existsSync("".concat(_final,".zip")))fs.unlinkSync("".concat(_final,".zip"));if(fs.existsSync(to))fs.rmSync(to,{recursive:true,force:true});loading.stop(1);});return function resolveConflicts(){return _ref3.apply(this,arguments)}}();var gerarDeploy=function(){var _ref4=_asyncToGenerator(function*(){var loading=new draft("Compressing built files");try{var files=(yield listFiles(to))||[];var output=fs.createWriteStream("".concat(_final,".zip"));var archive=archiver("zip",{zlib:{level:(build===null||build===void 0?void 0:build.level)||0}});archive.pipe(output);var _iterator3=_createForOfIteratorHelper(files),_step3;try{for(_iterator3.s();!(_step3=_iterator3.n()).done;){var file=_step3.value;archive.file(file,{name:file});}}catch(err){_iterator3.e(err);}finally{_iterator3.f();}yield archive.finalize();loading.stop(1,"Successfully compressed into: ".concat(sh.underscore).concat(sh.blue).concat(sh.bold,"./").concat(_final,".zip"));}catch(error){loading.stop(1,"Nothing to compress");}});return function gerarDeploy(){return _ref4.apply(this,arguments)}}();var clearTemp=function(){var _ref5=_asyncToGenerator(function*(){var loading=new draft("Deleting temporary files");yield rmTemp();if(fs.existsSync("".concat(source).concat(sep,"exit")))fs.unlinkSync("".concat(source).concat(sep,"exit"));if(fs.existsSync(to))fs.rmSync(to,{recursive:true,force:true});loading.stop(1);});return function clearTemp(){return _ref5.apply(this,arguments)}}();var msToTime=function msToTime(s){function pad(n,z){z=z||2;return ("00"+n).slice(-z)}var ms=s%1000;s=(s-ms)/1000;var secs=s%60;s=(s-secs)/60;var mins=s%60;var hrs=(s-mins)/60;return "".concat(pad(hrs),":").concat(pad(mins),":").concat(pad(secs))};console.log();var startTime=performance.now();yield resolveConflicts();yield buildFiles();yield gerarDeploy();yield clearTemp();console.log();loading.stop(1,"Finished in ".concat(sh.green).concat(msToTime(performance.now()-startTime)));}catch(e){loading.stop(0,"".concat(sh.red,"Error: ").concat(sh.reset).concat(e));process.exit(1);}})();
