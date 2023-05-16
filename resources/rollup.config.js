// @ts-check

import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import swrc from './.swrc.js';

const useUglify = swrc.start.compile.js.uglify;

const configs = defineConfig({
   plugins: [
      nodeResolve({
         browser: true,
      }),
      commonjs(),
      typescript({
         tsconfig: './tsconfig.json',
      }),
   ],
   output: {
      strict: true,
      format: 'iife',
      inlineDynamicImports: true,
   },
});

if (Array.isArray(configs.plugins)) {
   if (useUglify)
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
         }),
         terser({
            compress: true,
            mangle: true,
         })
      );
   else
      configs.plugins.push(
         babel({
            babelHelpers: 'bundled',
            presets: [
               {
                  exclude: ['transform-regenerator'],
               },
            ],
         })
      );
}

export default configs;
