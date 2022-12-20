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
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function (method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
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

DraftLog(console);var sh={yellow:"\x1B[33m",green:"\x1B[32m",cyan:"\x1B[36m",white:"\x1B[37m",blue:"\x1B[34m",magenta:"\x1B[35m",red:"\x1B[31m",dim:"\x1B[2m",underscore:"\x1B[4m",bright:"\x1B[22m",reset:"\x1B[0m",bold:"\x1B[1m",italic:"\x1B[3m",clear:"\x1Bc"};var colorByType={html:sh.cyan,php:sh.magenta,css:sh.blue,scss:sh.blue,js:sh.yellow};function type(file){var _type;var ext=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;var type;if(file.includes(".html"))type="html";else if(file.includes(".php"))type="php";else if(file.includes(".css"))type="css";else if(file.includes(".scss"))type="scss";else if(file.includes(".js"))type="js";if(ext)return "".concat(colorByType[type]||sh.cyan).concat((_type=type)!==null&&_type!==void 0&&_type.toUpperCase()?type.toUpperCase():file.split(".").pop().toUpperCase()||"??");else return colorByType[type]||sh.white}var draft=_createClass(function draft(string){var _this=this;var style=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"dots";var start=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;_classCallCheck(this,draft);this.string=string;this.loading={dots:["\u280B","\u280B","\u2839","\u2838","\u283C","\u2834","\u2826","\u2827","\u2807","\u280F"],circle:["\u25DC","\u25E0","\u25DD","\u25DE","\u25E1","\u25DF"]};this.style=style;this.color=sh.yellow;this.message=console.draft("");this.status={0:"".concat(sh.red,"\u2716"),1:"".concat(sh.green,"\u2714"),2:"".concat(sh.yellow,"\u26A0"),3:"".concat(sh.blue,"\u2139")};this.start=function(){var i=0;var interval=_this.loading[_this.style]==="dots"?50:150;_this.timer=setInterval(function(){if(i>=_this.loading[_this.style].length)i=0;var current=_this.loading[_this.style][i++];_this.message("".concat(sh.bold).concat(sh.bright).concat(_this.color).concat(current," ").concat(sh.reset).concat(_this.string));},interval);};this.stop=function(status){var string=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;clearInterval(_this.timer);if(!!string)_this.string=string;_this.message("".concat(sh.bold).concat(sh.bright).concat(_this.status[status]," ").concat(sh.reset).concat(_this.string));return};start&&this.start();});

var createDir = (function(directory){var directorys=[];if(typeof directory==="string")directorys.push(directory);else if(_typeof(directory)==="object")Object.assign(directorys,directory);directorys.forEach(function(dir){dir=normalize(dir);if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true});});});

var isWindows=platform()==="win32";(function(){var meta=dirname(decodeURI(new URL(import.meta.url).pathname));var currentPath=isWindows?meta.substring(1):meta;var paths=currentPath.split("/");var rootIndex=paths.lastIndexOf("simple-web-cli");return resolve(paths.splice(0,rootIndex+1).join(sep))})();var cwd=normalize("file:///".concat(process.cwd()));

var setConfig=function(){var _ref=_asyncToGenerator(_regeneratorRuntime().mark(function _callee(){var _args$,_output$ftp,_output$ftp2,_output$ftp2$start,_output$ftp3,_output$ftp3$start,_output$ftp4,_output$ftp4$start,_output$ftp4$start$ho,_output$ftp5,_output$ftp5$start,_output$ftp6,_output$ftp6$start,_output$ftp6$start$us,_output$ftp7,_output$ftp7$start,_output$ftp8,_output$ftp8$start,_output$ftp8$start$pa,_output$ftp9,_output$ftp9$start,_output$ftp10,_output$ftp10$start,_output$build;var _process$argv,args,arg,config,output,isValid,validations,source,to,required,dev,dist,process_files,build,plugins,options,blacklist;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_process$argv=_toArray(process.argv),args=_process$argv.slice(2);arg=((_args$=args[0])===null||_args$===void 0?void 0:_args$.replace(/-/g,""))||"start";_context.next=4;return import(join("./".concat(cwd),".swrc.js"));case 4:config=_context.sent;output=_objectSpread2(_objectSpread2({},{}),config["default"]);isValid=function isValid(arr){return !arr.some(function(validation){return validation===false})};validations={ftp:[!!(output!==null&&output!==void 0&&output.ftp),!!(output!==null&&output!==void 0&&(_output$ftp=output.ftp)!==null&&_output$ftp!==void 0&&_output$ftp.start),typeof(output===null||output===void 0?void 0:(_output$ftp2=output.ftp)===null||_output$ftp2===void 0?void 0:(_output$ftp2$start=_output$ftp2.start)===null||_output$ftp2$start===void 0?void 0:_output$ftp2$start.root)==="string",typeof(output===null||output===void 0?void 0:(_output$ftp3=output.ftp)===null||_output$ftp3===void 0?void 0:(_output$ftp3$start=_output$ftp3.start)===null||_output$ftp3$start===void 0?void 0:_output$ftp3$start.host)==="string"&&(output===null||output===void 0?void 0:(_output$ftp4=output.ftp)===null||_output$ftp4===void 0?void 0:(_output$ftp4$start=_output$ftp4.start)===null||_output$ftp4$start===void 0?void 0:(_output$ftp4$start$ho=_output$ftp4$start.host)===null||_output$ftp4$start$ho===void 0?void 0:_output$ftp4$start$ho.trim().length)>0,typeof(output===null||output===void 0?void 0:(_output$ftp5=output.ftp)===null||_output$ftp5===void 0?void 0:(_output$ftp5$start=_output$ftp5.start)===null||_output$ftp5$start===void 0?void 0:_output$ftp5$start.user)==="string"&&(output===null||output===void 0?void 0:(_output$ftp6=output.ftp)===null||_output$ftp6===void 0?void 0:(_output$ftp6$start=_output$ftp6.start)===null||_output$ftp6$start===void 0?void 0:(_output$ftp6$start$us=_output$ftp6$start.user)===null||_output$ftp6$start$us===void 0?void 0:_output$ftp6$start$us.trim().length)>0,typeof(output===null||output===void 0?void 0:(_output$ftp7=output.ftp)===null||_output$ftp7===void 0?void 0:(_output$ftp7$start=_output$ftp7.start)===null||_output$ftp7$start===void 0?void 0:_output$ftp7$start.pass)==="string"&&(output===null||output===void 0?void 0:(_output$ftp8=output.ftp)===null||_output$ftp8===void 0?void 0:(_output$ftp8$start=_output$ftp8.start)===null||_output$ftp8$start===void 0?void 0:(_output$ftp8$start$pa=_output$ftp8$start.pass)===null||_output$ftp8$start$pa===void 0?void 0:_output$ftp8$start$pa.trim().length)>0,(output===null||output===void 0?void 0:(_output$ftp9=output.ftp)===null||_output$ftp9===void 0?void 0:(_output$ftp9$start=_output$ftp9.start)===null||_output$ftp9$start===void 0?void 0:_output$ftp9$start.secure)==="explict"||(output===null||output===void 0?void 0:(_output$ftp10=output.ftp)===null||_output$ftp10===void 0?void 0:(_output$ftp10$start=_output$ftp10.start)===null||_output$ftp10$start===void 0?void 0:_output$ftp10$start.secure)===true]};if(!isValid(validations.ftp)){output.ftp={start:{root:"",host:"",user:"",pass:"",secure:""}};}source=normalize(output.workspaces.src.replace("./",""));to=normalize(output.workspaces.dist.replace("./",""));required=normalize(".library/");if(source.substring(source.length-1,source.length)===sep)source=source.substring(0,source.length-1);if(to.substring(to.length-1,to.length)===sep)to=to.substring(0,to.length-1);if(required.substring(required.length-1,required.length)===sep)required=required.substring(0,required.length-1);dev={ftp:output.ftp.start};dist={ftp:output.ftp.build};process_files=arg==="build"&&output!==null&&output!==void 0&&(_output$build=output.build)!==null&&_output$build!==void 0&&_output$build.compile?output.build.compile:output.start.compile;build=(output===null||output===void 0?void 0:output.build)||false;plugins=(output===null||output===void 0?void 0:output.plugins)||false;options=(output===null||output===void 0?void 0:output.options)||false;blacklist=output.hasOwnProperty("blacklist")?output.blacklist:[]||[];process_files.js.require=required;createDir([source,to,required]);return _context.abrupt("return",{source:source,to:to,dev:dev,dist:dist,process_files:process_files,build:build,options:options,plugins:plugins,blacklist:blacklist});case 25:case"end":return _context.stop();}}},_callee)}));return function setConfig(){return _ref.apply(this,arguments)}}();var _await$setConfig=await setConfig(),source=_await$setConfig.source,to=_await$setConfig.to,dev=_await$setConfig.dev;_await$setConfig.dist;var process_files=_await$setConfig.process_files;_await$setConfig.build;_await$setConfig.options;var plugins=_await$setConfig.plugins,blacklist=_await$setConfig.blacklist;

