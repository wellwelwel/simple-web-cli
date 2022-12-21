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
         comments: false,
         compact: true,
         minified: true,
         babelHelpers: 'inline',
         presets: ['@babel/preset-env'],
         exclude: 'node_modules/**',
      }),
   ],
});

export default [
   setConfig('./src/tasks/start/index.js', './lib/tasks/start'),
   setConfig('./src/tasks/build/index.js', './lib/tasks/build'),
];