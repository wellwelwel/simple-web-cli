import { _ as _typeof, a as _asyncToGenerator, b as _regeneratorRuntime, c as _objectSpread2, d as _toArray, e as cwd } from './init.js';
import { normalize, sep, join } from 'path';
import fs from 'fs';
import 'os';
import 'child_process';
import 'draftlog';

var createDir = (function (directory) {
  var directorys = [];
  if (typeof directory === 'string') directorys.push(directory);else if (_typeof(directory) === 'object') Object.assign(directorys, directory);
  directorys.forEach(function (dir) {
    dir = normalize(dir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
      recursive: true
    });
  });
});

var setConfig = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var _args$, _output$ftp, _output$ftp2, _output$ftp2$start, _output$ftp3, _output$ftp3$start, _output$ftp4, _output$ftp4$start, _output$ftp4$start$ho, _output$ftp5, _output$ftp5$start, _output$ftp6, _output$ftp6$start, _output$ftp6$start$us, _output$ftp7, _output$ftp7$start, _output$ftp8, _output$ftp8$start, _output$ftp8$start$pa, _output$ftp9, _output$ftp9$start, _output$ftp10, _output$ftp10$start, _output$build;
    var _process$argv, args, arg, config, output, isValid, validations, source, to, required, dev, dist, process_files, build, plugins, options, blacklist;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _process$argv = _toArray(process.argv), args = _process$argv.slice(2);
            arg = ((_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.replace(/-/g, '')) || 'start';
            _context.next = 4;
            return import(join("./".concat(cwd), '.swrc.js'));
          case 4:
            config = _context.sent;
            output = _objectSpread2(_objectSpread2({}, {}), config["default"]);
            isValid = function isValid(arr) {
              return !arr.some(function (validation) {
                return validation === false;
              });
            };
            validations = {
              ftp: [!!(output !== null && output !== void 0 && output.ftp), !!(output !== null && output !== void 0 && (_output$ftp = output.ftp) !== null && _output$ftp !== void 0 && _output$ftp.start), typeof (output === null || output === void 0 ? void 0 : (_output$ftp2 = output.ftp) === null || _output$ftp2 === void 0 ? void 0 : (_output$ftp2$start = _output$ftp2.start) === null || _output$ftp2$start === void 0 ? void 0 : _output$ftp2$start.root) === 'string', typeof (output === null || output === void 0 ? void 0 : (_output$ftp3 = output.ftp) === null || _output$ftp3 === void 0 ? void 0 : (_output$ftp3$start = _output$ftp3.start) === null || _output$ftp3$start === void 0 ? void 0 : _output$ftp3$start.host) === 'string' && (output === null || output === void 0 ? void 0 : (_output$ftp4 = output.ftp) === null || _output$ftp4 === void 0 ? void 0 : (_output$ftp4$start = _output$ftp4.start) === null || _output$ftp4$start === void 0 ? void 0 : (_output$ftp4$start$ho = _output$ftp4$start.host) === null || _output$ftp4$start$ho === void 0 ? void 0 : _output$ftp4$start$ho.trim().length) > 0, typeof (output === null || output === void 0 ? void 0 : (_output$ftp5 = output.ftp) === null || _output$ftp5 === void 0 ? void 0 : (_output$ftp5$start = _output$ftp5.start) === null || _output$ftp5$start === void 0 ? void 0 : _output$ftp5$start.user) === 'string' && (output === null || output === void 0 ? void 0 : (_output$ftp6 = output.ftp) === null || _output$ftp6 === void 0 ? void 0 : (_output$ftp6$start = _output$ftp6.start) === null || _output$ftp6$start === void 0 ? void 0 : (_output$ftp6$start$us = _output$ftp6$start.user) === null || _output$ftp6$start$us === void 0 ? void 0 : _output$ftp6$start$us.trim().length) > 0, typeof (output === null || output === void 0 ? void 0 : (_output$ftp7 = output.ftp) === null || _output$ftp7 === void 0 ? void 0 : (_output$ftp7$start = _output$ftp7.start) === null || _output$ftp7$start === void 0 ? void 0 : _output$ftp7$start.pass) === 'string' && (output === null || output === void 0 ? void 0 : (_output$ftp8 = output.ftp) === null || _output$ftp8 === void 0 ? void 0 : (_output$ftp8$start = _output$ftp8.start) === null || _output$ftp8$start === void 0 ? void 0 : (_output$ftp8$start$pa = _output$ftp8$start.pass) === null || _output$ftp8$start$pa === void 0 ? void 0 : _output$ftp8$start$pa.trim().length) > 0, (output === null || output === void 0 ? void 0 : (_output$ftp9 = output.ftp) === null || _output$ftp9 === void 0 ? void 0 : (_output$ftp9$start = _output$ftp9.start) === null || _output$ftp9$start === void 0 ? void 0 : _output$ftp9$start.secure) === 'explict' || (output === null || output === void 0 ? void 0 : (_output$ftp10 = output.ftp) === null || _output$ftp10 === void 0 ? void 0 : (_output$ftp10$start = _output$ftp10.start) === null || _output$ftp10$start === void 0 ? void 0 : _output$ftp10$start.secure) === true]
            };
            if (!isValid(validations.ftp)) {
              output.ftp = {
                start: {
                  root: '',
                  host: '',
                  user: '',
                  pass: '',
                  secure: ''
                }
              };
            }
            source = normalize(output.workspaces.src.replace('./', ''));
            to = normalize(output.workspaces.dist.replace('./', ''));
            required = normalize('helpers/');
            if (source.substring(source.length - 1, source.length) === sep) source = source.substring(0, source.length - 1);
            if (to.substring(to.length - 1, to.length) === sep) to = to.substring(0, to.length - 1);
            if (required.substring(required.length - 1, required.length) === sep) required = required.substring(0, required.length - 1);
            dev = {
              ftp: output.ftp.start
            };
            dist = {
              ftp: output.ftp.build
            };
            process_files = arg === 'build' && output !== null && output !== void 0 && (_output$build = output.build) !== null && _output$build !== void 0 && _output$build.compile ? output.build.compile : output.start.compile;
            build = (output === null || output === void 0 ? void 0 : output.build) || false;
            plugins = (output === null || output === void 0 ? void 0 : output.plugins) || false;
            options = (output === null || output === void 0 ? void 0 : output.options) || false;
            blacklist = output.hasOwnProperty('blacklist') ? output.blacklist : [] || [];
            process_files.js.require = required;
            createDir([source, to, required]);
            return _context.abrupt("return", {
              source: source,
              to: to,
              dev: dev,
              dist: dist,
              process_files: process_files,
              build: build,
              options: options,
              plugins: plugins,
              blacklist: blacklist
            });
          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function setConfig() {
    return _ref.apply(this, arguments);
  };
}();
var _await$setConfig = await setConfig(),
  source = _await$setConfig.source,
  to = _await$setConfig.to,
  dev = _await$setConfig.dev,
  dist = _await$setConfig.dist,
  process_files = _await$setConfig.process_files,
  build = _await$setConfig.build,
  options = _await$setConfig.options,
  plugins = _await$setConfig.plugins,
  blacklist = _await$setConfig.blacklist;

export { blacklist, build, dev, dist, options, plugins, process_files, source, to };
