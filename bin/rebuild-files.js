const fse = require('fs-extra');

const readJSON = file => JSON.parse(fse.readFileSync(file, 'utf-8'));
const buildJSON = obj => JSON.stringify(obj, null, 2);

const package = readJSON('package.json');
const babelrc = readJSON('.babelrc');

const stage = {

   package: false,
   babelrc: false
};

/* package.json */
try {
   
   if (!package?.browserslist) {
      
      package.browserslist = '> 0%';
      if (!stage.package) stage.package = true;
   }

   if (!package?.devDependencies) {
      
      package.devDependencies = { };
      if (!stage.package) stage.package = true;
   }

   if (!package?.devDependencies?.web) {
      
      package.devDependencies.web = 'file:.library';
      if (!stage.package) stage.package = true;
   }

   if (stage.package) fse.writeFileSync('package.json', buildJSON(package));
} catch (error) {

   console.warn('It was unable to get the needed resources into package.json.\nPlease, look at: https://github.com/wellwelwel/simple-web/blob/main/package.json and insert "browserslist" and local dependence "web" manually\n');
   console.error(error);
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
      
      babelrc.presets = [ ];
      if (!stage.babelrc) stage.babelrc = true;
   }
   if (!Array.isArray(babelrc?.presets[0])) {
      
      babelrc.presets[0] = [ ];
      if (!stage.babelrc) stage.babelrc = true;
   }
   
   const arrays = {
   
      presetEnv: false,
      exclude: false,
      transformRegenerator: false
   };
   
   babelrc.presets.forEach(item => {
   
      if (item.includes('@babel/preset-env')) arrays.presetEnv = true;
      if (!Array.isArray(item)) return;
   
      item.forEach(subitem => {
   
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
      
      babelrc.presets[0].push({ exclude: [ 'transform-regenerator' ] });
      if (!stage.babelrc) stage.babelrc = true;
   } else if (arrays.exclude && !arrays.transformRegenerator) {
   
      const excludeIndex = babelrc.presets[0].findIndex(item => item.exclude);
   
      babelrc.presets[0][excludeIndex].exclude.push('transform-regenerator');
      if (!stage.babelrc) stage.babelrc = true;
   }

   if (stage.babelrc) fse.writeFileSync('.babelrc', buildJSON(babelrc));
} catch (error) {
   
   console.warn('It was unable to get the needed resources into .babelrc.\nPlease, look at: https://github.com/wellwelwel/simple-web/blob/main/.babelrc and insert manually\n');
   console.error(error);
}