var watchClose = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(){return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:fs.writeFileSync("".concat(source).concat(sep,"exit"),"");if(fs.existsSync("".concat(source).concat(sep,"exit")))fs.unlinkSync("".concat(source).concat(sep,"exit"));case 2:case"end":return _context.stop();}}},_callee)}));

var isConnected = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(){var url,isConnected,_args=arguments;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:isConnected=function _isConnected(){try{return new Promise(function(resolve){var client=http2.connect(url);client.on("connect",function(){resolve(true);client.destroy();});client.on("error",function(){resolve(false);client.destroy();});})}catch(_unused){}};url=_args.length>0&&_args[0]!==undefined?_args[0]:"https://www.google.com/";_context.next=5;return isConnected();case 5:return _context.abrupt("return",_context.sent);case 6:case"end":return _context.stop();}}},_callee)}));

var serverOSNormalize = (function(path){if(dev["is-windows-server"])return win32.normalize(path);path=path.replace(/\\\\/g,"/");path=path.replace(/\\/g,"/");return path});

var client=new Client;var publicCachedAccess={};var privateCachedAccess={};function reconnect(){return _reconnect.apply(this,arguments)}function _reconnect(){_reconnect=_asyncToGenerator(_regeneratorRuntime().mark(function _callee(){return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return connect();case 2:case"end":return _context.stop();}}},_callee)}));return _reconnect.apply(this,arguments)}function showCHMOD(path){console.log("".concat(sh.red).concat(sh.dim).concat(sh.bold,"\u26A0 ").concat(sh.reset).concat(sh.dim,"CHMOD no applied to \"").concat(sh.red).concat(sh.bold).concat(path).concat(sh.reset).concat(sh.dim,"\""));}function connect(){return _connect.apply(this,arguments)}function _connect(){_connect=_asyncToGenerator(_regeneratorRuntime().mark(function _callee2(){var access,_args2=arguments;return _regeneratorRuntime().wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:access=_args2.length>0&&_args2[0]!==undefined?_args2[0]:false;client.error=false;if(access!==false){Object.assign(privateCachedAccess,access);publicCachedAccess.root=access.root;if(access!==null&&access!==void 0&&access.chmod)publicCachedAccess.chmod=access.chmod;}_context2.prev=3;_context2.next=6;return isConnected();case 6:if(!_context2.sent){_context2.next=9;break}_context2.next=9;return client.access({host:privateCachedAccess.host,port:(privateCachedAccess===null||privateCachedAccess===void 0?void 0:privateCachedAccess.port)||21,user:privateCachedAccess.user,password:privateCachedAccess.pass,root:privateCachedAccess.root,secure:privateCachedAccess.secure,secureOptions:{rejectUnauthorized:false},passvTimeout:10000,keepalive:30000});case 9:return _context2.abrupt("return",true);case 12:_context2.prev=12;_context2.t0=_context2["catch"](3);client.error="".concat(sh.reset).concat(sh.red).concat(_context2.t0);return _context2.abrupt("return",false);case 16:case"end":return _context2.stop();}}},_callee2,null,[[3,12]])}));return _connect.apply(this,arguments)}function send(_x,_x2){return _send.apply(this,arguments)}function _send(){_send=_asyncToGenerator(_regeneratorRuntime().mark(function _callee5(file,waiting){var _publicCachedAccess$c3,_publicCachedAccess$c5,receiver,dir,remoteFile,exists,_publicCachedAccess$c,_publicCachedAccess$c2,dirs,dirsLenght,path,i,_publicCachedAccess$c4,_publicCachedAccess$c6;return _regeneratorRuntime().wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:_context5.prev=0;client.error=false;if(!client.closed){_context5.next=5;break}_context5.next=5;return reconnect();case 5:receiver=file.replace("".concat(to).concat(sep),"");dir=serverOSNormalize(dirname("".concat(privateCachedAccess.root).concat(sep).concat(receiver)));remoteFile=serverOSNormalize("".concat(privateCachedAccess.root).concat(sep).concat(receiver));exists=function(){var _ref=_asyncToGenerator(_regeneratorRuntime().mark(function _callee3(){var _yield$client$list;return _regeneratorRuntime().wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.prev=0;_context3.next=3;return client===null||client===void 0?void 0:client.list(dir);case 3:_context3.t2=_yield$client$list=_context3.sent;_context3.t1=_context3.t2===null;if(_context3.t1){_context3.next=7;break}_context3.t1=_yield$client$list===void 0;case 7:if(!_context3.t1){_context3.next=11;break}_context3.t3=void 0;_context3.next=12;break;case 11:_context3.t3=_yield$client$list.length;case 12:_context3.t4=_context3.t3;_context3.t0=_context3.t4>0;if(_context3.t0){_context3.next=16;break}_context3.t0=false;case 16:return _context3.abrupt("return",_context3.t0);case 19:_context3.prev=19;_context3.t5=_context3["catch"](0);return _context3.abrupt("return",false);case 22:case"end":return _context3.stop();}}},_callee3,null,[[0,19]])}));return function exists(){return _ref.apply(this,arguments)}}();_context5.next=11;return exists();case 11:if(_context5.sent){_context5.next=23;break}_context5.next=14;return client.ensureDir(dir);case 14:if(!(publicCachedAccess!==null&&publicCachedAccess!==void 0&&(_publicCachedAccess$c=publicCachedAccess.chmod)!==null&&_publicCachedAccess$c!==void 0&&_publicCachedAccess$c.dir)){_context5.next=23;break}_context5.prev=15;_context5.next=18;return client.ftp.request("SITE CHMOD ".concat(publicCachedAccess===null||publicCachedAccess===void 0?void 0:(_publicCachedAccess$c2=publicCachedAccess.chmod)===null||_publicCachedAccess$c2===void 0?void 0:_publicCachedAccess$c2.dir," ").concat(dir));case 18:_context5.next=23;break;case 20:_context5.prev=20;_context5.t0=_context5["catch"](15);showCHMOD(dir);case 23:if(!(publicCachedAccess!==null&&publicCachedAccess!==void 0&&(_publicCachedAccess$c3=publicCachedAccess.chmod)!==null&&_publicCachedAccess$c3!==void 0&&_publicCachedAccess$c3.recursive)){_context5.next=41;break}dirs=dirname(receiver).split(sep);dirsLenght=dirs.length;path=privateCachedAccess.root;i=0;case 28:if(!(i<dirsLenght)){_context5.next=41;break}path+="/".concat(dirs[i]);_context5.prev=30;_context5.next=33;return client.ftp.request("SITE CHMOD ".concat(publicCachedAccess===null||publicCachedAccess===void 0?void 0:(_publicCachedAccess$c4=publicCachedAccess.chmod)===null||_publicCachedAccess$c4===void 0?void 0:_publicCachedAccess$c4.dir," ").concat(path));case 33:_context5.next=38;break;case 35:_context5.prev=35;_context5.t1=_context5["catch"](30);showCHMOD(path);case 38:i++;_context5.next=28;break;case 41:_context5.next=43;return client.uploadFrom(file,serverOSNormalize("".concat(privateCachedAccess.root).concat(sep).concat(receiver)));case 43:if(!(publicCachedAccess!==null&&publicCachedAccess!==void 0&&(_publicCachedAccess$c5=publicCachedAccess.chmod)!==null&&_publicCachedAccess$c5!==void 0&&_publicCachedAccess$c5.file)){_context5.next=52;break}_context5.prev=44;_context5.next=47;return client.ftp.request("SITE CHMOD ".concat(publicCachedAccess===null||publicCachedAccess===void 0?void 0:(_publicCachedAccess$c6=publicCachedAccess.chmod)===null||_publicCachedAccess$c6===void 0?void 0:_publicCachedAccess$c6.file," ").concat(remoteFile));case 47:_context5.next=52;break;case 49:_context5.prev=49;_context5.t2=_context5["catch"](44);showCHMOD(remoteFile);case 52:_context5.next=54;return new Promise(function(){var _ref2=_asyncToGenerator(_regeneratorRuntime().mark(function _callee4(resolve){var _waiting$scheduling;var timer;return _regeneratorRuntime().wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:timer=setInterval(resolve);if(!(waiting!==null&&waiting!==void 0&&(_waiting$scheduling=waiting.scheduling)!==null&&_waiting$scheduling!==void 0&&_waiting$scheduling.started)){clearInterval(timer);resolve();}case 2:case"end":return _context4.stop();}}},_callee4)}));return function(_x4){return _ref2.apply(this,arguments)}}());case 54:return _context5.abrupt("return",true);case 57:_context5.prev=57;_context5.t3=_context5["catch"](0);client.error="".concat(sh.dim).concat(sh.red).concat(_context5.t3);return _context5.abrupt("return",false);case 61:case"end":return _context5.stop();}}},_callee5,null,[[0,57],[15,20],[30,35],[44,49]])}));return _send.apply(this,arguments)}function remove(_x3){return _remove.apply(this,arguments)}function _remove(){_remove=_asyncToGenerator(_regeneratorRuntime().mark(function _callee6(file){var isDir,receiver,_args6=arguments;return _regeneratorRuntime().wrap(function _callee6$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:isDir=_args6.length>1&&_args6[1]!==undefined?_args6[1]:false;_context6.prev=1;client.error=false;receiver=file.replace("".concat(to).concat(sep),"");if(!client.closed){_context6.next=7;break}_context6.next=7;return reconnect(file);case 7:if(isDir){_context6.next=12;break}_context6.next=10;return client.remove(normalize("".concat(privateCachedAccess.root).concat(sep).concat(receiver)));case 10:_context6.next=14;break;case 12:_context6.next=14;return client.removeDir(serverOSNormalize("".concat(privateCachedAccess.root).concat(sep).concat(receiver)));case 14:return _context6.abrupt("return",true);case 17:_context6.prev=17;_context6.t0=_context6["catch"](1);client.error="".concat(sh.dim).concat(sh.red).concat(_context6.t0);return _context6.abrupt("return",false);case 21:case"end":return _context6.stop();}}},_callee6,null,[[1,17]])}));return _remove.apply(this,arguments)}var FTP = {client:client,publicCachedAccess:publicCachedAccess,connect:connect,send:send,remove:remove};

