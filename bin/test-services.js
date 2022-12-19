import { exec } from 'child_process';
import fs from 'fs';
import { extname } from 'path';

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

_asyncToGenerator(function*(){var sh=function(){var _ref2=_asyncToGenerator(function*(command){return new Promise(function(resolve,reject){return exec(command,function(error,stdout){return !!error?reject(error):resolve(stdout)})})});return function sh(_x){return _ref2.apply(this,arguments)}}();var pass=function pass(stdout){var regex=arguments.length>1&&arguments[1]!==undefined?arguments[1]:/PASSED/gm;return regex.test(stdout)};var results={passed:"\u2796 \x1B[32mPASSED\x1B[0m\n",failed:"\u2796 \x1B[31mFAILED\x1B[0m\n"};var tests={"Environment preparation":function(){var _EnvironmentPreparation=_asyncToGenerator(function*(){try{if(fs.existsSync("temp")){console.log("   \u2795 Removing previous temporary files...");yield sh("rm -r \"temp\"");}console.log("   \u2795 Creating temporary folder...");yield sh("mkdir \"temp\"");yield sh("mkdir \"temp/.resources\"");console.log("   \u2795 Importing modules...");yield sh("npm i");console.log("   \u2795 Linking service...");yield sh("npm link");return "PASSED"}catch(error){return error}});function EnvironmentPreparation(){return _EnvironmentPreparation.apply(this,arguments)}return EnvironmentPreparation}(),"Executing service \"init\"":function(){var _ExecutingServiceInit=_asyncToGenerator(function*(){try{var init=yield sh("cd \"temp\" && sw init --TEST");var source="temp/.swrc.js";var toTrue=/start: (false)/gm;var toFalse=/(initialCommit): (true)/gm;var toUncomment=/\/\/\s{0,}(chmod|dir|file|recursive|})/gm;var swrc=fs.readFileSync(source,"utf-8");var result=swrc.replace(toTrue,function(a){return a.replace(/false/,"true")}).replace(toFalse,function(a){return a.replace(/true/,"false")}).replace(toUncomment,function(a){return a.replace(/\/\/ /,"")});fs.writeFileSync(source,result);fs.copyFileSync(".github/workflows/resources/tests/.resources/test-resource-replace.html","temp/.resources/test-resource-replace.html");return init}catch(error){return error}});function ExecutingServiceInit(){return _ExecutingServiceInit.apply(this,arguments)}return ExecutingServiceInit}(),"Executing service \"start\"":function(){var _ExecutingServiceStart=_asyncToGenerator(function*(){var result=sh("cd \"temp\" && sw start --TEST");var start_errors=0;try{if(process.platform!=="win32"){expecteds["test.zip"]={name:"Zip file: No compile (just copy) and extract to test content",cb:function(){var _cb=_asyncToGenerator(function*(){if(!fs.existsSync("temp/dist/test.txt"))yield sh("cd \"temp/dist\" && unzip test.zip");});function cb(){return _cb.apply(this,arguments)}return cb}(),ext:"txt",output:"Success"};}setTimeout(_asyncToGenerator(function*(){var _loop=function*_loop(expected){try{var _expecteds$expected,_expecteds$expected3;var copied=true;try{fs.copyFileSync(".github/workflows/resources/tests/".concat(expected),"temp/src/".concat(expected));}catch(error){copied=false;}if((_expecteds$expected=expecteds[expected])!==null&&_expecteds$expected!==void 0&&_expecteds$expected.src)return "continue";var _expecteds$expected2=expecteds[expected],name=_expecteds$expected2.name,output=_expecteds$expected2.output;var file=(_expecteds$expected3=expecteds[expected])!==null&&_expecteds$expected3!==void 0&&_expecteds$expected3.ext?expected.replace(extname(expected),".".concat(expecteds[expected].ext)):expected;yield new Promise(function(resolve){var count=0;var limit=100;var attemp=setInterval(_asyncToGenerator(function*(){var _expecteds$expected4,_expecteds$expected5,_fs$readFileSync,_fs$readFileSync$trim;count++;if(count>=limit){clearInterval(attemp);resolve();}if(!fs.existsSync("temp/src/".concat(file))&&!fs.existsSync("temp/src/".concat(expected)))return;if(!fs.existsSync("temp/dist/".concat(file))&&!fs.existsSync("temp/dist/".concat(expected)))return;if((_expecteds$expected4=expecteds[expected])!==null&&_expecteds$expected4!==void 0&&_expecteds$expected4.cb)yield (_expecteds$expected5=expecteds[expected])===null||_expecteds$expected5===void 0?void 0:_expecteds$expected5.cb();if(((_fs$readFileSync=fs.readFileSync("temp/dist/".concat(file),"utf-8"))===null||_fs$readFileSync===void 0?void 0:(_fs$readFileSync$trim=_fs$readFileSync.trim())===null||_fs$readFileSync$trim===void 0?void 0:_fs$readFileSync$trim.length)===0)return;clearInterval(attemp);resolve();}),100);});var compare=fs.readFileSync("temp/dist/".concat(file),"utf-8");console.log(copied&&compare===output?"   \x1B[32m\u2714\x1B[0m":"   \x1B[31m\u2716\x1B[0m",name);if(!copied||compare!==output){errors.push(_defineProperty({},name,compare));start_errors++;}}catch(error){console.log("   \x1B[31m\u2716\x1B[0m ".concat(error.message));start_errors++;}};for(var expected in expecteds){var _ret=yield*_loop(expected);if(_ret==="continue")continue}yield sh("cd \"temp\" && touch \"src/exit\"");}),5000);if(!pass(result))return result;return start_errors===0?"PASSED":"FAILED to building files"}catch(error){return error}});function ExecutingServiceStart(){return _ExecutingServiceStart.apply(this,arguments)}return ExecutingServiceStart}(),"Executing service \"build\"":function(){var _ExecutingServiceBuild=_asyncToGenerator(function*(){try{return yield sh("cd \"temp\" && sw build --TEST")}catch(error){return error}});function ExecutingServiceBuild(){return _ExecutingServiceBuild.apply(this,arguments)}return ExecutingServiceBuild}()};var errors=[];var expecteds={"test-file.html":{name:"Building HTML",output:"<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Document</title></head><body></body></html>"},"test-file.css":{name:"Building CSS",output:"div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}"},"test-file.scss":{name:"Building SCSS",output:"div{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}",ext:"css"},"test-file.js":{name:"Building JS",output:"\"use strict\";console.log(\"Hello World\");"},"test-file.php":{name:"Building PHP",output:"<?php echo 123;"},"test-file.phtml":{name:"Building PHTML",output:"<?php echo 123?>"},"_header.html":{src:true},"test-import.html":{name:"Testing Feature: HTML Import",output:"<html><body><header></header></body></html>"},"test-string-replace.html":{name:"Testing Plug-in: String Replace",output:"<html><body>my-start-output</body></html>"},"test-resource-replace.html":{name:"Testing Plug-in: Resource Replace",output:"<html><body>456</body></html>"}};for(var test in tests){console.log("\u2796 ".concat(test,"..."));var prove=yield tests[test]();var passed=pass(prove);if(!passed)errors.push(_defineProperty({},test,prove));console.log(results[passed?"passed":"failed"]);}if(process.platform==="linux"){console.log("\u2796 Testing FTP service...");var source="temp/.swrc.js";var regex={root:/root: '',/gim,host:/host: '',/gim,user:/user: '',/gim,pass:/pass: '',/gim,secure:/secure: true\s\|\|\s/gim};var swrc=fs.readFileSync(source,"utf-8");var result="";result=swrc.replace(regex.root,function(a){return a.replace(/''/,"'/'")});result=result.replace(regex.host,function(a){return a.replace(/''/,"'127.0.0.1'")});result=result.replace(regex.user,function(a){return a.replace(/''/,"'test'")});result=result.replace(regex.pass,function(a){return a.replace(/''/,"'test'")});result=result.replace(regex.secure,function(a){return a.replace(/true\s\|\|\s/,"")});fs.writeFileSync(source,result);setTimeout(function(){return sh("cd \"temp\" && touch \"src/exit\"")},5000);var FTP=yield sh("cd \"temp\" && sw --TEST");var _passed=pass(FTP,/Connected/gm);if(!_passed)errors.push({"Testing FTP service:":FTP});console.log(results[_passed?"passed":"failed"]);}if(fs.existsSync("temp")){try{yield sh("rm -r \"temp\"");console.log("\u2796 Removing temporary files...");console.log(results.passed);}catch(error){}}if(errors.length===0)return true;console.log("\n--- LOGS ---\n");errors.forEach(function(error){return console.log(error)});console.log("\n--- LOGS ---\n");process.exit(1);})();
