import fs from 'fs';
import exec from '../.web/modules/execShellCommand.js';
import latest from '../.web/modules/get-latest-version.js';

const rebuildFiles = async (arg) => {
   const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
   const buildJSON = (obj) => orderJSON(obj, 2);
   const packageFile = readJSON('package.json') || {};
   const babelrc = readJSON('.babelrc') || {};

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
      '@babel/cli',
      '@babel/core',
      '@babel/preset-env',
      '@rollup/plugin-babel',
      'autoprefixer',
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
      if (!packageFile?.devDependencies?.web) {
         packageFile.devDependencies.web = 'file:.library';

         if (!stage.package) stage.package = true;
         if (!stage.npm_i) stage.npm_i = true;
      }

      if (stage.package) fs.writeFileSync('package.json', buildJSON(packageFile));
      if (stage.npm_i) await exec('npm i');
   } catch (error) {
      console.warn(
         'Unable to get the needed resources into package.json.\nPlease, look at: https://github.com/wellwelwel/simple-web-cli/blob/main/package.json and insert "browserslist" and local dependence "web" manually\n'
      );
      console.error(`Error: ${error.message}\n`);

      if (!stage.error) stage.error = true;
   }

   /* .babelrc */
   try {
      if (!babelrc?.minified) {
         babelrc.minified = true;
         if (!stage.babelrc) stage.babelrc = true;
      }
      if (!babelrc?.comments) {
         babelrc.comments = false;
         if (!stage.babelrc) stage.babelrc = true;
      }
      if (!Array.isArray(babelrc?.presets)) {
         babelrc.presets = [];
         if (!stage.babelrc) stage.babelrc = true;
      }
      if (!Array.isArray(babelrc?.presets[0])) {
         babelrc.presets[0] = [];
         if (!stage.babelrc) stage.babelrc = true;
      }

      const arrays = {
         presetEnv: false,
         exclude: false,
         transformRegenerator: false,
      };

      babelrc.presets.forEach((item) => {
         if (item.includes('@babel/preset-env')) arrays.presetEnv = true;
         if (!Array.isArray(item)) return;

         item.forEach((subitem) => {
            if (subitem?.exclude) {
               if (subitem.exclude.includes('transform-regenerator')) arrays.transformRegenerator = true;
               arrays.exclude = true;
            }
         });
      });

      if (!arrays.presetEnv) {
         babelrc.presets[0].push('@babel/preset-env');
         if (!stage.babelrc) stage.babelrc = true;
      }
      if (!arrays.exclude && !arrays.transformRegenerator) {
         babelrc.presets[0].push({ exclude: ['transform-regenerator'] });
         if (!stage.babelrc) stage.babelrc = true;
      } else if (arrays.exclude && !arrays.transformRegenerator) {
         const excludeIndex = babelrc.presets[0].findIndex((item) => item.exclude);

         babelrc.presets[0][excludeIndex].exclude.push('transform-regenerator');
         if (!stage.babelrc) stage.babelrc = true;
      }

      if (stage.babelrc) fs.writeFileSync('.babelrc', buildJSON(babelrc));
   } catch (error) {
      console.warn(
         'Unable to get the needed resources into .babelrc.\nPlease, look at: https://github.com/wellwelwel/simple-web-cli/blob/main/.babelrc and insert missing JSON values manually\n'
      );
      console.error(`Error: ${error.message}\n`);

      if (!stage.error) stage.error = true;
   }

   return !stage.error;
};

export default rebuildFiles;