var empty = (function(str){return (str===null||str===void 0?void 0:str.trim().length)===0?true:false});

var ListFiles=_createClass(function ListFiles(){var _this=this;_classCallCheck(this,ListFiles);this.files=[];this.excludeDir=[];this.isTypeExpected=function(file,expected){if(expected===false)return true;var isValid=false;var types=[];var currentFileType=file.split(".").pop();if(typeof expected==="string")types.push(expected);else if(_typeof(expected)==="object")Object.assign(types,expected);for(var type in types){if(currentFileType.includes(types[type])){isValid=true;break}}return isValid};this.getFiles=function(){var _ref=_asyncToGenerator(_regeneratorRuntime().mark(function _callee(directory,type){var excludeDir,filesList,file,stat,_args=arguments;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:excludeDir=_args.length>2&&_args[2]!==undefined?_args[2]:false;if(excludeDir)_this.excludeDir.push(excludeDir.replace("./",""));filesList=fs.readdirSync(directory);_context.t0=_regeneratorRuntime().keys(filesList);case 5:if((_context.t1=_context.t0()).done){_context.next=20;break}file=_context.t1.value;stat=fs.statSync("".concat(directory).concat(sep).concat(filesList[file]));if(!_this.excludeDir.includes(directory)){_context.next=12;break}return _context.abrupt("return",false);case 12:if(!stat.isDirectory()){_context.next=17;break}_context.next=15;return _this.getFiles("".concat(directory).concat(sep).concat(filesList[file]),type);case 15:_context.next=18;break;case 17:if(_this.isTypeExpected(filesList[file],type))_this.files.push("".concat(directory).concat(sep).concat(filesList[file]));case 18:_context.next=5;break;case 20:return _context.abrupt("return",_this.files);case 21:case"end":return _context.stop();}}},_callee)}));return function(_x,_x2){return _ref.apply(this,arguments)}}();});var listFiles=function(){var _ref2=_asyncToGenerator(_regeneratorRuntime().mark(function _callee2(directory){var type,excludeDir,files,list,_args2=arguments;return _regeneratorRuntime().wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:type=_args2.length>1&&_args2[1]!==undefined?_args2[1]:false;excludeDir=_args2.length>2&&_args2[2]!==undefined?_args2[2]:false;files=new ListFiles;_context2.next=6;return files.getFiles(directory,type,excludeDir);case 6:list=_context2.sent;files.files=[];return _context2.abrupt("return",list);case 9:case"end":return _context2.stop();}}},_callee2)}));return function listFiles(_x3){return _ref2.apply(this,arguments)}}();

var exec = (function(cmd){return new Promise(function(resolve){return exec$1(cmd,function(error){return resolve(!!error?false:true)})})});

var deleteDS_Store = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(){return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:if(!(process.platform!=="darwin")){_context.next=2;break}return _context.abrupt("return");case 2:_context.next=4;return exec("find . -name \".DS_Store\" -type f -delete");case 4:case"end":return _context.stop();}}},_callee)}));

function vReg(string){var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"g";var validate_string=string.replace(/\//g,"\\/").replace(/\./g,"\\.").replace(/\*/g,"\\*").replace(/\$/g,"\\$").replace(/\+/g,"\\+").replace(/\?/g,"\\?").replace(/\|/g,"\\|").replace(/\[/g,"\\[").replace(/\]/g,"\\]").replace(/\(/g,"\\(").replace(/\)/g,"\\)").replace(/\{/g,"\\{").replace(/\}/g,"\\}");return new RegExp(validate_string,options)}

function path(file){var path=file.split(sep);path.pop();return path.join(sep)}

function no_process(file){var exclude_files=(process_files===null||process_files===void 0?void 0:process_files.exclude)||false;var result=false;if(exclude_files){var _iterator=_createForOfIteratorHelper(exclude_files),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var exclude=_step.value;if(vReg(exclude).test(file)){result=true;break}}}catch(err){_iterator.e(err);}finally{_iterator.f();}}return result}

var get_post_replace=function get_post_replace(){var post_replaces={config:true,strings:false};if(!(plugins!==null&&plugins!==void 0&&plugins.stringReplace))return post_replaces;var set_post_replaces=plugins.stringReplace;if(set_post_replaces!==null&&set_post_replaces!==void 0&&set_post_replaces.strings)if(Object.keys(set_post_replaces.strings).length>0)post_replaces.strings=set_post_replaces.strings;if(set_post_replaces!==null&&set_post_replaces!==void 0&&set_post_replaces.config)post_replaces.config=set_post_replaces===null||set_post_replaces===void 0?void 0:set_post_replaces.config;return post_replaces};

var resourceReplace = (function(file,local){var _resources$replace;if(!plugins)return false;var resources=(plugins===null||plugins===void 0?void 0:plugins.resourceReplace)||false;if(!(resources!==null&&resources!==void 0&&(_resources$replace=resources.replace)!==null&&_resources$replace!==void 0&&_resources$replace[local]))return false;var src=(resources===null||resources===void 0?void 0:resources.src)||".resources";var dest=file.replace(source,src);if(!fs.existsSync(dest))return false;return dest});

