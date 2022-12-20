import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import swrc from './.swrc.js';

const useBabel = swrc.start.compile.js.babel;
const useUglify = swrc.start.compile.js.uglify;

const defineConfig = {
   plugins: [
      alias({
         entries: [{ find: /#helpers\/(.+)/, replacement: './helpers/$1/index.js' }],
      }),
   ],
};

useBabel &&
   defineConfig.plugins.push(
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
         exclude: 'node_modules/**',
      })
   );

export default defineConfig;
