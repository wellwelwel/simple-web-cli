// @ts-check

import { defineConfig } from 'rollup';
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import swrc from './.swrc.js';

const useBabel = swrc.start.compile.js.babel;
const useUglify = swrc.start.compile.js.uglify;

const configs = defineConfig({
   plugins: [
      alias({
         entries: [
            { find: /#helpers\/(.+)/, replacement: './helpers/$1.js' },
            { find: /#utils\/(.+)/, replacement: './utils/$1.js' },
         ],
      }),
      nodeResolve(),
      commonjs(),
   ],
   output: {
      strict: true,
      format: 'iife',
      inlineDynamicImports: true,
   },
});

if (useBabel && Array.isArray(configs.plugins)) {
   configs.plugins.push(
      babel({
         babelHelpers: 'inline',
         comments: !useUglify,
         compact: useUglify,
         minified: useUglify,
         presets: [
            '@babel/preset-env',
            {
               exclude: ['transform-regenerator'],
            },
         ],
      })
   );
}

export default configs;