var post_process=function(){var _ref=_asyncToGenerator(_regeneratorRuntime().mark(function _callee(){var options,rejectTypes,config,src,to,local,response,get_replaces,isValid,fileType,isReplaceable,sampleContent,content,new_content,string,regex,stringToReplace,_args=arguments;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:options=_args.length>0&&_args[0]!==undefined?_args[0]:{};rejectTypes=[/\.tiff$/i,/\.tif$/i,/\.bmp$/i,/\.jpg$/i,/\.jpeg$/i,/\.jpe$/i,/\.jfif$/i,/\.png$/i,/\.gif$/i,/\.webp$/i,/\.avif$/i,/\.psd$/i,/\.psb$/i,/\.exif$/i,/\.raw$/i,/\.ai$/i,/\.crd$/i,/\.eps$/i,/\.woff$/i,/\.woff2$/i,/\.eot$/i,/\.otd$/i,/\.otf$/i,/\.ttf$/i,/\.ttc$/i,/\.avi$/i,/\.wmv$/i,/\.mov$/i,/\.flv$/i,/\.rm$/i,/\.mp4$/i,/\.mkv$/i,/\.mks$/i,/\.3gpp$/i,/\.aac$/i,/\.ac3$/i,/\.ac4$/i,/\.mp3$/i,/\.m4a$/i,/\.aiff$/i,/\.wav$/i,/\.ogg$/i,/\.alac$/i,/\.flac$/i,/\.pcm$/i,/\.pdf$/i,/\.xlsx$/i,/\.xltx$/i,/\.xlsm$/i,/\.xltm$/i,/\.xlsb$/i,/\.xls$/i,/\.xlt$/i,/\.xlam$/i,/\.xla$/i,/\.xlw$/i,/\.xla$/i,/\.xlr$/i,/\.ods$/i,/\.doc$/i,/\.docx$/i,/\.odt$/i,/\.dot$/i,/\.dotm$/i,/\.xps$/i,/\.wps$/i,/\.pptx$/i,/\.pptm$/i,/\.ppt$/i,/\.potx$/i,/\.potm$/i,/\.pot$/i,/\.ppsx$/i,/\.ppsm$/i,/\.pps$/i,/\.ppam$/i,/\.ppa$/i,/\.wmf$/i,/\.emf$/i,/\.rtf$/i,/\.odp$/i,/\.zip(\.[0-9]{1,})?$/i,/\.rar(\.[0-9]{1,})?$/i,/\.7z$/i,/\.z[0-9]{1,}?$/i,/\.gz$/i,/\.z$/i,/\.tar$/i,/\.tgz$/i,/\.bz2$/i,/\.(z|gz|tar|tgz|bz2)\.part/i];config={src:options.src||false,to:options.to||false,local:options.local||"start",response:options.response||false};src=config.src,to=config.to,local=config.local,response=config.response;if(response){_context.next=9;break}if(!(!src||!to)){_context.next=7;break}return _context.abrupt("return",false);case 7:if(fs.existsSync(src)){_context.next=9;break}return _context.abrupt("return",false);case 9:get_replaces=get_post_replace();isValid=!rejectTypes.some(function(regex){return regex.test(extname(src))});fileType=src.split(".").pop().toLowerCase();isReplaceable=function isReplaceable(){try{if(get_replaces.config===true)return true;if(get_replaces.config[fileType]===true)return true;if(get_replaces.config.others===true)return true;return false}catch(e){return false}};sampleContent=resourceReplace(src,local)||src;if(isValid){_context.next=18;break}_context.next=17;return exec("mkdir -p ".concat(dirname(to)," && cp ").concat(sampleContent," ").concat(to));case 17:return _context.abrupt("return","skip-this-file");case 18:content=fs.readFileSync(sampleContent,"utf8");_context.prev=19;if(isReplaceable()){new_content=content;for(string in get_replaces.strings){if(string.split("*").length===3&&string.substring(0,1)==="*"&&string.substring(string.length,string.length-1)==="*"){regex=RegExp(string.replace(/\*/gim,"\\*"),"gim");stringToReplace=get_replaces===null||get_replaces===void 0?void 0:get_replaces.strings[string][local];if(!stringToReplace||empty(stringToReplace)){if(local==="start"&&!empty(get_replaces.strings[string]["build"]))stringToReplace=get_replaces.strings[string]["build"];else if(local==="build"&&!empty(get_replaces.strings[string]["start"]))stringToReplace=get_replaces.strings[string]["start"];else stringToReplace="";}if(stringToReplace||empty(stringToReplace))new_content=new_content.replace(regex,stringToReplace);}}if(!!new_content)content=new_content;}_context.next=25;break;case 23:_context.prev=23;_context.t0=_context["catch"](19);case 25:_context.prev=25;if(!(response===true)){_context.next=30;break}return _context.abrupt("return",content);case 30:fs.writeFileSync(to,content);case 31:return _context.finish(25);case 32:case"end":return _context.stop();}}},_callee,null,[[19,23,25,32]])}));return function post_process(){return _ref.apply(this,arguments)}}();

function processCSS(_x){return _processCSS.apply(this,arguments)}function _processCSS(){_processCSS=_asyncToGenerator(_regeneratorRuntime().mark(function _callee(file){var local,replace,_,fileType,tempDIR,files,filename,_file,regex,_content,isValid,localTo,tempCSS,tempPath,_final,process,request,content,uglified,_args=arguments;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:local=_args.length>1&&_args[1]!==undefined?_args[1]:false;replace=_args.length>2&&_args[2]!==undefined?_args[2]:"start";_=file.split(sep).pop().substr(0,1)==="_"?true:false;fileType=file.split(".").pop().toLowerCase();tempDIR="temp_".concat(new Date().valueOf().toString());if(!(fileType==="scss"&&process_files.hasOwnProperty("scss")&&process_files.scss===false)){_context.next=9;break}createDir([path(file.replace(source,to))]);fs.copyFileSync(file,file.replace(source,to));return _context.abrupt("return",true);case 9:if(!(_&&fileType==="scss")){_context.next=16;break}_context.next=12;return listFiles(source,"scss");case 12:files=_context.sent;filename=file.split(sep).pop().replace(/_/,"").replace(/.scss/,"");for(_file in files){regex=RegExp("(@import).*?(\"|')((\\.\\/|\\.\\.\\/){1,})?((.*?\\/){1,})?(_)?(".concat(filename,")(\\.scss)?(\"|')"),"g");_content=fs.readFileSync(files[_file],"utf8");isValid=!!_content.match(regex);if(isValid)processCSS(files[_file],local,replace);}return _context.abrupt("return",true);case 16:localTo=!local?to:local;tempCSS=file.replace(source,tempDIR).replace(".scss",".css");tempPath=path(file.replace(source,tempDIR));_final=tempCSS.replace(tempDIR,localTo);process=!no_process(fileType==="scss"?tempCSS.replace(".css",".scss"):tempCSS);createDir([tempPath,tempPath.replace(tempDIR,localTo)]);if(!(fileType==="scss")){_context.next=28;break}_context.next=25;return exec("npx sass --quiet \"".concat(file,"\":\"").concat(tempCSS,"\" --no-source-map").concat(process_files.css.uglifycss&&process?" --style compressed":""));case 25:request=_context.sent;_context.next=29;break;case 28:if(fileType==="css"){fs.copyFileSync(file,tempCSS);request=true;}case 29:_context.t0="/* autoprefixer grid: autoplace */ ";_context.next=32;return post_process({src:tempCSS,response:true,local:replace});case 32:_context.t1=_context.sent;content=_context.t0.concat.call(_context.t0,_context.t1);fs.writeFileSync(tempCSS,content);if(!(process&&process_files.css.autoprefixer)){_context.next=38;break}_context.next=38;return exec("npx postcss \"".concat(tempCSS,"\" --use autoprefixer -o \"").concat(tempCSS,"\" --no-map"));case 38:uglified=process_files.css.uglifycss&&process?uglifycss.processFiles([tempCSS],{uglyComments:true}):fs.readFileSync(tempCSS,"utf8");fs.writeFileSync(_final,uglified);if(!fs.existsSync(tempDIR)){_context.next=43;break}_context.next=43;return exec("rm -rf ./".concat(tempDIR));case 43:return _context.abrupt("return",request);case 44:case"end":return _context.stop();}}},_callee)}));return _processCSS.apply(this,arguments)}

