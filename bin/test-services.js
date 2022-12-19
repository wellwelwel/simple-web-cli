import { exec } from 'child_process';
import fs from 'fs';
import { extname } from 'path';

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

_asyncToGenerator(_regeneratorRuntime().mark(function _callee9(){var sh,pass,results,tests,errors,expecteds,test,prove,passed,source,regex,swrc,result,FTP,_passed;return _regeneratorRuntime().wrap(function _callee9$(_context10){while(1){switch(_context10.prev=_context10.next){case 0:sh=function(){var _ref2=_asyncToGenerator(_regeneratorRuntime().mark(function _callee(command){return _regeneratorRuntime().wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:return _context.abrupt("return",new Promise(function(resolve,reject){return exec(command,function(error,stdout){return !!error?reject(error):resolve(stdout)})}));case 1:case"end":return _context.stop();}}},_callee)}));return function sh(_x){return _ref2.apply(this,arguments)}}();pass=function pass(stdout){var regex=arguments.length>1&&arguments[1]!==undefined?arguments[1]:/PASSED/gm;return regex.test(stdout)};results={passed:"\u2796 \x1B[32mPASSED\x1B[0m\n",failed:"\u2796 \x1B[31mFAILED\x1B[0m\n"};tests={"Environment preparation":function(){var _EnvironmentPreparation=_asyncToGenerator(_regeneratorRuntime().mark(function _callee2(){return _regeneratorRuntime().wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.prev=0;if(!fs.existsSync("temp")){_context2.next=5;break}console.log("   \u2795 Removing previous temporary files...");_context2.next=5;return sh("rm -r \"temp\"");case 5:console.log("   \u2795 Creating temporary folder...");_context2.next=8;return sh("mkdir \"temp\"");case 8:_context2.next=10;return sh("mkdir \"temp/.resources\"");case 10:console.log("   \u2795 Importing modules...");_context2.next=13;return sh("npm i");case 13:console.log("   \u2795 Linking service...");_context2.next=16;return sh("npm link");case 16:return _context2.abrupt("return","PASSED");case 19:_context2.prev=19;_context2.t0=_context2["catch"](0);return _context2.abrupt("return",_context2.t0);case 22:case"end":return _context2.stop();}}},_callee2,null,[[0,19]])}));function EnvironmentPreparation(){return _EnvironmentPreparation.apply(this,arguments)}return EnvironmentPreparation}(),"Executing service \"init\"":function(){var _ExecutingServiceInit=_asyncToGenerator(_regeneratorRuntime().mark(function _callee3(){var init,source,toTrue,toFalse,toUncomment,swrc,result;return _regeneratorRuntime().wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.prev=0;_context3.next=3;return sh("cd \"temp\" && sw init --TEST");case 3:init=_context3.sent;source="temp/.swrc.js";toTrue=/start: (false)/gm;toFalse=/(initialCommit): (true)/gm;toUncomment=/\/\/\s{0,}(chmod|dir|file|recursive|})/gm;swrc=fs.readFileSync(source,"utf-8");result=swrc.replace(toTrue,function(a){return a.replace(/false/,"true")}).replace(toFalse,function(a){return a.replace(/true/,"false")}).replace(toUncomment,function(a){return a.replace(/\/\/ /,"")});fs.writeFileSync(source,result);fs.copyFileSync(".github/workflows/resources/tests/.resources/test-resource-replace.html","temp/.resources/test-resource-replace.html");return _context3.abrupt("return",init);case 15:_context3.prev=15;_context3.t0=_context3["catch"](0);return _context3.abrupt("return",_context3.t0);case 18:case"end":return _context3.stop();}}},_callee3,null,[[0,15]])}));function ExecutingServiceInit(){return _ExecutingServiceInit.apply(this,arguments)}return ExecutingServiceInit}(),"Executing service \"start\"":function(){var _ExecutingServiceStart=_asyncToGenerator(_regeneratorRuntime().mark(function _callee7(){var result,start_errors;return _regeneratorRuntime().wrap(function _callee7$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:result=sh("cd \"temp\" && sw start --TEST");start_errors=0;_context8.prev=2;if(process.platform!=="win32"){expecteds["test.zip"]={name:"Zip file: No compile (just copy) and extract to test content",cb:function(){var _cb=_asyncToGenerator(_regeneratorRuntime().mark(function _callee4(){return _regeneratorRuntime().wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:if(fs.existsSync("temp/dist/test.txt")){_context4.next=3;break}_context4.next=3;return sh("cd \"temp/dist\" && unzip test.zip");case 3:case"end":return _context4.stop();}}},_callee4)}));function cb(){return _cb.apply(this,arguments)}return cb}(),ext:"txt",output:"Success"};}setTimeout(_asyncToGenerator(_regeneratorRuntime().mark(function _callee6(){var _loop,expected,_ret;return _regeneratorRuntime().wrap(function _callee6$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:_loop=_regeneratorRuntime().mark(function _loop(expected){var _expecteds$expected,_expecteds$expected3,copied,_expecteds$expected2,name,output,file,compare;return _regeneratorRuntime().wrap(function _loop$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:_context6.prev=0;copied=true;try{fs.copyFileSync(".github/workflows/resources/tests/".concat(expected),"temp/src/".concat(expected));}catch(error){copied=false;}if(!((_expecteds$expected=expecteds[expected])!==null&&_expecteds$expected!==void 0&&_expecteds$expected.src)){_context6.next=5;break}return _context6.abrupt("return","continue");case 5:_expecteds$expected2=expecteds[expected],name=_expecteds$expected2.name,output=_expecteds$expected2.output;file=(_expecteds$expected3=expecteds[expected])!==null&&_expecteds$expected3!==void 0&&_expecteds$expected3.ext?expected.replace(extname(expected),".".concat(expecteds[expected].ext)):expected;_context6.next=9;return new Promise(function(resolve){var count=0;var limit=100;var attemp=setInterval(_asyncToGenerator(_regeneratorRuntime().mark(function _callee5(){var _expecteds$expected4,_expecteds$expected5,_fs$readFileSync,_fs$readFileSync$trim;return _regeneratorRuntime().wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:count++;if(count>=limit){clearInterval(attemp);resolve();}if(!(!fs.existsSync("temp/src/".concat(file))&&!fs.existsSync("temp/src/".concat(expected)))){_context5.next=4;break}return _context5.abrupt("return");case 4:if(!(!fs.existsSync("temp/dist/".concat(file))&&!fs.existsSync("temp/dist/".concat(expected)))){_context5.next=6;break}return _context5.abrupt("return");case 6:if(!((_expecteds$expected4=expecteds[expected])!==null&&_expecteds$expected4!==void 0&&_expecteds$expected4.cb)){_context5.next=9;break}_context5.next=9;return (_expecteds$expected5=expecteds[expected])===null||_expecteds$expected5===void 0?void 0:_expecteds$expected5.cb();case 9:if(!(((_fs$readFileSync=fs.readFileSync("temp/dist/".concat(file),"utf-8"))===null||_fs$readFileSync===void 0?void 0:(_fs$readFileSync$trim=_fs$readFileSync.trim())===null||_fs$readFileSync$trim===void 0?void 0:_fs$readFileSync$trim.length)===0)){_context5.next=11;break}return _context5.abrupt("return");case 11:clearInterval(attemp);resolve();case 13:case"end":return _context5.stop();}}},_callee5)})),100);});case 9:compare=fs.readFileSync("temp/dist/".concat(file),"utf-8");console.log(copied&&compare===output?"   \x1B[32m\u2714\x1B[0m":"   \x1B[31m\u2716\x1B[0m",name);if(!copied||compare!==output){errors.push(_defineProperty({},name,compare));start_errors++;}_context6.next=18;break;case 14:_context6.prev=14;_context6.t0=_context6["catch"](0);console.log("   \x1B[31m\u2716\x1B[0m ".concat(_context6.t0.message));start_errors++;case 18:case"end":return _context6.stop();}}},_loop,null,[[0,14]])});_context7.t0=_regeneratorRuntime().keys(expecteds);case 2:if((_context7.t1=_context7.t0()).done){_context7.next=10;break}expected=_context7.t1.value;return _context7.delegateYield(_loop(expected),"t2",5);case 5:_ret=_context7.t2;if(!(_ret==="continue")){_context7.next=8;break}return _context7.abrupt("continue",2);case 8:_context7.next=2;break;case 10:_context7.next=12;return sh("cd \"temp\" && touch \"src/exit\"");case 12:case"end":return _context7.stop();}}},_callee6)})),5000);if(pass(result)){_context8.next=7;break}return _context8.abrupt("return",result);case 7:return _context8.abrupt("return",start_errors===0?"PASSED":"FAILED to building files");case 10:_context8.prev=10;_context8.t0=_context8["catch"](2);return _context8.abrupt("return",_context8.t0);case 13:case"end":return _context8.stop();}}},_callee7,null,[[2,10]])}));function ExecutingServiceStart(){return _ExecutingServiceStart.apply(this,arguments)}return ExecutingServiceStart}(),"Executing service \"build\"":function(){var _ExecutingServiceBuild=_asyncToGenerator(_regeneratorRuntime().mark(function _callee8(){return _regeneratorRuntime().wrap(function _callee8$(_context9){while(1){switch(_context9.prev=_context9.next){case 0:_context9.prev=0;_context9.next=3;return sh("cd \"temp\" && sw build --TEST");case 3:return _context9.abrupt("return",_context9.sent);case 6:_context9.prev=6;_context9.t0=_context9["catch"](0);return _context9.abrupt("return",_context9.t0);case 9:case"end":return _context9.stop();}}},_callee8,null,[[0,6]])}));function ExecutingServiceBuild(){return _ExecutingServiceBuild.apply(this,arguments)}return ExecutingServiceBuild}()};errors=[];expecteds={"test-file.html":{name:"Building HTML",output:"<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Document</title></head><body></body></html>"},"test-file.css":{name:"Building CSS",output:"div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}"},"test-file.scss":{name:"Building SCSS",output:"div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}",ext:"css"},"test-file.js":{name:"Building JS",output:"\"use strict\";console.log(\"Hello World\");"},"test-file.php":{name:"Building PHP",output:"<?php echo 123;"},"test-file.phtml":{name:"Building PHTML",output:"<?php echo 123?>"},"_header.html":{src:true},"test-import.html":{name:"Testing Feature: HTML Import",output:"<html><body><header></header></body></html>"},"test-string-replace.html":{name:"Testing Plug-in: String Replace",output:"<html><body>my-start-output</body></html>"},"test-resource-replace.html":{name:"Testing Plug-in: Resource Replace",output:"<html><body>456</body></html>"}};_context10.t0=_regeneratorRuntime().keys(tests);case 7:if((_context10.t1=_context10.t0()).done){_context10.next=18;break}test=_context10.t1.value;console.log("\u2796 ".concat(test,"..."));_context10.next=12;return tests[test]();case 12:prove=_context10.sent;passed=pass(prove);if(!passed)errors.push(_defineProperty({},test,prove));console.log(results[passed?"passed":"failed"]);_context10.next=7;break;case 18:if(!(process.platform==="linux")){_context10.next=37;break}console.log("\u2796 Testing FTP service...");source="temp/.swrc.js";regex={root:/root: '',/gim,host:/host: '',/gim,user:/user: '',/gim,pass:/pass: '',/gim,secure:/secure: true\s\|\|\s/gim};swrc=fs.readFileSync(source,"utf-8");result="";result=swrc.replace(regex.root,function(a){return a.replace(/''/,"'/'")});result=result.replace(regex.host,function(a){return a.replace(/''/,"'127.0.0.1'")});result=result.replace(regex.user,function(a){return a.replace(/''/,"'test'")});result=result.replace(regex.pass,function(a){return a.replace(/''/,"'test'")});result=result.replace(regex.secure,function(a){return a.replace(/true\s\|\|\s/,"")});fs.writeFileSync(source,result);setTimeout(function(){return sh("cd \"temp\" && touch \"src/exit\"")},5000);_context10.next=33;return sh("cd \"temp\" && sw --TEST");case 33:FTP=_context10.sent;_passed=pass(FTP,/Connected/gm);if(!_passed)errors.push({"Testing FTP service:":FTP});console.log(results[_passed?"passed":"failed"]);case 37:if(!fs.existsSync("temp")){_context10.next=47;break}_context10.prev=38;_context10.next=41;return sh("rm -r \"temp\"");case 41:console.log("\u2796 Removing temporary files...");console.log(results.passed);_context10.next=47;break;case 45:_context10.prev=45;_context10.t2=_context10["catch"](38);case 47:if(!(errors.length===0)){_context10.next=49;break}return _context10.abrupt("return",true);case 49:console.log("\n--- LOGS ---\n");errors.forEach(function(error){return console.log(error)});console.log("\n--- LOGS ---\n");process.exit(1);case 53:case"end":return _context10.stop();}}},_callee9,null,[[38,45]])}))();
