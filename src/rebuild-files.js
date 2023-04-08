import fs from 'fs';
import exec from './modules/execShellCommand.js';
import latest from './modules/get-latest-version.js';

const rebuildFiles = async (arg) => {
   const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
   const buildJSON = (obj) => orderJSON(obj, 3);
   const packageFile = readJSON('package.json') || {};

   const stage = {
      package: false,
      babelrc: false,
      error: false,
      npm_i: false,
   };
   const orderJSON = (obj, space) => {
      const allKeys = [];
      const seen = {};

      JSON.stringify(obj, (key, value) => {
         if (!(key in seen)) {
            allKeys.push(key);
            seen[key] = null;
         }

         return value;
      });

      allKeys.sort();

      return JSON.stringify(obj, allKeys, space);
   };
   const dependencies = [
      '@babel/preset-env',
      '@rollup/plugin-alias',
      '@rollup/plugin-babel',
      '@rollup/plugin-commonjs',
      '@rollup/plugin-node-resolve',
      'autoprefixer',
      'node-and-vite-helpers',
      'packages-update',
      'postcss-cli',
      'rollup',
      'sass',
      'uglify-js',
   ];

   const compatibility = {
      node:
         +process.version
            .split('.')
            .shift()
            .replace(/[^0-9]/, '') <= 14,
      dependencies: { 'postcss-cli': '^8.3.1' },
   };

   /* package.json */
   try {
      if (!packageFile?.devDependencies) packageFile.devDependencies = {};
      if (!packageFile?.scripts) packageFile.scripts = {};

      if (packageFile?.type !== 'module') packageFile.type = 'module';
      if (!packageFile.scripts?.update) packageFile.scripts.update = 'npx npu; npm i --ignore-scripts';

      for (const dependence of dependencies) {
         if (
            !packageFile?.devDependencies?.[dependence] &&
            !packageFile?.dependencies?.[dependence] &&
            !packageFile?.bundleDependencies?.[dependence]
         ) {
            if (compatibility.node && compatibility.dependencies?.[dependence]) {
               packageFile.devDependencies[dependence] = compatibility.dependencies[dependence];
            } else packageFile.devDependencies[dependence] = `^${await latest(dependence)}`;

            if (!stage.package) stage.package = true;
            if (!stage.npm_i) stage.npm_i = true;
         }
      }

      /* autoprefixer requires */
      if (!packageFile?.browserslist) {
         packageFile.browserslist = '> 0%';
         if (!stage.package) stage.package = true;
      }

      /* Dev */
      if (!packageFile?.devDependencies) packageFile.devDependencies = {};

      if (stage.package) fs.writeFileSync('package.json', buildJSON(packageFile));
      if (stage.npm_i) await exec('npm i');
   } catch (error) {
      console.warn(
         'Unable to get the needed resources into package.json.\nPlease, look at: https://github.com/wellwelwel/simple-web-cli/blob/main/package.json and insert "browserslist" and local dependence "web" manually\n'
      );
      console.error(`Error: ${error.message}\n`);

      if (!stage.error) stage.error = true;
   }

   return !stage.error;
};

export default rebuildFiles;
