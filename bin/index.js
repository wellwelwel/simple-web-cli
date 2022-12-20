#! /usr/bin/env node

import fs from 'fs';
import { platform, EOL } from 'os';
import { dirname, resolve, sep, normalize, basename } from 'path';
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

var exec = (function (cmd) {
  return new Promise(function (resolve) {
    return exec$1(cmd, function (error) {
      return resolve(!!error ? false : true);
    });
  });
});

DraftLog(console);
var sh$1 = {
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
var draft = /*#__PURE__*/_createClass(function draft(string) {
  var _this = this;
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'dots';
  var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  _classCallCheck(this, draft);
  this.string = string;
  this.loading = {
    dots: ['⠋', '⠋', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    circle: ['◜', '◠', '◝', '◞', '◡', '◟']
  };
  this.style = style;
  this.color = sh$1.yellow;
  this.message = console.draft('');
  this.status = {
    0: "".concat(sh$1.red, "\u2716"),
    1: "".concat(sh$1.green, "\u2714"),
    2: "".concat(sh$1.yellow, "\u26A0"),
    3: "".concat(sh$1.blue, "\u2139")
  };
  this.start = function () {
    var i = 0;
    var interval = _this.loading[_this.style] === 'dots' ? 50 : 150;
    _this.timer = setInterval(function () {
      if (i >= _this.loading[_this.style].length) i = 0;
      var current = _this.loading[_this.style][i++];
      _this.message("".concat(sh$1.bold).concat(sh$1.bright).concat(_this.color).concat(current, " ").concat(sh$1.reset).concat(_this.string));
    }, interval);
  };
  this.stop = function (status) {
    var string = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    clearInterval(_this.timer);
    if (!!string) _this.string = string;
    _this.message("".concat(sh$1.bold).concat(sh$1.bright).concat(_this.status[status], " ").concat(sh$1.reset).concat(_this.string));
    return;
  };
  start && this.start();
});

var sh = function sh(command) {
  return new Promise(function (resolve, reject) {
    return exec$1(command, function (error, stdout) {
      return !!error ? reject(error) : resolve(stdout);
    });
  });
};
var latestVersion = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(packageName) {
    var _yield$sh, _packageName$trim;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return sh("npm view ".concat(packageName === null || packageName === void 0 ? void 0 : (_packageName$trim = packageName.trim()) === null || _packageName$trim === void 0 ? void 0 : _packageName$trim.toLowerCase(), " version"));
          case 2:
            _context.t1 = _yield$sh = _context.sent;
            _context.t0 = _context.t1 === null;
            if (_context.t0) {
              _context.next = 6;
              break;
            }
            _context.t0 = _yield$sh === void 0;
          case 6:
            if (!_context.t0) {
              _context.next = 10;
              break;
            }
            _context.t2 = void 0;
            _context.next = 11;
            break;
          case 10:
            _context.t2 = _yield$sh.trim();
          case 11:
            return _context.abrupt("return", _context.t2);
          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function latestVersion(_x) {
    return _ref.apply(this, arguments);
  };
}();

var rebuildFiles = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(arg) {
    var readJSON, buildJSON, packageFile, stage, orderJSON, dependencies, compatibility, _i, _dependencies, _packageFile$devDepen, _packageFile$dependen, _packageFile$bundleDe, dependence, _compatibility$depend;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            readJSON = function readJSON(file) {
              return JSON.parse(fs.readFileSync(file, 'utf-8'));
            };
            buildJSON = function buildJSON(obj) {
              return orderJSON(obj, 2);
            };
            packageFile = readJSON('package.json') || {};
            stage = {
              "package": false,
              babelrc: false,
              error: false,
              npm_i: false
            };
            orderJSON = function orderJSON(obj, space) {
              var allKeys = [];
              var seen = {};
              JSON.stringify(obj, function (key, value) {
                if (!(key in seen)) {
                  allKeys.push(key);
                  seen[key] = null;
                }
                return value;
              });
              allKeys.sort();
              return JSON.stringify(obj, allKeys, space);
            };
            dependencies = ['@babel/preset-env', '@rollup/plugin-alias', '@rollup/plugin-babel', 'autoprefixer', 'packages-update', 'postcss-cli', 'rollup', 'sass', 'uglify-js'];
            compatibility = {
              node: +process.version.split('.').shift().replace(/[^0-9]/, '') <= 14,
              dependencies: {
                'postcss-cli': '^8.3.1'
              }
            };
            /* package.json */
            _context.prev = 7;
            if (!(packageFile !== null && packageFile !== void 0 && packageFile.devDependencies)) packageFile.devDependencies = {};
            _i = 0, _dependencies = dependencies;
          case 10:
            if (!(_i < _dependencies.length)) {
              _context.next = 27;
              break;
            }
            dependence = _dependencies[_i];
            if (!(!(packageFile !== null && packageFile !== void 0 && (_packageFile$devDepen = packageFile.devDependencies) !== null && _packageFile$devDepen !== void 0 && _packageFile$devDepen[dependence]) && !(packageFile !== null && packageFile !== void 0 && (_packageFile$dependen = packageFile.dependencies) !== null && _packageFile$dependen !== void 0 && _packageFile$dependen[dependence]) && !(packageFile !== null && packageFile !== void 0 && (_packageFile$bundleDe = packageFile.bundleDependencies) !== null && _packageFile$bundleDe !== void 0 && _packageFile$bundleDe[dependence]))) {
              _context.next = 24;
              break;
            }
            if (!(compatibility.node && (_compatibility$depend = compatibility.dependencies) !== null && _compatibility$depend !== void 0 && _compatibility$depend[dependence])) {
              _context.next = 17;
              break;
            }
            packageFile.devDependencies[dependence] = compatibility.dependencies[dependence];
            _context.next = 22;
            break;
          case 17:
            _context.t0 = "^";
            _context.next = 20;
            return latestVersion(dependence);
          case 20:
            _context.t1 = _context.sent;
            packageFile.devDependencies[dependence] = _context.t0.concat.call(_context.t0, _context.t1);
          case 22:
            if (!stage["package"]) stage["package"] = true;
            if (!stage.npm_i) stage.npm_i = true;
          case 24:
            _i++;
            _context.next = 10;
            break;
          case 27:
            /* autoprefixer requires */
            if (!(packageFile !== null && packageFile !== void 0 && packageFile.browserslist)) {
              packageFile.browserslist = '> 0%';
              if (!stage["package"]) stage["package"] = true;
            }

            /* Dev */
            if (!(packageFile !== null && packageFile !== void 0 && packageFile.devDependencies)) packageFile.devDependencies = {};
            if (stage["package"]) fs.writeFileSync('package.json', buildJSON(packageFile));
            if (!stage.npm_i) {
              _context.next = 33;
              break;
            }
            _context.next = 33;
            return exec('npm i');
          case 33:
            _context.next = 40;
            break;
          case 35:
            _context.prev = 35;
            _context.t2 = _context["catch"](7);
            console.warn('Unable to get the needed resources into package.json.\nPlease, look at: https://github.com/wellwelwel/simple-web-cli/blob/main/package.json and insert "browserslist" and local dependence "web" manually\n');
            console.error("Error: ".concat(_context.t2.message, "\n"));
            if (!stage.error) stage.error = true;
          case 40:
            return _context.abrupt("return", !stage.error);
          case 41:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 35]]);
  }));
  return function rebuildFiles(_x) {
    return _ref.apply(this, arguments);
  };
}();

