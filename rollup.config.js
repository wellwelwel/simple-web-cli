// @ts-check

import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';

const setConfig = (/** @type {string} */ input, /** @type {string} */ dir) =>
   defineConfig({
      input,
      output: {
         dir,
         format: 'es',
      },
      external: [
         'fs',
         'os',
         'path',
         'draftlog',
         'child_process',
         'html-minifier',
         'basic-ftp',
         'basic-sftp',
         'http2',
         'uglifycss',
         'node-watch',
         'archiver',
         'perf_hooks',
         'madge',
      ],
      plugins: [
         babel({
            comments: false,
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
         }),
      ],
   });

export default [
   setConfig('./src/index.js', './bin'),
   setConfig('./src/tasks/start/index.js', './lib/tasks/start'),
   setConfig('./src/tasks/build/index.js', './lib/tasks/build'),
];