var requiredResources=process_files.js.require;var packageName=JSON.parse(fs.readFileSync(".library/package.json","utf8"));function getLine$1(search,content){var index=content.indexOf(search);var tempString=content.substring(0,index);return tempString.split(EOL).length}function recursive_require(_x,_x2){return _recursive_require.apply(this,arguments)}function _recursive_require(){_recursive_require=_asyncToGenerator(_regeneratorRuntime().mark(function _callee(file,replace){var backup,requireds,content,_loop,required;return _regeneratorRuntime().wrap(function _callee$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return post_process({src:file,response:true,local:replace});case 2:backup=_context2.sent;requireds=backup.match(/((const|let|var).*?{?(.*)}?.*)?require\((.*?)\)(.\w+)?;?/gim);content=backup;_loop=_regeneratorRuntime().mark(function _loop(required){var fixPath,origins,regex,requiredName,exist_require,require,current,outputContent,outputModule,isModule,evalResources,_exec,_exec$groups,_exec2,_exec2$groups,_exec3,_exec3$groups,pipeModules,isPipe,nameVarPipe,requiredModules,key,typeVAR,_exec4,_exec4$groups,_typeVAR,nameVAR;return _regeneratorRuntime().wrap(function _loop$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.prev=0;fixPath=requireds[required].replace(/\.\.\//gim,"").replace("./","");origins=requiredResources.split(sep);if(origins.length>1)origins.forEach(function(folder){return fixPath=fixPath.replace(folder,"")});else fixPath=fixPath.replace(requiredResources,"");regex=/(require\([''`])(.+?)([''`]\);?)/;requiredName=regex.exec(fixPath)[2].replace(RegExp(packageName.name.replace(/\//,"\\/"),"gim"),"");exist_require=function exist_require(){var required_path=normalize("".concat(requiredResources).concat(sep).concat(requiredName));if(fs.existsSync("".concat(required_path).concat(sep,"index.js")))return "".concat(required_path).concat(sep,"index.js");throw "The file \"".concat(sh.yellow).concat(required_path).concat(sep,"index.js").concat(sh.reset,"\" was not found in the library. Line ").concat(getLine$1(requireds[required],backup)," from \"").concat(sh.yellow).concat(file).concat(sh.reset,"\"")};require=exist_require();current=fs.readFileSync(require,"utf-8");outputContent="";outputModule=/module|exports/;isModule=outputModule.test(current)?outputModule.exec(current)[2]:false;if(!(typeof isModule!=="boolean")){_context.next=41;break}evalResources=eval(current);if(!(_typeof(evalResources)==="object")){_context.next=38;break}pipeModules=[];isPipe=((_exec=_wrapRegExp(/require.*\.(\w+)/gim,{getModules:1}).exec(requireds[required].replace(/\s/gm,"")))===null||_exec===void 0?void 0:(_exec$groups=_exec.groups)===null||_exec$groups===void 0?void 0:_exec$groups.getModules)||false;nameVarPipe=((_exec2=_wrapRegExp(/(const|let|var).*?(\w+).*?require/,{getPipeModule:2}).exec(requireds[required]))===null||_exec2===void 0?void 0:(_exec2$groups=_exec2.groups)===null||_exec2$groups===void 0?void 0:_exec2$groups.getPipeModule)||false;if(isPipe)pipeModules.push(isPipe);requiredModules=isPipe?pipeModules:((_exec3=_wrapRegExp(/\{\s?(.*)\s?\}.*?=.*?require/gim,{getModules:1}).exec(requireds[required].replace(/\s/gm,"")))===null||_exec3===void 0?void 0:(_exec3$groups=_exec3.groups)===null||_exec3$groups===void 0?void 0:_exec3$groups.getModules.split(","))||[];_context.t0=_regeneratorRuntime().keys(evalResources);case 21:if((_context.t1=_context.t0()).done){_context.next=35;break}key=_context.t1.value;typeVAR=requireds[required].match(/const|let|var/gim);if(!requiredModules.includes(key)){_context.next=32;break}if(!(typeof evalResources[key]!=="function")){_context.next=29;break}current=current.replace(/([^:\/\/])(\/{2}.*?)|((\/\*[\s\S]*?\*\/|^\s*$)|(module|exports).+;?)/gim,"").trim();outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(current).concat(EOL);return _context.abrupt("continue",21);case 29:if(!!typeVAR)outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(typeVAR," ").concat(isPipe?nameVarPipe:key," = ").concat(evalResources[key],";").concat(EOL);else console.log("".concat(sh.red,"\u26A0").concat(sh.reset," Bad module call in \"").concat(sh.yellow).concat(file).concat(sh.reset,"\": ").concat(getLine$1(requireds[required],backup)));_context.next=33;break;case 32:if(!typeVAR){console.log("".concat(sh.red,"\u26A0").concat(sh.reset," No variable type defined for the module in \"").concat(sh.yellow).concat(file).concat(sh.reset,"\": ").concat(getLine$1(requireds[required],backup)));}case 33:_context.next=21;break;case 35:requiredModules.forEach(function(wrongModule){if(evalResources[wrongModule])return;console.log("".concat(sh.red,"\u26A0").concat(sh.reset," \"").concat(wrongModule,"\" not found in \"").concat(sh.yellow).concat(require).concat(sh.reset,"\". Line: ").concat(getLine$1(wrongModule,backup)," from \"").concat(sh.yellow).concat(file).concat(sh.reset,"\""));});_context.next=39;break;case 38:if(typeof evalResources==="function"){_typeVAR=requireds[required].match(/const|let|var/gim)||false;nameVAR=((_exec4=_wrapRegExp(/(const|let|var).*?(\w+)/,{nameVAR:2}).exec(requireds[required]))===null||_exec4===void 0?void 0:(_exec4$groups=_exec4.groups)===null||_exec4$groups===void 0?void 0:_exec4$groups.nameVAR)||false;if(!!_typeVAR&&!!nameVAR)outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(_typeVAR," ").concat(nameVAR," = ").concat(evalResources,";");else {outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(evalResources.toString()).concat(EOL);}}case 39:_context.next=43;break;case 41:current=current.replace(/([^:\/\/])(\/{2}.*?)|((\/\*[\s\S]*?\*\/|^\s*$))/gim,"").trim();outputContent+="// Imported from '".concat(require,"'").concat(EOL).concat(current).concat(EOL);case 43:if(!regex.test(outputContent)){_context.next=47;break}_context.next=46;return recursive_require(require,replace);case 46:outputContent=_context.sent;case 47:content=content.replace(requireds[required],outputContent);_context.next=53;break;case 50:_context.prev=50;_context.t2=_context["catch"](0);console.log("".concat(sh.red,"\u26A0").concat(sh.reset," ").concat(_context.t2));case 53:case"end":return _context.stop();}}},_loop,null,[[0,50]])});_context2.t0=_regeneratorRuntime().keys(requireds);case 7:if((_context2.t1=_context2.t0()).done){_context2.next=12;break}required=_context2.t1.value;return _context2.delegateYield(_loop(required),"t2",10);case 10:_context2.next=7;break;case 12:return _context2.abrupt("return",content);case 13:case"end":return _context2.stop();}}},_callee)}));return _recursive_require.apply(this,arguments)}function processJS(_x3){return _processJS.apply(this,arguments)}function _processJS(){_processJS=_asyncToGenerator(_regeneratorRuntime().mark(function _callee5(file){var local,replace,_,filename,regex,files,_file,content,localTo,tempDIR,pre,tempJS,_final,pre_process,_pre_process,process,_process,post_process$1,_post_process,request,_args6=arguments;return _regeneratorRuntime().wrap(function _callee5$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:_post_process=function _post_process3(){_post_process=_asyncToGenerator(_regeneratorRuntime().mark(function _callee4(){var content;return _regeneratorRuntime().wrap(function _callee4$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:content=fs.readFileSync(pre,"utf8");fs.writeFileSync(_final,content);case 2:case"end":return _context5.stop();}}},_callee4)}));return _post_process.apply(this,arguments)};post_process$1=function _post_process2(){return _post_process.apply(this,arguments)};_process=function _process3(){_process=_asyncToGenerator(_regeneratorRuntime().mark(function _callee3(){var _process_files$js2,_process_files$js3;var error,_request,_request2;return _regeneratorRuntime().wrap(function _callee3$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:error=false;if(!no_process(pre)){_context4.next=3;break}return _context4.abrupt("return");case 3:if(!(process_files!==null&&process_files!==void 0&&(_process_files$js2=process_files.js)!==null&&_process_files$js2!==void 0&&_process_files$js2.babel)){_context4.next=8;break}_context4.next=6;return exec("npx --quiet babel \"".concat(pre,"\" -o \"").concat(pre,"\""));case 6:_request=_context4.sent;if(!_request)error=true;case 8:if(!(process_files!==null&&process_files!==void 0&&(_process_files$js3=process_files.js)!==null&&_process_files$js3!==void 0&&_process_files$js3.uglify)){_context4.next=13;break}_context4.next=11;return exec("npx --quiet uglifyjs \"".concat(pre,"\" -o \"").concat(pre,"\" -c -m"));case 11:_request2=_context4.sent;if(!_request2)error=true;case 13:return _context4.abrupt("return",error);case 14:case"end":return _context4.stop();}}},_callee3)}));return _process.apply(this,arguments)};process=function _process2(){return _process.apply(this,arguments)};_pre_process=function _pre_process3(){_pre_process=_asyncToGenerator(_regeneratorRuntime().mark(function _callee2(){var _process_files$js,_process_files$js$exc;var exclude_files,result,_iterator,_step,exclude,content;return _regeneratorRuntime().wrap(function _callee2$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:exclude_files=(process_files===null||process_files===void 0?void 0:(_process_files$js=process_files.js)===null||_process_files$js===void 0?void 0:(_process_files$js$exc=_process_files$js.exclude)===null||_process_files$js$exc===void 0?void 0:_process_files$js$exc.requireBrowser)||false;result=false;if(!exclude_files){_context3.next=21;break}_iterator=_createForOfIteratorHelper(exclude_files);_context3.prev=4;_iterator.s();case 6:if((_step=_iterator.n()).done){_context3.next=13;break}exclude=_step.value;if(!vReg(exclude).test(file)){_context3.next=11;break}result=true;return _context3.abrupt("break",13);case 11:_context3.next=6;break;case 13:_context3.next=18;break;case 15:_context3.prev=15;_context3.t0=_context3["catch"](4);_iterator.e(_context3.t0);case 18:_context3.prev=18;_iterator.f();return _context3.finish(18);case 21:if(result){_context3.next=27;break}_context3.next=24;return recursive_require(file,replace);case 24:_context3.t1=_context3.sent;_context3.next=30;break;case 27:_context3.next=29;return post_process({src:file,response:true,local:replace});case 29:_context3.t1=_context3.sent;case 30:content=_context3.t1;fs.writeFileSync(pre,content);case 32:case"end":return _context3.stop();}}},_callee2,null,[[4,15,18,21]])}));return _pre_process.apply(this,arguments)};pre_process=function _pre_process2(){return _pre_process.apply(this,arguments)};local=_args6.length>1&&_args6[1]!==undefined?_args6[1]:false;replace=_args6.length>2&&_args6[2]!==undefined?_args6[2]:"start";_=/\.library/.test(file)?true:false;if(!_){_context6.next=17;break}filename=file.split(sep).pop().replace(/.js/,"");regex=RegExp("require.*?".concat(filename));_context6.next=14;return listFiles(source,"js",requiredResources);case 14:files=_context6.sent;for(_file in files){content=fs.readFileSync(files[_file],"utf8");if(regex.test(content))processJS(files[_file],local);}return _context6.abrupt("return");case 17:localTo=!local?to:local;tempDIR="temp_".concat(new Date().valueOf().toString());pre=file.replace(source,tempDIR);tempJS=path(pre);_final=file.replace(source,localTo);createDir([tempDIR,tempJS,tempJS.replace(tempDIR,localTo)]);_context6.next=25;return pre_process();case 25:_context6.next=27;return process();case 27:request=_context6.sent;_context6.next=30;return post_process$1();case 30:if(!fs.existsSync(tempDIR)){_context6.next=33;break}_context6.next=33;return exec("rm -rf ./".concat(tempDIR));case 33:return _context6.abrupt("return",!request);case 34:case"end":return _context6.stop();}}},_callee5)}));return _processJS.apply(this,arguments)}

var processPHP=function processPHP(content){var _content,_process_files$php;if(!content||((_content=content)===null||_content===void 0?void 0:_content.trim().length)===0)return "";else if(!(process_files!==null&&process_files!==void 0&&(_process_files$php=process_files.php)!==null&&_process_files$php!==void 0&&_process_files$php.minify))return content;try{var new_content=content;var strings_PHP=new_content.match(/(('.*?')|(".*?")|(`.*?`))/gim);var backup_strings_PHP={};for(var key in strings_PHP){var id="\"".concat(Math.random().toString(36).substr(2,9)).concat(Math.random().toString(36).substr(2,9),"\"");backup_strings_PHP[id]=strings_PHP[key];new_content=new_content.replace(strings_PHP[key],id);}new_content=new_content.replace(/(\/\*[\s\S]*?\*\/)|(\/{2}.*)|(\<!--[^\[][\w\W]*?-->)/gim,"").replace(/[\s]{2,}|[\n]{1,}|[\r]{1,}|[\t]{1,}/gim," ").replace(/(<\?\s)|(<\?\n)|(<\?\r)|(<\?\t)/gim,"<?php ").replace(/\s{\s|\s{|{\s/gim,"{").replace(/\s}\s|\s}|}\s/gim,"}").replace(/\s\(\s|\s\(|\(\s/gim,"(").replace(/\s\)\s|\s\)|\)\s/gim,")").replace(/\s\[\s|\s\[|\[\s/gim,"[").replace(/\s\]\s|\s\]|\]\s/gim,"]").replace(/\s;\s|\s;|;\s/gim,";").replace(/\s:\s|\s:|:\s/gim,":").replace(/\s-\s|\s-|-\s/gim,"-").replace(/\s\+\s|\s\+|\+\s/gim,"+").replace(/\s\*\s|\s\*|\*\s/gim,"*").replace(/\s\/\s|\s\/|\/\s/gim,"/").replace(/\s%\s|\s%|%\s/gim,"%").replace(/\s!\s|\s!|!\s/gim,"!").replace(/\s\?\s|\s\?|\?\s/gim,"?").replace(/\s=\s|\s=|=\s/gim,"=").replace(/\s<\s|\s<|<\s/gim,"<").replace(/\s>\s|\s>|>\s/gim,">").replace(/\s\^\s|\s\^|\^\s/gim,"^").replace(/\sAND\s|\sAND|AND\s/gim,"AND").replace(/\sOR\s|\sOR|OR\s/gim,"OR").replace(/\sXOR\s|\sXOR|XOR\s/gim,"XOR").replace(/\s&\s|\s&|&\s/gim,"&").replace(/\s\|\s|\s\||\|\s/gim,"|").replace(/\s\.\s|\s\.|\.\s/gim,".").replace(/\s,\s|\s,|,\s/gim,",").replace(/\s'\s|\s'|'\s/gim,"'").replace(/\s"\s|\s"|"\s/gim,"\"").replace(/\s`\s|\s`|`\s/gim,"`").replace(/<\?=\s/gim,"<?=").replace(/ \?>/gim,"?>").replace(/<\?php/gim,"<?php ").replace(/(?:\s)\s/gim," ").replace(/^\s.?\s|[\s]{1,}$/gim,"");for(var _id in backup_strings_PHP){new_content=new_content.replace(_id,backup_strings_PHP[_id]);}if(!!new_content)content=new_content.trim();}catch(e){}finally{return content}};

function getLine(search,content){var index=content.indexOf(search);var tempString=content.substring(0,index);return tempString.split(EOL).length}var putHTML=function putHTML(content,file){var importRegex=/<!--.*?import\(("|')(.*)("|')\).*?-->/gim;var getImports=content.match(importRegex)||[];if(getImports.length>0){var backup=content;getImports.forEach(function(importHTML){var _exec,_exec$groups;var extractPath=((_exec=_wrapRegExp(/<!\x2D\x2D.*?import\(("|')(.*)("|')\).*?\x2D\x2D>/gim,{"import":2}).exec(importHTML))===null||_exec===void 0?void 0:(_exec$groups=_exec.groups)===null||_exec$groups===void 0?void 0:_exec$groups["import"])||false;var finalPath=normalize("".concat(dirname(file),"/").concat(extractPath.replace(/(^\.?\/)/gm,"")));var toReplace=vReg(importHTML,"gim");if(!fs.existsSync(finalPath)){console.log("".concat(sh.red,"\u26A0").concat(sh.reset," \"").concat(sh.cyan).concat(extractPath).concat(sh.reset,"\" not found. Line ").concat(getLine(importHTML,backup)," from \"").concat(sh.cyan).concat(file).concat(sh.reset,"\""));return}var toImport=fs.readFileSync(finalPath,"utf-8");if(importRegex.test(toImport))toImport=putHTML(toImport,finalPath);content=content.replace(toReplace,toImport);});}return content};var processHTML=function(){var _ref=_asyncToGenerator(_regeneratorRuntime().mark(function _callee2(content,file){var _process_files$html,_process_files$html$e,_process_files$html2;var exclude_require,doImport,_iterator,_step,exclude,new_content,_process_files$html3,_content,import_like_scss;return _regeneratorRuntime().wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:exclude_require=(process_files===null||process_files===void 0?void 0:(_process_files$html=process_files.html)===null||_process_files$html===void 0?void 0:(_process_files$html$e=_process_files$html.exclude)===null||_process_files$html$e===void 0?void 0:_process_files$html$e.htmlImport)||false;doImport=true;if(!exclude_require){_context2.next=21;break}_iterator=_createForOfIteratorHelper(exclude_require);_context2.prev=4;_iterator.s();case 6:if((_step=_iterator.n()).done){_context2.next=13;break}exclude=_step.value;if(!RegExp(exclude,"gm").test(basename(file))){_context2.next=11;break}doImport=false;return _context2.abrupt("break",13);case 11:_context2.next=6;break;case 13:_context2.next=18;break;case 15:_context2.prev=15;_context2.t0=_context2["catch"](4);_iterator.e(_context2.t0);case 18:_context2.prev=18;_iterator.f();return _context2.finish(18);case 21:_asyncToGenerator(_regeneratorRuntime().mark(function _callee(){var dirs,srcFile,preRegex,finalRegex,files,_iterator2,_step2,searchFile,searchContent;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:if(doImport){_context.next=2;break}return _context.abrupt("return");case 2:dirs=dirname(file).split(sep);srcFile=basename(file);preRegex=dirs.map(function(dir){return "(".concat(dir,"/)?")});finalRegex=new RegExp("".concat(preRegex.join("")).concat(srcFile),"gim");_context.next=8;return listFiles(source,"html");case 8:files=_context.sent;_iterator2=_createForOfIteratorHelper(files);_context.prev=10;_iterator2.s();case 12:if((_step2=_iterator2.n()).done){_context.next=26;break}searchFile=_step2.value;if(!(searchFile===file)){_context.next=16;break}return _context.abrupt("continue",24);case 16:searchContent=fs.readFileSync(searchFile,"utf-8");if(!searchContent.match(finalRegex)){_context.next=24;break}_context.t0=fs;_context.t1=searchFile.replace(source,to);_context.next=22;return processHTML(searchContent,searchFile);case 22:_context.t2=_context.sent;_context.t0.writeFileSync.call(_context.t0,_context.t1,_context.t2);case 24:_context.next=12;break;case 26:_context.next=31;break;case 28:_context.prev=28;_context.t3=_context["catch"](10);_iterator2.e(_context.t3);case 31:_context.prev=31;_iterator2.f();return _context.finish(31);case 34:case"end":return _context.stop();}}},_callee,null,[[10,28,31,34]])}))();if(doImport)content=putHTML(content,file);if(process_files!==null&&process_files!==void 0&&(_process_files$html2=process_files.html)!==null&&_process_files$html2!==void 0&&_process_files$html2.minify){_context2.next=25;break}return _context2.abrupt("return",content);case 25:_context2.prev=25;new_content=minify(content,{removeAttributeQuotes:false,removeComments:true,minifyCSS:true,minifyJS:true,preserveLineBreaks:false,collapseWhitespace:true});if(!!new_content)content=new_content.trim();_context2.next=32;break;case 30:_context2.prev=30;_context2.t1=_context2["catch"](25);case 32:_context2.prev=32;import_like_scss=(process_files===null||process_files===void 0?void 0:(_process_files$html3=process_files.html)===null||_process_files$html3===void 0?void 0:_process_files$html3.htmlImportLikeSass)||false;if(!(import_like_scss&&/^_(.*).html$/.test(basename(file)))){_context2.next=36;break}return _context2.abrupt("return","skip-this-file");case 36:if(!(!content||((_content=content)===null||_content===void 0?void 0:_content.trim().length)===0)){_context2.next=38;break}return _context2.abrupt("return","");case 38:return _context2.abrupt("return",content);case 40:case"end":return _context2.stop();}}},_callee2,null,[[4,15,18,21],[25,30,32,40]])}));return function processHTML(_x,_x2){return _ref.apply(this,arguments)}}();

var processHTACCESS=function processHTACCESS(content){var _content,_process_files$htacce;if(!content||((_content=content)===null||_content===void 0?void 0:_content.trim().length)===0)return "";else if(!(process_files!==null&&process_files!==void 0&&(_process_files$htacce=process_files.htaccess)!==null&&_process_files$htacce!==void 0&&_process_files$htacce.minify))return content;try{var new_content=content;new_content=content.replace(/#.*/gim,"").replace(/^\s+|\s+$/gim,"\r\n").replace(/(\t{2,})|(\r{2,})|(\n{2,})/gim,"").replace(/^\s.?\s|[\s]{1,}$/gim,"");if(!!new_content)content=new_content.trim();}catch(e){}finally{return content}};

var Schedule=_createClass(function Schedule(){_classCallCheck(this,Schedule);this.scheduling={busy:false,queuing:[],started:false,current:"",exceed:[]};this.queue=function(callback){var name=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"";var _this$scheduling=this.scheduling,queuing=_this$scheduling.queuing,exceed=_this$scheduling.exceed;if(this.scheduling.started===false){queuing.push({name:name,service:callback});}else {exceed.push({name:name,service:callback});}};this.start=function(){var _ref=_asyncToGenerator(_regeneratorRuntime().mark(function _callee4(options){var _this=this;var set_options,_this$scheduling2,queuing,exceed,recursive,timeInterval;return _regeneratorRuntime().wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:set_options={type:(options===null||options===void 0?void 0:options.type)||"recursive",timeInterval:(options===null||options===void 0?void 0:options.timeInterval)||0,recursive:(options===null||options===void 0?void 0:options.recursive)||true};this.scheduling.started=true;_this$scheduling2=this.scheduling,queuing=_this$scheduling2.queuing,exceed=_this$scheduling2.exceed;recursive=function(){var _ref2=_asyncToGenerator(_regeneratorRuntime().mark(function _callee2(){var waiting;return _regeneratorRuntime().wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:waiting=setInterval(_asyncToGenerator(_regeneratorRuntime().mark(function _callee(){var key,_this$scheduling3;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.t0=_regeneratorRuntime().keys(queuing);case 1:if((_context.t1=_context.t0()).done){_context.next=13;break}key=_context.t1.value;if(!(_this.scheduling.busy===true)){_context.next=5;break}return _context.abrupt("return");case 5:_this.scheduling.busy=true;_this.scheduling.current=queuing[key].name;_context.next=9;return queuing[key].service();case 9:queuing.splice(queuing[key],1);_this.scheduling.busy=false;_context.next=1;break;case 13:if(queuing.length===0){if(exceed.length>0)queuing.push(exceed.shift());else if(exceed.length===0){_this.scheduling.started=false;clearInterval(waiting);if((_this$scheduling3=_this.scheduling)!==null&&_this$scheduling3!==void 0&&_this$scheduling3.file)delete _this.scheduling.file;}}case 14:case"end":return _context.stop();}}},_callee)})),set_options.timeInterval);case 1:case"end":return _context2.stop();}}},_callee2)}));return function recursive(){return _ref2.apply(this,arguments)}}();timeInterval=function timeInterval(){var timer=0;var _loop=function _loop(key){setTimeout(_asyncToGenerator(_regeneratorRuntime().mark(function _callee3(){return _regeneratorRuntime().wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.next=2;return queuing[key].service();case 2:return _context3.abrupt("return",_context3.sent);case 3:case"end":return _context3.stop();}}},_callee3)})),timer+=set_options.timeInterval);};for(var key in queuing){_loop(key);}};if(!(set_options.type==="recursive"===true)){_context4.next=10;break}_context4.next=8;return recursive();case 8:_context4.next=11;break;case 10:timeInterval();case 11:case"end":return _context4.stop();}}},_callee4,this)}));return function(_x){return _ref.apply(this,arguments)}}();});

