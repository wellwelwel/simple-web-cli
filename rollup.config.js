// @ts-check

import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';

const setConfig = (/** @type {string} */ input, /** @type {string} */ outputFile) =>
   defineConfig({
      input,
      output: {
         file: outputFile,
         format: 'es',
         inlineDynamicImports: true,
      },
      external: [
         'fs',
         'os',
         'path',
         'draftlog',
         'child_process',
         'html-minifier',
         'basic-ftp',
         'http2',
         'uglifycss',
         'node-watch',
         'archiver',
         'perf_hooks',
      ],
      plugins: [
         babel({
            comments: false,
            babelHelpers: 'bundled',
         }),
      ],
   });

export default [
   setConfig('./src/index.js', './bin/index.js'),
   setConfig('./src/test-services.js', './bin/test-services.js'),
   setConfig('./src/tasks/start/index.js', './lib/tasks/start/index.js'),
   setConfig('./src/tasks/build/index.js', './lib/tasks/build/index.js'),
];
