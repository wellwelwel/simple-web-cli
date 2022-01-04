"use strict";

var isCompatible = function isCompatible() {

   try {

      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
      function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

      var _require = require('child_process'), exec = _require.exec;
      var process = require("process");

      var sh = function sh(command) {

         return new Promise(function (resolve, reject) {

            return exec(command, function (error, stdout) {

               return !!error ? reject(error) : resolve(stdout);
            });
         });
      };

      var checkNPM = function () {

         var _ref = _asyncToGenerator(function* () {

            var npm = {

               minimum: 702,
               current: +(yield sh('npm -v')).replace(/[^0-9]/g, '')
            };

            return npm.current >= npm.minimum;
         });

         return function checkNPM() {

            return _ref.apply(this, arguments);
         };
      }();

      var node = {

         minimun: 14.15,
         current: process.version.split(".") || ["v0","0"]
      };

      return checkNPM() && parseFloat("".concat(node.current[0].replace(/[^0-9]/g, ""), ".").concat(node.current[1] || 0)) >= node.minimun;
   }
   catch (error) {

      return false;
   }
};

module.exports = isCompatible;