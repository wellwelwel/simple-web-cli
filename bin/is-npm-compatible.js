"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('child_process'),
    exec = _require.exec;

var sh = function () {
  var _ref = _asyncToGenerator(function* (command) {
    return new Promise(function (resolve, reject) {
      return exec(command, function (error, stdout) {
        return !!error ? reject(error) : resolve(stdout);
      });
    });
  });

  return function sh(_x) {
    return _ref.apply(this, arguments);
  };
}();

var isNPMCompatible = function () {
  var _ref2 = _asyncToGenerator(function* () {
    try {
      var npm = {
        minimum: [7, 0, 2],
        current: (yield sh('npm -v')).replace(/[^0-9.]/, '').split('.')
      };
      if (+npm.current[0] > npm.minimum[0]) return true;
      if (+npm.current[0] === npm.minimum[0] && +npm.current[1] > npm.minimum[1]) return true;
      if (+npm.current[0] === npm.minimum[0] && +npm.current[1] === npm.minimum[1] && +npm.current[2] >= npm.minimum[2]) return true;
      return false;
    } catch (error) {
      return false;
    }
  });

  return function isNPMCompatible() {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = isNPMCompatible;
