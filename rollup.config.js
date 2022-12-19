import { babel } from '@rollup/plugin-babel';

const setConfig = (input, dir) => ({
   input,
   output: {
      dir,
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
         babelHelpers: 'bundled',
         presets: ['@babel/preset-env'],
         exclude: 'node_modules/**',
         comments: false,
         compact: true,
      }),
   ],
});

export default [
   setConfig('./src/init.js', './bin'),
   setConfig('./src/test-services.js', './bin'),
   setConfig('./.web/tasks/start/index.js', './lib/tasks/start'),
   setConfig('./.web/tasks/build/index.js', './lib/tasks/build'),
];