var autoDeploy = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(){var loading,_dev$ftp,host,user,pass,pre_connect,conn,deploy,watcherSource,watcherMain,watcherModules,onSrc;return _regeneratorRuntime().wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:loading={ftp:new draft("","circle",false)};console.log();loading.ftp.start();loading.ftp.string="".concat(sh.bold,"FTP:").concat(sh.reset," ").concat(sh.dim,"Connecting");_dev$ftp=dev.ftp,host=_dev$ftp.host,user=_dev$ftp.user,pass=_dev$ftp.pass;pre_connect=!empty(host)||!empty(user)||!empty(pass);if(!pre_connect){_context5.next=12;break}_context5.next=9;return FTP.connect(dev.ftp);case 9:_context5.t0=_context5.sent;_context5.next=13;break;case 12:_context5.t0=false;case 13:conn=_context5.t0;if(!conn){FTP.client.close();loading.ftp.stop(3,"".concat(sh.dim).concat(sh.bold,"FTP:").concat(sh.reset).concat(sh.dim," No connected"));}else loading.ftp.stop(1,"".concat(sh.bold,"FTP:").concat(sh.reset," ").concat(sh.dim,"Connected"));deploy=new Schedule;watcherSource=watch(source,{recursive:true});watcherMain=watch(to,{recursive:true});watcherModules=watch(".library",{recursive:true});onSrc=function(){var _ref2=_asyncToGenerator(_regeneratorRuntime().mark(function _callee(event,file){var _deploy$scheduling;var inBlacklist,isDir,log,fileType,finalFile,pathFile,status,request,_request,original,minified;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:if(!file.match(/DS_Store/)){_context.next=4;break}_context.next=3;return deleteDS_Store();case 3:return _context.abrupt("return");case 4:if(file==="".concat(source).concat(sep,"exit")){FTP.client.close();watcherSource.close();watcherMain.close();watcherModules.close();process.exit(0);}inBlacklist=blacklist.some(function(item){return !!file.match(vReg(item,"gi"))});if(!inBlacklist){_context.next=9;break}console.log("".concat(sh.blue,"\u2139").concat(sh.reset," Ignoring file in blacklist: \"").concat(sh.bold).concat(file).concat(sh.reset,"\""));return _context.abrupt("return");case 9:isDir=file.split(sep).pop().includes(".")?false:true;if(!(event=="update"&&isDir)){_context.next=12;break}return _context.abrupt("return");case 12:if((_deploy$scheduling=deploy.scheduling)!==null&&_deploy$scheduling!==void 0&&_deploy$scheduling.file){_context.next=16;break}deploy.scheduling.file=file;_context.next=18;break;case 16:if(!(deploy.scheduling.file===file)){_context.next=18;break}return _context.abrupt("return");case 18:log={building:new draft("","dots",false)};fileType=file.split(".").pop().toLowerCase();finalFile=file.replace(source,to);pathFile=file.split(sep);pathFile.pop();pathFile=pathFile.join(sep);if(!(event==="update")){_context.next=68;break}log.building.start();log.building.string="Building ".concat(sh.dim,"from").concat(sh.reset," \"").concat(sh.bold).concat(type(file)).concat(file).concat(sh.reset,"\"");status=1;if(!(fileType==="js")){_context.next=35;break}_context.next=31;return processJS(file);case 31:request=_context.sent;if(!request)status=0;_context.next=65;break;case 35:if(!(fileType==="scss"||fileType==="css")){_context.next=42;break}_context.next=38;return processCSS(file);case 38:_request=_context.sent;if(!_request)status=0;_context.next=65;break;case 42:_context.next=44;return post_process({src:file,response:true,to:finalFile});case 44:original=_context.sent;minified=false;if(!(original!=="skip-this-file")){_context.next=65;break}if(no_process(file)){_context.next=64;break}if(!(fileType==="php"||fileType==="phtml")){_context.next=54;break}_context.next=51;return processPHP(original);case 51:minified=_context.sent;_context.next=64;break;case 54:if(!(fileType==="html")){_context.next=60;break}_context.next=57;return processHTML(original,file);case 57:minified=_context.sent;_context.next=64;break;case 60:if(!(fileType==="htaccess")){_context.next=64;break}_context.next=63;return processHTACCESS(original);case 63:minified=_context.sent;case 64:if(minified!=="skip-this-file"){createDir(pathFile.replace(source,to));fs.writeFileSync(finalFile,!minified?original:minified);}case 65:log.building.stop(status);_context.next=69;break;case 68:if(event==="remove"){log.building.start();log.building.string="Removed ".concat(sh.dim,"from").concat(sh.reset," \"").concat(sh.bold).concat(type(file)).concat(file).concat(sh.reset,"\"");if(isDir)fs.rmSync(finalFile,{recursive:true,force:true});else {if(fs.existsSync(finalFile))fs.unlinkSync(finalFile);if(fileType==="scss"){if(fs.existsSync(finalFile.replace(".scss",".css")))fs.unlinkSync(finalFile.replace(".scss",".css"));}}log.building.stop(1);}case 69:case"end":return _context.stop();}}},_callee)}));return function onSrc(_x,_x2){return _ref2.apply(this,arguments)}}();watcherSource.on("change",function(event,file){return onSrc(event,file)});watcherMain.on("change",function(){var _ref3=_asyncToGenerator(_regeneratorRuntime().mark(function _callee3(event,file){var connected,deployFile,_deployFile,isDir;return _regeneratorRuntime().wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_deployFile=function _deployFile3(){_deployFile=_asyncToGenerator(_regeneratorRuntime().mark(function _callee2(){var log,action;return _regeneratorRuntime().wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:log={status:new draft("","dots",false)};if(connected&&conn)log.deploy=new draft("","dots",false);log.status.start();(log===null||log===void 0?void 0:log.deploy)&&log.deploy.start();if(event=="update"){log.status.stop(1,"Copied ".concat(sh.dim,"to").concat(sh.reset," \"").concat(type(deploy.scheduling.current)).concat(sh.bold).concat(deploy.scheduling.current).concat(sh.reset,"\""));if(connected&&conn)log.deploy.string="Deploying ".concat(sh.dim,"to").concat(sh.reset," \"").concat(type(deploy.scheduling.current)).concat(sh.bold).concat(serverOSNormalize(deploy.scheduling.current.replace(to,FTP.publicCachedAccess.root))).concat(sh.reset,"\"");}else {log.status.stop(1,"Removed ".concat(sh.dim,"from").concat(sh.reset," \"").concat(type(deploy.scheduling.current)).concat(sh.bold).concat(deploy.scheduling.current).concat(sh.reset,"\""));if(connected&&conn)log.deploy.string="Removing ".concat(sh.dim,"from").concat(sh.reset," \"").concat(type(deploy.scheduling.current)).concat(sh.bold).concat(serverOSNormalize(deploy.scheduling.current.replace(to,FTP.publicCachedAccess.root))).concat(sh.reset,"\"");}if(!(connected&&conn)){_context2.next=17;break}if(!(event=="update")){_context2.next=12;break}_context2.next=9;return FTP.send(file,deploy);case 9:_context2.t0=_context2.sent;_context2.next=15;break;case 12:_context2.next=14;return FTP.remove(file,isDir);case 14:_context2.t0=_context2.sent;case 15:action=_context2.t0;log.deploy.stop(!!action?1:0,FTP.client.error);case 17:case"end":return _context2.stop();}}},_callee2)}));return _deployFile.apply(this,arguments)};deployFile=function _deployFile2(){return _deployFile.apply(this,arguments)};if(!file.match(/DS_Store/)){_context3.next=6;break}_context3.next=5;return deleteDS_Store();case 5:return _context3.abrupt("return");case 6:_context3.next=8;return isConnected();case 8:connected=_context3.sent;isDir=file.split(sep).pop().includes(".")?false:true;if(!(event=="update"&&isDir)){_context3.next=12;break}return _context3.abrupt("return");case 12:deploy.queue(deployFile,file);_context3.next=15;return deploy.start();case 15:case"end":return _context3.stop();}}},_callee3)}));return function(_x3,_x4){return _ref3.apply(this,arguments)}}());watcherModules.on("change",function(){var _ref4=_asyncToGenerator(_regeneratorRuntime().mark(function _callee4(event,file){var isDir,library,required,requiredResources,js,_iterator,_step,dependence,file_dependence,to_process;return _regeneratorRuntime().wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:if(!file.match(/DS_Store/)){_context4.next=4;break}_context4.next=3;return deleteDS_Store();case 3:return _context4.abrupt("return");case 4:isDir=file.split(sep).pop().includes(".")?false:true;if(!(event=="update"&&isDir)){_context4.next=7;break}return _context4.abrupt("return");case 7:library=file.replace(/(\.library\/)|(\/index.js)/gim,"",file);required=RegExp("require.*?".concat(library),"gim");requiredResources=process_files.js.require;_context4.next=12;return listFiles(source,"js",requiredResources);case 12:js=_context4.sent;_iterator=_createForOfIteratorHelper(js);_context4.prev=14;_iterator.s();case 16:if((_step=_iterator.n()).done){_context4.next=26;break}dependence=_step.value;file_dependence=fs.readFileSync(dependence,"utf8");to_process=!!file_dependence.match(required);_context4.t0=to_process;if(!_context4.t0){_context4.next=24;break}_context4.next=24;return onSrc("update",dependence);case 24:_context4.next=16;break;case 26:_context4.next=31;break;case 28:_context4.prev=28;_context4.t1=_context4["catch"](14);_iterator.e(_context4.t1);case 31:_context4.prev=31;_iterator.f();return _context4.finish(31);case 34:case"end":return _context4.stop();}}},_callee4,null,[[14,28,31,34]])}));return function(_x5,_x6){return _ref4.apply(this,arguments)}}());return _context5.abrupt("return",true);case 24:case"end":return _context5.stop();}}},_callee5)}));

