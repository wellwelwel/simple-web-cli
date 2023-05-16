// @ts-check

import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import swrc from './.swrc.js';

const useBabel = swrc.start.compile.js.babel;
const useUglify = swrc.start.compile.js.uglify;

const configs = defineConfig({
   plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
         allowJs: true,
         skipLibCheck: true,
         forceConsistentCasingInFileNames: true,
      }),
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
