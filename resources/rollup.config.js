import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';

export default {
   plugins: [
      alias({
         entries: [{ find: /#helpers\/(.+)/, replacement: './helpers/$1/index.js' }],
      }),
      babel({
         babelHelpers: 'inline',
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