var rmTemp=function(){var _ref=_asyncToGenerator(_regeneratorRuntime().mark(function _callee(){var currentDir,_iterator,_step,dir;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:currentDir=fs.readdirSync("./");_iterator=_createForOfIteratorHelper(currentDir);_context.prev=2;_iterator.s();case 4:if((_step=_iterator.n()).done){_context.next=12;break}dir=_step.value;if(/^temp_/.test(dir)){_context.next=8;break}return _context.abrupt("continue",10);case 8:_context.next=10;return exec("rm -rf ./".concat(dir));case 10:_context.next=4;break;case 12:_context.next=17;break;case 14:_context.prev=14;_context.t0=_context["catch"](2);_iterator.e(_context.t0);case 17:_context.prev=17;_iterator.f();return _context.finish(17);case 20:case"end":return _context.stop();}}},_callee,null,[[2,14,17,20]])}));return function rmTemp(){return _ref.apply(this,arguments)}}();

_asyncToGenerator(_regeneratorRuntime().mark(function _callee(){var link,starting,success;return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:link=new draft("Linking the local package: ".concat(sh.green).concat(sh.dim,"[ .library: web ]"));_context.next=3;return exec("npm link .library");case 3:link.stop(1);_context.next=6;return watchClose();case 6:starting=new draft("Starting".concat(sh.dim).concat(sh.yellow," ... ").concat(sh.reset).concat(sh.bright),"circle");_context.next=9;return rmTemp();case 9:_context.next=11;return deleteDS_Store();case 11:if(fs.existsSync("temp"))fs.rmSync("temp",{recursive:true,force:true});if(fs.existsSync("".concat(source,"/exit")))fs.unlinkSync("".concat(source).concat(sep,"exit"));_context.next=15;return autoDeploy();case 15:success=_context.sent;if(success){_context.next=21;break}_context.next=19;return watchClose();case 19:starting.stop(0,"Falha ao iniciar processos");process.exit(1);case 21:starting.stop(1,"Watching".concat(sh.reset," ").concat(sh.green).concat(sh.bold,"YOU").concat(sh.reset).concat(sh.dim).concat(sh.green," ... ").concat(sh.reset).concat(sh.bright,"\uD83E\uDDDF"));case 22:case"end":return _context.stop();}}},_callee)}))();
