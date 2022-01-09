const { execSync } = require('child_process');
const fs = require('fs');
const commands = require('./modules/commands');
const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf-8'));
const buildJSON = obj => orderJSON(obj, 2);
const orderJSON = (obj, space) => {

   const allKeys = [];
   const seen = { };

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

(() => {

   const dest = 'package.json';
   const git = {

      name: '@wellwelwel/simple-web-cli',
      publishConfig: {
         registry:'https://npm.pkg.github.com/wellwelwel'
      }
   };
   const package = readJSON(dest);

   package.name = git.name;
   package.publishConfig = git.publishConfig;
   package.repository = git.repository;

   const content = buildJSON(package);

   fs.writeFileSync(dest, content);
   execSync(commands(dest, true).join(' && '), { stdio: 'inherit' });
})();