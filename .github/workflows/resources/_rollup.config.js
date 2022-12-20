import { babel } from '@rollup/plugin-babel';

export default {
   plugins: [
      babel({
         babelHelpers: 'bundled',
         comments: false,
         compact: true,
         minified: true,
         presets: [
            '@babel/preset-env',
            {
               exclude: ['transform-regenerator'],
            },
         ],
         exclude: 'node_modules/**',
      }),
   ],
};
