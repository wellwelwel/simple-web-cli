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
         compilerOptions: {
            lib: ['DOM', 'DOM.Iterable', 'ESNext'],
            target: 'ESNext',
            module: 'ESNext',
            moduleResolution: 'bundler',
            resolveJsonModule: true,
            isolatedModules: true,
            esModuleInterop: true,
            allowImportingTsExtensions: true,
            allowSyntheticDefaultImports: true,
            allowJs: true,
            strict: true,
            alwaysStrict: true,
            strictFunctionTypes: false,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noImplicitAny: true,
            noFallthroughCasesInSwitch: true,
            removeComments: true,
            sourceMap: false,
            declaration: false,
            skipLibCheck: true,
            noEmit: true,
         },
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