var isWindows = platform() === 'win32';
var __dirname = function () {
  var meta = dirname(decodeURI(new URL(import.meta.url).pathname));
  var currentPath = isWindows ? meta.substring(1) : meta;
  var paths = currentPath.split('/');
  var rootIndex = paths.lastIndexOf('simple-web-cli');
  return resolve(paths.splice(0, rootIndex + 1).join(sep));
}();
var cwd = normalize("file:///".concat(process.cwd()));

var ListFiles = /*#__PURE__*/_createClass(function ListFiles() {
  var _this = this;
  _classCallCheck(this, ListFiles);
  this.files = [];
  this.excludeDir = [];
  this.isTypeExpected = function (file, expected) {
    if (expected === false) return true;
    var isValid = false;
    var types = [];
    var currentFileType = file.split('.').pop();
    if (typeof expected === 'string') types.push(expected);else if (_typeof(expected) === 'object') Object.assign(types, expected);
    for (var type in types) {
      if (currentFileType.includes(types[type])) {
        isValid = true;
        break;
      }
    }
    return isValid;
  };
  this.getFiles = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(directory, type) {
      var excludeDir,
        filesList,
        file,
        stat,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              excludeDir = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
              if (excludeDir) _this.excludeDir.push(excludeDir.replace('./', ''));
              filesList = fs.readdirSync(directory);
              _context.t0 = _regeneratorRuntime().keys(filesList);
            case 5:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 20;
                break;
              }
              file = _context.t1.value;
              stat = fs.statSync("".concat(directory).concat(sep).concat(filesList[file]));
              if (!_this.excludeDir.includes(directory)) {
                _context.next = 12;
                break;
              }
              return _context.abrupt("return", false);
            case 12:
              if (!stat.isDirectory()) {
                _context.next = 17;
                break;
              }
              _context.next = 15;
              return _this.getFiles("".concat(directory).concat(sep).concat(filesList[file]), type);
            case 15:
              _context.next = 18;
              break;
            case 17:
              if (_this.isTypeExpected(filesList[file], type)) _this.files.push("".concat(directory).concat(sep).concat(filesList[file]));
            case 18:
              _context.next = 5;
              break;
            case 20:
              return _context.abrupt("return", _this.files);
            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
});
var listFiles = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(directory) {
    var type,
      excludeDir,
      files,
      list,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            type = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
            excludeDir = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;
            files = new ListFiles();
            _context2.next = 6;
            return files.getFiles(directory, type, excludeDir);
          case 6:
            list = _context2.sent;
            files.files = []; // 🤡
            return _context2.abrupt("return", list);
          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return function listFiles(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
  var _args$;
  var _process$argv, args, arg, isWindows, requires, filesCallback, alloweds, importing, _iterator, _step, require, gitignore, toIgnore, rebuilded, _yield$import, options;
  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _process$argv = _toArray(process.argv), args = _process$argv.slice(2);
          arg = ((_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.replace(/-/g, '')) || 'start';
          isWindows = platform() === 'win32';
          _context2.t0 = ['helpers'];
          _context2.next = 6;
          return listFiles("".concat(__dirname, "/resources"));
        case 6:
          _context2.t1 = _context2.sent.map(function (file) {
            return basename(file);
          });
          requires = {
            dirs: _context2.t0,
            files: _context2.t1
          };
          filesCallback = {
            'package.json': function () {
              var _packageJson = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return exec('npm i');
                      case 2:
                        return _context.abrupt("return", _context.sent);
                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));
              function packageJson() {
                return _packageJson.apply(this, arguments);
              }
              return packageJson;
            }()
          };
          alloweds = {
            init: true,
            start: '../lib/tasks/start/index.js',
            build: '../lib/tasks/build/index.js',
            TEST: '../lib/tasks/start/index.js'
          };
          if (!(arg !== 'TEST' && !alloweds[arg])) {
            _context2.next = 13;
            break;
          }
          console.error("Command \"".concat(arg, "\" not found.").concat(EOL, "Use \"init\", \"start\" or \"build\".").concat(EOL));
          return _context2.abrupt("return");
        case 13:
          importing = new draft("Importing required local modules: ".concat(sh$1.green).concat(sh$1.dim, "[ ").concat(sh$1.italic, "autoprefixer, rollup, postcss, sass and uglifyjs").concat(sh$1.reset).concat(sh$1.green).concat(sh$1.dim, " ]"));
          _iterator = _createForOfIteratorHelper(requires.dirs);
          _context2.prev = 15;
          _iterator.s();
        case 17:
          if ((_step = _iterator.n()).done) {
            _context2.next = 28;
            break;
          }
          require = _step.value;
          if (!isWindows) {
            _context2.next = 24;
            break;
          }
          _context2.next = 22;
          return exec('xcopy ' + normalize("".concat(__dirname, "/").concat(require, "\\")) + ' ' + normalize("./".concat(require, "\\")) + ' /s /e /y');
        case 22:
          _context2.next = 26;
          break;
        case 24:
          _context2.next = 26;
          return exec('cp -rnf ' + normalize("".concat(__dirname, "/").concat(require, "/")) + ' ' + normalize("./".concat(require)));
        case 26:
          _context2.next = 17;
          break;
        case 28:
          _context2.next = 33;
          break;
        case 30:
          _context2.prev = 30;
          _context2.t2 = _context2["catch"](15);
          _iterator.e(_context2.t2);
        case 33:
          _context2.prev = 33;
          _iterator.f();
          return _context2.finish(33);
        case 36:
          requires.files.forEach(function (require) {
            if (!fs.existsSync(normalize("./".concat(require)))) {
              fs.copyFileSync(normalize("".concat(__dirname, "/resources/").concat(require)), normalize("./".concat(require)));
              if (filesCallback !== null && filesCallback !== void 0 && filesCallback[require]) filesCallback[require]();
            }
          });
          gitignore = fs.readFileSync(normalize('./.gitignore'), 'utf-8');
          toIgnore = ['dist', 'release', 'src/exit', 'node_modules', 'package-lock.json', 'yarn.lock'];
          toIgnore.forEach(function (ignore) {
            var regex = RegExp(ignore, 'gm');
            if (!regex.test(gitignore)) gitignore += "".concat(EOL).concat(ignore);
          });
          fs.writeFileSync(normalize('./.gitignore'), gitignore);
          _context2.next = 43;
          return rebuildFiles(arg);
        case 43:
          rebuilded = _context2.sent;
          importing.stop(1);
          if (rebuilded) {
            _context2.next = 47;
            break;
          }
          return _context2.abrupt("return");
        case 47:
          _context2.prev = 47;
          if (!fs.existsSync(normalize('./.swrc.js'))) {
            _context2.next = 56;
            break;
          }
          _context2.next = 51;
          return import('./config-7c7bb707.js');
        case 51:
          _yield$import = _context2.sent;
          options = _yield$import.options;
          if (!(arg === 'start' && options !== null && options !== void 0 && options.initalCommit && !fs.existsSync(normalize('./.git')))) {
            _context2.next = 56;
            break;
          }
          _context2.next = 56;
          return exec("git init && git add . && git commit -m \"Initial Commit\"");
        case 56:
          _context2.next = 60;
          break;
        case 58:
          _context2.prev = 58;
          _context2.t3 = _context2["catch"](47);
        case 60:
          if (!(typeof alloweds[arg] === 'string')) {
            _context2.next = 63;
            break;
          }
          _context2.next = 63;
          return import(alloweds[arg]);
        case 63:
          /* Calls to script */

          /* Reserved to tests */
          args.includes('--TEST') && console.log('PASSED');
        case 64:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, null, [[15, 30, 33, 36], [47, 58]]);
}))();

export { _typeof as _, _asyncToGenerator as a, _regeneratorRuntime as b, _objectSpread2 as c, _toArray as d, cwd as e };
